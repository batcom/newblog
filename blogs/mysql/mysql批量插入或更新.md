# MySql批量插入或更新

<!--标题：MySql批量插入或更新｜分类：mysql｜标签：php,msyql -->

> 　前些天研究博客发布的代码的时候遇到批量问题，深入写下去后发现是批量插入或更新的问题。简单来说，就是有一批数据需要入库，如果根据某个字段，数据库里面已经存在的话，就判断数据库里面的数据和更新的数据是否相同，如果不同就更新；如果数据库里面不存在就直接插入。本来如果不是批量，一般处理就是先查询数据库是否存在，不存在就插入，存在就根据数据库查出来的数据对比，不相同就更新。但是，一旦批量的话，原理肯定不变，该为用`whereIn`查询即可。但是总感觉比较麻烦，需要先查询然后再对比，两次数据库操作，那有没有更简单的方法呢？经过一翻研究还真找到了，也说明了这的确是一个很典型和普遍的问题。

---

## 问题描述

上面前言里已经解释的差不多了，后来研究发现，原来这个问题有个专门的代号叫**UpSert**，从名字上面就可以看出来，就是又要批量更新，又要批量插入。更简单的描述是**实现批量插入，存在就更新，不存在就插入**。既然说是存在就，那就代表肯定有一个对比的字段，所以，有一列一定是**主键**或者**Unique**约束的，这个要先明白。没有唯一约束的，遇到这种情况先要建立唯一约束。下面借助实例，更加清晰的来解释和实战演练。

### 数据表结构

```mysql
create table testUpSert( 
id int(10) unsigned NOT NULL AUTO_INCREMENT,  
name varchar(50),
certno char(18),
age int,
PRIMARY KEY (`id`),
UNIQUE KEY (`certno`)
); 
```

上面表中`id`和`certno`(身份证)都具有唯一约束。现在先来插入一些数据:

```mysql
insert into testUpSert(id,name,age,certno)values(1,'a',11,'150302200201018898');
insert into testUpSert(id,name,age,certno)values(2,'b',12,'150302200201017211'); 
insert into testUpSert(id,name,age,certno)values(3,'c',13,'150302200201019137'); 
```

现在数据是这个样子:

