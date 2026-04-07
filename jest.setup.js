/**
 * Jest 测试设置文件
 * 配置测试环境和全局变量
 */

// 全局测试超时
jest.setTimeout(10000);

// 模拟 localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (i) => Object.keys(store)[i]
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// 模拟 performance API
if (!global.performance) {
  global.performance = {
    now: () => Date.now()
  };
}

// 模拟 URLSearchParams
global.URLSearchParams = class URLSearchParams {
  constructor(init) {
    this.params = new Map();
    if (init && init.startsWith('?')) {
      init = init.substring(1);
    }
    if (init) {
      init.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) this.params.set(key, value || '');
      });
    }
  }
  get(name) {
    return this.params.get(name) || null;
  }
};

// 模拟 navigator.share
if (!global.navigator) {
  global.navigator = {};
}
global.navigator.share = jest.fn(() => Promise.resolve());
global.navigator.clipboard = {
  writeText: jest.fn(() => Promise.resolve())
};

// 清除每次测试前的 localStorage
beforeEach(() => {
  localStorage.clear();
});

// 控制台输出优化
console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();
