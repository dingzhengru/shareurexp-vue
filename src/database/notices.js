const now = new Date();


// user: user id
// creator: user id 創建這個通知的是誰(誰回覆的，或官方帳戶)
// article: article id
// type: 
//      'official' 官方通知
//      'post' 有新回覆
// isRead: 是否已讀

export default [
    {
        id: 0,
        user: 1,
        article: 2,
        creator: 0,
        created: now,
        type: 'official',
        content: '官方通知',
        isRead: false
    },
    {
        id: 1,
        user: 1,
        article: 2,
        creator: 2,
        created: now,
        type: 'post',
        content: '有新的回覆',
        isRead: false
    },
    {
        id: 2,
        user: 1,
        article: 3,
        creator: 1,
        created: now,
        type: 'post',
        content: '有新的回覆',
        isRead: false
    },
]