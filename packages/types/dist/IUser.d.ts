import type { Types } from 'mongoose';
export interface IUser {
    id?: Types.ObjectId | string;
    roles: ERole[];
}
export declare enum ERole {
    HOST = "Host"
}
//# sourceMappingURL=IUser.d.ts.map