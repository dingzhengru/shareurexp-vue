import { db, firebase } from '../firebase.js'

import _ from 'lodash'


// users object

// uid 對應 auth uid
// pushArticles 推過的文章
// pushPosts 推過的回覆
// images 在編輯器上傳的圖片(imgur api 或 自己寫的 express api)
// settings 使用者設定 目前有pagesize, showmode
// avatarColor 存顏色，套用在用css做的avatar背景色
//      也可以考慮讓使用者自己上傳圖像，改存圖片網址

/*
avatarColors = [
    '#EC7063', '#A569BD', '#5DADE2', '#45B39D', '#58D68D', 
    '#F5B041', '#DC7633', '#CACFD2', '#99A3A4', '#566573',
]
*/

/*
{
    id: 0,
    uid: 'VRB819bUm8g5eQKtdzzoYS2kQpr2',
    email: 'qws12369vdx@gmail.com',
    username: 'username0',
    created: now,
    editDate: now,
    pushArticles: [],
    pushPosts: [],
    images: [],
    avatarColor: '#CD6155',
    notices: [],
    settings: {
        pagesize: 5,
        showmode: 'page'
    }
}
*/

export default {
    namespaced: true,
    state: {
        collection: 'users',
        data: null,
        currentUser: null,
        isCurrentUserReady: false,
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
        getIsCurrentUserReady: function(state) {
            return state.isCurrentUserReady
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
        setCurrentUser(state, payload) {
            state.currentUser = payload;
            state.isCurrentUserReady = true
        },
        setIsCurrentUserReady(state, payload) {
            state.isCurrentUserReady = payload
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
        getUserByUid({ state, commit }, payload) {
            let uid = payload;
            return new Promise((resolve, reject) => {
                db.collection(state.collection)
                .where('uid', '==', uid)
                .get()
                .then(snapshot => {
                    let data = snapshot.docs.map(doc => doc.data());
                    resolve(data[0]);
                })
                .catch(error => {
                    reject(error);
                })
            })
        },
        setWatchById({ state, commit }, payload) {
            let id = payload

            db.collection(state.collection)
            .where('id', '==', id)
            .onSnapshot(snapshot => {
                let data = snapshot.docs.map(doc => doc.data())[0];
                commit('setCurrentUser', data)
            });
        },
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
        addDataAction({ state, commit, dispatch }, payload) {

            let data = payload;

            if(data.password)
                delete data.password

            let avatarColors = [
                '#EC7063', '#A569BD', '#5DADE2', '#45B39D', '#58D68D', 
                '#F5B041', '#DC7633', '#CACFD2', '#99A3A4', '#566573',
            ]

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
                        data.editDate = data.created;
                        data.pushs = [];
                        data.pushArticles = [];
                        data.pushPosts = [];
                        data.images = [];
                        data.notices = [];
                        data.settings = {
                            pagesize: 5,
                            showmode: 'page'
                        }
                        data.avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)]

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
            data.editDate = new firebase.firestore.Timestamp.fromDate(new Date());
            
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
            data.editDate = new Date(Date.now());

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


