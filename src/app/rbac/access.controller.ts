import { Response, Request, NextFunction } from "express"
// import { Types } from 'mongoose';
// import crypto from 'crypto';
import asyncHandler from "../../../helpers/async";
import UserRepo from './user.repository';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import { generateTokenKey } from "../../../helpers/tokenKeyGenerator";
import { generateOTP } from "../../../helpers/otpGenerate";
import User from './User';
import Role from '../roles/Role';
import { SuccessResponse, SuccessMsgResponse, TokenRefreshResponse } from '../../../core/ApiResponse';
import _ from 'lodash';
import { createTokens, getAccessToken, validateTokenData } from '../../../utils/authUtils';
import KeystoreRepo from './keystore.repository';
import { TokenService } from '../token/token.service'
import Token from '../token/Token'
import { comparePassword } from "../../../utils/password";
// import { AccessService } from './access.service'
import { generateCode } from '../../../helpers/generate';
// import { sendMail } from "../../../utils/email";
// import JWT from '../../../core/JWT';
// import { validateTokenData, createTokens, getAccessToken } from '../../../utils/authUtils';

export class AccessController {

    private tokenService: TokenService = new TokenService()
    // readonly service: AccessService = new AccessService()



    signup = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
            const user = await UserRepo.findByEmail(req.body.email);
            if (user) throw new BadRequestError('User already registered');
            // if (user && user.email) throw new BadRequestError('User already registered');

            const accessTokenKey = generateTokenKey();
            const refreshTokenKey = generateTokenKey();

