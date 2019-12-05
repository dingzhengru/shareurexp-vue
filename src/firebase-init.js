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

function addIncrementId(items) {
    return items.map((item, index) => {
        item.id = index
        return item
    })
}

import { firebase, db } from './firebase.js'


import users from './database/users.js'
import articles from './database/articles.js'
import posts from './database/posts.js'
import schools from './database/schools.js'
import tags from './database/tags.js'
import notices from './database/notices.js'



export default () => {
    initCollection(db, 'users', users);
    // initCollection(db, 'articles', articles);
    // initCollection(db, 'posts', posts);
    

    // initCollection(db, 'schools', addIncrementId(schools))
    // initCollection(db, 'tags', addIncrementId(tags))

    // initCollection(db, 'notices', addIncrementId(notices))
}