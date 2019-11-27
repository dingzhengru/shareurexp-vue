# shareurexp-vue(demo project)

*  <a href="#project-setup">Project setup</a>
*  <a href="#firebase">firebase</a>
*  <a href="#bootstrap">bootstrap</a>
*  <a href="#fort-awesome">fort-awesome</a>
*  <a href="#vue2-editor">vue2-editor</a>
*  <a href="#vue-select">vue-select</a>
*  <a href="#vue-tippy">vue-tippy</a>
*  <a href="#v-responsive">v-responsive</a>
*  <a href="#axios">axios</a>
*  <a href="#imgur-api">imgur api</a>
*  <a href="#lodash">lodash</a>
*  <a href="#dayjs">dayjs</a>
*  <a href="#正則表達式">正則表達式</a>
*  <a href="#my-ip.ioapi">my-ip.io/api</a>
*  <a href="#遇到的問題">遇到的問題</a>
    *  <a href="#跨站源資源共用CORS">跨站源資源共用(CORS)</a>
    *  <a href="#ERR_BLOCKED_BY_CLIENT">ERR_BLOCKED_BY_CLIENT</a>
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
*  import css & js in main.js
*  用於置左, 置右 ml-auto, mr-auto(margin-left: auto; , margin-right: auto; )

**main.js**  
```
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
```  
## fort-awesome
*  import css & js in main.js

```npm install --save-dev @fortawesome/fontawesome-free```  
**main.js**
```
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'
```

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
## vue-select
*  v-model 放被選的值(參數)
*  label 選擇要顯示的欄位
*  :options 放data
*  :reduce 把值改成object裡的一個欄位

**{ id: 0, name: '' } 要指定值是id，顯示的是name的話 name => name.id**  
main.js  
```import 'vue-select/dist/vue-select.css'```  
.vue
```
<v-select label="name"
          :reduce="name => name.id"
          :options="getTags"
          v-model="article.tags"
          multiple 
          placeholder="選擇科系(複選)"/>

import vSelect from 'vue-select'
```
## vue-tippy

## v-responsive

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
*  isEmpty() 判斷是不是空值(null, {}, [], undefined, **數字也會被判斷為空值**)
*  clonedeep() 深拷貝
```
import _ from 'lodash'
```

## dayjs
*  極度輕量的處理時間library
*  目前主要用於處理firebase回傳來的時間格式  
*  設置時區: ```dayjs.locale('zh-tw')```
*  引入的 Plugin: RelativeTime
```
import dayjs from 'dayjs'

// 設置時區(全域)
import 'dayjs/locale/zh-tw.js'
dayjs.locale('zh-tw')

// 調用時才設(只限這行)
dayjs().locale('zh-tw').format() 

// import Plugin
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// 遇到'relativeTime' of undefined 的bug的話 下面是解法(作者: 1.18版修正)
import tw from  'dayjs/locale/zh-tw';
dayjs.locale(tw);   
dayjs.locale('zh-tw');   

// 放在data 這樣就可以在template直接使用
data: function() {
    return {
        dayjs: dayjs
    }
}
```

## 遇到的問題
###  跨站源資源共用(CORS)
*  你要跨的server 沒有允許你這個網域存取
*  有時候是req header沒設定好 (imgur api ex: {content-type: false, 'mimeType': 'multipart/form-data'})
*  自己的server的話，要設定好跨站存取你那個網域

```
// set res headers
headers: {
    Access-Control-Allow-Origin: '*',
    Access-Control-Allow-Headers: 'origin, content-type, accept',
    Access-Control-Allow-Methods: 'GET, POST, PUT, DELETE, OPTIONS',
    Access-Control-Allow-Credentials: true
}

// or use express extend

const cors = require('cors')
app.use(cors()); // 允許全部跨站
app.use(cors({
  origin: 'http://yourapp.com' // 允許指定網域
}))

```


###  ERR_BLOCKED_BY_CLIENT
*  通常是遇到ad block阻擋了檔案、ajax存取(檔案名稱、網域名稱被阻擋，可能包含廣告敏感字)
*  尋找沒被擋掉的web api(ex: my-ip.io/api)
*  找不到就只能自己架server寫api了

