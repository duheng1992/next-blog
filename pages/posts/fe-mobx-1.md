---
title: 开始使用 Mobx 吧！
date: 2022/12/26
description: 小肚教你快速上手 Mobx
tag: web development
author: 小肚肚肚肚肚哦
---

之前一直比较忌讳在前端项目中使用全局状态管理工具，安装包比较大，配置起来比较繁琐，比如 Redux。但是随着项目业务的增多，一些状态很难做到组件间共享，比如登录状态、通知消息等。


## 前端状态管理方案

下面来对比一下 前端项目中全局状态管理的几种方式。

1. localStorage / sessionStorage

2. cookie

3. Context 全局上下文

4. 状态管理工具，比如 Redux、Pinia等


### 1. localStorage

先说第一种，可以存在浏览器本地的一种存储方式。确实项目中经常在用：

```js
export function setLocalStorage(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.log(e.message)
    }
}

export function getLocalStorage(key) {
    const value = window.localStorage.getItem(key);
    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
}
```

- 优势
    1. 能够长期储存数据
    2. 同一个域下共享同一个对象
    3. 不会随 HTTP 请求发送
    4. 页面级别使用
- 缺点
    1. 不同的浏览器窗口下，信息会相互干扰
    2. 在浏览器的隐私模式下不可以读取
    3. 由于服务关闭后信息还能存在在浏览器缓存中，故不适宜存储敏感信息，比如登录信息等
    4. 由于使用了 window 对象，非浏览器环境不可使用
    5. 无法响应式触发所有组件同步更新状态（这也是redux存在的意义）
- 建议
   - 存储常用的下拉菜单选择项、公用列表、枚举等。


### 2. Cookie

- 优势
    1. 可以前后端共享
    2. 同一个域下共享同一个对象
- 缺点
    1. 限制大小4K，只能存一些公共变量，使用场景不适合用于缓存
    2. 存在额外的安全配置成本
    3. 跨域存在问题，需要额外的配置成本
    4. 不够灵活，不能适应越来越多的全局状态的添加

### 3. Context

Context 传递信息是组件级别的，往往包裹在需要共享参数的组件集合的最外层：

```js
const BasicContext = React.createContext({});

<BasicContext.Provider value={{ ...context, ...systemStore }} >
    ...
</BasicContext.Provider>
```

Context 不产生数据来源，往往和缓存一起使用，比如 systemStore 可以是 getLocalStorage 拿到的一堆数据的集合，被他包裹的子元素便都可以共享同一份上下文数据。

- 优势
    1. 使用简单，不需要额外配置
    2. 组件级别使用
- 缺点
    1. 只提供一个上下文环境，必须和其他的状态管理工具一起使用
    2. 受框架限制
    3. context相当于全局变量， 难以追溯数据源
    4. 耦合度高，即不利于组件复用也不利于测试
    5. 没办法反向修改状态值，子组件只能被动读取

### Mobx

使用框架级别的状态管理工具可以用来存储临时的前端层级的公共状态：


- 优势
    1. 便于代码管理
    2. 组件级别使用
    3. 读写方便，没有安全问题
- 缺点
    1. 受框架限制
    2. 需要额外的配置
    3. 业务耦合度高，用户写业务必须照顾到状态的配置
    4. ...

Mobx 是一种相对能够克服配置繁琐问题的工具，这次在项目开发中就引入了 Mobx，使用响应式+函数式模式，并将 Reducer和Action合为一体，使得Mobx相对于 Redux 简单许多。

## Mobx 使用

这里以实现一个运营系统内部当前待审核项目的数量提示为例，讲解 Mobx 在函数式组件中的使用。

- 安装

```js
yarn add mobx mobx-react-lite
```

- 引入：新建 stores.js

```js
import { runInAction } from "mobx"
import { useLocalObservable } from 'mobx-react-lite';

// 自己定义的 API请求，本质是一个 Promise
import { GetAuditingDataCount } from '../../src/apis/usms';

export const Store = () => {

  // 创建观察者
  const storeContext = useLocalObservable(() => ({
    // 状态
    auditCount: {},
    get getAuditCount() { return this.auditCount; },
    // 请求API的action
    reloadAuditCount() {
      GetAuditingDataCount().then(res => {
        runInAction(() => {
          this.auditCount = res?.Data || {}
        })
      })
    },
    // 重置状态
    resetAuditCount() {
      runInAction(() => {
        this.auditCount = {};
      })
    }
  }));

  return { storeContext }
}

```
上面就创建了一个读取当前待审核数量的store。

- 业务中使用：使用 observer 包裹要用到状态的组件，name在这个组件内部就建立了监听

```js
import { observer } from "mobx-react-lite";

function Menu() {
  ...
}

export default observer(Menus)
```

借助 Context 传值给 Menu：

```js
// 引入自定义的 store
import { Store as MobxStore } from '../stores';

const { storeContext } = MobxStore();

// 单独一个文件写入：const BasicContext = React.createContext({});
<BasicContext.Provider value={{ storeContext }} >
    ...
    <Menu />
    ...
</BasicContext.Provider>
```

Menu 组件内部使用：

```js
import BasicContext from '../../BasicContext'

const context = useContext(BasicContext);

const storeContext = context.storeContext || {};
```
如此就拿到了那个 store 的单例，进而在渲染时就可以这样写：

```js
<Menu.SubMenu
    title={
      <span>
        {menu.icon}
        // 这里是重点，可直接获取状态数据 storeContext?.auditCount?.TotalCount
        {menu.auditCount ? <Badge offset={[4, 0]} dot={(storeContext?.auditCount?.TotalCount || 0) > 0}>
          <span>{menu.name}</span>
        </Badge> : <span>{menu.name}</span>}
      </span>
    }
    key={menu.key}
    >
    {genMenus(menu.children)}
</Menu.SubMenu>
```

数据变更：

```js
// 审核接口

AuditAPI(...).then(() => {
    ...
    // 刷新 mobx 状态
    storeContext.reloadAuditCount();
});
```
当审核状态变化时，动态调用API重新设置stores里的值后，所有被 observe 的组件都会自动变化：


![image.png](/images/2022-12-26/2022-12-26-1.png)


## 总结

不是万不得已，尽量不要上全局状态管理工具，使用 Context + sessionStorage 代替即可。在需要实时或触发式更新状态的地方，如果不能上 webSocket，实在要用，就使用配置简单，耦合性低的工具。同时还要照顾到安全性，推荐配置：Context + Mobx.
