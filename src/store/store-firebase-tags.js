import { db } from '../firebase.js'

import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        data: null,
        status: null,
        error: null,
        sort: {
            orderByField: 'id',
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
            return state.data[id];
        },
        getSortData: (state) => {
            let data = state.data || [];
            let field = state.sort.orderByField;
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
            let field = state.sort.orderByField;
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
            console.log('setData', payload);
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
            console.log('setSearch', payload);
            state.search = payload;
        },
        setPage(state, payload) {
            console.log('setPage', payload);
            state.pagination = payload;
        }
    },
    actions: {
        getDataAction({ state, commit }, payload) {
            console.log('getDataAction');

            // state.data 固定用id排序，不要去動到他本身

            return new Promise((resolve, reject) => {
                db.collection('tags')
                .orderBy('id')
                .get()
                .then((snapshot) => {
                    let tags = snapshot.docs.map(doc => doc.data());
                    commit('setData', tags);
                    resolve(tags);
                })
                .catch((error) => {
                    reject(error);
                })
            })
        },
        addDataAction({ dispatch, commit }, payload) {
            console.log('addDataAction');

            let tag = payload;

            // 直接從資料庫找最大的ID，+1之後當新資料的ID
            return new Promise((resolve, reject) => {
                db.collection('tags')
                .orderBy('id', 'desc')
                .limit(1)
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        tag.id = (Number(doc.data().id) + 1) || 0;
                        tag.created = new Date(Date.now());
                        tag.editDate = tag.created;
                        tag.images = [];

                        db.collection('tags').add(tag);

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(tag);
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

            let tag = payload;

            return new Promise((resolve, reject) => {
                db.collection('tags').where('id', '==', tag.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(tag);
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

            let tag = payload;
            tag.editDate = new Date(Date.now());

            return new Promise((resolve, reject) => {
                db.collection('tags')
                .where('id', '==', tag.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.update(tag);
                        resolve(tag);
                    })
                })
                .catch((error) => {
                    reject(error);
                })
            })
        }
    },
}


