<div align="center">

# docsify-footnote

[![GitHub Release](https://img.shields.io/github/release/Robert-Du0001/docsify-footnote.svg)](https://github.com/Robert-Du0001/docsify-footnote/releases) [![NPM Release](https://img.shields.io/npm/v/docsify-footnote.svg)](https://www.npmjs.com/package/docsify-footnote)

[English](/README.md) | [简体中文](/README.zh-CN.md)

[docsify.js](https://docsify.js.org)的Markdown脚注插件
</div>

## Example

你只需要导入这个JS脚本： 

```js
<script src="//cdn.jsdelivr.net/npm/docsify-footnote/dist/docsify-footnote.min.js"></script>
```

然后即可生效:

```markdown
tf[^1]

[^1]: Test File

or

tf^[Test File]

or

tf1[^2]

[^2]: Test File1
```

![demo-1](/docs/assets/imgs/example.png)

## 配置

```javascript
window.$docsify = {
  docsifyFootnote: {
    // 当设置为true时，可以隐藏子锚点编号
    // https://github.com/Robert-Du0001/docsify-footnote/pull/5
    hideSubAnchor: true,
  }
}
```

## License
[MIT License](LICENSE)
