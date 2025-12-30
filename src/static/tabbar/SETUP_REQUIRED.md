# TabBar 图标临时说明

## 重要提示

当前项目配置了 TabBar，但缺少图标文件。在运行小程序之前，需要先准备图标文件。

## 需要的图标文件

在 `src/static/tabbar/` 目录下需要以下6个图标文件：

1. **home.png** - 拼车大厅（未选中）
2. **home-active.png** - 拼车大厅（选中）
3. **publish.png** - 发布（未选中）
4. **publish-active.png** - 发布（选中）
5. **mine.png** - 我的（未选中）
6. **mine-active.png** - 我的（选中）

## 图标规格

- **尺寸**: 建议 81x81 像素
- **格式**: PNG 格式，支持透明背景
- **颜色**:
  - 未选中：灰色 (#999999)
  - 选中：绿色 (#07c160)

## 临时解决方案

### 方案1：使用在线图标生成器

访问 [iconfont](https://www.iconfont.cn/) 或其他图标网站，搜索并下载合适的图标：

- 首页图标：搜索 "home" 或 "房子"
- 发布图标：搜索 "add" 或 "加号"
- 我的图标：搜索 "user" 或 "用户"

### 方案2：临时禁用 TabBar（用于开发测试）

如果只是想先测试页面功能，可以暂时注释掉 `src/pages.json` 中的 tabBar 配置：

```json
{
  "pages": [...],
  "globalStyle": {...},
  "easycom": {...}
  // 暂时注释 tabBar
  // "tabBar": {
  //   ...
  // }
}
```

然后通过 `uni.navigateTo` 来测试各个页面。

### 方案3：使用emoji作为临时方案

创建简单的纯色PNG图标，可以使用在线工具：

- [Favicon Generator](https://favicon.io/favicon-generator/)
- [Canva](https://www.canva.com/)

## 运行小程序前的检查清单

- [ ] 准备好所有6个TabBar图标
- [ ] 图标已放置到 `src/static/tabbar/` 目录
- [ ] 在 `manifest.json` 中填写小程序 appid
- [ ] 配置云开发环境ID（如果使用云函数）
- [ ] 检查 `pages.json` 配置是否正确

## 快速开始（不使用TabBar）

如果想快速查看效果，可以：

1. 注释掉 tabBar 配置
2. 修改 pages.json，设置首页为第一个页面
3. 运行 `pnpm dev:mp-weixin`
4. 在微信开发者工具中打开 `dist/dev/mp-weixin` 目录

然后可以通过代码跳转来测试各个页面功能。
