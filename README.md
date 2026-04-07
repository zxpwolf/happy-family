# 🌸 Happy Family - 儿童身高评估系统

> 科学预测孩子未来身高 · 关爱孩子成长每一步

## 📖 项目简介

Happy Family 是一个专业的儿童身高评估系统，提供科学的身高预测、体型分析、全国排名等功能，帮助家长了解孩子的生长发育情况。

## ✨ 核心功能

- 📏 **身高评估** - 基于中国儿童身高标准数据
- 📊 **体型分析** - BMI 指数、体重状态评估
- 🏆 **全国排名** - 查看孩子在全国同龄人中的位置
- 📈 **生长曲线** - 0-18 岁完整生长轨迹
- 👨‍⚕️ **健管助手** - 专业健康管理师在线服务
- 📱 **管理后台** - 数据统计、用户管理、数据导出
- 💾 **数据持久化** - 内存数据库 + localStorage

## 📁 项目结构

```
happy-family/
├── height-assessment.html      # H5 主页面（用户端）
├── admin.html                  # 管理后台（运营端）
├── db.js                       # 内存数据库模块
├── run-tests.js                # 核心功能测试
├── db.test.js                  # 数据库模块测试
├── admin-db-integration.test.js # 管理后台集成测试
├── package.json                # npm 配置
├── jest.config.js              # Jest 配置
├── jest.setup.js               # 测试环境设置
├── TEST.md                     # 测试文档
├── TEST-REPORT.md              # 测试报告
├── PERSISTENCE.md              # 持久化方案文档
├── ADMIN-DB-INTEGRATION.md     # 管理后台集成文档
├── BUGFIX-ADMIN.md             # Bug 修复报告
├── GITHUB-PUSH.md              # GitHub 推送指南
├── QUICK-PUSH.md               # 快速推送指南
└── push-to-github.sh           # 推送脚本
```

## 🚀 快速开始

### 1. 打开 H5 页面

直接在浏览器中打开：
```bash
open happy-family/height-assessment.html
```

### 2. 使用功能

1. 填写孩子信息（姓名、性别、出生日期）
2. 输入当前身高、体重
3. 输入父母身高
4. 点击"开始评估"生成报告

### 3. 管理后台

打开管理后台：
```bash
open happy-family/admin.html
```

默认登录账号：
- 用户名：`admin`
- 密码：`admin123`

## 🧪 测试

### 运行核心功能测试
```bash
node happy-family/run-tests.js
```

### 运行数据库测试
```bash
node happy-family/db.test.js
```

### 运行集成测试
```bash
node happy-family/admin-db-integration.test.js
```

### 测试覆盖率

| 模块 | 测试用例 | 通过率 |
|------|---------|--------|
| 核心功能 | 179 | 99.44% |
| 数据库模块 | 119 | 100% |
| 集成测试 | 13 | 100% |
| **总计** | **311** | **99.68%** |

## 📊 功能特性

### 用户端（height-assessment.html）

- 👨‍👩‍👧 家庭照片展示
- 📝 表单输入（孩子信息、父母身高）
- 📊 身高评估报告
  - 当前身高状态
  - 体型分析（BMI、体重状态）
  - 身高预测
  - 生长曲线图
- 🏆 全国排名（分享后解锁）
- 👩‍⚕️ 健管助手（企业微信咨询）
- 📷 保存报告为图片
- 📚 身高成长资讯

### 管理后台（admin.html）

- 📊 数据概览
  - 总用户数、总记录数
  - 今日测评数
  - 近 7 日趋势图
  - 性别/年龄/百分位分布
- 📋 测评记录管理
  - 查看所有记录
  - 搜索/筛选/分页
  - 导出数据
- 👥 用户分析
  - 用户列表
  - 活跃状态
- 📝 资讯配置
  - 文章管理
  - 分类管理
- ⚙️ 系统设置
  - 密码修改
  - 数据清理

### 数据库模块（db.js）

- 💾 数据持久化（localStorage）
- 👥 用户管理
- 📋 记录管理
- 📊 统计分析
- 📤 数据导出/导入
- 🧹 数据清理

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **图表**: Chart.js 4.4.0
- **截图**: html2canvas
- **数据库**: 内存数据库 + localStorage
- **测试**: 独立测试运行器（兼容 Jest）

## 📈 性能指标

| 指标 | 数值 |
|------|------|
| 页面加载时间 | < 1s |
| 评估计算时间 | < 10ms |
| 数据库查询 | < 1ms |
| 图片保存 | < 500ms |
| 测试通过率 | 99.68% |

## 🔒 数据安全

- 所有数据存储在本地浏览器
- 手机号脱敏处理
- 不上传任何服务器
- 支持数据导出备份

## 📝 更新日志

### v1.0.0 (2026-04-07)
- ✅ 初始版本发布
- ✅ 身高评估功能
- ✅ 管理后台
- ✅ 数据库持久化
- ✅ 完整测试套件（311 个测试用例）

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

## 👥 作者

- **花姐** 🌸

## 🙏 致谢

感谢所有为项目做出贡献的开发者！

---

**项目地址**: https://github.com/zxpwolf/happy-family  
**最后更新**: 2026-04-07
