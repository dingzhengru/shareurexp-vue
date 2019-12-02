import { firebase, actionCodeSettings } from '../firebase.js'

import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        data: null,
        isReady: false,
        isSignIn: null,
    },
    getters: {
        getData(state) {
            return state.data || [];
        },
        getCurrentUser(state) {
            return firebase.auth().currentUser;
        },
        getIsReady(state) {
            return state.isReady;
        },
        getIsSignIn(state) {
            return state.isSignIn;
        }
    },
    mutations: {
        setData(state, payload) {
            state.data = payload;
        },
        clearData(state, payload) {
            state.data = null;
        },
        setReady(state, payload) {
            state.isReady = payload;
        },
        setIsSignIn(state, payload) {
            state.isSignIn = payload;
        }
    },
    actions: {
        setAuthStateChanged({ commit }, payload) {
            console.log('setAuthStateChanged')
            return new Promise((resolve, reject) => {
                firebase.auth().onAuthStateChanged(user => {

                    commit('setReady', true);

                    if (user) {
                        commit('setData', user);
                        commit('setIsSignIn', true);
                        resolve(user);
                    } else {
                        commit('clearData');
                        commit('setIsSignIn', false);
                        reject(user);
                    }
                });
            });
        },
        signUpAction({ commit }, payload) {
            console.log('signUpAction');

            let email = payload.email;
            let password = payload.password;

            return new Promise((resolve, reject) => {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(result => {
                    resolve(result);
                })
                .catch(error => {
                    reject(error);
                })
            })
        },
        signInAction({ commit }, payload) {
            console.log('signInAction');

            let email = payload.email;
            let password = payload.password;

            return new Promise((resolve, reject) => {
                firebase.auth().signInWithEmailAndPassword(email, password)
                .then(result => {
                    commit('setData', result.user);
                    commit('setIsSignIn', true);
                    resolve(result);
                })
                .catch(error => {
                    // error.code 登入會遇到的error code
                    // auth/invalid-email  
                    // auth/invalid-password
                    // auth/wrong-password
                    // auth/user-not-found
                    reject(error);
                });
            });
        },
        signOutAction({ commit }, payload) {
            console.log('signOutAction');
            return new Promise((resolve, reject) => {
                firebase.auth().signOut().then(() => {
                    commit('setIsSignIn', false);
                    resolve('sign out')
                }).catch(error => {
                    reject(error);
                });
            });
        },
        sendEmailVerification({ state }, payload) {
            console.log('sendEmailVerification');

            // this user is auth user
            let user = state.data || payload;

            return new Promise((resolve, reject) => {
                user.sendEmailVerification(actionCodeSettings)
                .then(() => {
                    resolve();
                }).catch(error => {
                    reject(error.message);
                });
            });
        },
        sendPasswordResetEmail({ commit }, payload) {
            let email = payload.email
            return new Promise((resolve, reject) => {
                firebase.auth().sendPasswordResetEmail(email)
                .then(data => {
                    resolve(data)
                }).catch(error => {
                    reject(error)
                });
            });
        }
    },
}


