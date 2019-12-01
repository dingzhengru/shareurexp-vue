import { db, firebase } from '../firebase.js'

import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        data: null,
        status: null,
        error: null,
        sort: {
            field: 'id',
            isAsc: true
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
        getPostsByUserId: (state) => (id) => {
            let data = state.data || [];
            return data.filter(item => item.creator == id)
        },
        getPostsByArticleId: (state) => (id) => {
            let data = state.data || [];
            return data.filter(item => item.article == id)
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
                return data.filter(function(p) {
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
        getPageData(state) {
            let currentPage = state.pagination.currentPage;
            let pagesize = state.pagination.pagesize;
            let startAt = pagesize * (currentPage - 1);
            let endAt = startAt + pagesize;

            let data = state.data || [];

            return data.slice(startAt, endAt);
        },
        getFilterData(state, getters) {
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
        }
    },
    actions: {
        getDataAction({ state, commit }, payload) {
            console.log('getDataAction');

            // state.data 固定用id排序，不要去動到他本身

            return new Promise((resolve, reject) => {
                db.collection('posts')
                .orderBy('id')
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => doc.data());
                    commit('setData', posts);
                    resolve(posts);
                })
                .catch((error) => {
                    reject(error);
                })
            })
        },
        addDataAction({ dispatch, commit }, payload) {
            console.log('addDataAction');

            let post = payload;

            // 直接從資料庫找最大的ID，+1之後當新資料的ID
            return new Promise((resolve, reject) => {
                db.collection('posts').orderBy('id', 'desc').limit(1).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        post.id = Number(doc.data().id) + 1;
                        post.article = Number(post.article);
                        post.created = firebase.firestore.Timestamp.fromDate(new Date());
                        post.editDate = post.created;

                        db.collection('posts').add(post);

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(post);
                    })
                })
                .catch((error) => {
                    reject(error.message);
                })
            })
        },
        removeDataAction({ dispatch, commit }, payload) {
            console.log('removeDataAction');

            let post = payload;

            return new Promise((resolve, reject) => {
                db.collection('posts').where('id', '==', post.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(post);
                    })
                })
                .catch((error) => {
                    reject(error.message);
                })
            })
        },
        updateDataAction({ dispatch, commit }, payload) {
            console.log('updateDataAction');
            // 這裡不使用 dispatch('getDataAction') 更新，避免執行太多次

            let post = payload;
            post.editDate = firebase.firestore.Timestamp.fromDate(new Date())

            return new Promise((resolve, reject) => {
                db.collection('posts')
                .where('id', '==', post.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.update(post);
                        resolve(post);
                    })
                })
                .catch((error) => {
                    reject(error);
                })
            })
        }
    },
}


