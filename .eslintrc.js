module.exports = {
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
  ],
  env: {
    jest: true,
    node: true,
    browser: true,
  },
  parser: 'babel-eslint',
  rules: {
    'quote-props': ['error', 'consistent-as-needed']
  }
};
