# ThinkPHP验证类实现类似Laravel中required_相关方法

<!--标题：ThinkPHP验证类实现类似Laravel中required_相关方法｜分类：php｜标签：PHP，THINKPHP，Laravel-->

> 今天在使用`tp5.0`的时候发现没有laravel里面的sometimes,required_with... 等相关方法，在做验证的时候这几个方法又非常容易用到，所以用在`tp`下实现了下，记录实现过程

---

## 继承Validate

因为`tp`没有`laravel`里面关于`Rule`的抽象层，所以，先通过简单的继承来完成这些公共方法的实现

```php
<?php

namespace app\admin\validate;

use think\Validate;

class BaseValidator extends Validate
{
    function sometimes($value, $rule, $data, $field)
    {
        // $rules = [
        //     'mobile' => 'require|mobile',
        // ];
        // $message = [
        //     'mobile.require' => '手机号码不得为空!',
        //     'mobile.mobile' => '手机号码格式错误!',
        // ];
        // if (false === $this->message($message)->check($data, $rules)) {
        //     return $this->getError();
        // } else {
        //     return true;
        // }
        // trace($field);
        // trace($rule);
        if (isset($data[$field])) {
            return $this->check($value, $rule);
        }
        return true;
    }

    // 字段存在，其它指定任一字段就不能存在 conflict:conflict_field1,conflict_field2
    function conflict($value, $rule, $data, $field)
    {
        if (is_string($rule))
            $rule = explode(',', $rule);
        if (array_intersect($rule, array_keys($data))) return false;
        return true;
    }

    //如果 anotherfield 字段等于任一 value，验证的字段必须出现且不为空 。 r_if:anotherfield,value1,value2
    function r_if($value, $rule, $data, $field)
    {
        if (is_string($rule))
            $rule = explode(',', $rule);
        $another_field = array_shift($rule);
        if (in_array($data[$another_field], $rule)) {
            if (isset($data[$field]) && !empty($value)) return true;
        }
        return false;
    }


    // 只有在其他任一指定字段出现时，验证的字段才必须出现且不为空。//同Laravel:required_with,因tp框架的坑，不能用require关键字，改为r代替
    function r_with($value, $rule, $data, $field)
    {
        // var_dump($value, $rule, $data, $field);
        // die;
        if (is_string($rule))
            $rule = explode(',', $rule);
        $appear_number = 0;
        foreach ($rule as $r) {
            if (isset($data[$r])) $appear_number++;
        }
        if ($appear_number > 0) {
            if (isset($data[$field]) && !empty($value)) return true;
        }
        return false;
    }

    // 只有在其他指定字段全部出现时，验证的字段才必须出现且不为空。同required_with_all
    function r_with_all($value, $rule, $data, $field)
    {
        // var_dump($value, $rule, $data, $field);
        // die;
        if (is_string($rule))
            $rule = explode(',', $rule);
        $appear_number = 0;
        foreach ($rule as $r) {
            if (isset($data[$r])) $appear_number++;
        }
        // var_dump($appear_number);
        if ($appear_number === count($rule)) { //全部出现
            if (isset($data[$field]) && !empty($value)) return true;
        }
        return false;
    }


    // 只在其他指定任一字段不出现时，验证的字段才必须出现且不为空。同required_without
    function r_without($value, $rule, $data, $field)
    {
        // var_dump($value, $rule, $data, $field);
        // die;
        if (is_string($rule))
            $rule = explode(',', $rule);
        $appear_number = 0;
        foreach ($rule as $r) {
            if (!isset($data[$r])) $appear_number++;
        }
        if ($appear_number > 0 && isset($data[$field]) && !empty($value)) return true;
        return false;
    }

    // 全部不出现，验证字段才必须出现且不为空 同required_without_all
    function r_without_all($value, $rule, $data, $field)
    {
        // var_dump($value, $rule, $data, $field);
        // die;
        if (is_string($rule))
            $rule = explode(',', $rule);
        $appear_number = 0;
        foreach ($rule as $r) {
            if (!isset($data[$r])) $appear_number++;
        }
        // var_dump($appear_number);
        if ($appear_number === count($rule)) {
            if (isset($data[$field]) && !empty($value)) return true;
        }
        return false;
    }
}
```



## 解释上面实现的难点和过程

上诉实现的时候，感觉用`array_intersect`交集或者循环判断是否设置值，然后返回逻辑值得思路的时候会觉得非常绕，总觉得`r_without_all`,`r_without`他们之间逻辑上是相同的，越想会越晕，后来想到通过记录出现的次数`$appear_number`即可非常方便的根据字面意思来进行最后的逻辑判断，这个是重点。

然后里面有一个坑就是，这几个方法名不能用以require开头命名，因为`tp`把这个方法名硬编码在代码里面的，所以，用`r`暂时替代，以后再实现其它方法时也要注意，具体源码在

`think\Validate`类中，第`406`行，`checkItem`方法中，具体文件行数可能跟版本有差异，只需查找关键字`strpos($info, 'require')`即可快速定位。附上`checkItem`代码片段

```php
 /**
     * 验证单个字段规则
     * @access protected
     * @param string    $field  字段名
     * @param mixed     $value  字段值
     * @param mixed     $rules  验证规则
     * @param array     $data  数据
     * @param string    $title  字段描述
     * @param array     $msg  提示信息
     * @return mixed
     */
    protected function checkItem($field, $value, $rules, $data, $title = '', $msg = [])
    {
        // 支持多规则验证 require|in:a,b,c|... 或者 ['require','in'=>'a,b,c',...]
        if (is_string($rules)) {
            $rules = explode('|', $rules);
        }
        $i = 0;
        foreach ($rules as $key => $rule) {
            if ($rule instanceof \Closure) {
                $result = call_user_func_array($rule, [$value, $data]);
                $info   = is_numeric($key) ? '' : $key;
            } else {
                // 判断验证类型
                list($type, $rule, $info) = $this->getValidateType($key, $rule);

                // 如果不是require 有数据才会行验证
                if (0 === strpos($info, 'require') || (!is_null($value) && '' !== $value)) {
                    // 验证类型
                    $callback = isset(self::$type[$type]) ? self::$type[$type] : [$this, $type];
                    // 验证数据
                    $result = call_user_func_array($callback, [$value, $rule, $data, $field, $title]);
                } else {
                    $result = true;
                }
            }

            if (false === $result) {
                // 验证失败 返回错误信息
                if (isset($msg[$i])) {
                    $message = $msg[$i];
                    if (is_string($message) && strpos($message, '{%') === 0) {
                        $message = Lang::get(substr($message, 2, -1));
                    }
                } else {
                    $message = $this->getRuleMsg($field, $title, $info, $rule);
                }
                return $message;
            } elseif (true !== $result) {
                // 返回自定义错误信息
                if (is_string($result) && false !== strpos($result, ':')) {
                    $result = str_replace([':attribute', ':rule'], [$title, (string) $rule], $result);
                }
                return $result;
            }
            $i++;
        }
        return $result;
    }

```

