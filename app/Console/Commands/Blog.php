<?php

namespace App\Console\Commands;

use App\Models\Blog as ModelsBlog;
use Carbon\Carbon;
use DirectoryIterator;
use Illuminate\Console\Command;
use RecursiveIterator;
use RecursiveIteratorIterator;
use RecursiveRegexIterator;
use RegexIterator;
use SplFileInfo;

class Blog extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'blog:make {dir} {--chunk=100} {--model=U}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '生成blog';

    //　当前处理的游标
    protected $currentNum = 0;

    protected $allNum = 0;

    protected $chunk = 100;
    // U:upinsert插入or更新插入时间为默认方式为发布，适用与单个文件更新发布
    // I 适合批量发布目录
    protected $publishModel = 'U';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $dir = $this->argument('dir');
        $this->chunk = $this->option('chunk');
        $this->publishModel = $this->option('model');
        $this->makeBlogByDir($dir);
    }

    protected function makeBlogByDir($dir)
    {
        $blogModel = new ModelsBlog;
        foreach ($this->getDbRecordData($dir) as $mdRecords) {
            //　插入md内容到数据库
            $this->info(sprintf("正在插入第%d条数据", $this->currentNum));
            $blogModel->insertMdToDb($mdRecords, $this->publishModel);
            $this->info(sprintf("插入第%d条数据完成", $this->currentNum));
        }
        // TODO 生成静态文件
        //$this->makeHtmls($dir);
    }

    private function getDbRecordData($dir)
    {
        $i = 0;
        $mdRecords = [];
        foreach ($this->getSplFile($dir) as $file) {
            $mdContent = $this->getMdFileContents($file);
            $md5file =  md5_file($file);
            [$title, $category, $tags, $preface] = $this->parseOthers($mdContent);
            $path = $file->getPathname();
            $this->currentNum++;
            $i++;
            $this->info(sprintf("正在获取第%d条, %s 的内容", $this->currentNum, $file));
            $mdRecords[$path]['md_content'] = $mdContent;
            $mdRecords[$path]['title'] = $title;
            $mdRecords[$path]['md5file'] = $md5file;
            $mdRecords[$path]['category'] = $category;
            $mdRecords[$path]['tags'] = $tags;
            $mdRecords[$path]['preface'] = $preface;
            $mdRecords[$path]['path'] = $file->getPathname();
            if ($i >= $this->chunk) {
                yield $mdRecords;
                $mdRecords = [];
                $i = 0;
            }
        }
        yield $mdRecords;
    }


    protected function makeHtmlFile($file)
    {
        // $
    }

    public function parseOthers($content)
    {
        $returnEmpty = [$this->parseMdTitle($content), '', '', $this->parsePreface($content)];
        preg_match('#^<!--(.*)-->[\r|\n|\r\n]$#m', $content, $m);
        if (empty($m)) return $returnEmpty;
        if (strpos($m[1], "｜") === false) return $returnEmpty;
        $line = explode("｜", $m[1]);
        if (count($line) < 3) return $returnEmpty;
        list($titleLine, $catLine, $tagsLine) = explode("｜", $m[1]);
        $title = explode('：', $titleLine)[1] ?? $this->parseMdTitle($content);
        $cate = explode('：', $catLine)[1] ?? '';
        $tags = explode('：', $tagsLine)[1] ?? '';
        $preface = $this->parsePreface($content);
        return [$title, $cate, $tags, $preface];
    }

    //　解析前言　描述
    public function parsePreface($content)
    {
        preg_match('#^>(.*)---$#sm', $content, $m);
        return isset($m[1]) ? (trim($m[1]) ?? '') : '';
    }

    public function parseMdTitle($content)
    {
        preg_match('/^# (.*)[\r|\n|\r\n]$/m', $content, $m);
        return isset($m[1]) ? (trim($m[1]) ?? '') : '';
    }

    public function parseHtmlTitle($content)
    {
        preg_match_all('#<h1>(.*?)</h1>#', $content, $m);
        return $m[1][0] ?? '';
    }

    private function getMdFileContents($file)
    {
        return file_get_contents($file);
    }

    protected function getSplFile($dir)
    {
        if (is_dir($dir)) {
            $directory = new \RecursiveDirectoryIterator($dir);
            $it = new RecursiveIteratorIterator($directory);
            $regx = new RegexIterator($it, '/^.+\.md$/i', RecursiveRegexIterator::GET_MATCH);
            foreach ($regx as $fileinfo) {
                yield new SplFileInfo($fileinfo[0]);
            }
        } else if (is_file($dir)) {
            $fileinfo = new SplFileInfo($dir);
            yield $fileinfo;
        } else {
            $this->error(sprintf("%s:文件或者目录不存在" . PHP_EOL, $dir));
        }
    }
}
