<?php


Route::namespace('Blog')->group(function () {

    Route::get('/', 'BlogController@index');
    Route::get('/info', 'BlogController@info');
});

// 关于我
Route::redirect('/about/me', '/info?aid=2');
