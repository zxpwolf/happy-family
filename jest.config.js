/**
 * Jest 配置文件
 * 用于儿童身高评估 H5 页面单元测试
 */
module.exports = {
  // 测试环境
  testEnvironment: 'jsdom',
  
  // 覆盖率配置
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
  
  // 覆盖率阈值 - 要求 95% 以上
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  
  // 测试文件匹配
  testMatch: [
    '**/*.test.js',
    '**/*.spec.js'
  ],
  
  // 排除目录
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/'
  ],
  
  // 覆盖率排除
  collectCoverageFrom: [
    '**/*.js',
    '!node_modules/**',
    '!coverage/**',
    '!**/*.test.js',
    '!**/*.config.js'
  ],
  
  // 详细输出
  verbose: true,
  
  // 显示覆盖率
  collectCoverage: true,
  
  // 超时时间
  testTimeout: 10000,
  
  // 模拟实现
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
