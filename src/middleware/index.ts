import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator";


export const handleInputErrors = (req: Request, resp: Response, next: NextFunction) => {
    
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        resp.status(400).json({ errors: errors.array() });
    }

    next()
}