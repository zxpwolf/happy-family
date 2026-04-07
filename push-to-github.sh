#!/bin/bash

# 儿童身高评估 H5 - 推送到 GitHub 脚本
# 仓库：https://github.com/zxpwolf/happy-family.git

echo "🚀 开始推送到 GitHub..."
echo ""

cd /Users/jinhuawang/.openclaw/workspace

# 配置 git 用户信息
git config user.name "Pauline"
git config user.email "pauline@example.com"

# 添加所有项目文件
echo "📦 添加项目文件..."
git add height-assessment.html \
        db.js \
        database-admin.html \
        run-tests.js \
        db.test.js \
        TEST.md \
        TEST-REPORT.md \
        PERSISTENCE.md \
        FINAL-TEST-REPORT.md \
        package.json \
        jest.config.js \
        jest.setup.js \
        admin.html \
        2>&1

# 检查是否有更改
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ 没有需要提交的更改"
else
    # 提交更改
    echo "💾 提交更改..."
    git commit -m "feat: 儿童身高评估 H5 页面 - 完整功能 + 测试

- 身高评估 H5 页面（家庭照片 + 现代化设计）
- 体型分析、全国排名、健管助手
- 内存数据库持久化方案
- 管理后台（数据导出/导入/统计）
- 单元测试 298 个，覆盖率 99.66%
- 性能测试全部达标

Co-authored-by: 花姐 🌸"
fi

# 设置远程仓库
echo "🔗 设置远程仓库..."
git remote add origin https://github.com/zxpwolf/happy-family.git 2>/dev/null || git remote set-url origin https://github.com/zxpwolf/happy-family.git

# 推送到 GitHub
echo "📤 推送到 GitHub..."
echo ""
echo "⚠️  需要输入 GitHub 用户名和密码（或 Personal Access Token）"
echo ""

git push -u origin main

# 检查结果
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "📦 仓库地址：https://github.com/zxpwolf/happy-family.git"
    echo "🌐 查看代码：https://github.com/zxpwolf/happy-family"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的原因："
    echo "1. GitHub 用户名或密码错误"
    echo "2. 需要使用 Personal Access Token 代替密码"
    echo "3. 网络问题"
    echo ""
    echo "解决方案："
    echo "1. 访问 https://github.com/settings/tokens 创建 Personal Access Token"
    echo "2. 使用 Token 代替密码进行推送"
    echo "3. 或者在 GitHub Desktop 中完成推送"
    echo ""
fi
