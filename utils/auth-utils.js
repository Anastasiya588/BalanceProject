import config from "../src/config/config.js";
import {HttpUtils} from "./http-utils.js";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';

    static setAuthInfo(accessToken, refreshToken, userInfo) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    }

    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    static setUserInfo(userInfoOnly) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(userInfoOnly));
    }

    static getAuthInfo(key = null) {
        if (key === this.userInfoKey) {
            const userInfoString = localStorage.getItem(this.userInfoKey);
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

    static removeUserInfo() {
        localStorage.removeItem(this.userInfoKey);
    }

    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static async updateRefreshToken() {
        let result = null;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        console.log('Refresh Token:', refreshToken);
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