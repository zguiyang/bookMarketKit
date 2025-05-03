// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ["**/*.vue", "**/*.ts"],
  rules: {
    "vue/html-self-closing": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": 'off',
  },
})
