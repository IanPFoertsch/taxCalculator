module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jasmine": true
  },
  "plugins": ["jasmine"],
  "extends": ["eslint:recommended", "plugin:jasmine/recommended"],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "warn",
      "single"
    ],
    "semi": [
      "warn",
      "never"
    ],
    "no-unused-vars": [
      "warn"
    ],
    "jasmine/no-focused-tests": 0,
    "jasmine/new-line-before-expect": 0
  },
  globals: {
    "_": true,
    "Adapters": true,
    "Calculator": true,
    "Constants": true,
    "Models": true,
    "Services": true
  }
};
