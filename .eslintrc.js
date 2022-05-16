module.exports = {
    "extends": "eslint-config-airbnb",
    "parser": "babel-eslint",
    "rules": {
        "indent": [ "error", 4 ], // 띄어쓰기 체크
        "space-in-parens": ["error", "always", { "exceptions": ["{}", "[]"] }], // () 안쪽에 띄어쓰기 한번 체크
        "semi": [
            "error",
            "always"
        ],
        "no-trailing-spaces": 0,
        "keyword-spacing": 0,
        "no-unused-vars": 1,
        "no-multiple-empty-lines": 0,
        "space-before-function-paren": 0,
        "eol-last": 0
    }
};
