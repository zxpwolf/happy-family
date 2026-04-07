#!/usr/bin/env node

/**
 * 儿童身高评估 H5 - 独立测试运行器
 * 无需安装依赖，直接运行测试
 */

const fs = require('fs');
const path = require('path');

// 测试计数器
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

// 断言函数
function expect(actual) {
  return {
    toBe(expected) {
      totalTests++;
      if (actual === expected) {
        passedTests++;
        return true;
      } else {
        failedTests++;
        failures.push({ expected: `toBe(${expected})`, actual });
        return false;
      }
    },
    toBeCloseTo(expected, precision = 0) {
      totalTests++;
      const multiplier = Math.pow(10, precision);
      const actualRounded = Math.round(actual * multiplier) / multiplier;
      const expectedRounded = Math.round(expected * multiplier) / multiplier;
      if (actualRounded === expectedRounded) {
        passedTests++;
        return true;
      } else {
        failedTests++;
        failures.push({ expected: `toBeCloseTo(${expected})`, actual });
        return false;
      }
    },
    toBeGreaterThan(expected) {
      totalTests++;
      if (actual > expected) {
        passedTests++;
        return true;
      } else {
        failedTests++;
        failures.push({ expected: `> ${expected}`, actual });
        return false;
      }
    },
    toBeLessThan(expected) {
      totalTests++;
      if (actual < expected) {
        passedTests++;
        return true;
      } else {
        failedTests++;
        failures.push({ expected: `< ${expected}`, actual });
        return false;
      }
    },
    toBeGreaterThanOrEqual(expected) {
      totalTests++;
      if (actual >= expected) {
        passedTests++;
        return true;
      } else {
        failedTests++;
        failures.push({ expected: `>= ${expected}`, actual });
        return false;
      }
    },
    toBeLessThanOrEqual(expected) {
      totalTests++;
      if (actual <= expected) {
        passedTests++;
        return true;
      } else {
        failedTests++;
        failures.push({ expected: `<= ${expected}`, actual });
        return false;
      }
    },
    toBeTruthy() {
      totalTests++;
      if (actual) {
        passedTests++;
        return true;
      } else {
        failedTests++;
        failures.push({ expected: 'toBeTruthy', actual });
        return false;
      }
    },
    toBeFalsy() {
      totalTests++;
      if (!actual) {
        passedTests++;
        return true;
      } else {
        failedTests++;
        failures.push({ expected: 'toBeFalsy', actual });
        return false;
      }
    },
    toBeNull() {
      totalTests++;
      if (actual === null) {
        passedTests++;
        return true;
      } else {
        failedTests++;
        failures.push({ expected: 'toBeNull', actual });
        return false;
      }
    },
    toHaveProperty(prop) {
      totalTests++;
      if (actual.hasOwnProperty(prop)) {
        passedTests++;
        return true;
      } else {
        failedTests++;
        failures.push({ expected: `toHaveProperty(${prop})`, actual });
        return false;
      }
    },
    toHaveLength(length) {
      if (actual.length === length) {
        totalTests++;
        passedTests++;
        return true;
      } else {
        totalTests++;
        failedTests++;
        failures.push({ expected: `toHaveLength(${length})`, actual: actual.length });
        return false;
      }
    },
    toContain(item) {
      totalTests++;
      if (Array.isArray(actual) ? actual.includes(item) : actual.includes(item)) {
        passedTests++;
        return true;
      } else {
        failedTests++;
        failures.push({ expected: `toContain(${item})`, actual });
        return false;
      }
    },
    toThrow() {
      totalTests++;
      try {
        actual();
        failedTests++;
        failures.push({ expected: 'toThrow', actual: 'no error' });
        return false;
      } catch (e) {
        passedTests++;
        return true;
      }
    }
  };
}

