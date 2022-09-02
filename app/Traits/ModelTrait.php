<?php

namespace App\Traits;

trait ModelTrait
{
    function addAll($data)
    {
        $instance = new static;
        return $instance->insert($data);
    }

    function batchUpdate(array $update, $whenField = 'id', $whereField = 'id')
    {
        /*
        UPDATE categories 
            SET display_order = CASE id 
                WHEN 1 THEN 3 
                WHEN 2 THEN 4 
                WHEN 3 THEN 5 
            END, 
            title = CASE id 
                WHEN 1 THEN 'New Title 1'
                WHEN 2 THEN 'New Title 2'
                WHEN 3 THEN 'New Title 3'
            END
            WHERE id IN (1,2,3)
        */
        $when = [];
        $ids = [];
        foreach ($update as $sets) {
            #　跳过没有更新主键的数据
            if (!isset($sets[$whenField])) continue;
            $whenValue = $sets[$whenField];

            foreach ($sets as $fieldName => $value) {
                #主键不需要被更新
                if ($fieldName == $whenField) {
                    array_push($ids, $value);
                    continue;
                };

                $when[$fieldName][] = "when '{$whenValue}' then '{$value}'";
            }
        }

        #　没有更新的条件id
        if (!$when) return false;
        $instance = new static;

        $query = $instance->whereIn($whereField, $ids);

        #　组织sql
        foreach ($when as $fieldName => &$item) {
            $item = \DB::raw("case $whenField " . implode(' ', $item) . ' end ');
        }

        return $query->update($when);
    }
}
