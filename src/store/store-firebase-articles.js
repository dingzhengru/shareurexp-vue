import { db, firebase } from '../firebase.js'

import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        data: null,
        status: null,
        error: null,
        sort: {
            orderByField: 'id',
            isAsc: false
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
        getArticlesByUserId: (state) => (id) => {
            let data = state.data || [];
            return data.filter(item => item.creator == id)
        },
        getSearchArticles: (state) => (users) => {
            let data = state.data || [];
            let searchText = state.search.text;
            let searchField = state.search.field;

            if(searchField != 'creator') {
                if(_.isEmpty(searchField))
                    return data.filter((p) => {
                        for(let x in p) {
                            if(x == 'creator') {
                                if(users[p[x]].username
                                   .toLowerCase()
                                   .includes(searchText.toLowerCase()))
                                   return p;
                            }
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
            }
            return data.filter((p) => {
                if(users[p[searchField]].username
                   .toLowerCase()
                   .includes(searchText.toLowerCase()))
                   return p;
            })
        },
        getSortArticles: (state, getters) => (data) => {
            let field = state.sort.orderByField;
            let isAsc = state.sort.isAsc;

            return data.sort(function (a, b) {
                if(isAsc)
                    return a[field] > b[field] ? 1 : -1;
                else
                    return a[field] < b[field] ? 1 : -1;
            });
        },
        getArticlesFilter: (state, getters) => (users) => {
            // users => {... username: ''}
            // users 是為了查 username的

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
            let data = getters.getSearchArticles(users) || [];

            // sort
            data = getters.getSortArticles(data);

            // page
            data = data.slice(startAt, endAt);

            return data
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
            let pageSize = state.pagination.pageSize;
            let startAt = pageSize * (currentPage - 1);
            let endAt = startAt + pageSize;

            let data = state.data || [];

            return data.slice(startAt, endAt);
        },
        getFilterData: (state, getters) => {
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
                db.collection('articles')
                .orderBy('id')
                .get()
                .then((snapshot) => {
                    let articles = snapshot.docs.map(doc => doc.data());
                    commit('setData', articles);
                    resolve(articles);
                })
                .catch((error) => {
                    reject(error);
                })
            })
        },
        addDataAction({ dispatch, commit }, payload) {
            console.log('addDataAction');

            let article = payload;

            // 直接從資料庫找最大的ID，+1之後當新資料的ID
            return new Promise((resolve, reject) => {
                db.collection('articles').orderBy('id', 'desc').limit(1).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        article.id = Number(doc.data().id) + 1;
                        article.created = new Date(Date.now());
                        article.editDate = article.created;

                        db.collection('articles').add(article);

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(article);
                    })
                })
                .catch((error) => {
                    reject(error.message);
                })
            })
        },
        removeDataAction({ dispatch, commit }, payload) {
            console.log('removeDataAction');

            let article = payload;

            return new Promise((resolve, reject) => {
                db.collection('articles').where('id', '==', article.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();

                        // update data(更新state的資料)
                        dispatch('getDataAction');

                        resolve(article);
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

            let article = payload;

            article.editDate = firebase.firestore.Timestamp.fromDate(new Date())
            
            return new Promise((resolve, reject) => {
                db.collection('articles')
                .where('id', '==', article.id).get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.update(article)
                        resolve(article);
                    })
                })
                .catch((error) => {
                    reject(error);
                })
            })
        }
    },
}


