import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
    // Example validation logic
    if (!req.body || !req.body.someRequiredField) {
        res.status(400).json({ error: 'Missing required field' });
        return;
    }
    next();
};