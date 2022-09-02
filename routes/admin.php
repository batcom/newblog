<?php

//    Route::get('/index',"Admin\IndexController@index"); 
/*Route::group(['prefix' => 'admin'], function () {
    Route::get('',"Admin\IndexController@index"); 
    
});*/


Route::namespace('Admin')->group(function(){

    Route::get('/index',"IndexController@index"); 
});