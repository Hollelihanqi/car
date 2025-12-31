import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import json from '@eslint/json';
import VueEslintParser from 'vue-eslint-parser';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const autoImportPath = path.resolve(__dirname, 'src/typings/.eslintrc-auto-import.json');
// const autoImportConfig = JSON.parse(fs.readFileSync(autoImportPath, 'utf8'));

export default defineConfig([
  // 基础 JS 配置
  js.configs.recommended,

  // TypeScript 推荐配置（打平）
  ...tseslint.configs.recommended,

  // Vue 基础配置
  ...pluginVue.configs['flat/recommended'],

  // 全局浏览器环境
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // ...autoImportConfig.globals
      }
    }
  },

  // Vue 解析器（关键修复）
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: VueEslintParser, //不要全局配置 VueEslintParser ，否则会尝试解析非 Vue 文件
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        ecmaFeatures: { jsx: true }
      }
    }
  },

  // JSON 配置（使用官方 recommended）
  json.configs.recommended,

  // 自定义规则
  {
    rules: {
      // 基础规则
      'prettier/prettier': [
        'error',
        {
          printWidth: 120, // 每行最大长度为 120
          tabWidth: 2, // 缩进使用 2 个空格
          useTabs: false, // 使用空格而不是制表符
          singleQuote: true, // 使用单引号代替双引号
          jsxSingleQuote: false, // JSX 中使用双引号
          trailingComma: 'none', // 不使用尾随逗号
          jsxBracketSameLine: false, // JSX 标签的右括号另起一行
          htmlWhitespaceSensitivity: 'ignore' // 忽略 HTML 空格敏感性
        }
      ],
      "linebreak-style": ["off", "unix"],
      'no-var': 'error', // 禁止使用 var，强制使用 let 或 const
      'prefer-const': 'warn', // 建议使用 const 来声明不会被重新赋值的变量
      quotes: ['error', 'single', { avoidEscape: true }], // 强制使用单引号
      semi: ['error', 'always'], // 强制语句结尾使用分号
      'no-trailing-spaces': 'error', // 禁止行尾空格
      'no-multiple-empty-lines': ['warn', { max: 1 }], // 限制连续空行数量为 1
      'no-unexpected-multiline': 'error', // 防止多行表达式引起的错误
      'no-useless-escape': 'off', // 允许某些不必要的转义字符
      'no-undef': 'off', // 关闭对 TS 类型名的误报，由 TS 本身负责未定义标识符检查

      // TypeScript 相关规则
      '@typescript-eslint/no-unused-vars': 'error', // 禁止未使用的变量
      '@typescript-eslint/prefer-ts-expect-error': 'error', // 建议使用 @ts-expect-error 而不是 @ts-ignore
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
      '@typescript-eslint/no-non-null-assertion': 'off', // 允许使用非空断言操作符（!）
      '@typescript-eslint/no-namespace': 'off', // 允许使用自定义命名空间
      '@typescript-eslint/semi': 'off', // 关闭与 semi 规则冲突的规则
      '@typescript-eslint/no-unsafe-function-type': 'off', // 允许使用 Function 函数类型

      // Vue 相关规则
      'vue/html-indent': ['error', 2], // 强制模板缩进为 2 个空格
      'vue/max-attributes-per-line': ['warn', { singleline: 3 }], // 单行元素最多允许 3 个属性
      'vue/multi-word-component-names': 'off', // 允许单词组件名
      'vue/no-mutating-props': 'off', // 允许直接修改 props,（前提是 prop 是一个对象）
      'vue/attribute-hyphenation': 'off', // 允许在模板中使用驼峰命名的属性
      'vue/no-required-prop-with-default': 'off', // 允许为必需的 prop 提供默认值
      'vue/no-v-html': 'warn', // 允许使用 v-html 指令
      // indent, semi 已移除
      'no-unused-vars': 'off' // 关闭与 @typescript-eslint/no-unused-vars 冲突的规则
    }
  },

  // Prettier 集成
  eslintPluginPrettier,

  // 忽略
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '**/*.d.ts',
      'public/',
      '.vite/',
      '*.config.{js,ts}',
      'swagger/templates/',
      'typings/',
      'uniCloud-aliyun/'
    ]
  }
]);
