export type AccessRefreshUserInfoType = {
    tokens: Tokens,
    user: UserInfo,
}

export type Tokens = {
    accessToken: string;
    refreshToken: string;
}

export type UserInfo = {
    name: string;
    lastName: string;
    id: number;
}