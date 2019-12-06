# shareurexp-vue(demo project)

*  <a href="#project-setup">Project setup</a>
*  <a href="#store-firebase">store-firebase</a>
*  <a href="#my-computed">my-computed</a>
    *  <a href="#authIsReady">authIsReady</a>
    *  <a href="#authIsSignIn">authIsSignIn</a>
    *  <a href="#getCurrentUser">getCurrentUser</a>
    *  <a href="#getIsCurrentUserReady">getIsCurrentUserReady</a>
*  <a href="#my-methods">my-methods</a>
    *  <a href="#setUserChecker">setUserChecker</a>
*  <a href="#my-component">my-component</a>
    *  <a href="#Pagination">Pagination</a>
    *  <a href="#SignInModal">SignInModal</a>
*  <a href="#scss-css">scss & css</a>
    *  <a href="#searchclear">searchclear</a>
    *  <a href="#avatar">avatar</a>
    *  <a href="#"></a>
*  <a href="css-animate">css animate</a>
*  <a href="#firebase">firebase</a>
*  <a href="#bootstrap">bootstrap</a>
    *  <a href="#bootstrap的置中">bootstrap的置中</a>
    *  <a href="#有下拉軸的Dropdown">有下拉軸的Dropdown</a>
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
    *  <a href="#如何在vue監聽scroll">如何在vue監聽scroll</a>
    *  <a href="#取得scroll位置與是否快到底部的判斷">取得scroll位置與是否快到底部的判斷</a>
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

## store-firebase
*  為firebase寫的 vue store
*  包含獲取、新增、修改、刪除、即時更新(資料更動時)
*  還包含搜尋、排序、分頁
*  要把store中的 state.collection 改成要對應的 firebase collection
*  setWatchById 是監控某個特定id用的，目前用在users.currentUser
```
import { db, firebase } from '../firebase.js'

export default {
    namespaced: true,
    state: {
        collection: 'your-firebase-collection',
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
        getData: function(state) {},
        getDataById: (state) => (id) => {},
        getSortData: function(state) {},
        getSearchData: function(state) {},
        getPageData: function(state) {},
        getFilterData: function(state, getters) {
            // sort => search => page
        }
    },
    mutations: {
        setData(state, payload) {},
        setSort(state, payload) {},
        setSearch(state, payload) {},
        setPage(state, payload) {}
    },
    actions: {
        setWatchById({ state, commit }, payload) {},
        setWatchDataAction({ state, commit }, payload) {},
        getDataAction({ state, commit }, payload) {},
        addDataAction({ state, commit, dispatch  }, payload) {},
        removeDataAction({ state, commit, dispatch }, payload) {},
        updateDataAction({ state, commit, dispatch }, payload) {}
    },
}



```

## my-computed
*  列出幾個我覺得需要特別記起來的

### authIsReady
*  確認firebase auth是否準備好了
```
authIsReady: function() {
    return this.$store.getters['auth/getIsReady'];
}
        
```
### authIsSignIn
*  確認firebase auth是否有用戶登入

```
authIsSignIn: function() {
    return this.$store.getters['auth/getIsSignIn'];
}
```

### getCurrentUser
*  並非取得firebase auth的使用者，而是自己寫的users的
```
getCurrentUser: function() {
    return this.$store.getters['users/getCurrentUser'];
}
```
### getIsCurrentUserReady
*  確認自創的users的 current user 是否準備好了
*  目前用在顯示nav時的判斷，避免註冊與登入會先顯示出來

```
getIsCurrentUserReady: function() {
    return this.$store.getters['users/getIsCurrentUserReady'];
}
```


## my-methods
### setUserChecker
*  因為不確定 firebase auth 的準備時間所以要設置interval去重複確認
*  有使用到的computed: getCurrentUser, authIsReady, authIsSignIn
*  使用 try catch 避免出錯時沒清掉 interval
```
this.setUserChecker(() => {
    // 放確認完 auth 與 currentUser 後想做的事
})
```
```
setUserChecker: function(callback, time) {
    if(!_.isNumber(time))
        time = 500

    let userChecker = setInterval(() => {
        try {
            if(!this.authIsReady)
                return
            if(this.authIsSignIn == false) {
                clearInterval(userChecker)
                return
            }
            // 有登入 一定就會有currentuser 所以要避免因延遲沒執行到
            if(this.getCurrentUser) {
                callback()
                clearInterval(userChecker)
            }
        } catch {
            clearInterval(userChecker)
        }
    }, time)
}
```
## my-component
*  自己寫的component

### Pagination
*  data 如果有設置搜尋的話，需要放搜尋後結果
*  @change-page: 會回傳currentPage，接回來並更新你的currentPage

```
<Pagination 
    :currentPage="pagination.currentPage"
    :pageSize="pagination.pageSize"
    :data="getSearchArticles"
    @change-page="changePage">
</Pagination>
```

### SignInModal
*  此modal是用bootstrap寫成的，需引入bootstrap
*  id: 打開modal中的 data-target="#id"
*  signInHandle: 需要給一個回傳 Promise 的函式
*  回傳Promise是為了在登入時檢查是否登入成功，避免失敗還把modal關掉