            const { user: createdUser, keystore } = await UserRepo.create(
                req.body as User,
                accessTokenKey,
                refreshTokenKey,
                "USER",
            );
            if (!createdUser) throw new BadRequestError('User creation field!');
            const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);

            const { token } = await this.tokenService.createToken({
                shot_code: generateOTP(),
                token: generateTokenKey(),
                type: 'PHONE_VERIFY',
                userId: createdUser.id,
                expireAt: new Date()
            } as Token)

            // if (createdUser && createdUser.phone) {
            //   // @ts-ignore
            //   console.log({ to: createdUser.phone, text: token?.shot_code });
            // }

            // let link = `http://52.192.208.76/api/v1/auth/email-verify?token=${token?.token}&user=${token?.userId}`
            // if (createdUser && createdUser.email) {
            //   // @ts-ignore
            //   sendMail({ to: createdUser.email, text: link })
            // }

            console.log("Token: ", token)
            new SuccessResponse('Signup Successful', {
                user: _.pick(createdUser, ['id', 'first_name', 'last_name', 'email', 'phone_status', 'role', 'profilePicUrl', 'gender']),
                tokens,
                token,
            }).send(res);
        }
    )

    // signupDriver = asyncHandler(
    //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
    //     const user = await UserRepo.findByEmail(req.body.email);
    //     if (user) throw new BadRequestError('User already registered');
    //     // if (user && user.email) throw new BadRequestError('User already registered');

    //     const accessTokenKey = generateTokenKey();
    //     const refreshTokenKey = generateTokenKey();

    //     req.body.referCode = await generateCode(5, 0, 70, '')

    //     const { user: createdUser, keystore } = await UserRepo.create(
    //       req.body as User,
    //       accessTokenKey,
    //       refreshTokenKey,
    //       "DRIVER",
    //     );

    //     if (!createdUser) throw new BadRequestError('User creation field!');
    //     const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);

    //     const { token } = await this.tokenService.createToken({
    //       shot_code: generateOTP(),
    //       token: generateTokenKey(),
    //       type: 'PHONE_VERIFY',
    //       userId: createdUser.id,
    //       expireAt: new Date()
    //     } as Token)

    //     // let link = `http://52.192.208.76/api/v1/auth/email-verify?token=${token?.token}&user=${token?.userId}`
    //     // if (createdUser && createdUser.email) {
    //     //   // @ts-ignore
    //     //   sendMail({ to: createdUser.email, text: link })
    //     // }
    //     console.log("Token: ", token)
    //     new SuccessResponse('Signup Successful', {
    //       user: _.pick(createdUser, ['id', 'first_name', 'last_name', 'email', 'phone_status', 'role', 'profilePicUrl', 'gender']),
    //       tokens,
    //       token
    //     }).send(res);
    //   }
    // )

    signin = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

            const user = await UserRepo.findByEmail(req.body.email);
            console.log('====================================');
            console.log(user);
            console.log('====================================');
            if (!user) throw new BadRequestError('Invalid credentials');
            if (!user.password) throw new BadRequestError('Credential not set');
            if (!user.status) throw new BadRequestError('User InActive');

            if (user.phone_status !== "VERIFIED") {
                const { token } = await this.tokenService.createToken({
                    shot_code: generateOTP(),
                    token: generateTokenKey(),
                    type: 'PHONE_VERIFY',
                    userId: user.id,
                    expireAt: new Date()
                } as Token)

                // let link = `http://localhost:8001/api/v1/auth/email-verify?token=${token?.token}&user=${token?.userId}`
                // if (user && user.email) {
                //   // @ts-ignore
                //   sendMail({ to: user.email, text: link, subject: "Email Verification" })
                // }
                console.log("Signin OTP: ", token)
                throw new BadRequestError('please verify your phone!');
            }

            comparePassword(req.body.password, user.password)

            const accessTokenKey = generateTokenKey();
            const refreshTokenKey = generateTokenKey();

            await KeystoreRepo.create(user.id, accessTokenKey, refreshTokenKey);

            const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

            new SuccessResponse('Login Success', {
                user: _.pick(user, ['id', 'first_name', 'last_name', 'email', 'profile_picture', 'role', 'phone_status', 'profilePicUrl', 'gender']),
                tokens: tokens,
            }).send(res);

        }
    )


    getMe = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

            const user = await UserRepo.findById(req.user.id);
            new SuccessResponse('fetch success', { user }).send(res);

        }
    )

    getUserById = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

            const user = await UserRepo.findById(req.params.id);
            new SuccessResponse('fetch success', { user }).send(res);

        }
    )

    addUser = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
            const user = await UserRepo.findByEmail(req.body.email);
            if (user) throw new BadRequestError('User already registered');

            const { user: createdUser } = await UserRepo.createUser({
                ...req.body,
                // companyId: req.company.id,
                phone_status: "PENDING"
            });
            new SuccessResponse('fetch success', { user: createdUser }).send(res);

        }
    )

    getUsers = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
            const users = await UserRepo.findUsers();
            new SuccessResponse('fetch success', { users }).send(res);
        }
    )

    // getTeachers = asyncHandler(
    //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
    //     const users = await UserRepo.findTeachers();
    //     new SuccessResponse('fetch success', { users }).send(res);
    //   }
    // )

    updateUser = asyncHandler(
        async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
            const { body, params } = req;
            const user = await UserRepo.update(params.id, body);
            new SuccessResponse('update success', { user }).send(res);
        }
    )

    updateMe = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
            const { body } = req;
            const users = req.user.id;
            const user = await UserRepo.update(users, body);
            new SuccessResponse('update success', { user }).send(res);
        }
    )

    delete = asyncHandler(
        async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
            const { params } = req;
            const user = await UserRepo.delete(params.id);
            new SuccessResponse('delete success', { user }).send(res);
        }
    )

    // verifyEmail = asyncHandler(
    //   async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    //     const { token, otp, user } = req.query;

    //     if (!_.isString(user) || !Boolean(_.isString(token) || _.isString(otp))) throw new BadRequestError('Invalid Request')
    //     //@ts-ignore
    //     const tokenfound = await this.tokenService.findForEmailVerification({ token, otp, user })
    //     if (!tokenfound) throw new BadRequestError('Token Expire') //  || tokenfound.expireAt < new Date()

    //     await UserRepo.update(user, { phone_status: "VERIFIED" } as User);
    //     // res.redirect('https://elect.com/')
    //   }
    // )

    verifyPhone = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
            const user = req.user.id;
            const { otp } = req.body;
            req.accessToken = getAccessToken(req.headers.authorization);

            if (!_.isString(user) || !_.isString(otp)) throw new BadRequestError('Invalid Request')
            //@ts-ignore
            const otpfound = await this.tokenService.findForPhoneVerification({ otp, user })
            if (!otpfound) throw new BadRequestError('OTP Expire') //  || tokenfound.expireAt < new Date()

            const accessTokenKey = generateTokenKey();
            const refreshTokenKey = generateTokenKey();

            const userData = await UserRepo.update(user, { phone_status: "VERIFIED" } as User);
            await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
            // @ts-ignore
            const tokens = await createTokens(userData, accessTokenKey, refreshTokenKey);
            new SuccessResponse('otp success', {
                user: _.pick(userData, ['id', 'first_name', 'last_name', 'email', 'phone_status', 'profile_picture', 'role', 'profilePicUrl', 'gender']),
                tokens: tokens
            }).send(res);
            // res.redirect('https://elect.com/')
        }
    )

    // signout = asyncHandler(
    //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
    //     await KeystoreRepo.remove(req.keystore._id);
    //     new SuccessMsgResponse('Logout success').send(res);
    //   }
    // )

    // verify = asyncHandler(
    //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
    //     new SuccessResponse('verify success', {
    //       user: _.pick(req.user, ['_id', 'name', 'roles', 'profilePicUrl']),
    //     }).send(res);
    //   }
    // )

    // refresh = asyncHandler(
    //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
    //     req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    //     const accessTokenPayload = await JWT.decode(req.accessToken);
    //     validateTokenData(accessTokenPayload);

    //     const user = await UserRepo.findById(new Types.ObjectId(accessTokenPayload.sub));
    //     if (!user) throw new AuthFailureError('User not registered');
    //     req.user = user;

    //     const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
    //     validateTokenData(refreshTokenPayload);

    //     if (accessTokenPayload.sub !== refreshTokenPayload.sub)
    //       throw new AuthFailureError('Invalid access token');

    //     const keystore = await KeystoreRepo.find(
    //       req.user._id,
    //       accessTokenPayload.prm,
    //       refreshTokenPayload.prm,
    //     );

    //     if (!keystore) throw new AuthFailureError('Invalid access token');
    //     await KeystoreRepo.remove(keystore._id);

    //     const accessTokenKey = crypto.randomBytes(64).toString('hex');
    //     const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    //     await KeystoreRepo.create(req.user._id, accessTokenKey, refreshTokenKey);
    //     const tokens = await createTokens(req.user, accessTokenKey, refreshTokenKey);

    //     new TokenRefreshResponse('Token Issued', tokens.accessToken, tokens.refreshToken).send(res);
    //   }
    // )

    // getUsers = asyncHandler(
    //   async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

    //     const users = await UserRepo.find();
    //     new SuccessResponse('fetch success', {
    //       users
    //     }).send(res);

    //   }
    // )
    verifyEmail = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {
            const user = await UserRepo.findByEmail(req.body.email);
            if (user) throw new BadRequestError('User already registered');

            new SuccessMsgResponse('Email Not Found')
        }
    )

    forgotPassword = asyncHandler(
        async (req: any, res: Response, next: NextFunction): Promise<Response | void> => {

            const user = await UserRepo.findByEmail(req.body.email);
            if (!user || !user.email) throw new SuccessMsgResponse('Email send success, Check your email').send(res);

            const { token } = await this.tokenService.createToken({
                shot_code: generateTokenKey(5),
                token: generateTokenKey(),
                type: 'FORGOT_PASSWORD',
                userId: user.id,
                expireAt: new Date()
            } as Token)

            let link = `http://localhost:5001/api/v1/auth/reset-password/?token=${token?.token}&user=${token?.userId}&email=${user.email}`
            if (user && user.email) {
                // @ts-ignore
                // sendMail({ subject: 'iPrint (Forgot Password)', to: user.email, text: link })
            }
            console.log("==== link ====", link);

            new SuccessMsgResponse('Email send success, Check your email').send(res);
        }
    )

    resetPassword = asyncHandler(
        async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
            const { token, otp } = req.query;

            if (!Boolean(_.isString(token) || _.isString(otp))) throw new BadRequestError('Invalid Request')
            const tokenfound = await this.tokenService.verifyCode({ code: token as string, type: 'FORGOT_PASSWORD' })

            await UserRepo.updatePassword(tokenfound.userId, { password: req.body.password });
            new SuccessMsgResponse('password reset Successful').send(res);
        }
    )

    passwordOTPVerify = asyncHandler(
        async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
            const { otp, email } = req.body;
            const user = await UserRepo.findByEmail(email);
            if (!user) throw new BadRequestError('User not exist');

            const userId = user.id

            if (!_.isString(userId) || !_.isString(otp)) throw new BadRequestError('Invalid Request')
            //@ts-ignore
            const otpfound = await this.tokenService.findForPasswordVerification({ otp, userId })
            if (!otpfound) throw new BadRequestError('OTP Expire') //  || tokenfound.expireAt < new Date()

            new SuccessResponse('otp success', { user: userId }).send(res);
        }
    )

    verifyPassword = asyncHandler(
        async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
            const { user } = req.query;

            // if (!_.isString(user) || _.isString(otp)) throw new BadRequestError('Invalid Request')
            //@ts-ignore

            await UserRepo.update(user, { password: req.body.password } as User);
            new SuccessMsgResponse('password update success').send(res);

        }
    )



}