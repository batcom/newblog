<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\ModelTrait;
use Staudenmeir\LaravelUpsert\Eloquent\HasUpsertQueries;

/**
 * App\Models\Blog
 *
 * @property int $id
 * @property string $md_content
 * @property string $html_content
 * @property string $tag
 * @property string $path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Blog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Blog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Blog query()
 * @method static \Illuminate\Database\Eloquent\Builder|Blog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Blog whereHtmlContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Blog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Blog whereMdContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Blog wherePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Blog whereTag($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Blog whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Blog extends Model
{
    use ModelTrait, HasUpsertQueries;
    protected $table = 'blog';

    // public $timestamps = false;

    // protected $fillable = ['html_content', 'md_content'];

    protected $dateFormat = 'Y-m-d H:i:s';

    public  function insertMdToDb($mdRecords, $publishModel = 'U')
    {
        // dd($publishModel, $mdRecords);
        if ($publishModel === 'U') {
            $updateField =  ['path', 'md5file', 'md_content', 'html_content', 'tags', 'category', 'title', 'preface'];
            Blog::upsert(
                $mdRecords,
                'path',
                $updateField
            );
            Blog::on('mysql_sugar')->upsert(
                $mdRecords,
                'path',
                $updateField
            );
            Blog::on('mysql_tencent')->upsert(
                $mdRecords,
                'path',
                $updateField
            );
        } else {
            Blog::insertIgnore($mdRecords, 'path');
            Blog::on('mysql_sugar')::insertIgnore($mdRecords, 'path');
            Blog::on('mysql_tencent')::insertIgnore($mdRecords, 'path');
        }
    }
}
