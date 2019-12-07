import { db, firebase } from '../firebase.js'

import _ from 'lodash'

// school object

/*

{
    "name": "國立臺灣大學"
}

*/

export default {
    namespaced: true,
    state: {
        collection: 'schools',
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
                .then((snapshot) => {
                    let data = snapshot.docs.map(doc => doc.data());
                    commit('setData', data);
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                })
            })
        },
        addDataAction({ state, commit, dispatch }, payload) {

            let data = payload;

            // 直接從資料庫找最大的ID，+1之後當新資料的ID
            return new Promise((resolve, reject) => {
                db.collection(state.collection)
                .orderBy('id', 'desc')
                .limit(1)
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        data.id = (Number(doc.data().id) + 1) || 0;
                        data.created = firebase.firestore.Timestamp.fromDate(new Date());

                        db.collection(state.collection).add(data);

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(data);
                    })
                })
                .catch((error) => {
                    reject(error.message);
                })
            })
        },
        removeDataAction({ state, commit, dispatch }, payload) {

            let data = payload;

            return new Promise((resolve, reject) => {
                db.collection(state.collection).where('id', '==', data.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(data);
                    })
                })
                .catch((error) => {
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
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.update(data);
                        // update data(更新state的資料)
                        dispatch('getDataAction');
                        resolve(data);
                    })
                })
                .catch((error) => {
                    reject(error);
                })
            })
        }
    },
}


