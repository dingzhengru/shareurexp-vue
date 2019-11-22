# shareurexp-vue(demo project)

*  <a href="#project-setup">Project setup</a>
*  <a href="#firebase">firebase</a>
*  <a href="#bootstrap">bootstrap</a>
*  <a href="#vue2-editor">vue2-editor</a>
*  <a href="#axios">axios</a>
*  <a href="#imgur-api">imgur api</a>
*  <a href="#lodash">lodash</a>
*  <a href="#dayjs">dayjs</a>

## Project setup
```npm install```  

### Compiles and hot-reloads for development
```npm run serve```  

### Compiles and minifies for production
```npm run build```  

### Lints and fixes files
```npm run lint```  

## firebase
*  firebase.js 引入firebase並export給其他檔案用的
*  firebase-init.js 自己寫的幾個方法，用於初始化collection

**use in other .js, .vue**  
```
import { firebase, db, actionCodeSettings } from '../firebase.js'
```

**firebase.js**
```
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
    url: 'http://localhost:8080',
    handleCodeInApp: true,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { firebase, db, actionCodeSettings };
```

## bootstrap
*  import css  
**main.js**  
```import 'bootstrap/dist/css/bootstrap.min.css'```  

## vue2-editor

**in .vue script**
```
import { VueEditor } from 'vue2-editor';

components: { VueEditor }
```
**template**
```
<vue-editor 
    id="editor"
    v-model="content"
    useCustomImageHandler
    @image-added="handleImageAdded"
></vue-editor>
```

## axios
*  Promise based HTTP client for the browser and node.js
*  簡易使用Ajax

ex: imgur api post image to https://api.imgur.com/3/image
```
axios({
        url: 'https://api.imgur.com/3/image',
        method: 'POST',
        'timeout': 0,
        'headers': {
            'Authorization': 'Client-ID ' + imgurClient.id
        },
        'processData': false,
        'mimeType': 'multipart/form-data',
        'content-type': false,
        'data': formData
    })
```

## imgur api

ArticleAdd.vue, ArticleEdit.vue (with vue2-editor)
```
handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {

    let formData = new FormData();
    formData.append("image", file);
    // formData.append("user", this.article.creator);


    // imgur api
    axios({
        url: 'https://api.imgur.com/3/image',
        method: 'POST',
        'timeout': 0,
        'headers': {
            'Authorization': 'Client-ID ' + imgurClient.id
        },
        'processData': false,
        'mimeType': 'multipart/form-data',
        'content-type': false,
        'data': formData
    }).then(result => {
        console.log(result.data.data.link, result.data);
        let url = result.data.data.link;

        // 將圖片網址加進使用者資料中
        let user = this.$store.getters['users/getDataById'](this.article.creator);
        user.images.push(url);
        this.$store.dispatch('users/updateDataAction', user);

        Editor.insertEmbed(cursorLocation, "image", url);
        resetUploader();
    })
```

## lodash
列出幾個比較常用的  
*  isEmpty() 判斷是不是空值(null, {}, [], undefined, )
*  clonedeep() 深拷貝
```
import _ from 'lodash'
```

## dayjs
*  極度輕量的處理時間library
*  目前主要用於處理firebase回傳來的時間格式  

```
import dayjs from 'dayjs'

// 放在data 這樣就可以在template直接使用
data: function() {
    return {
        dayjs: dayjs
    }
}
```