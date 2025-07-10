# GitHub CI/CD 部署指南

## 🚀 自动化RSS生成和发布

本项目已配置GitHub Actions来自动生成RSS订阅源并通过GitHub Pages发布。

## 📋 部署步骤

### 1. 创建GitHub仓库
```bash
git init
git add .
git commit -m "Initial commit: RSS Feed Generator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. 配置GitHub Secrets (必须先完成)
在GitHub仓库设置中添加以下Secret：

**Settings → Secrets and variables → Actions → New repository secret**

- **Name**: `TWITTER_API_KEY`
- **Value**: 你的TwitterAPI.io密钥

⚠️ **重要**: 绝对不要将API密钥提交到代码仓库中！

### 3. 手动触发第一次运行
由于gh-pages分支还不存在，需要先手动运行Actions：

1. 进入仓库 **Actions** 标签页
2. 点击 **Generate RSS Feeds** 工作流
3. 点击 **Run workflow** 按钮
4. 选择 **main** 分支
5. 点击绿色的 **Run workflow** 按钮

### 4. 等待Actions完成
- 查看Actions运行状态，确保成功完成
- 成功后会自动创建gh-pages分支
- 如果失败，检查API密钥是否正确配置

### 5. 启用GitHub Pages (Actions成功后)
1. 进入仓库 **Settings → Pages**
2. Source 选择 **Deploy from a branch**
3. Branch 选择 **gh-pages** (现在应该可以看到了)
4. Folder 选择 **/ (root)**
5. 点击 **Save**

### 6. 后续自动运行
配置完成后，工作流将：
- **自动运行**: 每6小时自动执行
- **代码推送**: 推送到main分支时自动运行

## 🔄 工作流程说明

### 自动化流程
1. **定时触发**: 每6小时运行一次 (UTC 0, 6, 12, 18点)
2. **获取数据**: 使用Twitter API搜索关键词
3. **生成RSS**: 为每个分类创建RSS XML文件
4. **创建网页**: 生成RSS订阅源索引页面
5. **发布**: 自动部署到GitHub Pages

### 输出结果
部署完成后，你的RSS订阅源将在以下地址可用：
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

各分类RSS地址：
- SaaS: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/saas.xml`
- 联盟营销: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/affiliate-marketing.xml`
- SEO: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/seo.xml`
- 付费广告: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/paid-advertising.xml`
- 电商: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/e-commerce.xml`
- 创作者经济: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/creator-economy.xml`
- AI技术: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/ai-technology.xml`

## 📊 监控和维护

### 查看运行状态
- **Actions标签页**: 查看工作流运行历史
- **GitHub Pages**: 检查部署状态
- **RSS验证**: 使用RSS验证工具检查生成的订阅源

### 故障排除
1. **API限制**: 检查Twitter API使用量
2. **Secret配置**: 确认TWITTER_API_KEY正确设置
3. **权限问题**: 确保GitHub Actions有写入权限
4. **Pages设置**: 确认GitHub Pages正确配置

### 自定义配置
- **修改频率**: 编辑 `.github/workflows/generate-rss.yml` 中的cron表达式
- **调整关键词**: 修改 `src/keywords/index.ts`
- **更改样式**: 编辑工作流中的HTML模板

## 🔒 安全最佳实践

### ✅ 已实现的安全措施
- API密钥存储在GitHub Secrets中
- 环境变量不会暴露在代码中
- `.env` 文件已添加到 `.gitignore`

### ⚠️ 注意事项
- 定期轮换API密钥
- 监控API使用量避免超限
- 不要在公开仓库中提交敏感信息
- 定期检查依赖包安全更新

## 📈 使用统计
部署后可以通过以下方式监控使用情况：
- GitHub Pages访问统计
- RSS阅读器订阅数量
- Twitter API使用量统计

## 🎯 优化建议
1. **缓存策略**: 添加RSS内容缓存避免重复内容
2. **错误通知**: 配置失败时的邮件通知
3. **内容过滤**: 添加内容质量评分机制
4. **多语言支持**: 扩展到其他语言内容
5. **分析工具**: 集成Google Analytics追踪使用情况

部署完成后，你将拥有一个完全自动化的RSS订阅源生成系统！