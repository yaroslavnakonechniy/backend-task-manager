import { Router, type Response, type NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { type IExtendedRequest } from '../../../interfaces/index';

const router = Router();

router.post('/sing-up', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    req.log?.info("User signed up");

    res.status(201).json("You signed up successfuly");
});

router.post('/sing-in', 
    [
        body('email')
        .notEmpty()
        .withMessage('Email is required')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address'),
        body('password')
        .notEmpty()
        .withMessage('Password is required')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
    ],
    (req: IExtendedRequest, res: Response, next: NextFunction) => {
        req.log?.info("User sing in");

        const result = validationResult(req);

        if(!result.isEmpty()) {
            return next({errors: result.array()});
        }

        res.status(200).json("You singed in successfuly");
});

router.post('/sing-out', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    req.log?.info("User sing out");

    res.status(200).json("You singed out successfuly");
});

export { router }