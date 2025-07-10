#!/bin/bash

# RSS Feed Generator - GitHub 部署脚本
echo "🚀 RSS Feed Generator - GitHub 部署脚本"
echo "========================================"

# 检查是否已经是git仓库
if [ ! -d ".git" ]; then
    echo "📁 初始化Git仓库..."
    git init
    git branch -M main
else
    echo "✅ Git仓库已存在"
fi

# 检查是否有.env文件
if [ ! -f ".env" ]; then
    echo "⚠️  警告: 未找到.env文件"
    echo "请先复制.env.example到.env并配置你的API密钥"
    echo "cp .env.example .env"
    echo "然后编辑.env文件添加TWITTER_API_KEY"
    exit 1
fi

# 添加所有文件到git
echo "📦 添加文件到Git..."
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "feat: RSS Feed Generator with GitHub Actions CI/CD

- Twitter API integration using third-party service
- 7 business categories with targeted keywords
- Automated RSS generation every 6 hours
- GitHub Pages deployment for RSS hosting
- Secure API key management with GitHub Secrets"

# 检查是否已设置远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo "🔗 请设置GitHub远程仓库:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo ""
    echo "然后运行:"
    echo "git push -u origin main"
    echo ""
    echo "📋 部署清单:"
    echo "1. 创建GitHub仓库"
    echo "2. 设置远程仓库地址"
    echo "3. 推送代码到GitHub"
    echo "4. 在GitHub仓库设置中添加TWITTER_API_KEY到Secrets"
    echo "5. 启用GitHub Pages (选择gh-pages分支)"
    echo "6. 等待Actions运行完成"
    echo ""
    echo "详细说明请查看 DEPLOYMENT.md"
else
    echo "🚀 推送到GitHub..."
    git push -u origin main
    
    echo ""
    echo "✅ 代码已推送到GitHub!"
    echo ""
    echo "📋 接下来的步骤:"
    echo "1. 在GitHub仓库设置中添加TWITTER_API_KEY到Secrets"
    echo "2. 启用GitHub Pages (选择gh-pages分支)"
    echo "3. 等待GitHub Actions运行完成"
    echo ""
    echo "🌐 你的RSS订阅源将在以下地址可用:"
    REPO_URL=$(git remote get-url origin)
    REPO_NAME=$(basename "$REPO_URL" .git)
    USERNAME=$(basename $(dirname "$REPO_URL"))
    echo "https://$USERNAME.github.io/$REPO_NAME/"
fi

echo ""
echo "🎉 部署脚本完成!"