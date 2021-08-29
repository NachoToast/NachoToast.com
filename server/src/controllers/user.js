"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.login = void 0;
// model import
const login = async (req, res) => {
    return res.status(200).json({ message: 'Log in!' });
};
exports.login = login;
const signup = async (req, res) => {
    return res.status(200).json({ message: 'Sign up!' });
};
exports.signup = signup;
