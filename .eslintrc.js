module.exports = {
  extends: [
    'airbnb-base',
  ],
  env: {
    jest: true,
    node: true,
    browser: true,
  },
  parser: 'babel-eslint',
  rules: {
    'quote-props': ['error', 'consistent-as-needed'],
    'comma-dangle': ['error', 'always-multiline'],
    'function-paren-newline': ['error', 'consistent']
  },
  settings: {
    'import/resolver': {
      webpack: {
        'config': 'webpack.common.js'
      },
    },
  },
};
