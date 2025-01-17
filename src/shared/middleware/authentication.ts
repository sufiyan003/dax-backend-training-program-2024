// import { Router, Request } from 'express';
// import { ProtectedRequest } from 'app-request';
// import UserRepo from '../Api/Components/access/user.repository';
// import { AuthFailureError, AccessTokenError, TokenExpiredError } from '../core/ApiError';
// import JWT from '../core/JWT';
// import KeystoreRepo from '../Api/Components/access/keystore.repository';
// import { getAccessToken, validateTokenData } from '../utils/authUtils';
// import validator, { ValidationSource } from '../helpers/validator';
// import { authBearerSchema } from '../utils/joi.schema';
// import asyncHandler from '../helpers/async';

import { NextFunction, Request, Response } from "express";
import { JwtService } from "../../app/rbac/jwt.service";
import { UserRepository } from "../../app/rbac/user.repository";

// const router = Router();

export const authentication = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        throw new Error("Your are not auth")
      }

      const bearerToken = req.headers.authorization.split('Bearer ')[1]
      const jwtPayload = await JwtService.validate(bearerToken);
      console.log({ jwtPayload });
      
      if (!jwtPayload) {
        throw new Error("Your are not auth")
      }
      
      const user = await new UserRepository().findById(jwtPayload.prm);

      if (!user) {
        throw new Error("Your are not auth, user not found!")
      }

      if (user.status === "block") {
        throw new Error("Your are not auth, you are blocked")
      }

    //   @ts-ignore
      req.userId = jwtPayload.prm;
    //   @ts-ignore
      req.user = user;
      
      next();
    } catch (error) {
      next(error)
    }
}

// export default router.use(
//   validator(authBearerSchema, ValidationSource.HEADER),
//   asyncHandler(async (req: any, res, next) => {
//     req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase
//     try {
//       const payload = await JWT.validate(req.accessToken);
//       validateTokenData(payload);

//       const user = await UserRepo.findById(payload.sub);
//       if (!user) throw new AuthFailureError('User not registered');
//       if (!user.isActive) throw new AuthFailureError('You have been blocked by admin');

//       req.user = user;

//       if(req.user && req.user.role.code === "SUPER_ADMIN"){
//         req.user.isAdmin = true;
//       }

//       else if(req.user && req.user.role.code === "VIRTUAL_ASSISTANT"){
//         req.user.isVA = true;
//       }

//       const keystore = await KeystoreRepo.findforKey(req.user.id, payload.prm);
//       if (!keystore) throw new AuthFailureError('Invalid access token');
//       req.keystore = keystore;

//       return next();
//     } catch (e) {
//       if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
//       throw e;
//     }
//   }),
// );

// // export const authentication = (router: Router, path: string, methods: [string]): void => {

// //   router.use(
// //     path,
// //     validator(authBearerSchema, ValidationSource.HEADER),
// //     asyncHandler(async (req: any, res, next) => {
// //       console.log(req.method, methods);
      
// //       req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase
// //       try {
// //         const payload = await JWT.validate(req.accessToken);
// //         validateTokenData(payload);

// //         const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
// //         if (!user) throw new AuthFailureError('User not registered');
// //         req.user = user;

// //         const keystore = await KeystoreRepo.findforKey(req.user._id, payload.prm);
// //         if (!keystore) throw new AuthFailureError('Invalid access token');
// //         req.keystore = keystore;

// //         return next();
// //       } catch (e) {
// //         if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
// //         throw e;
// //       }
// //     }),
// //   );

// // }