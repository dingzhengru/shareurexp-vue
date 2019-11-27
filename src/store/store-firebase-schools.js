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
            pageSize: null
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
            let pageSize = state.pagination.pageSize;
            let startAt = pageSize * (currentPage - 1);
            let endAt = startAt + pageSize;

            let data = state.data || [];

            return data.slice(startAt, endAt);
        },
        getFilterData(state, getters) {
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

            // search => sort => page
            let data = getters.getSearchData;

            // sort
            data = data.sort((a, b) => {
                if(isAsc)
                    return a[field] > b[field] ? 1 : -1;
                else
                    return a[field] < b[field] ? 1 : -1;
            });
            

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
                db.collection('schools')
                .orderBy('id')
                .get()
                .then((snapshot) => {
                    let schools = snapshot.docs.map(doc => doc.data());
                    commit('setData', schools);
                    resolve(schools);
                })
                .catch((error) => {
                    reject(error);
                })
            })
        },
        addDataAction({ dispatch, commit }, payload) {
            console.log('addDataAction');

            let school = payload;

            // 直接從資料庫找最大的ID，+1之後當新資料的ID
            return new Promise((resolve, reject) => {
                db.collection('schools')
                .orderBy('id', 'desc')
                .limit(1)
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        school.id = (Number(doc.data().id) + 1) || 0;
                        school.created = firebase.firestore.Timestamp.fromDate(new Date());
                        school.editDate = school.created;
                        school.images = [];

                        db.collection('schools').add(school);

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(school);
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

            let school = payload;

            return new Promise((resolve, reject) => {
                db.collection('schools').where('id', '==', school.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(school);
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

            let school = payload;
            school.editDate = firebase.firestore.Timestamp.fromDate(new Date());

            return new Promise((resolve, reject) => {
                db.collection('schools')
                .where('id', '==', school.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.update(school);
                        resolve(school);
                    })
                })
                .catch((error) => {
                    reject(error);
                })
            })
        }
    },
}


