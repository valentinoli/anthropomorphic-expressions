module.exports = {
  root: true,
  env: {
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 2022
  },
  extends: [
    'standard',
    'plugin:vue/vue3-recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off'
  },
  globals: {
    affdex: 'readonly'
  }
}
