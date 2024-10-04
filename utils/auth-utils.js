import config from "../src/config/config.js";
import {HttpUtils} from "./http-utils";

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
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {
            return localStorage.getItem(key)
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoKey]: localStorage.getItem(this.userInfoKey)
            }
        }
    }

    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }

    static removeUserInfo() {
        localStorage.removeItem(this.userInfoKey);
    }

    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static async updateRefreshToken() {
        // const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        //
        // if (!refreshToken) {
        //     return {error: true, message: 'Refresh token is missing'};
        // }
        //
        // const response = await HttpUtils.request('/refresh', 'POST', false, {
        //     refreshToken: refreshToken,
        // })
        //
        // if (response.error) {
        //     return response;
        // }
        //
        // if (response.response && response.response.tokens.accessToken && response.response.tokens.refreshToken) {
        //     this.setTokens(response.response.tokens.accessToken, response.response.tokens.refreshToken);
        //     return {error: false};
        // }
        //
        // return {error: true, message: 'Failed to refresh token'};
        let result = null;
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        console.log(refreshToken)
        if (refreshToken) {
            const response = await HttpUtils.request('/refresh', 'POST', false, {
                refreshToken: refreshToken,
            })
            console.log(response)
            if (response && response.response) {
                // const tokens = await response.json();
                console.log(response.response)
                if (response.response.tokens) {
                    this.setTokens(response.response.tokens.accessToken, response.response.tokens.refreshToken)
                    result = true;
                }
            } else {
                result = false
                console.error('Ошибка при обновлении токена:', response.status, response.statusText);
            }
        }

        // if (!result) {
        //     console.error('Удаление некорректных токенов.');
        //     this.removeAuthInfo();
        // }
        return result;
    }
}