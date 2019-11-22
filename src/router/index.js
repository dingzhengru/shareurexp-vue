import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import User from '../views/User.vue'
import SignIn from '../views/SignIn.vue'
import SignOut from '../views/SignOut.vue'
import SignUp from '../views/SignUp.vue'
import ArticleRoot from '../views/ArticleRoot.vue'
import Articles from '../views/Articles.vue'
import Article from '../views/Article.vue'
import ArticleAdd from '../views/ArticleAdd.vue'
import ArticleEdit from '../views/ArticleEdit.vue'

import PostAdd from '../views/PostAdd.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/user',
    name: 'user',
    component: User
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: SignIn
  },
  {
    path: '/sign-out',
    name: 'sign-out',
    component: SignOut
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: SignUp
  },
  {
    path: '/articles',
    name: 'articles-root',
    component: ArticleRoot,
    children: [
        {
          path: '/',
          name: 'articles',
          component: Articles
        },
        {
          path: 'id/:id',
          name: 'article',
          component: Article
        },
        {
          path: 'add',
          name: 'article-add',
          component: ArticleAdd
        },
        {
          path: 'id/:id/post-add',
          name: 'post-add',
          component: PostAdd
        },
        {
          path: 'id/:id/edit',
          name: 'article-edit',
          component: ArticleEdit
        },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
