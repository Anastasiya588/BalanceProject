import {UserInfoType} from "./user-info.type";
import {TokensType} from "./tokens.type";

export type AccessRefreshUserInfoType = {
    tokens: TokensType,
    user: UserInfoType,
}