```
<SignInModal
    id="SignInModal"
    :signInHandle="signIn">    
</SignInModal>

<button 
    data-toggle="modal"
    data-target="#SignInModal">
    Open Modal
</button>
```
### SignUpModal
*  此modal是用bootstrap寫成的，需引入bootstrap
*  id: 打開modal中的 data-target="#id"
*  signUpHandle: 需要給一個回傳 Promise 的函式
*  回傳Promise是為了在登入時檢查是否登入成功，避免失敗還把modal關掉
*  比登入多寫一個關閉 modal 剩餘秒數的 counter ，為了呈現"幾秒後關閉"

```
<SignUpModal
    id="SignUpModal"
    :signUpHandle="signUp">    
</SignUpModal>

<button 
    data-toggle="modal"
    data-target="#SignUpModal">
    Open Modal
</button>
```
```
// conter 顯示幾秒後關閉的
let count = 0;
let countdownTimer = setInterval(() => {
    count = count + 1000
    this.closeLeftTime = Math.floor((this.closeTimeMS - count) / 1000);
    this.message = `${ this.closeLeftTime } 後關閉此視窗`
    if(this.closeLeftTime <= 0)
        clearInterval(countdownTimer);
}, 1000)
```
## scss & css
*  這專案有用到的客製 css style

### searchclear
*  input 後面的清除按鈕( X圖案 )
```
.searchclear {
    position: absolute;
    right: 50px;
    top: 0;
    bottom: 0;
    height: 14px;
    margin: auto;
    font-size: 14px;
    cursor: pointer;
    color: #ccc;
    z-index: 99;
}
```

### avatar
*  用 css 做的簡單文字圖像(要把一個文字放進裡面)

```

// default
.avatar {
    display: inline-block;
    box-sizing: content-box;
    color: #fff;
    text-align: center;
    vertical-align: top;
    background-color: #e5ecf5;
    font-weight: 400;
    width: 48px;
    height: 48px;
    border-radius: 48px;
    font-size: 24px;
    line-height: 48px;
}

// small (.avatar .small)
.small-avatar {
    margin: -2px 5px -2px -6px !important;
    width: 24px  !important;
    height: 24px  !important;
    border-radius: 24px  !important;
    font-size: 12px  !important;
    line-height: 24px  !important;
}

```

## css animate
*  自己寫的簡單動畫
*  只要用transition直接選 all 或只指定變動的屬性(transition: width 0.3s ease-in-out;)
*  剩下就自己指定事件去做屬性變更即可(ex: focus 就把width變大, blur 就把他小回原大小)
*  transition: property || duration || delay || timing-function  [, ...];
*  transition: all 0.5s ease-in-out; / transition: width 0.5s ease-in-out;

```
<input type="text" 
        :style="{ width: inputWidth }" 
        @focus="widenInputWidth()"
        @blur="narrowInputWidth()">

input {
    transition: width 0.3s ease-in-out;
}
```
```
data: function() {
    return {
        inputWidth: '100px'
    }
},
methods: {
    widenInputWidth: function() {
        this.inputWidth = '300px';
    },
    narrowInputWidth: function() {
        this.inputWidth = '100px';
    }
}
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

### bootstrap的置中
*  .text-center
*  { margin: auto }
*  .mx-auto (flex)
```
<div class="d-flex">
    <div class="mx-auto">
        ...
    </div>
</div>
```

### 有下拉軸的Dropdown
*  將這段css加上去 dropdown menu 就可以固定高度且有下拉軸了

```
.scrollable-menu {
    height: auto;
    max-height: 200px;
    overflow-x: hidden;
}
```

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


### 如何在vue監聽scroll

```
export default {
    created: function() {
        window.addEventListener('scroll', this.handleScroll, , { passive: true });
    },
    beforeDestroy: function() {
        window.removeEventListener('scroll', this.handleScroll, , { passive: true });
    },
    methods: {
        handleScroll: function(event) {}
    }
}
```

### 取得scroll位置與是否快到底部的判斷
*  window.scrollY 是取得 scroll 與頂部的距離(最頂部時是 0)
*  window.innerHeight 是取得viewport的高度 (outerHeight 是瀏覽器的高度)
*  document.body.scrollHeight 是取得body的scroll總長度 (通常跟 document.documentElement.scrollHeight 一樣)
*  window.scrollY + window.innerHeight = document.body.scrollHeight
*  取得 window.scrollY 最大值: document.body.scrollHeight - window.innerHeight
*  當到底部時 window.scrollY 自然就會是等於上面那個值
```
// 避免太舊的瀏覽器沒支援 scrollY (IE之類的)
let scrollY = window.scrollY || 
              window.pageYOffset ||
              document.documentElement.scrollTop ||
              window.scrollTop || 
              window.offsetTop
// 到最底部時
if(window.scrollY == (document.body.scrollHeight - window.innerHeight))

// 距離底部 <= 100px
if((document.body.scrollHeight - window.innerHeight) - window.scrollY <= 100)

```
<img src="https://i.imgur.com/NBUFrfv.png">  
來源: https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerHeight