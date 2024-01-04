---
title: 🔥 前端工程化必经的一环 -- 前后端接口规范
date: 2022/3/4
description: 前端 vs 后端
tag: web development
author: 小肚肚肚肚肚哦
---

# 🔥 前端工程化必经的一环 -- 前后端接口规范

前后端分离的项目中，API接口的质量会直接影响前端页面渲染的逻辑。作者经过多年的与后端开发同学、产品的“磨合”中总结了一套相对来说比较完整的，对于前端比较友好的接口规范。其实说是怼后端，但换个角度讲，也是在帮助后端进步嘛！


## 0、设计规范原则

```
1.   前端应只关注渲染逻辑，而不应该关注数据的处理逻辑。接口返回的数据应该是能够直接展示在界面上的。
2.   一个功能应避免多个接口嵌套调用获取数据，后台应该处理好一次性返回。
3.   响应格式应该是JSON，而且应避免多级JSON的出现；
4.   后端如果需要界面实时刷新数据，不应该要求前端定时器轮询，而要提供类似webSocket之类的功能。
```
根据这个原则，后端返回的数据应该是所见即所得的数据，而不应该是一层包一层的复杂的JSON，需要前端额外来处理很复杂的去重，排序、深浅拷贝，变形等处理。前端在渲染每一个div，每一个table的cell时，不用担心数据结构会频繁更改从而导致页面崩溃。

## 1、接口制定的全流程

前端请求一般是`HTTP`协议，这里以HTTP为例。

### HTTP请求的协议类型

应使用下面罗列的HTTP方法（使用的SQL关键字）:

- `GET`（SELECT）：从服务器取出资源，一项或多项。
- `POST`（CREATE）：在服务器新建一个资源。
- `PUT`（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
- `PATCH`（UPDATE）：在服务器更新资源（客户端提供改变的属性），使用比较少
- `DELETE`（DELETE）：从服务器删除资源。

下面是一些例子:

- `GET` /schools：列出所有的学校列表
- `POST` /school：新建一个学校
- `GET` /school/{id}：获取某个指定学校的信息
- `PUT` /school/{id}：更新某个指定学校的信息（提供该学校的全部信息，而不是让前端再通过别的接口获取）
- `PATCH` /school/{id}：更新某个指定学校的信息（提供该学校的部分信息）
- `DELETE` /school/{id}：删除某个学校

### HTTP请求的参数定义

不同`HTTP`方法对应不同的参数传递方式，如下：

> query指路径传参，body指requestBody请求体

- `GET`：path & query
- `POST`：path & body
- `PUT`：path & query & body
- `PATCH`：path & query & body
- `DELETE`：path & query

注意：
```
1. 未出现在上表中的位置不可放置参数，如GET方法不可在body中放置参数。
2. 参数命名均遵循小驼峰命名法。
3. path和query中传递的参数需确保长度可控，超过2000字符（因浏览器而异）的参数可导致请求失败。当请求无法保证参数长度可控，则不能将参数放在path或query中，必须使用支持body参数的HTTP方法，如POST。
4. path和query中传递的参数需是基本类型，亦不可传递序列化之后的JSON对象！不然前端就要try/catch一下来parse了。
5. body中的参数需是合法JSON对象或者formData，即使参数仅包含单字段或单数组，也需包含在对象中，如：
{
  name: string;
}
```


### HTTP响应结果定义

针对不同操作，服务器向用户返回的结果应该符合以下规范。

- `GET` /collections：返回资源对象的列表（数组）
```js
{
    RetCode: 0,
    Message: 'ok',
    Action: 'collections',
    Data: [
        {
            Id: 1,
            name: 'collection1',
            ...
        },
        ...
    ]
}
```
- `GET` /collection/resource：返回单个资源对象
```js
{
    RetCode: 0,
    Message: 'ok',
    Action: 'collectionResource',
    Data: {
        Id: 1,
        name: 'collection1',
        ...
    }
}
```
- `POST` /collection：返回新生成的资源对象
```js
{
    RetCode: 0,
    Message: 'ok',
    Action: 'collection',
    Data: {
        Id: 1,
        name: 'collection1',
        ...
    }
}
```
- `PUT` /collection/resource：返回完整的资源对象， 返回结果同上。
- `PATCH` /collection/resource：返回完整的资源对象，返回结果同上。
- `DELETE` /collection/resource：返回一个空文档
```js
{
    RetCode: 0,
    Message: 'ok',
    Action: 'collectionResource',
    Data: {}
}
```
注意：
```
1. 所有返回数据需是合法JSON，尽量返回object或者array (二进制文件下载除外)。如果数据中包含类型为array的属性，当数据为空时，尽量返回空数组[]，避免返回null。
2. 返回数据避免使用map的<'key', 'value'>形式！如有相关格式的返回数据，请转换为array。
3. 如果没有数据需要返回，或系统报错时，可统一返回固定字段：
{
  RetCode: number; // 后端状态码
  Message: string; // 请求返回消息
  Action: string; // 请求的响应关键字
  Data: Object | Array; // 响应数据
}
4. 返回值中应尽量避免包含无用信息，或者额外的数据结构，仅包含必要数据即可。必要数据指前端需要渲染的数据。
5. 后端异常报错均以'500'状态码的形式返回，也可适当添加额外信息，非特殊情况无需在返回的数据体中返回HTTP code。
```

### URL规范

可参照下面的范例：
`GET [http | https]://host:port/studio/api/组件名/v1/模块名/菜单名/接口名/:param`

注意：
```
1. 不用大写字母，建议用中杠 - 不用下杠 _. 比如邀请码写成invitation-code而不是invitation_code
2. 使用名词表示资源集合，使用复数形式（为确保所有API URIs保持一致），不能使用动词；
3. 每个资源都至少有一个标识它的URI，同时应该遵循一个可预测的层次结构来提高可理解性，从而提高可用性；
4. 宾语必须是名词。网址中不能有动词，只能有名词，API中的名词也应该使用复数，宾语就是API的URL，是HTTP动词作用的对象。它应该是名词，不能是动词
```
正🌰 ：

- `GET` /classes：列出所有班级
- `POST` /classes：新建一个班级
- `GET` /classes/{classId}：获取某个指定班级的信息
- `PUT` /classes/{classId}：更新某个指定班级的信息（一般倾向整体更新）
- `PATCH` /classes/{classId}：更新某个指定班级的信息（一般倾向部分更新）
- `DELETE` /classes/{classId}：删除某个班级
- `GET` /classes/{classId}/teachers：列出某个指定班级的所有老师的信息
- `GET` /classes/{classId}/students：列出某个指定班级的所有学生的信息
- `DELETE` classes/{classId}/teachers/{teacherId}：删除某个指定班级下的指定的老师的信息

反例：
- /getAllclasses
- /createNewclass
- /deleteAllActiveclasses

> **复数还是单数URL问题**： 既然 URL 是名词，那么应该使用复数，还是单数？这没有统一的规定，但是常见的操作是读取一个集合，比如GET /articles（读取所有文章），这里明显应该是复数，而获取单个可以用GET /article/2。 当然，你可以为了统一起见，都使用复数URL，比如GET /articles/2。

多级URL的处理：当查询资源信息较多时，往往会有多级参数出现在URL中，此处要分三种情况讨论：

1. 查询信息指代当层唯一id，将查询信息放在path中，构建唯一的查询路径，如：
`> GET /authors/12/categories/2`

2. 查询信息属于对当层信息的状态过滤，将查询信息放在query中，如：
`> GET /articles?published=true`

3. 查询信息既包含当层id，也包含过滤信息，分别将id和过滤信息放在path和query中，如：
`> GET /authors/12/categories/2?published=true`


### HTTP状态码约束

客户端的每一次请求，服务器都必须给出回应。回应包括 HTTP 状态码和数据两部分。HTTP 状态码就是一个三位数，分成五个类别。

```
- 1xx：相关信息
- 2xx：操作成功
- 3xx：重定向
- 4xx：客户端错误
- 5xx：服务器错误
```
状态码规范见[W3C关于HTTP状态码定义](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)

### 分页与搜索接口约束

分页接口广泛出现在数据量较大场景下的表格型交互。即使是渲染简单的列表元素，超过500项有可能导致前端卡顿，超过5000项以上（不同浏览器、电脑配置会影响这个数字）有可能导致前端崩溃。凡无法保证能限制接口返回数量在一个较小数量级（100以下）的接口都需要考虑支持后端分页；如果返回结果数量是不受控制的（如包含用户生成数据），则`必须支持`后端分页。
<br />

这里给出请求范例：

GET 接口

`?page={page}&size={size}`

POST 接口

```js
// 格式1
{
    page: number;
    size: number;
    total: number; // 数据总量
}

// 格式2
{
    Limit: number;
    Offset: number
    Total: number; // 数据总量
}

// 其中page为当前请求页，为从0开始的正整数；
// size为当前页大小，常用的值有10、20等，理论上需支持任意正整数。特殊的，若为-1，可以约定为查询全部
// Limit同size
// Offset为相对偏移量，为从0开始的正整数
```


需要注意的是，如果交互中出现过滤、排序功能，则相关功能必要时都需要后端支持。如果参数能保证不超过一定长度，则参数放在query里也是可以接受的。数组型参数可以以相关字段用逗号连接的形式传递，如：

```js
?status=RUNNING,COMPLETE,ERROR
```
> 特殊类型处理
> 1. 关于Boolean类型，JSON数据传输中使用true/false字段进行传递。
> 2. 关于日期类型，JSON数据传输中一律使用长整形时间戳（Unix time）进行传递，具体日期显示格式由前端处理。



## 2、注意事项

任何形式的接口变更都会对前端产生影响，比如字段名称的修改，字段的增减，字段类型的修改，请求参数类型的变动等。原则上当接口对接完成后不应有任何形式的修改，如果一定要变更接口，需及时通知相应前端开发人员并重新对接。

表示同一含义的字段在同一套功能接口集合（增删改查）中应尽量保证相同。在接口设计中，对同一实体进行操作的接口应尽量保证在参数和返回值中，该实体的数据结构保持一致，尽量避免前端做数据对象转换的动作。


## 参考

[阮一峰 RESTful API 设计指南](https://www.ruanyifeng.com/blog/2014/05/restful_api.html)

[Representational state transfer](https://en.wikipedia.org/wiki/Representational_state_transfer)

[Hypertext Transfer Protocol](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods)

```
灵感来源 - Transwarp通用技术组前端团队jira文档 - 前后端接口规范
```