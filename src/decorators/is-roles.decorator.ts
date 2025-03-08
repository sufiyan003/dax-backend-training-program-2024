import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_KEY = 'isAdmin';
export const IS_CUSTOMER_KEY = 'isCustomer';


export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// This decorator marks routes as requiring admin access

export const IsAdmin = () => SetMetadata(IS_ADMIN_KEY, true);

// This decorator marks routes as requiring customer access
export const IsCustomer = () => SetMetadata(IS_CUSTOMER_KEY, true);
