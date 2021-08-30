import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import User from '../models/user';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        // content validation
        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).json({
                message: `Invalid content type, expected application/json but got ${req.headers['content-type'] ?? 'none'}`,
            });
        }

        return res.status(200).json({ message: 'Log in!' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong.' });
    }
};

const validUsername = new RegExp(/^[a-zA-Z0-9_]+$/);
const validEmail = new RegExp(/^\S+@\S+\.\S+$/);

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, password, passwordConfirm, email, submitting } = req.body;

        // content validation
        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).json({
                message: `Invalid content type, expected application/json but got ${req.headers['content-type'] ?? 'none'}`,
            });
        }

        // username validation
        if (username === undefined) return res.status(400).json({ message: 'No username specified.' });
        if (typeof username !== 'string') return res.status(400).json({ message: 'Username must be a string.' });
        if (username.length < 3) return res.status(400).json({ message: 'Username too short!' });
        if (username.length > 20) return res.status(400).json({ message: 'Username too long!' });
        if (!validUsername.test(username)) return res.status(400).json({ message: 'Invalid username!' });
        const existingUsername = await User.findOne({ usernameLower: username.toLowerCase() });
        if (existingUsername) return res.status(400).json({ message: 'Username taken!' });

        // email validation
        if (email === undefined) return res.status(400).json({ message: 'No email specified.' });
        if (typeof email !== 'string') return res.status(400).json({ message: 'Email must be a string.' });
        if (email.length > 255) return res.status(400).json({ message: 'Email too long!' });
        if (!validEmail.test(email)) return res.status(400).json({ message: 'Invalid email!' });
        const existingEmail = await User.findOne({ emailLower: email.toLowerCase() });
        if (existingEmail) return res.status(400).json({ message: 'email taken!' });

        // password validation
        if (password === undefined) return res.status(400).json({ message: 'No password specified.' });
        if (typeof password !== 'string') return res.status(400).json({ message: 'Password must be a string.' });
        if (password.length < 8) return res.status(400).json({ message: 'Password too short!' });
        if (password.length > 255) return res.status(400).json({ message: 'Password too long!' });
        if (password !== passwordConfirm) return res.status(400).json({ message: "Password's don't match!" });

        // actually submitting or just getting feedback?
        if (submitting === undefined || submitting !== true) return res.status(200).json({ message: 'Looks good!' });

        // password hashing
        const hashedPassword = await bcrypt.hash(password, 12);

        // user creation
        const now = new Date().toISOString();
        const newUser: any = await User.create({
            username,
            usernameLower: username.toLowerCase(),
            password: hashedPassword,
            email,
            emailLower: email.toLowerCase(),
            registered: now,
            lastOnline: now,
        });

        const token = jwt.sign(
            {
                email: newUser.email,
                id: newUser._id,
            },
            'test',
            { expiresIn: '1h' }
        );

        return res.status(201).json({ newUser, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong.' });
    }
};
