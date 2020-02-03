module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'lines-between-class-members': 'off',
    'class-methods-use-this': 'off',
    'func-names': 'off',
  },
};
