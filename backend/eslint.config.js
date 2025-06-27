import { createNodeConfig } from '../eslint.base.config.mjs';

export default [
  ...createNodeConfig(),
  // Backend 特定的规则
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      // 可以在这里添加 backend 特有的规则
    },
  },
];
