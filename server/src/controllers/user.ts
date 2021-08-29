import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

// model import

export const login = async (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Log in!' });
};

export const signup = async (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Sign up!' });
};
