import {HttpUtils} from "./http-utils";
import {UserInfoType} from "../src/types/user-info.type";
import {AuthInfoType} from "../src/types/auth-info.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoKey: string = 'userInfo';

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfoType): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    }

    public static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    public static setUserInfo(userInfoOnly: UserInfoType): void {
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfoOnly));
    }

    public static getAuthInfo(key: string | null): UserInfoType | string | null | AuthInfoType {
        if (key === this.userInfoKey) {
            const userInfoString: string | null = localStorage.getItem(this.userInfoKey);
            return userInfoString ? JSON.parse(userInfoString) : null;
        }
        if (key && [this.accessTokenKey, this.refreshTokenKey].includes(key)) {
            return localStorage.getItem(key)
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoKey]: localStorage.getItem(this.userInfoKey)
            } as AuthInfoType;
        }
    }

    public static removeUserInfo(): void {
        localStorage.removeItem(this.userInfoKey);
    }

    public static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    public static async updateRefreshToken(): Promise<boolean | null> {
        let result = null;
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);

        if (refreshToken) {
            const response = await HttpUtils.request('/refresh', 'POST', false, {
                refreshToken: refreshToken,
            })
            if (response && !response.error && response.response.tokens) {
                this.setTokens(response.response.tokens.accessToken, response.response.tokens.refreshToken)
                result = true;
                return result
            } else {
                result = false
                console.error('Ошибка при обновлении токена:', response.status, response.statusText);
            }
        }

        return result;
    }
}