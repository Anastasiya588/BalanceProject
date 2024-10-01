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
//получаем ответ от сервера
            result.response = await response.json();
        } catch (e) {
            console.error('Error during fetch:', e);
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            console.log('Response status:', response.status);
            if (useAuth && response.status === 401) { // Не авторизован
                if (!accessToken) {
                    result.redirect = '/login'; // Токена нет
                } else {
                    // Токен устарел или невалиден, необходимо обновить
                    console.log('Attempting to update token...');
                    const updateTokenResult = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        console.log('Token successfully updated. Making a retry request.');
                        accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
                        params.headers['x-auth-token'] = accessToken; // Устанавливаем новый токен
                        // Повторяем запрос
                        return this.request(url, method, useAuth, body);
                    } else {
                        console.log('Token update failed. Redirecting to login.');
                        result.redirect = '/login'; // Если обновление токена не удалось
                    }
                }
            }
        }
        return result;
    }
}