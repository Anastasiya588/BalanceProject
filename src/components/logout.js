import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.logout().then();
    }

    async logout() {
        const result = await HttpUtils.request('/logout', "POST", {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        })

        AuthUtils.removeAuthInfo();

        //Перевод пользователя на страницу login
        this.openNewRoute('/login')
    }

}