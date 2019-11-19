function clearCollection(db, coll) {
    console.log('clearCollection', coll);
    db.collection(coll).get().then((shotsnap) => {
        shotsnap.forEach((doc) => {
            db.collection(coll).doc(doc.id).delete();
        });
    });
}

function setNewData(db, coll, data) {
    console.log('setNewData', coll, data.length);
    if(Array.isArray(data)) {
        data.forEach((d) =>  {
            db.collection(coll).doc().set(d);
        })
    } else {
        db.collection(coll).doc().set(data);
    }
}

function initCollection(db, coll, data) {
    console.log('initCollection', coll, data.length);
    let index = 0;
    db.collection(coll).get()
    .then((shotsnap) => {
        if(shotsnap.docs.length == 0) {
            console.log('沒資料 直接Set進去');
            setNewData(db, coll, data);
        } else {
            console.log('先清光資料，再Set進去(最後一筆時代表index == docs.length')
            shotsnap.forEach((doc) => {
                index++;
                db.collection(coll).doc(doc.id).delete();
                if(index == shotsnap.docs.length)
                    setNewData(db, coll, data);
            });
        }
    })
    .catch((error) => { console.log("initCollection Error:", error) });
}

import { firebase, db } from './firebase.js'

const articles = [
    {
        title: 'title',
        content: `article content`, 
        created: firebase.firestore.Timestamp.fromDate(new Date(Date.now())),
        creator: 'users/Zes3quB0X3NZAZfs4q2upLyf1LZ2',
        posts: null,
    }
]

const posts = [
    {
        article: 'articles/GTxS0P4fGO3yDX4jeTE6',
        content: `post content`, 
        created: firebase.firestore.Timestamp.fromDate(new Date(Date.now())),
        creator: 'users/Zes3quB0X3NZAZfs4q2upLyf1LZ2',
    }
]

const users = [
    {
        uid: 'Zes3quB0X3NZAZfs4q2upLyf1LZ2',
        articles: [],
        posts: []
    }
]

export default () => {
    // initCollection(db, 'articles', articles);
    // initCollection(db, 'posts', posts);
}