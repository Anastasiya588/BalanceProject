import config from "../src/config/config.js";
import {AuthUtils} from "./auth-utils.js";

export class HttpUtils {
    static async request(url, method = "GET", useAuth = true, body = null) {
        const result = {
            error: false,
            response: null
        }
        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        };

        let accessToken = null;
        if (useAuth) {
            accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (accessToken) {
                params.headers['x-auth-token'] = accessToken;
            }
        }

        if (body) {
            params.body = JSON.stringify(body)
        }

        let response = null;
        try {
            response = await fetch(config.api + url, params);
//получаем ответ от сервера
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                //1-токена нет
                if (!accessToken) {
                    result.redirect = '/login';
                } else {
                    //2-токен устарел либо невалидный (надо обновить)
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        //запрос повторно
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }


            // //когда истек токен
            // if (response.status === 401) {
            //     const result = await AuthUtils.unauthorizedResponse();
            //     if (result) {
            //         return await this.request(url, method, body)
            //     } else {
            //         return null
            //     }
            // }
            // result.error = true;
        }

        return result;
    }
}