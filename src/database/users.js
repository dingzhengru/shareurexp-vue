const now = new Date();

// users object

// uid 對應 auth uid
// pushArticles 推過的文章
// pushPosts 推過的回覆
// images 在編輯器上傳的圖片(imgur api 或 自己寫的 express api)
// settings 使用者設定 目前有pagesize, showmode
// avatarColor 存顏色，套用在用css做的avatar背景色
//      也可以考慮讓使用者自己上傳圖像，改存圖片網址
//      顏色參考: https://htmlcolorcodes.com/ 下面選幾個覺得OK的
//      #EC7063 #A569BD #5DADE2 #45B39D #58D68D 
//      #F5B041 #DC7633 #CACFD2 #99A3A4 #566573

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
    settings: {
        pagesize: 5,
        showmode: 'page'
    }
}
*/

export default [
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
        avatarColor: '#EC7063',
        settings: {
            pagesize: 5,
            showmode: 'page'
        }
    },
    {
        id: 1,
        uid: 'Zes3quB0X3NZAZfs4q2upLyf1LZ2',
        email: 'qws7869vdx@gmail.com',
        username: 'username1',
        created: now,
        editDate: now,
        pushArticles: [],
        pushPosts: [],
        images: [],
        avatarColor: '#EC7063',
        settings: {
            pagesize: 5,
            showmode: 'page'
        }
    },
    {
        id: 2,
        uid: 'zTiWgf2Vh4SDNpWoMufceR7DfY33',
        email: 'asdasdasdzxcqwe@gmail.com',
        username: 'username2',
        created: now,
        editDate: now,
        pushArticles: [],
        pushPosts: [],
        images: [],
        avatarColor: '#5DADE2',
        settings: {
            pagesize: 5,
            showmode: 'page'
        }
    },
    {
        id: 3,
        uid: 'iTsWqVp3wKPZnnm8Dg7FVHmv7cB3',
        email: 'qwerasdf@gmail.com',
        username: 'username3',
        created: now,
        editDate: now,
        pushArticles: [],
        pushPosts: [],
        images: [],
        avatarColor: '#5DADE2',
        settings: {
            pagesize: 5,
            showmode: 'page'
        }
    },
]