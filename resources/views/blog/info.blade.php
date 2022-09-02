@include('blog/header')
                            <div class="col s12">
<style>
    h1{text-align: center}
    #reward {
        margin: 40px 0;
        text-align: center;
    }

    #reward .reward-link {
        font-size: 1.88rem;
    }

    #reward .btn-floating:hover {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    #rewardModal {
        width: 320px;
        height: 350px;
    }

    #rewardModal .reward-title {
        margin: 15px auto;
        padding-bottom: 5px;
    }

    #rewardModal .modal-content {
        padding: 10px;
    }

    #rewardModal .close {
        position: absolute;
        right: 15px;
        top: 15px;
        color: rgba(0, 0, 0, 0.5);
        font-size: 1.3rem;
        line-height: 20px;
        cursor: pointer;    
    }

    #rewardModal .reward-tabs {
        margin: 0 auto;
        width: 210px;
    }

    .reward-tabs .tabs {
        height: 38px;
        margin: 10px auto;
        padding-left: 0;
    }

    .reward-tabs .tabs .tab {
        height: 38px;
        line-height: 38px;
    }

    .reward-tabs .tab a {
        color: #fff;
        background-color: #ccc;
    }

    .reward-tabs .tab a:hover {
        color: #fff;
    }

    .reward-tabs .wechat-tab .active {
        color: #fff;
        background-color: #22AB38;
    }

    .reward-tabs .alipay-tab .active {
        color: #fff;
        background-color: #019FE8;
    }

    .reward-tabs .reward-img {
        width: 210px;
        height: 210px;
    }
</style> 
<main class="content">
    <div class="row">
        <div class="col s10">
            <div id="artDetail" class="container">
                <div class="card">
                    <div class="card-content article-info">
                        <div class="article-tag">
                            @foreach ($tags as $tag)
                            <a href="" target="_blank"><span class="chip tag-bg-color">{{$tag}}</span></a>
                            @endforeach
                        </div>
                        <div class="author-info">
                            <span>
                                <i class="fa fa-calendar fa-fw"></i>{{$date}}
                            </span>
                        </div>
                    </div>
                    <hr>
                    <div class="card-content article-card-content">
                        <div id="articleContent">
                            <div class="kg-card-markdown">
                                {!! $md_content !!}
                            </div>
                        </div>
                        <hr />
                        <div class="row">
<div id="reward">
    <a class="reward-link btn-floating btn-large waves-effect waves-light red">赏</a>
    <!-- Modal Structure -->
    <div id="rewardModal" class="modal">
        <div class="modal-content">
            <a class="close"><i class="fa fa-close"></i></a>
            <h4 class="reward-title">你的赏识是我前进的动力</h4>
            <div class="reward-content">
                <div class="reward-tabs">
                    <ul class="tabs">
                        <li class="tab wechat-tab waves-effect waves-light"><a class="active" href="#wechat">微信</a></li>
                        <li class="tab alipay-tab waves-effect waves-light"><a href="#alipay">微信</a></li>
                    </ul>
                    <div id="wechat">
                        <img src="http://image.luokangyuan.com/money.jpg" class="reward-img" alt="微信打赏二维码">
                    </div>
                    <div id="alipay">
                        <img src="http://image.luokangyuan.com/money.jpg" class="reward-img" alt="微信打赏二维码">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    $(function () {
        $('#reward .reward-link').on('click', function () {
            $('#rewardModal').openModal();
        });
        $('#rewardModal .close').on('click', function () {
            $('#rewardModal').closeModal();
        });
    });
</script>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card gitalk-card" data-aos="fade-up">
                    <div id="gitalk-container" class="card-content"></div>
                </div>
            </div>
        </div>
        <div class="col s2">
            <div id="toc" class="hiden-div">
                <h2 style="margin-left:80px; background: #eaeaea; color:#000">目录</h2>
                <div id="toc"></div>

<link rel="stylesheet" type="text/css" href="../assets/css/my.css">

<script src="../assets/libs/toc/jquery-ui-1.9.1.custom.min.js"></script>
<script src="../assets/libs/toc/jquery.tocify.js"></script>

<script>
    var toc = $("#toc").tocify({
        selectors: "h1,h2",
        extendPage: false, // 页面不够长时拉长页面，这里选择关闭因为感觉留出大片空白不好看- -
        highlightDefault: true // 自动高亮第一条
    }).data("toc-tocify");
   
    
    var toc = $("#toc");
    $(window).scroll(function () {
        var topSize = $(window).scrollTop();
        if(topSize > 320){
            toc.removeClass("hiden-div");
        }else{
            toc.addClass("hiden-div")
        }
    });

</script>            </div>
        </div>
    </div>
    </main>
 @include('blog.footer')
