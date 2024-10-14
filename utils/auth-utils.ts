import {HttpUtils} from "./http-utils";
import {AccessRefreshUserInfoType} from "../src/types/access-refresh-userInfo.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoKey: string = 'userInfo';

    public static setAuthInfo(accessToken, refreshToken, userInfo): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    }

    public static setTokens(accessToken, refreshToken): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    public static setUserInfo(userInfoOnly): void {
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfoOnly));
    }

    public static getAuthInfo(key = null): AccessRefreshUserInfoType | string | null | {
        [key: string]: string | null
    } {
        if (key === this.userInfoKey) {
            const userInfoString: string | null = localStorage.getItem(this.userInfoKey);
            return userInfoString ? JSON.parse(userInfoString) : null; // Преобразуем JSON-строку в объект
        }
        if (key && [this.accessTokenKey, this.refreshTokenKey].includes(key)) {
            return localStorage.getItem(key)
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoKey]: localStorage.getItem(this.userInfoKey)
            }
        }
    }

    public static removeUserInfo(): void {
        localStorage.removeItem(this.userInfoKey);
    }

    public static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    public static async updateRefreshToken(): Promise<boolean> {
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