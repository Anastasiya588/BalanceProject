import {UserInfoType} from "./user-info.type";

export type AuthInfoType = {
    accessToken: string | null;
    refreshToken: string | null;
    userInfo: UserInfoType | null;
}