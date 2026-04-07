# 📦 持久化方案文档

## 概述

儿童身高评估 H5 页面现已集成完整的持久化方案，使用**内存数据库 + localStorage**实现数据持久化存储。

## 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    H5 页面                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  用户登录   │  │  测评表单   │  │  数据展示   │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│         └────────────────┼────────────────┘             │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   数据库模块 (db.js)                     │
│  ┌─────────────────────────────────────────────────┐    │
│  │              HeightDB 类                         │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │    │
│  │  │  用户表  │ │  记录表  │ │  配置表  │        │    │
│  │  │  users   │ │ records  │ │  config  │        │    │
│  │  └──────────┘ └──────────┘ └──────────┘        │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  localStorage 持久化                     │
└─────────────────────────────────────────────────────────┘
```

## 数据表结构

### 1. users (用户表)

```javascript
{
  id: "k8x9y2z3a4b5",           // 唯一 ID
  phone: "138****8000",          // 手机号（脱敏）
  name: "138****8000",           // 昵称
  createdAt: "2026-04-07T...",   // 创建时间
  updatedAt: "2026-04-07T...",   // 更新时间
  assessmentCount: 5,            // 测评次数
  lastAssessmentAt: "2026-04-07T..." // 最近测评时间
}
```

### 2. records (测评记录表)

```javascript
{
  id: "m1n2o3p4q5r6",           // 唯一 ID
  userPhone: "138****8000",      // 用户手机号
  childName: "小明",             // 孩子姓名
  gender: "boy",                 // 性别
  birthDate: "2018-01-01",       // 出生日期
  age: 8,                        // 年龄
  height: 125,                   // 身高 (cm)
  weight: 25,                    // 体重 (kg)
  fatherHeight: 175,             // 父亲身高
  motherHeight: 163,             // 母亲身高
  targetHeight: 180,             // 期望身高
  percentile: 65,                // 百分位
  predictedHeight: 178,          // 预测身高
  geneticHeight: 176,            // 遗传身高
  bmi: 16.0,                     // BMI 指数
  createdAt: "2026-04-07T...",   // 创建时间
  userAgent: "Mozilla/5.0..."    // 用户代理
}
```

### 3. config (配置表)

```javascript
{
  shareEnabled: true,            // 分享功能开关
  rankingEnabled: false,         // 排名功能开关
  dataRetention: 365             // 数据保留天数
}
```

### 4. analytics (统计表)

```javascript
{
  totalVisits: 1000,             // 总访问次数
  totalAssessments: 500,         // 总测评次数
  lastReset: "2026-01-01T..."    // 最后重置时间
}
```

## API 使用

### 用户管理

```javascript
// 创建或更新用户
db.upsertUser({ phone: '13800138000', name: '张三' });

// 获取用户
db.getUser('13800138000');

// 获取所有用户
db.getAllUsers();

// 删除用户
db.deleteUser('13800138000');
```

### 测评记录管理

```javascript
// 保存记录
db.saveRecord({
  userPhone: '13800138000',
  childName: '小明',
  gender: 'boy',
  age: 8,
  height: 125,
  percentile: 65,
  // ... 其他字段
});

// 获取记录（支持筛选和分页）
db.getRecords({
  userPhone: '13800138000',
  gender: 'boy',
  minAge: 6,
  maxAge: 12,
  page: 1,
  pageSize: 20
});

// 获取单条记录
db.getRecord('record-id');

// 删除记录
db.deleteRecord('record-id');

// 清空所有记录
db.clearRecords();
```

### 配置管理

```javascript
// 获取配置
db.getConfig('shareEnabled');
db.getConfig(); // 获取所有配置

// 更新配置
db.setConfig('shareEnabled', false);
```

### 统计分析

```javascript
// 获取统计数据
const analytics = db.getAnalytics();
// 返回：
// - totalUsers: 总用户数
// - totalRecords: 总记录数
// - todayCount: 今日测评数
// - last7Days: 近 7 日趋势
// - genderDistribution: 性别分布
// - ageDistribution: 年龄分布
// - percentileDistribution: 百分位分布
```

### 数据管理

```javascript
// 导出所有数据
const data = db.exportData();