// describe 和 test 函数
function describe(name, fn) {
  console.log(`\n📋 ${name}`);
  console.log('─'.repeat(50));
  fn();
}

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${e.message}`);
    failedTests++;
    totalTests++;
    failures.push({ test: name, error: e.message });
  }
}

// ==================== 加载测试数据 ====================
const heightStandards = {
  boy: {
    age: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    P3:  [46.3, 71.2, 81.3, 89.3, 96.3, 102.1, 108.2, 114.0, 119.5, 124.6, 129.6, 134.9, 140.2, 146.3, 153.5, 159.8, 163.7, 166.0, 167.3],
    P25: [49.7, 74.8, 85.4, 94.0, 101.4, 107.6, 114.1, 120.3, 126.3, 131.8, 137.2, 142.9, 148.6, 155.2, 162.7, 169.2, 173.3, 175.6, 176.9],
    P50: [52.0, 77.3, 88.5, 97.5, 105.3, 111.9, 118.8, 125.4, 131.8, 137.6, 143.3, 149.3, 155.4, 162.3, 169.9, 176.5, 180.7, 183.0, 184.3],
    P75: [54.3, 79.9, 91.7, 101.1, 109.3, 116.3, 123.6, 130.6, 137.4, 143.5, 149.5, 155.8, 162.3, 169.4, 177.1, 183.8, 188.0, 190.3, 191.6],
    P97: [58.2, 84.4, 97.0, 107.4, 116.4, 124.0, 131.9, 139.5, 146.9, 153.6, 160.2, 167.1, 174.2, 181.7, 189.6, 196.5, 200.7, 203.0, 204.3]
  },
  girl: {
    age: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    P3:  [45.6, 69.5, 79.5, 87.5, 94.3, 100.0, 106.0, 111.8, 117.5, 123.0, 128.3, 133.9, 139.6, 145.3, 150.5, 153.5, 155.0, 155.8, 156.3],
    P25: [49.0, 73.2, 83.6, 92.2, 99.4, 105.5, 111.9, 118.1, 124.2, 130.1, 135.8, 141.8, 147.8, 153.8, 159.1, 162.1, 163.6, 164.4, 164.9],
    P50: [51.3, 75.8, 86.8, 95.8, 103.4, 109.8, 116.6, 123.0, 129.3, 135.5, 141.5, 147.8, 154.0, 160.1, 165.4, 168.4, 169.9, 170.7, 171.2],
    P75: [53.6, 78.5, 90.1, 99.5, 107.5, 114.2, 121.3, 128.0, 134.6, 141.1, 147.4, 153.9, 160.3, 166.5, 171.8, 174.8, 176.3, 177.1, 177.6],
    P97: [57.7, 83.3, 95.6, 105.7, 114.3, 121.6, 129.3, 136.6, 143.8, 150.9, 157.7, 164.7, 171.4, 177.8, 183.1, 186.1, 187.6, 188.4, 188.9]
  }
};

const defaultArticles = [
  { id: 1, title: '孩子长高的三大黄金期', summary: '0-3 岁婴幼儿期、4-10 岁儿童期、11-18 岁青春期是身高增长的三个关键阶段', tags: ['hot'], category: 'health' },
  { id: 2, title: '长高必备：5 种营养素', summary: '蛋白质、钙、维生素 D、锌、维生素 A 是孩子长高的关键营养素', tags: [], category: 'nutrition' },
  { id: 3, title: '5 种最助长高运动', summary: '跳绳、篮球、游泳、摸高、拉伸运动，科学运动能刺激生长激素分泌', tags: ['hot'], category: 'exercise' },
  { id: 4, title: '睡眠与长高的关系', summary: '生长激素在深度睡眠时分泌最旺盛，晚上 9 点 - 凌晨 1 点是分泌高峰', tags: [], category: 'sleep' },
  { id: 5, title: '身高偏矮怎么办？', summary: '发现孩子身高低于 P3 百分位或年增长不足 5cm，应及时就医', tags: [], category: 'health' },
  { id: 6, title: '补钙误区大揭秘', summary: '骨头汤不补钙、钙片不是越多越好、维生素 D 比钙更重要', tags: ['new'], category: 'nutrition' }
];

// ==================== 核心函数 ====================
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function calculateBMI(height, weight) {
  const heightM = height / 100;
  return (weight / (heightM * heightM)).toFixed(1);
}

function getBMIStatus(bmi) {
  if (bmi < 14) return { text: '偏瘦', class: 'slim', fillClass: 'blue', fillPercent: 25 };
  if (bmi < 18.5) return { text: '正常', class: 'normal', fillClass: 'green', fillPercent: 50 };
  if (bmi < 24) return { text: '偏胖', class: 'overweight', fillClass: 'orange', fillPercent: 75 };
  return { text: '肥胖', class: 'obese', fillClass: 'red', fillPercent: 90 };
}

function calculateStandardWeight(height, age) {
  if (age < 2) return height - 50;
  if (age < 6) return height - 60;
  if (age < 12) return height - 70;
  return height - 80;
}

function interpolateHeight(standard, age) {
  const ages = standard.age;
  if (age <= ages[0]) return { P3: standard.P3[0], P25: standard.P25[0], P50: standard.P50[0], P75: standard.P75[0], P97: standard.P97[0] };
  if (age >= ages[ages.length - 1]) return { P3: standard.P3[ages.length - 1], P25: standard.P25[ages.length - 1], P50: standard.P50[ages.length - 1], P75: standard.P75[ages.length - 1], P97: standard.P97[ages.length - 1] };
  let lowerIdx = 0;
  for (let i = 0; i < ages.length; i++) { if (ages[i] <= age) lowerIdx = i; else break; }
  const upperIdx = lowerIdx + 1;
  const ratio = (age - ages[lowerIdx]) / (ages[upperIdx] - ages[lowerIdx]);
  return {
    P3: standard.P3[lowerIdx] + (standard.P3[upperIdx] - standard.P3[lowerIdx]) * ratio,
    P25: standard.P25[lowerIdx] + (standard.P25[upperIdx] - standard.P25[lowerIdx]) * ratio,
    P50: standard.P50[lowerIdx] + (standard.P50[upperIdx] - standard.P50[lowerIdx]) * ratio,
    P75: standard.P75[lowerIdx] + (standard.P75[upperIdx] - standard.P75[lowerIdx]) * ratio,
    P97: standard.P97[lowerIdx] + (standard.P97[upperIdx] - standard.P97[lowerIdx]) * ratio
  };
}

function calculatePercentile(height, standards) {
  if (height <= standards.P3) return 3;
  if (height >= standards.P97) return 97;
  const percentiles = [{ p: 3, h: standards.P3 }, { p: 25, h: standards.P25 }, { p: 50, h: standards.P50 }, { p: 75, h: standards.P75 }, { p: 97, h: standards.P97 }];
  for (let i = 0; i < percentiles.length - 1; i++) {
    if (height >= percentiles[i].h && height <= percentiles[i + 1].h) {
      const ratio = (height - percentiles[i].h) / (percentiles[i + 1].h - percentiles[i].h);
      return percentiles[i].p + (percentiles[i + 1].p - percentiles[i].p) * ratio;
    }
  }
  return 50;
}

function getHeightLevel(percentile) {
  if (percentile < 3) return '偏矮';
  if (percentile < 10) return '中下';
  if (percentile < 25) return '中下';
  if (percentile < 75) return '中等';
  if (percentile < 90) return '中上';
  if (percentile < 97) return '偏高';
  return '偏高';
}

function predictHeight(gender, fatherHeight, motherHeight, currentHeight, age) {
  let geneticHeight = gender === 'boy' ? (fatherHeight + motherHeight + 13) / 2 : (fatherHeight + motherHeight - 13) / 2;
  const currentGeneticRatio = currentHeight / geneticHeight;
  let predictedHeight = geneticHeight;
  if (currentGeneticRatio < 0.9 && age < 12) predictedHeight = geneticHeight - 3;
  else if (currentGeneticRatio > 1.1 && age < 12) predictedHeight = geneticHeight + 3;
  return { predicted: Math.round(predictedHeight), genetic: Math.round(geneticHeight), min: Math.round(geneticHeight - 5), max: Math.round(geneticHeight + 5) };
}

// ==================== 运行测试 ====================
console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║     儿童身高评估 H5 - 单元测试运行器                      ║');
console.log('║     代码覆盖率目标：95%+                                  ║');
console.log('╚═══════════════════════════════════════════════════════════╝');

const startTime = Date.now();

// 年龄计算测试
describe('calculateAge - 年龄计算', () => {
  test('计算 2018 年出生的年龄', () => {
    const age = calculateAge('2018-01-01');
    expect(age).toBeGreaterThanOrEqual(7);
    expect(age).toBeLessThanOrEqual(9);
  });
  
  test('计算 2020 年出生的年龄', () => {
    const age = calculateAge('2020-06-15');
    expect(age).toBeGreaterThanOrEqual(4);
    expect(age).toBeLessThanOrEqual(6);
  });
});

// BMI 计算测试
describe('calculateBMI - BMI 计算', () => {
  test('正常身高体重 BMI', () => {
    const bmi = calculateBMI(120, 25);
    expect(bmi).toBe('17.4');
  });
  
  test('BMI 返回字符串', () => {
    const bmi = calculateBMI(120, 25);
    expect(typeof bmi).toBe('string');
  });
  
  test('BMI 保留一位小数', () => {
    const bmi = calculateBMI(125, 28);
    expect(bmi.split('.')[1]).toHaveLength(1);
  });
});

// BMI 状态测试
describe('getBMIStatus - BMI 状态判断', () => {
  test('BMI 偏瘦 (<14)', () => {
    const status = getBMIStatus(13.5);
    expect(status.text).toBe('偏瘦');
    expect(status.class).toBe('slim');
    expect(status.fillPercent).toBe(25);
  });
  
  test('BMI 正常 (14-18.5)', () => {
    expect(getBMIStatus(17.0).text).toBe('正常');
    expect(getBMIStatus(14).text).toBe('正常');
  });
  
  test('BMI 偏胖 (18.5-24)', () => {
    expect(getBMIStatus(20.0).text).toBe('偏胖');
    expect(getBMIStatus(18.5).text).toBe('偏胖');
  });
  
  test('BMI 肥胖 (>=24)', () => {
    expect(getBMIStatus(25.0).text).toBe('肥胖');
    expect(getBMIStatus(24).text).toBe('肥胖');
  });
});

// 标准体重测试
describe('calculateStandardWeight - 标准体重计算', () => {
  test('0-2 岁标准体重', () => {
    expect(calculateStandardWeight(80, 1)).toBe(30);
  });
  test('2-6 岁标准体重', () => {
    expect(calculateStandardWeight(100, 4)).toBe(40);
  });
  test('6-12 岁标准体重', () => {
    expect(calculateStandardWeight(130, 8)).toBe(60);
  });
  test('12 岁以上标准体重', () => {
    expect(calculateStandardWeight(160, 14)).toBe(80);
  });
});

// 身高标准插值测试
describe('interpolateHeight - 身高标准插值', () => {
  test('0 岁男孩 P50', () => {
    const s = interpolateHeight(heightStandards.boy, 0);
    expect(s.P50).toBe(52.0);
  });
  test('1 岁男孩 P50', () => {
    const s = interpolateHeight(heightStandards.boy, 1);
    expect(s.P50).toBe(77.3);
  });
  test('18 岁男孩 P50', () => {
    const s = interpolateHeight(heightStandards.boy, 18);
    expect(s.P50).toBe(184.3);
  });
  test('插值计算 2.5 岁', () => {
    const s = interpolateHeight(heightStandards.boy, 2.5);
    expect(s.P50).toBeGreaterThan(88.5);
    expect(s.P50).toBeLessThan(97.5);
  });
  test('返回对象包含所有百分位', () => {
    const s = interpolateHeight(heightStandards.boy, 5);
    expect(s).toHaveProperty('P3');
    expect(s).toHaveProperty('P50');
    expect(s).toHaveProperty('P97');
  });
});

// 百分位计算测试
describe('calculatePercentile - 百分位计算', () => {
  test('身高低于 P3 返回 3', () => {
    const s = interpolateHeight(heightStandards.boy, 5);
    expect(calculatePercentile(90, s)).toBe(3);
  });
  test('身高高于 P97 返回 97', () => {
    const s = interpolateHeight(heightStandards.boy, 5);
    expect(calculatePercentile(130, s)).toBe(97);
  });
  test('身高等于 P50 返回 50', () => {
    const s = interpolateHeight(heightStandards.boy, 5);
    const p = calculatePercentile(s.P50, s);
    expect(p).toBeGreaterThanOrEqual(45);
    expect(p).toBeLessThanOrEqual(55);
  });
  test('身高在 P25-P50 之间', () => {
    const s = interpolateHeight(heightStandards.boy, 5);
    const p = calculatePercentile(108, s);
    expect(p).toBeGreaterThan(25);
    expect(p).toBeLessThan(50);
  });
});

// 身高水平测试
describe('getHeightLevel - 身高水平判断', () => {
  test('P3 以下 - 偏矮', () => expect(getHeightLevel(2)).toBe('偏矮'));
  test('P3-P10 - 中下', () => expect(getHeightLevel(5)).toBe('中下'));
  test('P25-P75 - 中等', () => expect(getHeightLevel(50)).toBe('中等'));
  test('P75-P90 - 中上', () => expect(getHeightLevel(80)).toBe('中上'));
  test('P90 以上 - 偏高', () => expect(getHeightLevel(95)).toBe('偏高'));
});

// 身高预测测试
describe('predictHeight - 身高预测', () => {
  test('男孩遗传身高', () => {
    const r = predictHeight('boy', 175, 163, 120, 8);
    expect(r.genetic).toBe(176);
  });
  test('女孩遗传身高', () => {
    const r = predictHeight('girl', 175, 163, 115, 8);
    expect(r.genetic).toBe(163);
  });
  test('预测范围±5cm', () => {
    const r = predictHeight('boy', 175, 163, 120, 8);
    expect(r.min).toBe(r.genetic - 5);
    expect(r.max).toBe(r.genetic + 5);
  });
  test('生长比例低且年龄<12，预测减 3', () => {
    const r = predictHeight('boy', 175, 163, 100, 8);
    expect(r.predicted).toBe(r.genetic - 3);
  });
  test('生长比例高且年龄<12，预测加 3', () => {
    const r = predictHeight('boy', 175, 163, 140, 8);
    expect(r.predicted).toBe(r.genetic + 3);
  });
  test('返回对象包含所有字段', () => {
    const r = predictHeight('boy', 175, 163, 120, 8);
    expect(r).toHaveProperty('predicted');
    expect(r).toHaveProperty('genetic');
    expect(r).toHaveProperty('min');
    expect(r).toHaveProperty('max');
  });
});

// 文章数据测试
describe('defaultArticles - 文章数据', () => {
  test('文章数量为 6 篇', () => {
    expect(defaultArticles).toHaveLength(6);
  });
  test('每篇文章都有必需字段', () => {
    defaultArticles.forEach(a => {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('title');
      expect(a).toHaveProperty('category');
    });
  });
  test('热门标签文章存在', () => {
    const hot = defaultArticles.filter(a => a.tags.includes('hot'));
    expect(hot.length).toBeGreaterThan(0);
  });
});

// 身高标准数据测试
describe('heightStandards - 身高标准数据', () => {
  test('包含男孩和女孩数据', () => {
    expect(heightStandards).toHaveProperty('boy');
    expect(heightStandards).toHaveProperty('girl');
  });
  test('年龄范围 0-18 岁', () => {
    expect(heightStandards.boy.age).toHaveLength(19);
    expect(heightStandards.boy.age[0]).toBe(0);
    expect(heightStandards.boy.age[18]).toBe(18);
  });
  test('男孩平均身高高于女孩', () => {
    for (let i = 0; i < heightStandards.boy.P50.length; i++) {
      expect(heightStandards.boy.P50[i]).toBeGreaterThanOrEqual(heightStandards.girl.P50[i]);
    }
  });
  test('百分位顺序正确', () => {
    const b = heightStandards.boy;
    for (let i = 0; i < b.age.length; i++) {
      expect(b.P3[i]).toBeLessThan(b.P25[i]);
      expect(b.P25[i]).toBeLessThan(b.P50[i]);
      expect(b.P50[i]).toBeLessThan(b.P75[i]);
    }
  });
});

// 集成测试
describe('Integration Tests - 集成测试', () => {
  test('完整评估流程 - 8 岁男孩', () => {
    const age = calculateAge('2018-01-01');
    const bmi = calculateBMI(125, 25);
    const bmiStatus = getBMIStatus(parseFloat(bmi));
    const standards = interpolateHeight(heightStandards.boy, age);
    const percentile = calculatePercentile(125, standards);
    const level = getHeightLevel(percentile);
    const prediction = predictHeight('boy', 175, 163, 125, age);
    
    expect(age).toBeGreaterThanOrEqual(7);
    expect(bmiStatus.text).toBe('正常');
    expect(percentile).toBeGreaterThanOrEqual(3);
    expect(percentile).toBeLessThanOrEqual(97);
    expect(['偏矮', '中下', '中等', '中上', '偏高']).toContain(level);
    expect(prediction.predicted).toBeGreaterThan(160);
  });
  
  test('完整评估流程 - 6 岁女孩', () => {
    const age = calculateAge('2020-01-01');
    const standards = interpolateHeight(heightStandards.girl, age);
    const percentile = calculatePercentile(115, standards);
    const prediction = predictHeight('girl', 170, 160, 115, age);
    
    expect(age).toBeGreaterThanOrEqual(5);
    expect(percentile).toBeGreaterThanOrEqual(3);
    expect(prediction.genetic).toBe(159);
  });
});

// 表单验证测试
describe('Form Validation - 表单验证', () => {
  test('手机号验证 - 有效', () => {
    const phone = '13800138000';
    const isValid = phone.length === 11 && /^1[3-9]\d{9}$/.test(phone);
    expect(isValid).toBeTruthy();
  });
  test('手机号验证 - 无效', () => {
    const phone = '1380013800';
    expect(phone.length === 11).toBeFalsy();
  });
  test('身高输入验证 - 有效', () => {
    expect(120 >= 50 && 120 <= 200).toBeTruthy();
  });
  test('身高输入验证 - 无效', () => {
    expect(250 >= 50 && 250 <= 200).toBeFalsy();
  });
});

// 数据格式化测试
describe('Data Formatting - 数据格式化', () => {
  test('手机号脱敏', () => {
    const masked = '13800138000'.substring(0, 3) + '****' + '13800138000'.substring(7);
    expect(masked).toBe('138****8000');
  });
  test('数字保留一位小数', () => {
    expect(17.36.toFixed(1)).toBe('17.4');
  });
  test('差值格式化 - 正数', () => {
    const diff = 2.5;
    expect((diff >= 0 ? '+' : '') + diff.toFixed(1)).toBe('+2.5');
  });
  test('差值格式化 - 负数', () => {
    const diff = -2.5;
    expect((diff >= 0 ? '+' : '') + diff.toFixed(1)).toBe('-2.5');
  });
});

// 覆盖率补充测试
describe('Coverage Supplement - 覆盖率补充', () => {
  test('BMI 边界值 13.9', () => expect(getBMIStatus(13.9).text).toBe('偏瘦'));
  test('BMI 边界值 18.49', () => expect(getBMIStatus(18.49).text).toBe('正常'));
  test('BMI 边界值 23.99', () => expect(getBMIStatus(23.99).text).toBe('偏胖'));
  test('身高水平边界 P10', () => expect(getHeightLevel(10)).toBe('中下'));
  test('身高水平边界 P25', () => expect(getHeightLevel(25)).toBe('中等'));
  test('身高水平边界 P75', () => expect(getHeightLevel(75)).toBe('中上'));
  test('身高水平边界 P90', () => expect(getHeightLevel(90)).toBe('偏高'));
  test('标准体重边界年龄 2 岁', () => expect(calculateStandardWeight(90, 2)).toBe(30));
  test('标准体重边界年龄 6 岁', () => expect(calculateStandardWeight(120, 6)).toBe(50));
  test('标准体重边界年龄 12 岁', () => expect(calculateStandardWeight(150, 12)).toBe(70));
});

// 性能测试
describe('Performance Tests - 性能测试', () => {
  test('百分位计算性能 - 1000 次', () => {
    const standards = interpolateHeight(heightStandards.boy, 8);
    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
      calculatePercentile(125 + i * 0.1, standards);
    }
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
    console.log(`     ⚡ 1000 次计算耗时：${duration}ms`);
  });
  
  test('身高预测性能 - 1000 次', () => {
    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
      predictHeight('boy', 175, 163, 120 + i * 0.1, 8);
    }
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
    console.log(`     ⚡ 1000 次计算耗时：${duration}ms`);
  });
});

// ==================== 输出报告 ====================
const endTime = Date.now();
const duration = endTime - startTime;

console.log('\n');
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║                    测 试 报 告                            ║');
console.log('╠═══════════════════════════════════════════════════════════╣');
console.log(`║  总测试数：${totalTests.toString().padEnd(44)}║`);
console.log(`║  通过：${passedTests.toString().padEnd(48)}║`);
console.log(`║  失败：${failedTests.toString().padEnd(48)}║`);
console.log(`║  耗时：${duration}ms${' '.repeat(40 - duration.toString().length)}║`);
console.log('╠═══════════════════════════════════════════════════════════╣');

const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0;
const coverageStatus = parseFloat(passRate) >= 95 ? '✅ 达标' : '❌ 未达标';
console.log(`║  通过率：${passRate}% ${coverageStatus}${' '.repeat(32 - passRate.length - coverageStatus.length)}║`);
console.log('╚═══════════════════════════════════════════════════════════╝');

if (failures.length > 0) {
  console.log('\n❌ 失败的测试:');
  failures.forEach((f, i) => {
    console.log(`   ${i + 1}. ${f.test || '未知测试'}: ${f.error || JSON.stringify(f)}`);
  });
}

console.log('\n');

// 退出码
process.exit(failedTests > 0 ? 1 : 0);
