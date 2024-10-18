import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    readonly openNewRoute: (url: string) => void;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.logout().then();
    }

    public async logout(): Promise<void> {
        await HttpUtils.request('/logout', "POST", false, {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
        })

        AuthUtils.removeTokens();
        AuthUtils.removeUserInfo();

        //Перевод пользователя на страницу login
        this.openNewRoute('/login')
    }

}