import config from "../src/config/config";
import {AuthUtils} from "./auth-utils";
import {UserInfoType} from "../src/types/user-info.type";
import {AuthInfoType} from "../src/types/auth-info.type";

export class HttpUtils {
    public static async request(url: string, method: string = "GET", useAuth: boolean = true, body: any | null = null, period: string | null = null, dateFrom: string | null = null, dateTo: string | null = null): Promise<any> {
        const result: any = {
            error: false,
            response: null
        }
        const params: any = {
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
        const queryParams: URLSearchParams = new URLSearchParams();

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
        const fullUrl: string = `${config.api}${url}?${queryParams.toString()}`;

        let response = null;

        try {
            response = await fetch(fullUrl, params);
            //Получение ответа
            result.response = await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
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
                        const updateTokenResult: boolean | null = await AuthUtils.updateRefreshToken();
                        if (updateTokenResult) {
                            const accessToken: UserInfoType | string | null | AuthInfoType = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
                            if (accessToken) {
                                params.headers['x-auth-token'] = accessToken;
                            }
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