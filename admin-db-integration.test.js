/**
 * Admin.html 与数据库集成测试
 */

// 模拟浏览器环境
global.window = { navigator: { userAgent: 'Node.js Test' }, addEventListener: () => {} };
global.navigator = { userAgent: 'Node.js Test' };
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = v.toString(); },
  removeItem(k) { delete this.store[k]; },
  clear() { this.store = {}; }
};
global.document = {
  getElementById: () => ({ innerHTML: '', textContent: '', style: {}, value: '', addEventListener: () => {} }),
  addEventListener: () => {}
};
global.Chart = class Chart { constructor() {} destroy() {} };

// 加载数据库模块
const fs = require('fs');
const path = require('path');
const dbCode = fs.readFileSync(path.join(__dirname, 'db.js'), 'utf-8');
const modifiedDbCode = dbCode.replace(
  "if (typeof module !== 'undefined' && module.exports)",
  "if (false)"
) + "\nglobal.db = db;";
eval(modifiedDbCode);

// 测试计数器
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function expect(actual) {
  return {
    toBe(expected) {
      totalTests++;
      if (actual === expected) { passedTests++; console.log(`  ✅ ${actual}`); return true; }
      else { failedTests++; console.log(`  ❌ 期望 ${expected}, 实际 ${actual}`); return false; }
    },
    toBeGreaterThan(expected) {
      totalTests++;
      if (actual > expected) { passedTests++; console.log(`  ✅ > ${expected}`); return true; }
      else { failedTests++; return false; }
    },
    toHaveProperty(prop) {
      totalTests++;
      if (actual && actual.hasOwnProperty(prop)) { passedTests++; console.log(`  ✅ has ${prop}`); return true; }
      else { failedTests++; console.log(`  ❌ 缺少 ${prop}`); return false; }
    },
    toBeTruthy() {
      totalTests++;
      if (actual) { passedTests++; return true; }
      else { failedTests++; return false; }
    }
  };
}

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║  Admin.html - 数据库集成测试                               ║');
console.log('╚═══════════════════════════════════════════════════════════╝');

console.log('\n📋 数据库初始化测试');
console.log('─'.repeat(50));
expect(db.exists()).toBeTruthy();
expect(db.getInfo().version).toBe('1.0.0');

console.log('\n📋 用户管理集成测试');
console.log('─'.repeat(50));
const user = db.upsertUser({ phone: '13800138000', name: '管理员' });
expect(user).toHaveProperty('id');
expect(user.phone).toBe('13800138000');

console.log('\n📋 测评记录集成测试');
console.log('─'.repeat(50));
const record = db.saveRecord({
  userPhone: '13800138000',
  childName: '小明',
  gender: 'boy',
  age: 8,
  height: 125,
  percentile: 65
});
expect(record).toHaveProperty('id');
expect(record.childName).toBe('小明');

console.log('\n📋 统计分析集成测试');
console.log('─'.repeat(50));
const analytics = db.getAnalytics();
expect(analytics).toHaveProperty('totalUsers');
expect(analytics).toHaveProperty('totalRecords');
expect(analytics).toHaveProperty('todayCount');
expect(analytics.totalRecords).toBeGreaterThan(0);

console.log('\n📋 数据导出集成测试');
console.log('─'.repeat(50));
const exported = db.exportData();
expect(exported).toHaveProperty('version');
expect(exported).toHaveProperty('users');
expect(exported).toHaveProperty('records');

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║                    测 试 报 告                            ║');
console.log('╠═══════════════════════════════════════════════════════════╣');
console.log(`║  总测试数：${totalTests.toString().padEnd(44)}║`);
console.log(`║  通过：${passedTests.toString().padEnd(48)}║`);
console.log(`║  失败：${failedTests.toString().padEnd(48)}║`);
console.log('╠═══════════════════════════════════════════════════════════╣');
const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0;
console.log(`║  通过率：${passRate}% ${parseFloat(passRate) >= 95 ? '✅ 达标' : '❌ 未达标'}${' '.repeat(32 - passRate.length)}║`);
console.log('╚═══════════════════════════════════════════════════════════╝\n');

process.exit(failedTests > 0 ? 1 : 0);
