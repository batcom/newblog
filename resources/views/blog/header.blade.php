

<!DOCTYPE html>
<html lang="zh">

<head>

    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <title>徐恒的博客 - {{$title}}</title>
    <meta name="HandheldFriendly" content="True" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    {{-- <link rel="stylesheet" type="text/css" href="/assets/libs/awesome/css/font-awesome.min.css?v=0e02013512">
    <link rel="stylesheet" type="text/css" href="/assets/libs/materialize/css/materialize.min.css?v=0e02013512">
    <link rel="stylesheet" type="text/css" href="/assets/libs/aos/aos.css?v=0e02013512">
    <link rel="stylesheet" type="text/css" href="/assets/libs/animate/animate.min.css?v=0e02013512">
    <link rel="stylesheet" type="text/css" href="/assets/libs/lightGallery/css/lightgallery.min.css?v=0e02013512">
    <link rel="stylesheet" type="text/css" href="/assets/css/matery.css?v=0e02013512">
    <link rel="stylesheet" type="text/css" href="/assets/css/my.css?v=0e02013512">
    <link rel="stylesheet" type="text/css" href="/assets/css/jqcloud.css?v=0e02013512">
    <link rel="stylesheet" type="text/css" href="/assets/libs/prism/prism.css?v=0e02013512">
    <link rel="stylesheet" type="text/css" href="/assets/css/articClassification.css?v=0e02013512">
    <link rel="stylesheet" type="text/css" href="/assets/css/ihover.min.css?v=0e02013512">
    <link rel="stylesheet" type="text/css" href="/assets/libs/bootstrap/button.css?v=0e02013512">
    <script src="/assets/libs/jquery/jquery-2.2.0.min.js?v=0e02013512 "></script> --}}


     <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/batcom/static/assets/libs/materialize/css/materialize.min.css?v=5283dd0dd6">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/batcom/static/assets/libs/aos/aos.css?v=5283dd0dd6">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/batcom/static/assets/libs/animate/animate.min.css?v=5283dd0dd6">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/batcom/static/assets/libs/lightGallery/css/lightgallery.min.css?v=5283dd0dd6">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/batcom/static/assets/css/matery.css?v=5283dd0dd6">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/batcom/static/assets/css/my.css?v=5283dd0dd6">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/batcom/static/assets/css/jqcloud.css?v=5283dd0dd6">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/batcom/static/assets/libs/prism/prism.css?v=5283dd0dd6">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/batcom/static/assets/css/articClassification.css?v=5283dd0dd6">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/batcom/static/assets/css/ihover.min.css?v=5283dd0dd6">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/batcom/static/assets/libs/bootstrap/button.css?v=5283dd0dd6">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/batcom/static/assets/css/all.min.css?v=5283dd0dd6">
    <script src="https://cdn.jsdelivr.net/gh/batcom/static/assets/libs/jquery/jquery-2.2.0.min.js?v=5283dd0dd6 "></script>

    <link rel="shortcut icon" href="/favicon.png" type="image/png" />
    <meta name="referrer" content="no-referrer-when-downgrade" />
</head>

<body>
    <header class="navbar-fixed">
    <nav id="headNav" class="bg-color nav-transparent">
        <div id="navContainer" class="container">
            <div class="nav-wrapper">
                <div class="brand-logo">
                    <a href="/" class="waves-effect waves-light">
                        <img src="cross.logo" class="logo-img hide-on-small-only">
                        <span class="logo-span">圣城-蒙爱的城</span>
                    </a>
                </div>
                <a href="#" data-activates="mobile-nav" class="button-collapse"><i class="fa fa-navicon"></i></a>
                <ul class="right">
                     <li class="hide-on-med-and-down">
                        <a href="/" class="waves-effect waves-light">首页</a>
                    </li>
                    {{-- <li class="hide-on-med-and-down">
                        <a href="/articles/classification/" class="waves-effect waves-light">文章分类</a>
                    </li>
                    <li class="hide-on-med-and-down">
                        <a href="/articles/file/" class="waves-effect waves-light">文章归档</a>
                    </li>
                    <li class="hide-on-med-and-down">
                        <a href="/recard/list/people/" class="waves-effect waves-light">赞助墙 </a>
                    </li> --}}
                    <li class="hide-on-med-and-down">
                        <a href="/about/me/" class="waves-effect waves-light">关于我</a>
                    </li>
                    {{-- <li class="hide-on-med-and-down">
                        <a href="/friend/ship/" class="waves-effect waves-light">移步大佬</a>
                    </li> --}}
                    <li>
                        <a id="toggleSearch" class="waves-effect waves-light">
                            <i id="searchIcon" class="mdi-action-search"></i>
                        </a>
                    </li>
                </ul>

                <div class="side-nav" id="mobile-nav">
                    <div class="mobile-head bg-color">
                        <div class="logo-name">努力做最有价值的技术文章</div>
                        <div class="logo-desc">
                            这里，只求分享与免费；这里，不隐含扭曲的价值观，而是整合并充盈正能量；
                            
                        </div>
                    </div>
                    <ul class="menu-list">
                        <li>
                            <a href="/" class="waves-effect waves-light">
                                <i class="fa fa-link fa-lg fa-fw"></i>首页
                            </a>
                        </li>
                        <li>
                            <a href="/about/me/" class="waves-effect waves-light">
                                <i class="fa fa-link fa-lg fa-fw"></i>关于我
                            </a>
                        </li>
                    </ul>
                    <div class="social-link">
                        <a href="https://github.com/batcom" class="tooltipped" target="_blank" data-tooltip="访问我的GitHub"
                            data-position="top" data-delay="50">
                            <i class="fa fa-github fa-lg"></i>
                        </a>
                        <a href="mailto:1516070515@qq.com" class="tooltipped" target="_blank" data-tooltip="邮件联系我"
                            data-position="top" data-delay="50">
                            <i class="fa fa-envelope fa-lg"></i>
                        </a>
                        <a href="#!" class="tooltipped" data-tooltip="QQ号：1516070515" data-position="top" data-delay="50">
                            <i class="fa fa-qq fa-lg"></i>
                        </a>
                    </div>
                </div>

            </div>
        </div>
        <a href="https://github.com/batcom" class="github-corner">
            <svg viewBox="0 0 250 250" aria-hidden="true">
                <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
                <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                    fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
                <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
                    fill="currentColor" class="octo-body"></path>
            </svg>
        </a>
    </nav>
</header>
<div class="bg-cover" style="background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);">
    <div class="container">
        <div class="row">
            <div class="col s12  m12  l12 ">
               
                <div id="stars"></div>
                <div id="stars2"></div>
                <div id="stars3"></div>
                <div class="title center-align">
                    努力做有价值的技术文章
                </div>
                <div class="description center-align">
                    这里，只求分享与免费；这里，不隐含扭曲的价值观，而是整合并充盈正能量；
                </div>
            </div>
        </div>
    </div>
</div>    