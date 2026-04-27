import { Router, type Request, type Response, type NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import { type IExtendedRequest } from '../../../interfaces/index';

const router = Router();

router.post('/sign-up', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    req.log?.info("User signed up");

    res.status(201).json("You signed up successfuly");
});

router.post('/sign-in', 
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
    passport.authenticate('local'),
    (req: IExtendedRequest, res: Response, next: NextFunction) => {
        req.log?.info("User sing in");

        const result = validationResult(req);

        if(!result.isEmpty()) {
            return next({errors: result.array()});
        }

        res.status(200).json("You singed in successfuly");
});

router.post('/sign-out', (req: IExtendedRequest, res: Response, next: NextFunction) => {
    req.log?.info("User sing out");

    res.status(200).json("You singed out successfuly");
});

const isAuthenticated = (req: any, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

router.get('/protected', isAuthenticated, (req: IExtendedRequest, res: Response) => {
  res.status(200).json({ 
    message: "This is a protected route", 
    user: req.user 
  });
});

export { router }