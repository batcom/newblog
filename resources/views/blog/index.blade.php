@include('blog/header')
 <link href="https://cdn.jsdelivr.net/gh/batcom/static/template/blog/list.css" type="text/css" rel="stylesheet" />

    <main class="content">
      <div class="container notice">
        <div class="card">
          <div class="card-content">
            <i
              class="fa fa-volume-up fa-lg fa-fw text-color"></i>此生之路，我将走过；走过这一次，便再也无法重来。所有力所能及的善行，所有充盈于心的善意，我将毫不吝惜，即刻倾于。我将不再拖延，再不淡漠，只因此生之路，再也无法重来。
          </div>
        </div>
      </div>
      <!-- 所有文章卡片 -->
      <div class="l_body">
        <div class="body-wrapper">
          <div class="l_main">
            <section class="post-list">
              @foreach ($blogs as $blog)
                  
              
              <div class="post-wrapper">
                <article class="post reveal" data-sr-id="0" style="visibility: visible; opacity: 1; transition: all 0.25s ease 0s, opacity 0.6s cubic-bezier(0.5, 0, 0, 1) 0s;">
                  <section class="meta">
                    <a title="{{$blog->title}}" href="{{ url("/info?aid={$blog->id}") }}">
                      <img class="thumbnail" src="">
                    </a>
                    <div class="meta" id="header-meta">
                      <h2 class="title">
                        <a href="{{ action('Blog\BlogController@info', ['id' => $blog->id]) }}">{{$blog->title}}</a>
                      </h2><div class="new-meta-box"><div class="new-meta-item author">
                          <a href="https://xaoxuu.com" rel="nofollow">
                            <img src="https://cdn.jsdelivr.net/gh/batcom/static/assets/img/6fda0c831be0e443413d3366aec4498d2b874d.jpg">
                            <p>Mr. Xu</p></a>
                        </div><div class="new-meta-item date">
                          <a class="notlink"><i class="fa fa-calendar-alt" aria-hidden="true"></i><p>2019-10-06</p></a></div>
                        <!-- <div class="new-meta-item category">
                          <a href="" rel="nofollow"><i class="fa fa-folder-open" aria-hidden="true"></i>
                            <p>Dev&nbsp;/&nbsp;Cocoa</p>
                          </a>
                        </div>-->
                        </div>
                        <hr>
                    </div>
                  </section>
                  <section class="article typo">
                    <div class="article-entry" itemprop="articleBody">
                    <p><img src="" alt=""></p>
                    <p>{{$blog->preface}}</p>
                      <div class="readmore"><a href="{{ url("/info?aid={$blog->id}") }}" class="flat-box waves-effect waves-block"><i class="fas fa-book-open fa-fw" aria-hidden="true"></i> 阅读全文</a></div></div><div class="full-width auto-padding tags"><a href="/blog/tags/ios/" rel="nofollow"><i class="fas fa-tag fa-fw"></i> iOS</a></div>
                  </section>
                </article>
              </div>
              @endforeach
            </section>
            {{-- {{ $blogs->links() }} --}}
          <div class="prev-next"><div class="prev-next"><p class="current">{{$blogs->currentPage()}} / {{$blogs->lastPage()}}</p><a class="next" rel="next" href="{{$blogs->nextPageUrl()}}"><section class="post next">&nbsp;下一页&nbsp;<i class="fas fa-chevron-right" aria-hidden="true"></i></section></a></div></div>
          </div>
        </div>
      </div>
    </main>
     @include('blog.footer')