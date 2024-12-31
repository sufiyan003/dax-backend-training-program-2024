import User, { UserModel } from './User';
import Role from '../roles/Role';
import RoleRepo from "../roles/role.repository"
import { InternalError } from '../../../core/ApiError';
import bcrypt from 'bcrypt';
import KeystoreRepo from './keystore.repository';
import Keystore from './Keystore';
import Logger from '../../../core/Logger'
import { Prisma } from '@prisma/client';

export default class UserRepo {

    public static find({ where }: { where: Prisma.UserWhereInput }): Promise<User[] | null> {
        return UserModel.findMany({
            where: { ...where }
        })
    }

    public static findUsers(): Promise<User[] | null> {
        return UserModel.findMany({
            where: {
                role: { code: "USER" }
            },
            include: {
                role: {
                    select: {
                        id: true,
                        code: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
    }

    public static findOne({ where }: { where: Prisma.UserWhereInput }) {
        return UserModel.findFirst({
            where,
            include: {
                role: {
                    select: {
                        id: true,
                        code: true
                    }
                }
            }
        })
    }

    // public static findTeachers(): Promise<User[] | null> {
    //   return UserModel.findMany({
    //     where: {
    //       role: { code: "DRIVER" }
    //     },
    //     include: {
    //       role: {
    //         select: {
    //           id: true,
    //           code: true
    //         }
    //       }
    //     },
    //     orderBy: { createdAt: 'desc' }
    //   })
    // }

    // public static findEmployeeByCompany(country: string): Promise<User[] | null> {
    //   return UserModel.findMany({
    //     where: {
    //       role: {
    //         code: { in: ["ADMIN", "DRIVER", "USER"] }
    //       },
    //       country
    //     },
    //     include: {
    //       role: {
    //         select: {
    //           id: true,
    //           code: true
    //         }
    //       }
    //     },
    //     orderBy: { createdAt: 'desc' }
    //   })
    // }

    public static findById(id: string): Promise<User | null> {
        return UserModel.findFirst({
            where: { id, status: 'PUBLIC' },
            include: {
                role: {
                    select: {
                        id: true,
                        code: true
                    }
                },
            }
        })
    }

    public static findByEmail(email: string): Promise<User | null> {
        return UserModel.findFirst({
            where: { email },
            include: {
                role: {
                    select: {
                        id: true,
                        code: true
                    }
                },
            }
        })
    }

    public static async create(
        user: User,
        accessTokenKey: string,
        refreshTokenKey: string,
        roleCode: Role['code'],
    ): Promise<{ user: User | null; keystore: any }> {
        const now = new Date();

        const role = await RoleRepo.findByCode(roleCode)
        if (!role) throw new InternalError('Role must be defined in db!');

        user.password = bcrypt.hashSync(user.password || "NotPossible", 10);
        user.roleId = role.id;
        user.phone_status = 'VERIFIED' // 'VERIFIED'; // 'PENDING'
        user.gender = 'MALE'
        user.createdAt = user.updatedAt = now;
        // @ts-ignore 
        delete user.role

        const createdUser = await UserModel.create({
            data: { ...user },
            include: {
                role: {
                    select: {
                        id: true,
                        code: true
                    }
                }
            }
        });

        const keystore = await KeystoreRepo.create(createdUser.id, accessTokenKey, refreshTokenKey);

        return { user: createdUser, keystore };

    }

    public static async createUser(user: User): Promise<{ user: User | null }> {
        const now = new Date();

        // @ts-ignore 
        const role = await RoleRepo.findByCode(user.role)
        if (!role) throw new InternalError('Role must be defined in db!');

        user.password = bcrypt.hashSync(user.password || "NotPossible", 10);
        user.roleId = role.id;
        user.createdAt = user.updatedAt = now;
        // @ts-ignore 
        delete user.role

        const createdUser = await UserModel.create({
            data: user,
            include: {
                role: {
                    select: {
                        id: true,
                        code: true
                    }
                },
            }
        });

        return { user: createdUser };

    }

    public static async update(id: User['id'], user: User): Promise<User | null> {

        // @ts-ignore
        if (user.role) {
            // @ts-ignore
            const role = await RoleRepo.findByCode(user.role)
            if (!role) throw new InternalError('Role must be defined in db!');
            user.roleId = role.id;
        }

        if (user.password) {
            user.password = bcrypt.hashSync(user.password || "NotPossible", 10);
            Logger.info(`user (${user.email}) password update`)
        } else {
            // @ts-ignore 
            delete user.password
        }

        // @ts-ignore 
        delete user.role
        // @ts-ignore 
        delete user.company

        return UserModel.update({
            where: { id },
            data: user,
            include: {
                role: {
                    select: {
                        id: true,
                        code: true
                    }
                },
            }
        })
    }

    public static async updatePassword(id: User['id'], { password }: { password: User['password'] }): Promise<User | null> {

        password = bcrypt.hashSync(password || "NotPossible", 10);
        Logger.info(`user (${id}) password update`)

        return UserModel.update({
            where: { id },
            data: {
                password
            },
        })
    }

    // public static async updateCompany(id: User['id'], country: User['country']): Promise<User | null> {

    //   return UserModel.update({
    //     where: { id },
    //     data: { country },
    //     include: {
    //       role: {
    //         select: {
    //           id: true,
    //           code: true
    //         }
    //       },
    //     }
    //   })
    // }

    public static async updateInfo(id: User['id'], user: User): Promise<User | null> {

        // delete user.password
        // delete user.roleId
        // delete user.companyId

        return UserModel.update({
            where: { id },
            data: user,
            include: {
                role: {
                    select: {
                        id: true,
                        code: true
                    }
                },
            }
        })
    }

    public static async delete(id: User['id']): Promise<User | null> {
        return UserModel.delete({ where: { id } })
    }

}