![](https://gitee.com/batcom/static/raw/master/images/20200828211914.png)

好，接下来呢，我们有下组数据要插入更新，各位看管一看就明白本篇说的是什么问题了。

```mysql
insert into testUpSert(id,name,age,certno)values(1,'a',11,'150302200201018898');
insert into testUpSert(id,name,age,certno)values(2,'bb',12,'150302200201017211'); 
insert into testUpSert(id,name,age,certno)values(4,'d',13,'150302200201014432'); 
```

现在有上面的数据需要入库，即身份证尾号898的用户a记录不变(即数据相同的什么都不做),身份证号为211的用户修改名字b为bb(已存在数据不同的更新数据),新增用户d，身份证号为432(不存在的直接插入)。

肯定上面的语句因为唯一约束的原因会执行失败。无法达到我们想要的结果:4条记录,a,bb,c,d;这就是问题，下面介绍解决方案。

## 解决方案(**MySql**为例)

### 逻辑代码控制实现

最先想到的肯定就是通过程序实现了，但是会比较麻烦。思路就是，先将要插入的数据的唯一字段合并起来，然后去数据库里面用In查询一遍，然后根据结果集比对，比对也是很麻烦，首先是存在不存在，然后是存在的判断内容，就这样，最后组装两组数据，更新的和插入的，分别执行`Sql`语句。这里还有一个问题就是，如果批量过多的时候，查询语句会很长。而且逻辑复杂，也需要操作三次数据库。但这也算一种常见的解决方案了。我就不上代码了。

### Replace Into Table (...) Values ()

这种方法直接暴力而且简单，直接删除后替换，免除了判断，而且一条`Sql`语句解决问题，我开始也以为这种方案是最优的，但这种方案有一个问题，就是如果这个`Unique`键有其它关联外键或者引用，这样直接删除将会丢失引用关系.但无疑很多时候这是非常优秀且简单的解决方案。我们直接上`Sql`语句

```mysql
replace into testUpSert(id,name,age,certno)values(1,'a',11,'150302200201018898'),(2,'bb',12,'150302200201017211'),(4,'d',13,'150302200201014432'); 
```

![](https://gitee.com/batcom/static/raw/master/images/20200828225507.png)

我们看到一条`Sql`语句解决了我们的问题，并且没有报错。

### Insert Ignore Table (...) Values()

```mysql
insert ignore testUpSert(id,name,age,certno)values(1,'a',11,'150302200201018898'),(2,'bb',12,'150302200201017211'),(4,'d',13,'150302200201014432'); 
```

之所以介绍这条语句呢，是因为这条语句虽然不能直接达到效果，但和上面的Replace Into也是经常一起出现和讨论的。虽然不能达到效果，但是却能保证正常执行，即已经存在的就忽略，不存在的新增，省去了需要先查询在判断的问题。所以，用这条语句分步也可以很简单达到效果，即先执行这条语句，然后只需要update存在的就可以了，这样逻辑也会简单很多。

![](https://gitee.com/batcom/static/raw/master/images/20200828230253.png)

我们看到即便是上次4条内容已经存在的情况下，执行`insert ignore`依然没有报错，所以，这也是很有用的，在避免重复插入又需要批量新增的场景下使用

### Update Table Set Column = Case When .... Then ... Else ... End

这种方案实际利用的是将`Sql`作为一门语言来处理这个问题，着实有写蹩脚。但也可以解决问题，只是如果批量数据太多会造成`Sql`语句逻辑和长度都很复杂，所以，如果遇到上面几种情况都不适合处理的情况下，可以不妨试试这种方案。

```mysql
UPDATE `testUpSert` SET `name` = (
    CASE `certno` WHEN '150302200201018898' THEN 'a'  
    WHEN '150302200201017211' THEN 'b'  
    WHEN '150302200201014432' THEN 'd'  
    END)
WHERE `id` in(1, 2, 3);
```

![](/home/coolnet/php/blog/blogs/images/mysql/20200828231524.png)

我们看到这样也能够执行不出错，所以，只需要用语言先找出需要Update的数据，然后组装这样的语句，接着将剩下的直接Insert即可，这种方案和`Inser Ignore`方案恰好想法。一种是先插入，然后更新；一种是先更新然后插入。

### Insert Into Table (...) Values()　... ON DUPLICATE KEY UPDATE

**最后这种方案是目前个人觉得最好的方案了**。开始以为这种方案并不能批量更新。后来实验发现是可以的。给个大概的语句样子吧

```mysql
INSERT INTO `testUpSert` (id,name,age,certno) VALUES (1,'a',11,'150302200201018898'),(2,'bb',12,'150302200201017211'),(4,'d',13,'150302200201014432') ON DUPLICATE KEY UPDATE name=VALUES(name); 
```

![](/home/coolnet/php/blog/blogs/images/mysql/20200828232843.png)

我们看到这种方案也是一条`Sql`解决了我们上面的问题，并且没有`Replace Into`方案的副作用。当然如果你用的项目恰好是`Laravel`的话，那么恭喜你，还有`银弹`，经过我花时间的搜索居然找到了这个库 [upsert](https://github.com/staudenmeir/laravel-upsert),你可以使用这个库去操作不但本文介绍的**mysql**，还有`pg`,`sqlite`,`mssql`等，我看了下源代码也是写的相当的优雅，所以，可以放心使用。至于其它的框架的话，可以模拟这个库写出响应的代码来。不同的数据库**UpSert**语句还是不一样的。

## 各方案优缺点对比

上面介绍各个方案的时候已经详细叙述了，这里就不啰嗦了，相信各位看官如果仔细看到这里，应该都是很清楚明白的了。各种方案的场景和优劣。

## 结语

通过研究`MySql`批量插入和更新，其实还有很多我们不知道的`Sql`语句要去学习，这次最终找到了 [upsert](https://github.com/staudenmeir/laravel-upsert)，这个库还是很令人高兴的，使用方法也很简单，读读`Readme`就清楚明白了。这里就不介绍如何使用了。

