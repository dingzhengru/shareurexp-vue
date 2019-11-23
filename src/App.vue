<template>
<div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/user">User</router-link> |
      <router-link to="/sign-in">SignIn</router-link> |
      <router-link to="/sign-out">SignOut</router-link> |
      <router-link to="/sign-up">SignUp</router-link> |
      <router-link to="/articles">Articles</router-link> |
      <router-link to="/articles/add">AddArticle</router-link> |
    </div> -->
<nav id="navbar" class="navbar navbar-expand-lg navbar-custom ">
    <router-link to="/" class="navbar-brand">
        <img src="https://i.imgur.com/qz3f7tJ.png"
             height="50"
             width="100"
             alt="logo"
             title="home">
    </router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <i class="fas fa-align-justify fa-2x
                  navbar-collapse-icon"></i>
    </button>
    <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <router-link class="nav-link" to="/articles">Articles</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/articles/add">ArticleAdd</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/user">User</router-link>
            </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
                <a class="nav-link" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-align-justify fa-2x
                              navbar-toggle-icon"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                    <router-link 
                    v-if="true"
                    class="dropdown-item" 
                    to="/sign-up">
                    Sign Up</router-link>
                    <router-link 
                    v-if="true"
                    class="dropdown-item" 
                    to="/sign-in">
                    Sign In</router-link>
                    <div class="dropdown-divider"></div>
                    <router-link 
                    v-if="true"
                    class="dropdown-item" 
                    to="/sign-out">
                    Sign Out</router-link>
                </div>
            </li>
        </ul>
    </div>
</nav>

<main class="container">
    <router-view/>
</main>

<footer>
    <div class="container">
        <div class="row">
            <div class="col"></div>
            <div class="col text-center">
                <a href="https://github.com/dingzhengru">© by DingZhengRu</a>
            </div>
            <div class="col"></div>
        </div>
    </div>
</footer>

</div>
</template>

<style lang="scss">
html, body, #app{
    height: 100%;
}

#app {

}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

// nav
.navbar-custom {
    background-color: #CCBF97; 

    .nav-item {
        a {
            color: #1d525f;
            font-size: 18px;
            font-weight: bold;
        }
        a:hover { color: #FAF0E6; }
        a.router-link-exact-active {
            color: #FAF0E6;
        }
        a.dropdown-item:hover {
            background-color: #1d525f;
        }
        a.dropdown-item.router-link-exact-active {
            background-color: #1d525f;
        }
    }
    button.navbar-toggler {
        .navbar-collapse-icon:hover {
            color: #FAF0E6;
        }
    }
}

// main
main.container {
    box-shadow: 0px 0px 10px 3px #888888; 
    position: relative;
    min-height: 100%;
}

// footer
footer {
    background-color: #135A77;
    height: 50px;
    
    clear: both;
    a { color: #FAF0E6; }
    a:hover { color: #C7B19C;  }
}
</style>
