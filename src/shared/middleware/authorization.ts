import { NextFunction, Request } from "express";

export const authorization = (requiredRoles: string[]) => {
    return (req: Request, next: NextFunction) => {
        try {
            //   @ts-ignore
            const user = req.user;

            if (!user) {
                throw new Error("Not authenticated");
            }

            if (!requiredRoles.includes(user.role)) {
                throw new Error("Not authorized");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};