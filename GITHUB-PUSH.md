# 📤 推送到 GitHub 指南

## 仓库信息

- **仓库地址**: https://github.com/zxpwolf/happy-family.git
- **分支**: main

## 推送方式

### 方式一：使用推送脚本（推荐）

```bash
cd /Users/jinhuawang/.openclaw/workspace
./push-to-github.sh
```

然后输入你的 GitHub 用户名和密码（或 Personal Access Token）。

### 方式二：手动推送

```bash
cd /Users/jinhuawang/.openclaw/workspace

# 1. 配置 git（如果是第一次）
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 2. 添加文件
git add height-assessment.html db.js database-admin.html run-tests.js db.test.js TEST.md PERSISTENCE.md package.json admin.html

# 3. 提交
git commit -m "feat: 儿童身高评估 H5 页面 - 完整功能 + 测试"

# 4. 设置远程仓库
git remote add origin https://github.com/zxpwolf/happy-family.git
# 如果已存在远程仓库，使用：
# git remote set-url origin https://github.com/zxpwolf/happy-family.git

# 5. 推送
git push -u origin main
```

### 方式三：使用 GitHub Desktop

1. 打开 GitHub Desktop
2. 添加本地仓库：`/Users/jinhuawang/.openclaw/workspace`
3. 关联远程仓库：`https://github.com/zxpwolf/happy-family.git`
4. 点击 "Push origin"

## 🔑 使用 Personal Access Token

GitHub 已不再支持使用账户密码进行 Git 操作，需要使用 Personal Access Token：

### 创建 Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 填写备注（如：happy-family-push）
4. 选择权限：
   - ✅ `repo` (Full control of private repositories)
5. 点击 "Generate token"
6. **复制并保存 Token**（只显示一次！）

### 使用 Token 推送

```bash
git push -u origin main
# 当提示输入密码时，粘贴你的 Personal Access Token
```

或者在 URL 中包含 Token（不推荐，仅用于脚本）：

```bash
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/zxpwolf/happy-family.git
git push -u origin main
```

## 📦 已提交的文件

```
height-assessment.html      # H5 主页面
db.js                       # 数据库模块
database-admin.html         # 管理后台
run-tests.js                # 核心功能测试
db.test.js                  # 数据库测试
TEST.md                     # 测试文档
TEST-REPORT.md              # 测试报告
PERSISTENCE.md              # 持久化方案文档
FINAL-TEST-REPORT.md        # 最终测试报告
package.json                # npm 配置
jest.config.js              # Jest 配置
jest.setup.js               # 测试环境设置
admin.html                  # 运营管理后台
push-to-github.sh           # 推送脚本
GITHUB-PUSH.md              # 推送指南（本文件）
```

## ✅ 推送成功后

访问 https://github.com/zxpwolf/happy-family 查看代码。

## 🐛 常见问题

### Q: 提示 "Permission denied"
A: 确保你有该仓库的写入权限，或者使用 Personal Access Token。

### Q: 提示 "remote origin already exists"
A: 使用 `git remote set-url origin <url>` 而不是 `git remote add`。

### Q: 推送后看不到文件
A: 检查是否推送到了正确的分支，默认是 `main` 分支。

---

**创建日期**: 2026-04-07  
**维护者**: 花姐 🌸
