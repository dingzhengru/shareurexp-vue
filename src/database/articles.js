const now = new Date();

// creator: user id
// posts: post id list
// pushs: user id list 存推文的user id
// school: school id
// tags: tag id list
// latestPostDate: 最新post的created
// ipViews: ip list 儲存點入文章瀏覽的IP(不重複)

export default [
    {
        id: 0,
        title: '標題0',
        content: '<h3>內容0內容0內容0內容0內容0</h3>',
        creator: 0,
        created: now,
        editDate: now,
        posts: [],
        pushs: [],
        school: 50,
        tags: [48, 78],
        latestPostDate: now,
        ipViews: [],
    },
    {
        id: 1,
        title: '標題1',
        content: '<h3>內容1內容1內容1內容1內容1</h3>',
        creator: 1,
        created: now,
        editDate: now,
        posts: [],
        pushs: [],
        school: 27,
        tags: [36, 57],
        latestPostDate: now,
        ipViews: [],
    },
    {
        id: 2,
        title: '標題2',
        content: '<h3>內容2內容2內容2內容2內容2</h3>',
        creator: 2,
        created: now,
        editDate: now,
        posts: [0, 1],
        pushs: [],
        school: 50,
        tags: [64, 66],
        latestPostDate: now,
        ipViews: [],
    },
    {
        id: 3,
        title: '標題3',
        content: '<h3>內容3內容3內容3內容3內容3</h3>',
        creator: 0,
        created: now,
        editDate: now,
        posts: [2, 3],
        pushs: [],
        school: 10,
        tags: [6, 2, 4,10],
        latestPostDate: now,
        ipViews: [],
    },
    {
        id: 4,
        title: '標題4',
        content: '<h3>內容4內容4內容4內容4內容4</h3>',
        creator: 3,
        created: now,
        editDate: now,
        posts: [4],
        pushs: [],
        school: 80,
        tags: [22, 33, 44, 55],
        latestPostDate: now,
        ipViews: [],
    },
]