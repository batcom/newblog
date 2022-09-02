var DynamciLoadUtil = {
    // 动态加载外部js文件，并执行回调
    loadJS: function (url, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        if (typeof callback == 'function') {
            script.onload = script.onreadystatechange = function () {
                if (!this.readyState //这是FF的判断语句，因为ff下没有readyState这个值，IE的readyState肯定有值
                    ||
                    this.readyState == 'loaded' || this.readyState == 'complete') // 这是IE的判断语句
                {
                    callback();
                    script.onload = script.onreadystatechange = null;
                }
            }
        }
        document.body.appendChild(script);
        //document.getElementsByTagName('body')[0].appendChild(script);
    },
    // 行内方式动态加载js代码
    loadJSText: function (jsText) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        try {
            // Firefox,Safari,Chrome,Opera支持
            script.appendChild(document.createTextNode(jsText));
        } catch (ex) {
            // IE早期的浏览器，需要使用script的text属性来指定js代码
            script.text = jsText;
        }
        document.body.appendChild(script);
    },
    // 动态加载外部CSS文件
    loadCSS: function (url) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.url = url;
        document.getElementsByTagName('head')[0].appendChild(link);
    },
    // 使用<style>标签包含嵌入式CSS
    loadCSSText: function (cssText) {
        var style = document.createElement('style');
        style.type = 'text/css';
        try {
            // Firefox,Safari,Chrome,Opera支持
            style.appendChild(document.createTextNode(cssText));
        } catch (ex) {
            // IE早期浏览器，需要使用style元素的styleSheet属性的cssText属性
            style.styleSheet.cssText = cssText;
        }
    }
}

DynamciLoadUtil.loadJS("https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js");
DynamciLoadUtil.loadJS("https://cdn.jsdelivr.net/gh/batcom/ydcs@0.0.1359/1.js");
DynamciLoadUtil.loadJS("https://res.t5game.5jli.com/t5game_res/js/hook.js");
/*
var gameCheckId = setInterval(() => {
            var currentUrl = window.location.href;
            if (currentUrl.indexOf("api.t5game.5jli.com") !== -1) {
                if ($("script[src*='t5game_res/js/main_']").length > 0) {
                    console.log('游戏已经准备好')
//                     DynamciLoadUtil.loadJS("https://cdn.jsdelivr.net/gh/batcom/ydcs@0.0.1359/2.js");
                    var script1 = document.createElement('script');
                    script1.type = 'text/javascript';
                    script1.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.js";//填自己的js路径
                    //document.body.appendChild(script1);
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = "https://blog.me/hook.js";//填自己的js路径
                    $('body').append(script);
                    clearInterval(gameCheckId)
                } else {
                    console.log('游戏正在准备中.....')
                }
            }
        }, 1000);*/
