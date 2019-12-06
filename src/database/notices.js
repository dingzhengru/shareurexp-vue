const now = new Date();


// creator: user id 創建這個通知的是誰(誰回覆的，或官方帳戶)
// article: article id
// type: 
//      'official' 官方通知
//      'post' 有新回覆
// isRead: 是否已讀
// readUsers: 已讀的使用者

export default [
    {
        id: 0,
        creator: 0,
        article: 2,
        created: now,
        type: 'official',
        content: '內容內容內容內容',
        readUsers: [],
    },
    {
        id: 1,
        creator: 2,
        article: 2,
        created: now,
        type: 'post',
        content: '有新的回覆',
        readUsers: [],
    },
    {
        id: 2,
        creator: 1,
        article: 3,
        created: now,
        type: 'post',
        content: '有新的回覆',
        readUsers: [],
    },
    {
        id: 3,
        creator: 1,
        article: 3,
        created: now,
        type: 'post',
        content: '有新的回覆',
        readUsers: [],
    },
]