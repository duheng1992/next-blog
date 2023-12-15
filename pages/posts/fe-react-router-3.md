---
title: React Router v6 官方文档翻译 （三） ---- 主要概念
date: 2022/6/7
description: react router 官网解读
tag: React router
author: 小肚肚肚肚肚哦
---

# 主要概念

> 原文路径：https://reactrouter.com/docs/en/v6/getting-started/concepts

你可能会好奇，React Router是怎么运行起来的，他又是怎么辅助构建App的？换句话说，路由router到底是什么？<br>

如果你曾经想过上述问题，或者你想要更深入的了解路由机制，那么本篇文章可以帮助到你。本文包含React Router所有核心概念的详细解释。<br>

同时也请不要因为这篇文章而钻牛角尖，React Router的基本使用还是很简单的，业务使用的话，也不需要挖掘这么深入。<br>

React Router可不仅仅是一个url的映射函数，他是一套关于构建完整的用户界面的URL映射机制，所以会有更多的概念和规范。我们将会在以下三点来讨论：

1. 订阅和使用 [history stack](https://reactrouter.com/docs/en/v6/getting-started/concepts#history-stack)

2. 在路由中映射[URL](https://reactrouter.com/docs/en/v6/getting-started/concepts#url)

3. 通过映射来渲染层级嵌套UI


### 定义 

首先先抛出一些定义。不同于前后端框架的设计思路，有时候React Router中的一个词，在不同的上下文语义中会有不同的意思。下面列举一些常用的词汇，在之后也会详细的描述：

- **URL** - 很多人认为URL和route可互换，然而React Router中却不是这样。
- **Location** - 是React Router独有的，基于window.location的一个对象，表示当前用户所在地。他通常用来表示URL，但是会附带额外的路由信息。
- **Location State** - 一个未被编码的URL路由位置状态。类似于路由hash或者路由parmas，不同的是state是存储在浏览器缓存中。
- **History Stack** - 当用户使用路由跳转时，浏览器维护一个路由栈，对于栈中的每一个路由进行追溯。如果你长按浏览器中的向后按钮，你会看到浏览器的路由跳转历史。
- **Client Side Routing (CSR)** - 扁平化HTML文档跳转时，浏览器会自动维护一个history stack，用户侧的路由可以让开发者在不访问后端服务的前提下操作路由堆栈。
- **History** React Router内置对象，用户可以用它获取路由订阅信息，同时也提供了一些API来然用户操作history stack。
- **History Action** - history stack的操作，有Pop、Push和Replace。可使用Push来新添加一个路由入口，使用Replace也可以达到类似的效果，只是会在堆栈中替换掉当前的路由，使用Pop来获取上一个历史路由，用以浏览器返回。
- **Segment** - 介于'/'之间的URL片段。比如，’/users/123‘就有两个片段。
- **Path Pattern** - 带参URL。比如动态片段'/users/:userId'和星号片段'/docs/\*'。是一种React Router路由的匹配模式。
- **Dynamic Segment** - 动态片段，见上边描述。'users/:userId'可以精确匹配'users/123'.
- **URL Params** - 动态路由片段解析出来的路由参数。
- **Router** - 有状态路由组件。层级嵌套使用。
- **Route Config** - 路由树。通过匹配机制来构建路由分支。
- **Route** - 路由元素的基础组件。有path和element两个参数。path是匹配模式，当path匹配成功后，element中的元素才会被渲染。
- **Nested Routes** - 嵌套路由。路由可以有自己的孩子，每一个路由都定义了URL片段，单个URL可以同时匹配路由树中的多个路由。这使得可以使用outlet、相对路由等来布局嵌套dom结构。
- **Relative links** - 相对路由。不使用'/'开头的路由。他会继承父级路由作为前缀来进行匹配。这使得深层次的URL渲染变得容易，因为你不用再考虑如何获得完整的上下文路由了。
- **Match** - 当路由与URL匹配时用于保存信息的对象。比如，匹配的URL参数和路径名。
- **Matches** - 匹配当前位置的路由数组。用于嵌套路由中。
- **Parent Route** - 父路由。
- **Outlet** - 父路由中匹配子路由的渲染插槽。
- **Index Route** - outlet中默认渲染的组件。
- **Layout Route** - 没有path的父路由。用于把子路由分组到一个布局单元中。

### History和Location

在使用React Router之前，需要先订阅浏览器路由堆栈的变更。浏览器会独立维护该堆栈的变化，所以浏览器自带的前进和后退才能够使用。传统web开发中，用户每点击前进或后退、每发起一个路由跳转都会向后端发起请求。举个例子，我们有如下的操作流程：

1.  点击链接跳转到 `/dashboard`
2.  点击链接跳转到 `/accounts`
3.  点击链接跳转到 `/customers/123`
4.  点击后退按钮
5.  点击链接跳转到 `/dashboard`

那么路由堆栈将会有如下的变化：
1. \[**`/dashboard`**\]
2.  \[`/dashboard`,  **`/accounts`**\]
3.  \[`/dashboard`, `/accounts`,  **`/customers/123`**\]
4.  \[`/dashboard`,  **`/accounts`**, `/customers/123`\]
5.  \[`/dashboard`, `/accounts`,  **`/dashboard`**\]

> 译者注解，这里第四到第五步，/customers/123被替换掉了，类似于操作了replace，可能是浏览器判断第4步是back操作回来的，第五步中强制使用了replace。

#### History Object

在用户端路由使用的过程中，开发者可以通过代码显式的操作浏览器路由。比如说，可以如下写：

```js
<a
  href="/contact"
  onClick={(event) => {
    // stop the browser from changing the URL and requesting the new document
    event.preventDefault();
    // push an entry into the browser history stack and change the URL
    window.history.pushState({}, undefined, "/contact");
  }}
/>
```
上述代码改变了URL，但是并没有对UI进行任何的修改。我们也可以通过代码来改变路由状态，从而影响UI的变化。但问题是，浏览器没有提供非常好的监听URL变化的方法。

我们可以换种监听方式：


```js
window.addEventListener("popstate", () => {
  // URL changed!
});
```

上述方法看起来不错，但是他只在用户点击后退或者前进时生效。在程序调用`window.history.pushState`或`window.history.replaceState`时却没有任何监听事件可以使用。

在React Router中，history可以帮助你实现监听。他提供对push、pop、replace事件的监听：

```js
let history = createBrowserHistory();
history.listen(({ location, action }) => {
  // this is called whenever new locations come in
  // the action is POP, PUSH, or REPLACE
});
```
App不需要再额外创建他们自己的history对象，通过简单的监听函数，可以完成正确的重新渲染。

#### Location

浏览器的window自带有location对象，他提供URL的相关信息：

```js
window.location.pathname; // /getting-started/concepts/
window.location.hash; // #location
window.location.reload(); // force a refresh w/ the server
```

在React Router中的使用类似，但是会更简单，其结构如下：


```js
{
  pathname: "/bbq/pig-pickins",
  search: "?campaign=instagram",
  hash: "#menu",
  state: null,
  key: "aefz24ie"
}
```
前三个参数`{ pathname, search, hash }`类似于window.location，后两个参数是React Router独有的。

##### Location Pathname

Location Pathname是URL的一部分，比如对于URL：`https://example.com/teams/hotspurs`, 他的pathname就是`/teams/hotspurs`。这部分才是用于路由匹配的。

##### Location Search

URL有很多不同的使用选项：

- location search
- search params
- URL search params
- query string

在React Router中，我们便可以使用location search，它是一种序列化的`URLSearchParams`，所以有时候也可以叫他`URL search params`：

```js
// given a location like this:
let location = {
  pathname: "/bbq/pig-pickins",
  search: "?campaign=instagram&popular=true",
  hash: "",
  state: null,
  key: "aefz24ie",
};

// we can turn the location.search into URLSearchParams
let params = new URLSearchParams(location.search);
params.get("campaign"); // "instagram"
params.get("popular"); // "true"
params.toString(); // "campaign=instagram&popular=true",
```
解析前的序列化字符串叫`search`，精准解析后便是`search params`了。译者认为这里描述的意思就是说可以将URL字符串翻译为一个结构化的参数对象。当不需要考虑精确度时，这两个概念是可以互换的。

##### Location Hash

URL中的哈希（锚点）表示当前页面滚动的位置。在window.history.pushState被引入之前，web开发者只能通过改变URL锚点来控制浏览器路由的变化，这也是在不访问后端服务的前提下改变路由的唯一方式。现在我们仍然可以这样使用他。

##### Location State

你可能会好奇H5的API`window.history.pushState()`为什么会叫做push state，我们刚刚改变了URL，理论上不是应该叫做`history.push`更贴切？哈，我们也不是浏览器标准的制定者，这些问题我们暂且不考虑，就这个API本身而言，确实是一个不错的浏览器新特性。（作者随性翻译，大意基本是这样）。

浏览器提供的这个state，可以让我们轻松地传递路由状态。当我们点击浏览器后退按钮时，通过`pushState`便可以引起`history.state`的变化：

> 译者提醒：这种状态在刷新浏览器后会丢失，需要慎用

```js
window.history.pushState("look ma!", undefined, "/contact");
window.history.state; // "look ma!"
// user clicks back
window.history.state; // undefined
// user clicks forward
window.history.state; // "look ma!"
```

React Router利用了浏览器自带的功能，对其进行了一些抽象封装，并将值显示在location中，而不是history里。

你可以试着使用location.state，比如`location.hash`或者`location.search`，而不是直接将路由参数放在URL里，这样你的URL会比较整洁，传递会相对安全。

一组比较好的使用案例：

- 告诉下个页面你跳转自哪里，以此来动态布局UI。用的最多的例子是用户点击一个item，然后打开一个弹窗显示详细记录的使用场景。如果你想直接显示到URL的话，（译者认为是详情页面可以弹窗显示又可以页面显示的意思），那么就可以自定义布局组件来显示。
- 传递页面记录信息的一部分给要跳转的页面，那么下个页面会直接将这一部分渲染出来，进而可以借助已有信息渲染剩余部分。

代码实现上，可以使用`<Link>`或者`navigate`来实现改变state：

```jsx
<Link to="/pins/123" state={{ fromDashboard: true }} />;

let navigate = useNavigate();
navigate("/users/123", { state: partialUser });
```

在跳转后的页面中使用`useLocation`获取路由信息：

```js
let location = useLocation();
location.state;
```

> location.state是一个序列化的值，使用new Date()传递时间时，会被转化为字符串

##### Location Key

每一个location又有自己唯一的key。这对于锚点滚动式路由跳转、客户端数据缓存等是很有帮助的。每一个location获取唯一key后，你都可以使用扁平化数组、new Map()，甚至是locationStorage来将对应信息抽象出来。

举个🌰，在一个单一的客户端，不请求后端数据，在用户点击后退按钮时，可以通过如下设置来存储路由缓存：

```js
let cache = new Map();

function useFakeFetch(URL) {
  let location = useLocation();
  let cacheKey = location.key + URL;
  let cached = cache.get(cacheKey);

  let [data, setData] = useState(() => {
    // initialize from the cache
    return cached || null;
  });

  let [state, setState] = useState(() => {
    // avoid the fetch if cached
    return cached ? "done" : "loading";
  });

  useEffect(() => {
    if (state === "loading") {
      let controller = new AbortController();
      fetch(URL, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (controller.signal.aborted) return;
          // set the cache
          cache.set(cacheKey, data);
          setData(data);
        });
      return () => controller.abort();
    }
  }, [state, cacheKey]);

  useEffect(() => {
    setState("loading");
  }, [URL]);

  return data;
}
```

### Matching

在页面初始化渲染和history stack变化时，React Router会针对路由配置项来匹配出一套渲染结构。

#### Defining Routes

路由配置类似一个层级树，就像下面的例子：


```jsx
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="teams" element={<Teams />}>
      <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
  <Route element={<PageLayout />}>
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/tos" element={<Tos />} />
  </Route>
  <Route path="contact-us" element={<Contact />} />
</Routes>
```

`<Routes>`递归地渲染匹配到的`props.children`，提取他们的props并生成如下的结构：


```jsx
let routes = [
  {
    element: <App />,
    path: "/",
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "teams",
        element: <Teams />,
        children: [
          {
            index: true,
            element: <LeagueStandings />,
          },
          {
            path: ":teamId",
            element: <Team />,
          },
          {
            path: ":teamId/edit",
            element: <EditTeam />,
          },
          {
            path: "new",
            element: <NewTeamForm />,
          },
        ],
      },
    ],
  },
  {
    element: <PageLayout />,
    children: [
      {
        element: <Privacy />,
        path: "/privacy",
      },
      {
        element: <Tos />,
        path: "/tos",
      },
    ],
  },
  {
    element: <Contact />,
    path: "/contact-us",
  },
];
```

事实上，你可以不使用`<Routes>`，使用hook `useRoutes(routesGoHere)`依然可以完成上述任务。如你所见，路由定义中，可以声明多重路由片段，比如`:itemId/edit`，也可以声明单个片段，比如`:itemId`。所有的片段会被组合在一个来构建最后的路径模式（路由树）。

#### Match Params

以`/items/:itemId`这种动态路由片段为例，他可不是静态匹配URL的，任何的值似乎都可以当做`:itemId`来使用，比如`/items/123`和`/items/小肚肚肚肚肚哦`。解析出来的值就是`URL params`。在渲染一节（Rendering）会讲述怎么用这个参数。

#### Ranking Routes

当我们设置完路由配置后，我们最终会得到诸如如下的匹配模式：


```js
[
  "/",
  "/teams",
  "/teams/:teamId",
  "/teams/:teamId/edit",
  "/teams/new",
  "/privacy",
  "/tos",
  "/contact-us",
];
```

事情变得突然范特西起来，以请求path `"/teams/new"`为例，上述列表中哪一个匹配模式能够被翻牌子？我猜有两个：


```
/teams/new
/teams/:teamId
```

此时，React Router就需要做出最终决定，到底翻哪一个的牌子，大多数路由都会按照他们定义的先后顺序进行匹配，先到先得。但是使用这种算法，我们连`/`都能匹配到了。所以，我们应该更加完美的排序这些匹配模式，进而达到我们想要的匹配结果。这也是v6比较智能的一个体现。

这个例子中，我们直观的感觉`/teams/new`应该是最终的结果。我们所做的就是教会了React Router去完成这个任务。在匹配的过程中，React Router会按照片段序号进行排序（包括静态的、动态的和星号片段等），挑选最适合的匹配模式，而对于开发者，再也不用考虑路由配置的先后放置顺序了。

#### Pathless Routes

还有一些不带path的路由：

```html
<Route index element={<Home />} />
<Route index element={<LeagueStandings />} />
<Route element={<PageLayout />} />
```

对于这种我们怎么匹配呢？React Router的匹配时相当宽松的，`<LeagueStandings />`和`<Home />`组件是index路由，`<PageLayout />`是布局路由，我们在渲染（Rendering）这一节来讨论他是怎么工作的，这两者都与匹配本身没有多大关系。


#### Route Matches

当路由去匹配URL时，内部都会转化一个匹配对象，以`<Route path=":teamId" element={<Team/>}/>`为例：
 
```jsx
{
  pathname: "/teams/firebirds",
  params: {
    teamId: "firebirds"
  },
  route: {
    element: <Team />,
    path: ":teamId"
  }
}
```

pathname是URL部分，代表的是全量路径；params是通过URL解析来的暂态路由参数，`:teamId`即为`params.teamId`。

因为路由表是一棵树，单个URL可能会匹配书上的多个分支，以`/teams/firebirds`为例：


```diff 
<Routes>
+   <Route path="/" element={<App />}>
    <Route index element={<Home />} />
+   <Route path="teams" element={<Teams />}>
+     <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
  <Route element={<PageLayout />}>
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/tos" element={<Tos />} />
  </Route>
  <Route path="contact-us" element={<Contact />} />
</Routes>
```
高亮部分是他的匹配路径。React Router会创建一个匹配数组来存放嵌套的匹配路由，所以会生成一个嵌套的UI结构：

```jsx
[
  {
    pathname: "/",
    params: null,
    route: {
      element: <App />,
      path: "/",
    },
  },
  {
    pathname: "/teams",
    params: null,
    route: {
      element: <Teams />,
      path: "teams",
    },
  },
  {
    pathname: "/teams/firebirds",
    params: {
      teamId: "firebirds",
    },
    route: {
      element: <Team />,
      path: ":teamId",
    },
  },
];
```

### Rendering

最后的重头戏，在拿到匹配数后，要如何进行渲染呢？考虑如下的结构：


```jsx
// react 18+
const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path=":teamId/edit" element={<EditTeam />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route>
      </Route>
      <Route element={<PageLayout />}>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tos" element={<Tos />} />
      </Route>
      <Route path="contact-us" element={<Contact />} />
    </Routes>
  </BrowserRouter>
);
```

我们使用访问路径`/teams/firebirds`作为例子来解释如何渲染路由。`<Routes>`会识别配置项，通过精准匹配后在页面上构建如下结构：

```jsx
<App>
  <Teams>
    <Team />
  </Teams>
</App>
```

每一级匹配项都放置在其父路由元素中，最终渲染的结构与路由配置文件完全一样。大多数的网站和app都有这样的特性：套娃式放置元素，每一级元素都会有自己的导航来更改自己的子页面内容。

#### Outlets

嵌套元素树不会自动渲染，需要用outlet来告诉父元素渲染子元素的地方。`<Routes>`会首先渲染元素树的顶层元素（比如`<App />`），接下来匹配元素`<Teams>`：

```jsx
function App() {
  return (
    <div>
      <GlobalNav />
      <Outlet />
      <GlobalFooter />
    </div>
  );
}
```

Outlet组件会渲染下一个match的元素。同理，`<Teams>`中也需要一个outlet来渲染`<Team />`。

如果URL是`/contact-us`，那么元素树就会是如下结构：
```
<Contact />
```
他没有在App组件之下，所以会单独按照路由层级结构渲染。

如果URL是`/teams/firebirds/edit`，元素树会变成：

```jsx
<App>
  <Teams>
    <EditTeam />
  </Teams>
</App>
```

Outlet是一个占位符，被匹配到后会替换为匹配的子元素，而父级元素不会变化。


#### Index Routes

对于如下的路由配置：

```jsx
<Route path="teams" element={<Teams />}>
  <Route path=":teamId" element={<Team />} />
  <Route path="new" element={<NewTeamForm />} />
  <Route index element={<LeagueStandings />} />
</Route>
```
如果访问路径`/teams/firebirds`，那么元素树就会是如下结构：

```jsx
<App>
  <Teams>
    <Team />
  </Teams>
</App>
```
但是，如果访问路径是`/teams`，那么元素树就会是：
```jsx
<App>
  <Teams>
    <LeagueStandings />
  </Teams>
</App>
```
这里的优先级是怎么处理的？为什么声明了index就能够优先被pop出来？他甚至都没有path！很显然，不是通过path的匹配逻辑来的。这里使用了特殊的index routes，同样是渲染在父组件下的outlet的位置。这里如果不设置index路由的话，仅仅访问`/teams`，渲染的元素树会是下面这样：
```jsx
<App>
  <Teams />
</App>
```

如果teams路由被显示在左侧的目录树下时，name页面右侧就会是空白页了！需要默认的页面组件来填充。换句话说，index路由就是在所有child没有匹配的时候给出的默认渲染方案。


根据业务需求的不同，可能会需要不同的路由结构。不管父路由下的子路由如何排序，总是无法避免用户会直接访问父路由的路径，如果父路由中用了outlet的话就会产生空白页，index就是用来填充空白的（**译者**：作者的描述有一些繁琐，其实就是一句话：默认路由作为空白填充物）。

> 我发现React Router的官网自己本身就没有做的很好，Index是不是忘了

![image.png](/images/2022-6-7/2022-6-7-1.png)

#### Layout Routes

考虑如下高亮部分的路径：

```diff
<Routes>
+ <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="teams" element={<Teams />}>
      <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
+ <Route element={<PageLayout />}>
+   <Route path="/privacy" element={<Privacy />} />
    <Route path="/tos" element={<Tos />} />
  </Route>
  <Route path="contact-us" element={<Contact />} />
</Routes>
```

他的渲染元素树是：
```jsx
<App>
  <PageLayout>
    <Privacy />
  </PageLayout>
</App>
```
可以看到，两个并列的`<Route>`竟然渲染出了包含关系。这种情况的出现只是为了简化在同一个布局中多重子路由
嵌套的关系。不过禁用这种合并，又不想无限制嵌套下去的话，就得需要比较繁琐的配置了，可能会出现大量重复的组件：

> 不建议这样写哦

```jsx
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="teams" element={<Teams />}>
      <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
  </Route>
  <Route
    path="/privacy"
    element={
      <PageLayout>
        <Privacy />
      </PageLayout>
    }
  />
  <Route
    path="/tos"
    element={
      <PageLayout>
        <Tos />
      </PageLayout>
    }
  />
  <Route path="contact-us" element={<Contact />} />
</Routes>
```
所以，叫他布局路由有点问题，因为他并不会去参与匹配URL，他只是为了方便用户使用而做的一种路由合并而已。

> 插一句，无限制嵌套可以这么写，不过路径会长一些：/layout/privacy


```jsx
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="teams" element={<Teams />}>
      <Route path=":teamId" element={<Team />} />
      <Route path=":teamId/edit" element={<EditTeam />} />
      <Route path="new" element={<NewTeamForm />} />
      <Route index element={<LeagueStandings />} />
    </Route>
    
    // 嵌套配置
    <Route path="layout" element={<PageLayout />}>
      <Route path="privacy" element={<Privacy />} />
      <Route path="tos" element={<Tos />} />
    </Route>
  </Route>
</Routes>
```

### Navigating

URL变化的这个动作叫做导航（navigation），在React Router中有两种方法：

- `<Link>`
- `navigate`

#### Link

路由导航的主要方式。当用户点击改标签时便会触发操作。React Router会阻止浏览器默认的事件行为，并且向history堆栈中push一个新的状态。继而触发location的变化和路由匹配元素的渲染。

然而，link有局限性：

- 仍然是渲染一个a标签（因此键盘操作、可聚焦和SEO可以使用）
- 没有阻止浏览器的默认行为，比如右键点击或者按住ctrl后新建一个tab页签。

嵌套路由不仅仅是渲染布局，他也能处理相对路由。还拿之前的例子：

```jsx
<Route path="teams" element={<Teams />}>
  <Route path=":teamId" element={<Team />} />
</Route>
```

在`<Teams>`中可以这样写：
```jsx
<Link to="psg" />
<Link to="new" />
```
他们的路径全程是`/teams/psg` 和 `/teams/new`，可以看到他们继承了父路由作为前缀，因此路由组件不需要真的知道剩余的路由信息。因此路由配置会非常灵活，对于越来越复杂的app，需求和设计都在不停的变化时，这会大大减少开发者的痛苦。

#### Navigate Function

另一种方式，必须在函数式组件（RFC）中使用，使用`useNavigate`钩子获取navigate函数：
```jsx
let navigate = useNavigate();
useEffect(() => {
  setTimeout(() => {
    navigate("/logout");
  }, 30000);
}, []);
```

在form的提交事件中也可以使用：
```jsx
<form onSubmit={event => {
  event.preventDefault();
  let data = new FormData(event.target)
  let urlEncoded = new URLSearchParams(data)
  navigate("/create", { state: urlEncoded })
}}>
```

他和link中的to使用方式是类似的。你可以用它替代link标签：
`<li onClick={() => navigate("/somewhere")} />`

但是一般情况下，除了链接和表单以外，很少有交互会改变URL（**译者说**：放屁！跳不跳转还不是老板一句话？图片，audio，span等等，只要是能想到的元素皆可跳转🐶 ），因为他会增加可访问性和用户交互的复杂度。

### Data Access

路由的数据无非就是参数的获取，参数的修改，如下使用即可：
```jsx
let location = useLocation();
let urlParams = useParams();
let [urlSearchParams, setUrlSearchParams] = useSearchParams();
```

### Review

总结！

1. 写一下你的App：

```jsx
const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route>
      </Route>
      <Route element={<PageLayout />}>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tos" element={<Tos />} />
      </Route>
      <Route path="contact-us" element={<Contact />} />
    </Routes>
  </BrowserRouter>
);
```

2. `<BrowserRouter>`创建history模式的路由（原地刷新页面需要后端处理跳转，或者配置Nginx来判断是否需要请求后端），push状态值，并且订阅URL变化。

3. `<Routes>`容纳子路由，并且创建路由配置对象，通过当前路径来匹配具体的路由并创建匹配的元素树，最后渲染最优的匹配。

4. 每个父路由中应该有一个`<Outlet />`

5. outlet会渲染父路由中匹配到的下一个子路由元素。

6. 用户点击Link进行跳转。

7. 也可使用navigate()进行跳转。

8. history修改URL后会通知`<BrowserRouter>`。

9. `<BrowserRouter>`收到通知，触发匹配和渲染，重新从第2步开始。

That's all !

<hr />

文章较长，翻译不易，都看到这里了，要不点个赞再走呗🐶 ~~
