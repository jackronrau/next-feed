# 🔧 故障排除指南

## 常见问题和解决方案

### ❌ 问题1: 没有看到gh-pages分支

**原因**: gh-pages分支是由GitHub Actions自动创建的，需要先成功运行工作流。

**解决方案**:
1. 确保已添加`TWITTER_API_KEY`到GitHub Secrets
2. 手动触发Actions运行：
   - 进入 **Actions** → **Generate RSS Feeds** → **Run workflow**
3. 等待Actions成功完成
4. 刷新仓库页面，gh-pages分支应该出现

### ❌ 问题2: GitHub Pages显示404

**原因**: GitHub Pages还没有正确配置或Actions没有成功运行。

**解决方案**:
1. 检查Actions是否成功运行（绿色✅）
2. 确认gh-pages分支已创建
3. 在Settings → Pages中选择gh-pages分支
4. 等待几分钟让GitHub Pages部署完成

### ❌ 问题3: Actions运行失败

**可能原因和解决方案**:

#### 3.1 环境变量未找到
```
❌ TWITTER_API_KEY is required
Error: Process completed with exit code 1
```
**解决方案**:
1. 确认在GitHub仓库 **Settings → Secrets and variables → Actions** 中已添加 `TWITTER_API_KEY`
2. Secret名称必须完全匹配：`TWITTER_API_KEY`（区分大小写）
3. 重新运行工作流：**Actions → Generate RSS Feeds → Re-run jobs**
4. 检查Actions日志中的环境变量调试信息

#### 3.2 API密钥错误
```
Error: 401 Unauthorized
```
- 检查TWITTER_API_KEY是否正确设置
- 确认API密钥有效且未过期
- 重新生成API密钥并更新Secrets

#### 3.2 API限制
```
Error: 429 Too Many Requests
```
- 等待一段时间后重试
- 检查API使用量是否超限
- 考虑升级API套餐

#### 3.3 网络问题
```
Error: fetch failed
```
- 重新运行工作流
- 检查Twitter API服务状态

### ❌ 问题4: RSS文件为空或内容少

**原因**: 搜索关键词可能没有匹配到足够的推文。

**解决方案**:
1. 检查Actions日志查看搜索结果
2. 调整关键词的`min_faves`阈值（降低数值）
3. 修改搜索关键词使其更宽泛

### ❌ 问题5: 部署脚本权限错误

**错误信息**:
```
Permission denied: ./deploy.sh
```

**解决方案**:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🔍 调试步骤

### 1. 检查Actions日志
1. 进入仓库 **Actions** 标签页
2. 点击最近的工作流运行
3. 展开各个步骤查看详细日志
4. 查找错误信息和警告

### 2. 验证API连接
本地测试API连接：
```bash
# 创建.env文件并添加API密钥
cp .env.example .env
# 编辑.env添加TWITTER_API_KEY

# 运行测试
npm run test
```

### 3. 本地生成RSS
```bash
# 本地运行完整流程
npm run dev
```

### 4. 检查生成的文件
```bash
# 查看生成的RSS文件
ls -la feeds/
cat feeds/saas.xml
```

## 📊 监控和维护

### 定期检查项目
- **每周**: 检查Actions运行状态
- **每月**: 验证RSS内容质量
- **季度**: 更新关键词和API密钥

### 性能优化
1. **关键词优化**: 根据结果调整搜索词
2. **频率调整**: 修改cron表达式改变更新频率
3. **内容过滤**: 添加更多过滤条件

### 安全维护
1. **密钥轮换**: 定期更新API密钥
2. **权限检查**: 确保仓库权限设置正确
3. **依赖更新**: 定期更新npm包

## 🆘 获取帮助

### 检查清单
在寻求帮助前，请确认：
- [ ] API密钥已正确添加到GitHub Secrets
- [ ] Actions至少成功运行过一次
- [ ] gh-pages分支已创建
- [ ] GitHub Pages已启用并选择正确分支
- [ ] 等待了足够时间让部署完成

### 常用命令
```bash
# 检查git状态
git status

# 查看远程仓库
git remote -v

# 重新部署
git add .
git commit -m "fix: update configuration"
git push origin main

# 本地测试
npm run test
npm run dev
```

### 联系支持
如果问题仍然存在：
1. 检查GitHub Actions日志
2. 验证API服务状态
3. 查看GitHub Pages部署状态
4. 确认所有配置步骤都已完成

记住：大多数问题都是由于配置不完整或API密钥问题导致的。按照步骤仔细检查通常能解决问题。