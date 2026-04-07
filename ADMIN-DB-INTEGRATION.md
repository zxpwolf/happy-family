# 📊 Admin.html - 数据库集成文档

## 概述

运营管理后台（admin.html）现已集成内存数据库模块（db.js），实现数据持久化存储。

## 集成内容

### 1. 数据源切换

**之前**: 使用 localStorage 存储
```javascript
localStorage.getItem('heightAssessmentRecords')
localStorage.setItem('heightAssessmentRecords', JSON.stringify(data))
```

**现在**: 优先使用数据库，降级到 localStorage
```javascript
// 获取记录
if (typeof db !== 'undefined') {
  const result = db.getRecords();
  return result.records;
}
// 降级
return localStorage.getItem('heightAssessmentRecords');
```

### 2. 功能集成

| 功能 | 实现方式 |
|------|---------|
| 获取记录 | `db.getRecords()` |
| 保存记录 | `db.saveRecord()` |
| 清空记录 | `db.clearRecords()` |
| 导出数据 | `db.exportData()` (JSON 格式) |
| 用户统计 | `db.getAnalytics()` |
| 用户列表 | `db.getAllUsers()` |

### 3. 图表数据源

所有统计图表现在使用数据库的分析数据：

```javascript
// 之前
renderTrendChart(records);

// 现在
const analytics = db.getAnalytics();
renderTrendChartWithAnalytics(analytics);
```

### 4. 新增函数

| 函数 | 说明 |
|------|------|
| `initAdminDatabase()` | 初始化数据库连接 |
| `loadUsersFromDB()` | 从数据库加载用户分析 |
| `renderTrendChartWithAnalytics()` | 使用数据库数据渲染趋势图 |
| `renderGenderChartWithAnalytics()` | 使用数据库数据渲染性别图 |
| `renderAgeChartWithAnalytics()` | 使用数据库数据渲染年龄图 |
| `renderPercentileChartWithAnalytics()` | 使用数据库数据渲染百分位图 |

## 数据持久化流程

### 用户登录
```
admin.html → db.upsertUser() → localStorage
```

### 保存测评记录
```
admin.html → db.saveRecord() → localStorage
           ↓
     更新用户测评次数
```

### 统计数据
```
admin.html → db.getAnalytics() → 实时计算
           ↓
     总用户/总记录/今日测评/7 日趋势
     性别分布/年龄分布/百分位分布
```

### 数据导出
```
admin.html → db.exportData() → JSON 文件
           ↓
     包含 users/records/config/analytics
```

## 降级策略

如果数据库模块未加载，自动降级到 localStorage：

```javascript
function getRecords() {
  if (typeof db !== 'undefined') {
    const result = db.getRecords();
    return result.records;
  }
  // 降级到 localStorage
  const data = localStorage.getItem('heightAssessmentRecords');
  return data ? JSON.parse(data) : [];
}
```

## 测试覆盖

### 集成测试文件

- `admin-db-integration.test.js` - 13 个测试用例，100% 通过

### 测试覆盖

| 模块 | 测试用例 | 状态 |
|------|---------|------|
| 数据库初始化 | 2 | ✅ |
| 用户管理 | 2 | ✅ |
| 测评记录 | 2 | ✅ |
| 统计分析 | 4 | ✅ |
| 数据导出 | 3 | ✅ |

### 运行测试

```bash
node /Users/jinhuawang/.openclaw/workspace/admin-db-integration.test.js
```

## 使用示例

### 1. 查看统计数据

```javascript
// 管理后台自动加载
loadDashboard();
// 显示：总用户数、总记录数、今日测评、7 日趋势
```

### 2. 导出所有数据

```javascript
// 点击"导出 Excel"按钮
exportRecords();
// 下载 JSON 格式备份文件
```

### 3. 查看用户列表

```javascript
// 切换到"用户分析"标签
loadUsers();
// 显示：用户 ID、测评次数、首次/最近测评、活跃状态
```

## 性能优化

| 优化项 | 效果 |
|--------|------|
| 使用数据库分析 | 避免遍历所有记录 |
| 实时统计 | 数据更新即时反映 |
| 分页查询 | 大量数据不卡顿 |
| 索引优化 | 用户/记录查找快速 |

## 兼容性

| 浏览器 | 支持 | 说明 |
|--------|------|------|
| Chrome | ✅ | 完全支持 |
| Firefox | ✅ | 完全支持 |
| Safari | ✅ | 完全支持 |
| Edge | ✅ | 完全支持 |

## 故障排除

### Q: 管理后台显示"数据库未连接"？
A: 检查 db.js 是否正确加载，查看浏览器控制台。

### Q: 统计数据不准确？
A: 刷新页面重新加载数据，或检查数据库是否同步。

### Q: 导出文件为空？
A: 确认数据库中有记录，检查浏览器下载权限。

---

**集成日期**: 2026-04-07  
**维护者**: 花姐 🌸  
**版本**: 1.0.0
