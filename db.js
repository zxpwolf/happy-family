/**
 * 内存数据库模块
 * 使用 localStorage 实现数据持久化
 * 支持用户管理、测评记录、配置管理
 */

class HeightDB {
  constructor() {
    this.dbName = 'heightAssessmentDB';
    this.version = '1.0.0';
    this.tables = {
      users: 'users',
      records: 'records',
      config: 'config',
      analytics: 'analytics'
    };
    this.init();
  }

  // 初始化数据库
  init() {
    if (!this.exists()) {
      this.create();
    }
    this.migrate();
  }

  // 检查数据库是否存在
  exists() {
    return localStorage.getItem(this.dbName) !== null;
  }

  // 创建数据库
  create() {
    const db = {
      version: this.version,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tables: {
        users: [],
        records: [],
        config: {
          shareEnabled: true,
          rankingEnabled: false,
          dataRetention: 365 // 数据保留天数
        },
        analytics: {
          totalVisits: 0,
          totalAssessments: 0,
          lastReset: new Date().toISOString()
        }
      }
    };
    localStorage.setItem(this.dbName, JSON.stringify(db));
    console.log('📦 数据库创建成功');
    return db;
  }

  // 获取数据库
  get() {
    const data = localStorage.getItem(this.dbName);
    return data ? JSON.parse(data) : null;
  }

  // 保存数据库
  save(db) {
    db.updatedAt = new Date().toISOString();
    localStorage.setItem(this.dbName, JSON.stringify(db));
  }

  // 数据库迁移
  migrate() {
    const db = this.get();
    if (!db) return;
    
    if (db.version !== this.version) {
      console.log('🔄 数据库迁移：', db.version, '->', this.version);
      // 版本升级逻辑
      db.version = this.version;
      this.save(db);
    }
  }

  // ==================== 用户管理 ====================
  
  // 创建或更新用户
  upsertUser(userData) {
    const db = this.get();
    let user = db.tables.users.find(u => u.phone === userData.phone);
    
    if (user) {
      // 更新现有用户
      user = { ...user, ...userData, updatedAt: new Date().toISOString() };
      const index = db.tables.users.findIndex(u => u.phone === userData.phone);
      db.tables.users[index] = user;
    } else {
      // 创建新用户
      user = {
        id: this.generateId(),
        phone: userData.phone,
        name: userData.name || userData.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assessmentCount: 0,
        lastAssessmentAt: null
      };
      db.tables.users.push(user);
    }
    
    this.save(db);
    return user;
  }

  // 获取用户
  getUser(phone) {
    const db = this.get();
    return db.tables.users.find(u => u.phone === phone) || null;
  }

  // 获取所有用户
  getAllUsers() {
    const db = this.get();
    return db.tables.users;
  }

  // 删除用户
  deleteUser(phone) {
    const db = this.get();
    db.tables.users = db.tables.users.filter(u => u.phone !== phone);
    // 同时删除该用户的测评记录
    db.tables.records = db.tables.records.filter(r => r.userPhone !== phone);
    this.save(db);
    return true;
  }

  // ==================== 测评记录管理 ====================
  
