import { db, firebase } from '../firebase.js'

import _ from 'lodash'


// article object

// creator: user id
// posts: post id list
// pushs: user id list 存推文的user id
// school: school id
// tags: tag id list
// latestPostDate: 最新post的created
// ipViews: ip list 儲存點入文章瀏覽的IP(不重複)

/* 
{
    id: 0,
    title: '標題0',
    content: '<h3>內容0內容0內容0內容0內容0</h3>',
    creator: 0,
    created: now,
    editDate: now,
    posts: [],
    pushs: [],
    school: 50,
    tags: [48, 78],
    latestPostDate: now,
    ipViews: [],
}
*/

export default {
    namespaced: true,
    state: {
        collection: 'articles',
        data: null,
        status: null,
        error: null,
        sort: {
            field: 'created',
            isAsc: false
        },
        search: {
            text: '',
            field: '',
        },
        pagination: {
            currentPage: null,
            pagesize: null
        }
    },
    getters: {
        getData: (state) => {
            return state.data;
        },
        getDataById: (state) => (id) => {
            let data = state.data || [];
            return data.find(item => item.id == id)
        },
        getSearch: (state) => {
            return state.search
        },
        getSort: (state) => {
            return state.sort
        },
        getPage: (state) => {
            return state.pagination
        },
        getArticlesByUserId: (state) => (id) => {
            let data = state.data || [];
            return data.filter(item => item.creator == id)
        },
        getArticlesBySchoolId: (state) => (id) => {
            let data = state.data || [];
            return data.filter(item => item.school == id)
        },
        getArticlesByTagId: (state) => (id) => {
            let data = state.data || [];
            return data.filter(item => {
                        return item.tags.indexOf(id) >= 0
                    })
        },
        getPageArticles: (state) => (data) => {
            let currentPage = state.pagination.currentPage;
            let pagesize = state.pagination.pagesize;
            let startAt = pagesize * (currentPage - 1);
            let endAt = startAt + pagesize;
            return data.slice(startAt, endAt);
        },
        getSortArticles: (state, getters) => (data) => {
            let field = state.sort.field;
            let isAsc = state.sort.isAsc;


            // 這邊以array的數量排序的
            if(field == 'posts' || 
               field == 'ipViews')
                return data.sort(function (a, b) {
                    // 如果一樣 就照創建時間排序(降序)
                    if(a[field].length == b[field].length)
                        return a['created'] < b['created'] ? 1 : -1;

                    if(isAsc)
                        return a[field].length > b[field].length ? 1 : -1;
                    else
                        return a[field].length < b[field].length ? 1 : -1;
                });

            return data.sort(function (a, b) {
                if(isAsc)
                    return a[field] > b[field] ? 1 : -1;
                else
                    return a[field] < b[field] ? 1 : -1;
            });
        },
        getSortData: (state) => {
            let data = state.data || [];
            let field = state.sort.field;
            let isAsc = state.sort.isAsc;

            return data.sort(function (a, b) {
                if(isAsc)
                    return a[field] > b[field] ? 1 : -1;
                else
                    return a[field] < b[field] ? 1 : -1;
            });
        },
        getSearchData: (state) => {
            let data = state.data || [];
            let searchText = state.search.text;
            let searchField = state.search.field;

            if(_.isEmpty(searchField))
                return data.filter((p) => {
                    for(let x in p) {
                        if(String(p[x]).toLowerCase().includes(searchText.toLowerCase())) 
                            return p;
                    }
                })
            else {
                return data.filter((p) => {
                    if(String(p[searchField]).toLowerCase().includes(searchText.toLowerCase())) 
                        return p;
                })
            }
        },
        getPageData: (state) => {
            let currentPage = state.pagination.currentPage;
            let pagesize = state.pagination.pagesize;
            let startAt = pagesize * (currentPage - 1);
            let endAt = startAt + pagesize;

            let data = state.data || [];

            return data.slice(startAt, endAt);
        },
        getFilterData: (state, getters) => {
            // 取搜尋後再分割頁面的資料

            // page
            let currentPage = state.pagination.currentPage;
            let pagesize = state.pagination.pagesize;
            let startAt = pagesize * (currentPage - 1);
            let endAt = startAt + pagesize;

            // search
            let searchText = state.search.text;
            let searchField = state.search.field;

            // sort
            let field = state.sort.field;
            let isAsc = state.sort.isAsc;

            // sort => search => page
            let data = getters.getSortData;

            if(_.isEmpty(searchField)) {
                data = data
                       .filter(function(d) {
                        for(let x in d) {
                            if(String(d[x]).toLowerCase().includes(searchText.toLowerCase())) 
                                return d;
                            }
                        })
            }
            else {
                data = data
                       .filter((d) => {
                            if(String(d[searchField]).toLowerCase().includes(searchText.toLowerCase())) 
                                return d;
                        })
            }

            data = data.slice(startAt, endAt)

            return data;
        }
    },
    mutations: {
        setData(state, payload) {
            state.data = payload;
        },
        setStatus(state, payload) {
            state.status = payload;
        },
        setError(state, payload) {
            state.error = payload
        },
        setSort(state, payload) {
            state.sort = payload;
        },
        setSearch(state, payload) {
            state.search = payload;
        },
        setPage(state, payload) {
            state.pagination = payload;
        },
        setSearchText(state, payload) {
            state.search.text = payload;
        },
        setSearchField(state, payload) {
            state.search.field = payload;
        },
    },
    actions: {
        setWatchDataAction({ state, commit }, payload) {
            db.collection(state.collection)
            .onSnapshot(snapshot => {
                let data = snapshot.docs.map(doc => doc.data());
                commit('setData', data);
            });
        },
        getDataAction({ state, commit }, payload) {

            // state.data 固定用id排序，不要去動到他本身

            return new Promise((resolve, reject) => {
                db.collection(state.collection)
                .orderBy('id')
                .get()
                .then(snapshot => {
                    let data = snapshot.docs.map(doc => doc.data());
                    commit('setData', data);
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
            })
        },
        addDataAction({ state, commit, dispatch }, payload) {

            let data = payload;

            // 直接從資料庫找最大的ID，+1之後當新資料的ID
            return new Promise((resolve, reject) => {
                db.collection(state.collection).orderBy('id', 'desc').limit(1).get()
                .then(snapshot => {
                    snapshot.forEach((doc) => {
                        data.id = Number(doc.data().id) + 1;
                        data.created = new Date(Date.now());
                        data.editDate = data.created;
                        data.latestPostDate = data.created;

                        db.collection(state.collection).add(data)
                        .then(() => {
                            // update data(更新state的資料)
                            dispatch('getDataAction');
                            resolve(data);
                        })
                    })
                })
                .catch(error => {
                    reject(error.message);
                })
            })
        },
        removeDataAction({ state, commit, dispatch }, payload) {

            let data = payload;

            return new Promise((resolve, reject) => {
                db.collection(state.collection).where('id', '==', data.id).get()
                .then(snapshot => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete()
                        .then(() => {
                            // update data(更新state的資料)
                            dispatch('getDataAction');
                            resolve(data);
                        })
                    })
                })
                .catch(error => {
                    reject(error.message);
                })
            })
        },
        updateDataAction({ state, commit, dispatch }, payload) {
            // 這裡不使用 dispatch('getDataAction') 更新，避免執行太多次

            let data = payload;

            return new Promise((resolve, reject) => {
                db.collection(state.collection)
                .where('id', '==', data.id).get()
                .then(snapshot => {
                    snapshot.forEach((doc) => {
                        // title, content, school, tags 改變時才改變編輯時間
                        // array, object比較 用_.isEqual()
                        let docData = doc.data()
                        if(docData.title != docData.title || 
                           docData.content != docData.content || 
                           docData.school != docData.school ||
                           !_.isEqual(docData.tags, docData.tags))
                            data.editDate = firebase.firestore.Timestamp.fromDate(new Date())
                        
                        doc.ref.update(data)
                        .then(() => {
                            // update data(更新state的資料)
                            dispatch('getDataAction');
                            resolve(data);
                        })
                    })
                })
                .catch(error => {
                    reject(error);
                })
            })
        }
    },
}


