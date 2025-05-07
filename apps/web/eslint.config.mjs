// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**'],
  files: ['**/*.vue', '**/*.ts'],
  // 前端特定的规则
  rules: {
    'vue/html-self-closing': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
});
