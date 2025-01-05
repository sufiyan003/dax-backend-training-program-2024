import { Router } from 'express';
import { AccessController } from './access.controller';
// import validator from '../../shared/middleware/validateBody';
// import { signupSchema, userCredential } from "../../../utils/joi.schema";
// import { AccessController } from './access.controller';

export class AccessRoutes {

    readonly router: Router = Router();
    controller = new AccessController();

    constructor() {
        this.initRoutes();
    }

    initRoutes(): void {
        console.log("Access Routes initialized!");

        this.router.post(
            '/signup',
            this.controller.signup
            // validator(signupSchema),
        )

        this.router.post(
            '/signin',
            this.controller.signin
            // validator(userCredential),
            // this.controller.signin
        )

        this.router.post(
            '/sign-out',
            this.controller.signin
            // validator(userCredential),
            // this.controller.signin
        )

        // this.router.get(
        //     '/me',
        //     authentication,
        //     // authorization(["ADMIN", "COMPANY_ADMIN", "ADMIN", "MANAGER", "ADMIN"]),
        //     this.controller.getMe
        // )

        // this.router.post(
        //     '/user',
        //     authentication,
        //     // authorization(["COMPANY_ADMIN"]),
        //     // validator(employeeAddSchema),
        //     this.controller.addUser
        // )

        // this.router.get(
        //     '/users',
        //     // authentication,
        //     // authorization(["COMPANY_ADMIN", "ADMIN"]),
        //     this.controller.getUsers
        // )

        // // this.router.get(
        // //   '/email/verify',
        // //   // authentication,
        // //   // authorization(["COMPANY_ADMIN", "ADMIN"]),
        // //   this.controller.emailVerify
        // // )

        // // this.router.get(
        // //   '/teachers',
        // //   // authentication,
        // //   // authorization(["COMPANY_ADMIN", "ADMIN"]),
        // //   this.controller.getTeachers
        // // )

        // // this.router.get(
        // //   '/refer/list',
        // //   authentication,
        // //   this.controller.getReferUser
        // // )

        // this.router.put(
        //     '/users/:id',
        //     authentication,
        //     // authorization(["COMPANY_ADMIN", "ADMIN"]),
        //     // validator(employeeUpdateSchema),
        //     this.controller.updateUser
        // )

        // this.router.put(
        //     '/update/me',
        //     authentication,
        //     // authorization(["COMPANY_ADMIN", "ADMIN"]),
        //     // validator(employeeUpdateSchema),
        //     this.controller.updateMe
        // )

        // this.router.delete(
        //     '/users/:id',
        //     authentication,
        //     // authorization(["COMPANY_ADMIN", "ADMIN"]),
        //     this.controller.delete
        // )

        // // this.router.get(
        // //   '/email-verify',
        // //   this.controller.verifyEmail
        // // )

        // this.router.post(
        //     '/phone-verify',
        //     authentication,
        //     this.controller.verifyPhone
        // )

        // this.router.get(
        //     '/users/:id',
        //     authentication,
        //     authorization([RoleEnum.ADMIN]),
        //     this.controller.getUserById
        // )

        // this.router.get(
        //     '/email-verify',
        //     this.controller.verifyEmail
        // )

        // this.router.post(
        //     '/forgot-password',
        //     validator(schema.forgotPassword),
        //     this.controller.forgotPassword
        // )

        // this.router.post(
        //     '/reset-password',
        //     validator(schema.resetPassword),
        //     this.controller.resetPassword
        // )


        // // this.router.delete(
        // //   '/signout',
        // //   authentication,
        // //   this.controller.signout
        // // )

        // // this.router.post(
        // //   '/verify',
        // //   authentication,
        // //   this.controller.verify
        // // )

        // // this.router.post(
        // //   '/refresh',
        // //   authentication,
        // //   validator(refreshToken),
        // //   this.controller.refresh
        // // )

        // // this.router.post(
        // //   '/forgot-password',
        // //   // authentication,
        // //   // validator(refreshToken),
        // //   this.controller.forgotPassword
        // // )

        // this.router.post(
        //     '/password-otp',
        //     // authentication,
        //     // validator(refreshToken),
        //     this.controller.passwordOTPVerify
        // )

        // this.router.post(
        //     '/password-verify',
        //     validator(verifyPassword),
        //     this.controller.verifyPassword
        // )

    }

}