const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyBu0x2xeq-tZ3kLjtJiRQaY_p_c1Y5bAdo",
    authDomain: "shareurexp-demo.firebaseapp.com",
    databaseURL: "https://shareurexp-demo.firebaseio.com",
    projectId: "shareurexp-demo",
    storageBucket: "shareurexp-demo.appspot.com",
    messagingSenderId: "36474000873",
    appId: "1:36474000873:web:6490cd14126ee22433a778"
};

const actionCodeSettings = {
    // url: 'http://localhost:8080',
    url: 'https://shareurexp-demo.web.app'
    handleCodeInApp: true,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { firebase, db, actionCodeSettings };