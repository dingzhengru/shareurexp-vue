import { db, firebase } from '../firebase.js'

import _ from 'lodash'

// collection: firebase 的collection的名稱

// creator: user id 創建這個通知的是誰(誰回覆的，或官方帳戶)
// article: article id
// type: 
//      'official' 官方通知
//      'post' 有新回覆
// isRead: 是否已讀

/* notices object
{
    id: 0,
    user: 1,
    article: 2,
    creator: 0,
    created: now,
    type: 'official',
    content: '官方通知',
    isRead: false
}
*/

export default {
    namespaced: true,
    state: {
        collection: 'notices',
        data: null,
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
        getData: function(state) {
            return state.data;
        },
        getDataById: (state) => (id) => {
            let data = state.data || [];
            return data.find(item => item.id == id)
        },
        getDataByUserId: (state) => (id) => {
            let data = state.data || [];
            return data.filter(item => item.user == id)
        },
        getNotReadNoticesByUserId: (state) => (id) => {
            let data = state.data || [];
            return data.filter(item => item.user == id && !item.isRead)
        },
        getSortData: function(state) {
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
        getSearchData: function(state) {
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
        getPageData: function(state) {
            let currentPage = state.pagination.currentPage;
            let pagesize = state.pagination.pagesize;
            let startAt = pagesize * (currentPage - 1);
            let endAt = startAt + pagesize;

            let data = state.data || [];

            return data.slice(startAt, endAt);
        },
        getFilterData: function(state, getters) {
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
        setWatchDataAction({ state, commit }, payload) {
            db.collection(state.collection)
            .orderBy('id')
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
        addDataAction({ state, commit, dispatch  }, payload) {

            let data = payload;

            // 直接從資料庫找最大的ID，+1之後當新資料的ID
            return new Promise((resolve, reject) => {
                db.collection(state.collection)
                .orderBy('id', 'desc')
                .limit(1)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        data.id = (Number(doc.data().id) + 1) || 0;
                        data.created = firebase.firestore.Timestamp.fromDate(new Date());
                        
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
                    snapshot.forEach(doc => {

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

            let data = payload;

            return new Promise((resolve, reject) => {
                db.collection(state.collection)
                .where('id', '==', data.id).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
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


