# Tp模型关联例子

<!--标题：Tp模型关联例子｜分类：php｜标签：PHP，THINKPHP，模型，关联，多态-->

> tp文档中关于模型关联的文档太不清晰，参数太多，这里记录例子，方便后期查询使用

---

## 远程一对多

```php
<?php
namespace app\common\model;
class AdPage extends Common {

    public function list()
    {
        return $this->hasMany('app\common\model\AdPos','ad_pos_id','id')->alias('list');
    }

    public static function getModules($page_id)
    {
        $ad_pos_ids = PageModules::where('page_id',$page_id)->column('ad_pos_id');
        return AdPos::whereIn('id',$ad_pos_ids);
    }

    public  function modules()
    {
//        参数是:被关联表模型，中间表模型，中间表id，被关联表id，中间表关联字段,被关联表关联字段。
        return $this->hasManyThrough(AdPos::class,PageModules::class,'page_id',
            'id','id','ad_pos_id');
    }
}
```

