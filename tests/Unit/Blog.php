<?php

namespace Tests\Unit;

use App\Console\Commands\Blog as CommandsBlog;
use App\Models\Blog as ModelsBlog;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class Blog extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function testParseTitle()
    {
        $content = 'sdfe<h1>测试title</h1>dfsdfwerfsefsdf<h1>fsdfeee</h1>fdsfefsfsdf<h2>33sf</h2>sdfdf';
        $cmdBlog = new CommandsBlog;
        $title = $cmdBlog->parseHtmlTitle($content);
        $this->assertEquals($title, '测试title');
    }

    public function testParseMdTitle()
    {
        $content = '# 系统初始化流程

<!--标题：系统初始话流程｜分类：运维｜标签：安装，Linux-->

## 安装linux即软件初始化

### 安装typora

#### 软件方法仓库安装

1. 安装软件仓库`sudo apt-get install software-properties-common`';

        $cmdBlog = new CommandsBlog;
        $title = $cmdBlog->parseMdTitle($content);
        $this->assertEquals($title, '系统初始化流程');
    }


    public function testParseTagsOrCat()
    {
        $content = '# 系统初始化流程

<!--标题：系统初始话流程｜分类：运维｜标签：安装，Linux-->

## 安装linux即软件初始化

### 安装typora

#### 软件方法仓库安装

1. 安装软件仓库`sudo apt-get install software-properties-common`';
        $cmdBlog = new CommandsBlog;
        list($title, $cate, $tags) = $cmdBlog->parseOthers($content);
        // dd($title, $cate, $tags);
        $this->assertEquals($title, '系统初始话流程');
        $this->assertEquals($cate, '运维');
        $this->assertEquals($tags, '安装，Linux');
    }


    public function testParsePreface()
    {
        $content = '# 系统初始化流程

<!--标题：系统初始话流程｜分类：运维｜标签：安装，Linux-->

> 因为每次遇到新的公司、新电脑、新系统，不论是帮别人还是自己使用都不得不重复做许多相同的事情，资源得不到整合，又没有清晰的思路
>
> 指导，所以，决定写个流程下来，然后，按照这个流程可以提高效率，同时后续也可以根据该文档，整理相关的`shell`脚本，再次提高生产力。

---
';
        $cmdBlog = new CommandsBlog;
        $preface = $cmdBlog->parsePreface($content);
        $this->assertStringContainsString('因为每次遇到新的公司', $preface);
    }

    public function testMutiSqlServer()
    {
        $mdRecords = collect([
            './readme.md' => [
                'path' => './readme.md', 'md5file' => '7aa0391bc632052b1bd9c8cde69c6352',
            ],
            './test.md' => [
                'path' => './test.md', 'md5file' => 'ec1ac12ab85dbcdbf7b3b506314fe9b4',
            ],
            './vendor/nikic/php-parser/UPGRADE-4.0.md' => [
                'path' => './vendor/nikic/php-parser/UPGRADE-4.0.md', 'md5file' => '80720f735cc1fd2cf3579cc7b16c9876',
            ],
        ]);
        $rowInfect = ModelsBlog::on('mysql_sugar')->upsert($mdRecords->toArray(), 'path', ['path', 'md5file']);
        $rowInfect1 = ModelsBlog::on('mysql_tencent')->upsert($mdRecords->toArray(), 'path', ['path', 'md5file']);
        $this->assertIsInt($rowInfect);
        $this->assertIsInt($rowInfect1);
    }

    public function testMd5File()
    {
        $fileName = 'readme.md';
        $contents = file_get_contents($fileName);
        $cmd5 = md5($contents);
        $fmd5 = md5_file($fileName);
        $this->assertEquals($cmd5, $fmd5);
    }

    //　处理新增文章测试
    public function testBlogInsertDiff()
    {
        $mdRecords = collect([
            './readme.md' => [
                'path' => './readme.md', 'md5file' => '7aa0391bc632052b1bd9c8cde69c6352',
            ],
            './test.md' => [
                'path' => './test.md', 'md5file' => 'ec1ac12ab85dbcdbf7b3b506314fe9b4',
            ],
            './vendor/nikic/php-parser/UPGRADE-4.0.md' => [
                'path' => './vendor/nikic/php-parser/UPGRADE-4.0.md', 'md5file' => '80720f735cc1fd2cf3579cc7b16c9876',
            ],
        ]);
        $rowInfect = ModelsBlog::upsert($mdRecords->toArray(), 'path', ['path', 'md5file']);
        $this->assertIsInt($rowInfect);
        /* 下面的是collect 练习用逻辑判断更新和插入，只差最后入库没有完成,后来才查到有upsert这个库,写的非常好
        $modelBlog = new ModelsBlog();
        $existsDB = $modelBlog->whereIn('path', $mdRecords->keys())->select('path', 'md5file')
            ->get()->pluck('md5file', 'path');
        $addOrUpdate = $mdRecords->reject(function ($record) use ($existsDB) {
            return $existsDB->get($record['path']) === $record['md5file'];
        });
        $updateCollection = $addOrUpdate->filter(function ($record) use ($existsDB) {
            return $existsDB->get($record['path']) && $existsDB->get($record['path']) !== $record['md5file'];
        });
        $addCollection = $addOrUpdate->filter(function ($record) use ($existsDB) {
            return $existsDB->get($record['path']) === null;
        });
        $modelBlog->insert($addCollection->toArray());
        $modelBlog->save();*/
    }
}