  // 保存测评记录
  saveRecord(recordData) {
    const db = this.get();
    
    const record = {
      id: this.generateId(),
      userPhone: recordData.userPhone || 'anonymous',
      childName: recordData.childName || '匿名',
      gender: recordData.gender,
      birthDate: recordData.birthDate,
      age: recordData.age,
      height: recordData.height,
      weight: recordData.weight,
      fatherHeight: recordData.fatherHeight,
      motherHeight: recordData.motherHeight,
      targetHeight: recordData.targetHeight || null,
      percentile: recordData.percentile,
      predictedHeight: recordData.predictedHeight,
      geneticHeight: recordData.geneticHeight,
      bmi: recordData.bmi,
      createdAt: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    db.tables.records.unshift(record); // 新记录在前
    
    // 更新用户测评次数
    if (recordData.userPhone) {
      const user = db.tables.users.find(u => u.phone === recordData.userPhone);
      if (user) {
        user.assessmentCount = (user.assessmentCount || 0) + 1;
        user.lastAssessmentAt = record.createdAt;
      }
    }
    
    // 更新统计
    db.tables.analytics.totalAssessments = (db.tables.analytics.totalAssessments || 0) + 1;
    
    this.save(db);
    return record;
  }

  // 获取测评记录
  getRecords(options = {}) {
    const db = this.get();
    let records = db.tables.records;
    
    // 按用户筛选
    if (options.userPhone) {
      records = records.filter(r => r.userPhone === options.userPhone);
    }
    
    // 按性别筛选
    if (options.gender) {
      records = records.filter(r => r.gender === options.gender);
    }
    
    // 按年龄范围筛选
    if (options.minAge !== undefined) {
      records = records.filter(r => r.age >= options.minAge);
    }
    if (options.maxAge !== undefined) {
      records = records.filter(r => r.age <= options.maxAge);
    }
    
    // 按时间范围筛选
    if (options.startDate) {
      records = records.filter(r => new Date(r.createdAt) >= new Date(options.startDate));
    }
    if (options.endDate) {
      records = records.filter(r => new Date(r.createdAt) <= new Date(options.endDate));
    }
    
    // 分页
    const page = options.page || 1;
    const pageSize = options.pageSize || 20;
    const total = records.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const paginated = records.slice(start, start + pageSize);
    
    return {
      records: paginated,
      pagination: {
        page,
        pageSize,
        total,
        totalPages
      }
    };
  }

  // 获取单条记录
  getRecord(id) {
    const db = this.get();
    return db.tables.records.find(r => r.id === id) || null;
  }

  // 删除记录
  deleteRecord(id) {
    const db = this.get();
    db.tables.records = db.tables.records.filter(r => r.id !== id);
    this.save(db);
    return true;
  }

  // 清空所有记录
  clearRecords() {
    const db = this.get();
    db.tables.records = [];
    this.save(db);
    return true;
  }

  // ==================== 配置管理 ====================
  
  // 获取配置
  getConfig(key) {
    const db = this.get();
    return key ? db.tables.config[key] : db.tables.config;
  }

  // 更新配置
  setConfig(key, value) {
    const db = this.get();
    db.tables.config[key] = value;
    this.save(db);
    return true;
  }

  // ==================== 统计分析 ====================
  
  // 获取统计数据
  getAnalytics() {
    const db = this.get();
    const records = db.tables.records;
    const users = db.tables.users;
    
    // 计算今日测评数
    const today = new Date().toDateString();
    const todayCount = records.filter(r => new Date(r.createdAt).toDateString() === today).length;
    
    // 计算近 7 日测评趋势
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const count = records.filter(r => new Date(r.createdAt).toDateString() === dateStr).length;
      last7Days.push({
        date: date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
        count
      });
    }
    
    // 性别分布
    const boyCount = records.filter(r => r.gender === 'boy').length;
    const girlCount = records.filter(r => r.gender === 'girl').length;
    
    // 年龄分布
    const ageGroups = { '0-3 岁': 0, '4-6 岁': 0, '7-12 岁': 0, '13-18 岁': 0 };
    records.forEach(r => {
      if (r.age <= 3) ageGroups['0-3 岁']++;
      else if (r.age <= 6) ageGroups['4-6 岁']++;
      else if (r.age <= 12) ageGroups['7-12 岁']++;
      else ageGroups['13-18 岁']++;
    });
    
    // 百分位分布
    const percentileGroups = { 'P3 以下': 0, 'P3-P10': 0, 'P10-P25': 0, 'P25-P75': 0, 'P75-P90': 0, 'P90-P97': 0, 'P97 以上': 0 };
    records.forEach(r => {
      const p = r.percentile;
      if (p < 3) percentileGroups['P3 以下']++;
      else if (p < 10) percentileGroups['P3-P10']++;
      else if (p < 25) percentileGroups['P10-P25']++;
      else if (p < 75) percentileGroups['P25-P75']++;
      else if (p < 90) percentileGroups['P75-P90']++;
      else if (p < 97) percentileGroups['P90-P97']++;
      else percentileGroups['P97 以上']++;
    });
    
    return {
      totalUsers: users.length,
      totalRecords: records.length,
      todayCount,
      last7Days,
      genderDistribution: { boy: boyCount, girl: girlCount },
      ageDistribution: ageGroups,
      percentileDistribution: percentileGroups,
      analytics: db.tables.analytics
    };
  }

  // 记录访问
  recordVisit() {
    const db = this.get();
    db.tables.analytics.totalVisits = (db.tables.analytics.totalVisits || 0) + 1;
    this.save(db);
  }

  // ==================== 数据导出 ====================
  
  // 导出所有数据
  exportData() {
    const db = this.get();
    return {
      version: db.version,
      exportedAt: new Date().toISOString(),
      users: db.tables.users,
      records: db.tables.records,
      config: db.tables.config,
      analytics: db.tables.analytics
    };
  }

  // 导入数据
  importData(data) {
    try {
      const db = this.get();
      db.tables.users = data.users || [];
      db.tables.records = data.records || [];
      db.tables.config = { ...db.tables.config, ...data.config };
      db.tables.analytics = { ...db.tables.analytics, ...data.analytics };
      this.save(db);
      return true;
    } catch (e) {
      console.error('导入数据失败:', e);
      return false;
    }
  }

  // ==================== 数据清理 ====================
  
  // 清理过期数据
  cleanupExpiredData() {
    const db = this.get();
    const retentionDays = db.tables.config.dataRetention || 365;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    const beforeCount = db.tables.records.length;
    db.tables.records = db.tables.records.filter(r => new Date(r.createdAt) >= cutoffDate);
    const afterCount = db.tables.records.length;
    
    this.save(db);
    return {
      deleted: beforeCount - afterCount,
      remaining: afterCount
    };
  }

  // 重置数据库
  reset() {
    localStorage.removeItem(this.dbName);
    this.create();
    return true;
  }

  // ==================== 工具函数 ====================
  
  // 生成唯一 ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 获取数据库信息
  getInfo() {
    const db = this.get();
    return {
      name: this.dbName,
      version: db.version,
      createdAt: db.createdAt,
      updatedAt: db.updatedAt,
      users: db.tables.users.length,
      records: db.tables.records.length,
      size: localStorage.getItem(this.dbName).length
    };
  }
}

// 创建全局实例
const db = new HeightDB();

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HeightDB, db };
}
