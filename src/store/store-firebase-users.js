import { db, firebase } from '../firebase.js'

import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        data: null,
        currentUser: null,
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
            pageSize: null
        }
    },
    getters: {
        getData: function(state) {
            return state.data;
        },
        getCurrentUser: function(state) {
            return state.currentUser
        },
        getDataById: (state) => (id) => {
            let data = state.data || [];
            return data.find(item => item.id == id)
        },
        getUserByUid: (state) => (uid) => {
            let data = state.data;
            return data.find(item => item.uid == uid)
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
            let pageSize = state.pagination.pageSize;
            let startAt = pageSize * (currentPage - 1);
            let endAt = startAt + pageSize;

            let data = state.data || [];

            return data.slice(startAt, endAt);
        },
        getFilterData: function(state, getters) {
            // 取搜尋後再分割頁面的資料

            // page
            let currentPage = state.pagination.currentPage;
            let pageSize = state.pagination.pageSize;
            let startAt = pageSize * (currentPage - 1);
            let endAt = startAt + pageSize;

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
        setCurrentUser(state, payload) {
            state.currentUser = payload;
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
                db.collection('users')
                .orderBy('id')
                .get()
                .then((snapshot) => {
                    let users = snapshot.docs.map(doc => doc.data());
                    commit('setData', users);
                    resolve(users);
                })
                .catch((error) => {
                    reject(error);
                })
            })
        },
        addDataAction({ dispatch, commit }, payload) {
            console.log('addDataAction');

            let user = payload;

            // 直接從資料庫找最大的ID，+1之後當新資料的ID
            return new Promise((resolve, reject) => {
                db.collection('users')
                .orderBy('id', 'desc')
                .limit(1)
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        user.id = (Number(doc.data().id) + 1) || 0;
                        user.created = firebase.firestore.Timestamp.fromDate(new Date());
                        user.editDate = user.created;
                        user.images = [];

                        db.collection('users').add(user);

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(user);
                    })
                })
                .catch((error) => {
                    console.error(error.message);
                    reject(error.message);
                })
            })
        },
        removeDataAction({ dispatch, commit }, payload) {
            console.log('removeDataAction');

            let user = payload;
            user.editDate = new firebase.firestore.Timestamp.fromDate(new Date());
            
            return new Promise((resolve, reject) => {
                db.collection('users').where('id', '==', user.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(user);
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

            let user = payload;
            user.editDate = new Date(Date.now());

            return new Promise((resolve, reject) => {
                db.collection('users')
                .where('id', '==', user.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.update(user);
                        resolve(user);
                    })
                })
                .catch((error) => {
                    reject(error);
                })
            })
        },
        getUserByUid({ commit }, payload) {
            let uid = payload;
            return new Promise((resolve, reject) => {
                db.collection('users')
                .where('uid', '==', uid)
                .get()
                .then((snapshot) => {
                    let users = snapshot.docs.map(doc => doc.data());
                    resolve(users[0]);
                })
                .catch((error) => {
                    reject(error);
                })
            })
        }
    },
}