// 导入数据
db.importData(data);

// 清理过期数据
const result = db.cleanupExpiredData();
// 返回：{ deleted: 10, remaining: 490 }

// 重置数据库
db.reset();

// 获取数据库信息
const info = db.getInfo();
// 返回：name, version, createdAt, updatedAt, users, records, size
```

## 文件列表

```
workspace/
├── db.js                    # 数据库模块 ✅
├── height-assessment.html   # H5 主页面（已集成数据库）✅
├── database-admin.html      # 数据库管理后台 ✅
└── PERSISTENCE.md           # 持久化方案文档（本文件）
```

## 使用场景

### 1. 用户登录

```javascript
// 用户登录时自动创建或更新用户记录
function doLogin() {
  const phone = document.getElementById('loginPhone').value;
  const user = db.upsertUser({
    phone: phone,
    name: phone.substring(0, 3) + '****' + phone.substring(7)
  });
  currentUser = user;
}
```

### 2. 提交测评

```javascript
// 用户提交测评时自动保存
document.getElementById('heightForm').addEventListener('submit', function(e) {
  // ... 计算逻辑
  
  db.saveRecord({
    userPhone: currentUser ? currentUser.phone : null,
    childName: childName,
    gender: gender,
    age: age,
    height: currentHeight,
    // ... 其他字段
  });
});
```

### 3. 查看历史记录

```javascript
// 查看用户的测评历史
const history = db.getRecords({
  userPhone: currentUser.phone,
  page: 1,
  pageSize: 10
});
```

### 4. 数据分析

```javascript
// 获取分析数据用于图表展示
const analytics = db.getAnalytics();
renderCharts(analytics);
```

## 管理后台

访问 `database-admin.html` 打开数据库管理后台：

### 功能列表

- 📊 **数据统计**：用户数、记录数、今日测评、存储大小
- 👥 **用户列表**：查看所有注册用户及测评次数
- 📋 **记录列表**：查看最近测评记录
- 📈 **趋势图表**：近 7 日测评趋势、性别分布
- 📥 **数据导出**：导出 JSON 格式备份
- 📤 **数据导入**：从 JSON 文件恢复
- 🧹 **数据清理**：清理过期数据
- ⚠️ **重置数据库**：清空所有数据

## 数据安全

### 隐私保护

- 手机号脱敏存储（138****8000）
- 数据仅存储在用户浏览器本地
- 不上传到任何服务器

### 数据保留

- 默认保留 365 天数据
- 可配置保留期限
- 支持手动清理

### 备份恢复

- 支持完整数据导出
- 支持从备份恢复
- 建议定期备份

## 性能优化

### 存储限制

- localStorage 限制：5-10MB（取决于浏览器）
- 单条记录大小：约 500 bytes
- 预计可存储：10,000+ 条记录

### 查询优化

- 支持分页查询
- 支持多条件筛选
- 新记录优先（unshift）

### 自动清理

- 定期清理过期数据
- 避免存储无限增长
- 保持系统性能

## 兼容性

| 浏览器 | 支持 | 说明 |
|--------|------|------|
| Chrome | ✅ | 完全支持 |
| Firefox | ✅ | 完全支持 |
| Safari | ✅ | 完全支持 |
| Edge | ✅ | 完全支持 |
| 微信内置浏览器 | ✅ | 完全支持 |

## 故障排除

### Q: 数据丢失？
A: localStorage 可能被清除，建议定期导出备份。

### Q: 存储空间不足？
A: 使用清理功能删除过期数据，或导出后重置数据库。

### Q: 跨设备同步？
A: 当前方案为本地存储，如需跨设备同步需对接后端服务。

---

**版本**: 1.0.0  
**创建日期**: 2026-04-07  
**维护者**: 花姐 🌸
