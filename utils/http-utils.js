import config from "../src/config/config.js";
import {AuthUtils} from "./auth-utils.js";

export class HttpUtils {
    static async request(url, method = "GET", useAuth = true, body = null, period = null, dateFrom = null, dateTo = null) {
        const result = {
            error: false,
            response: null
        }
        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
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

        // Сбор параметров для запроса
        const queryParams = new URLSearchParams();

        if (period) {
            queryParams.append('period', period);
            if (period === 'interval') {
                if (dateFrom) {
                    queryParams.append('dateFrom', dateFrom);
                }
                if (dateTo) {
                    queryParams.append('dateTo', dateTo);
                }
            }
        }

        // Создаем полный URL с параметрами
        const fullUrl = `${config.api}${url}?${queryParams.toString()}`;


        let response = null;

        try {
            response = await fetch(fullUrl, params);
            //Получение ответа
            result.response = await response.json();
        } catch {
            result.error = true;
            return result;
        }

        try {
            if (response.status < 200 || response.status >= 300) {
                result.error = true;

                if (useAuth && response.status === 401) {
                    if (!accessToken) {
                        result.error = true;
                        result.redirect = '/login'; // Токена нет
                        return result
                    } else {
                        // Токен устарел или невалиден, необходимо обновить
                        const updateTokenResult = await AuthUtils.updateRefreshToken();
                        if (updateTokenResult) {
                            //запрос повторно
                            return this.request(url, method, useAuth, body, period, dateFrom, dateTo);
                        } else {
                            result.redirect = '/login';
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Error during fetch:', e);
            result.error = true;
            return result;
        }

        return result;
    }


}