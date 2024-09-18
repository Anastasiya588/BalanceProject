import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.processElement = document.getElementById('process-button');
        this.rememberMe = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');
        this.processElement.addEventListener('click', this.login.bind(this))
        this.fields = [
            {
                name: 'email',
                id: 'inputEmail',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'inputPassword',
                element: null,
                regex: /^(?=.*[A-ZА-Я])(?=.*\d).{8,}$/,
                valid: false,
            }
        ];
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });
    }

    validateField(field, element) {
        if (element.value && element.value.match(field.regex)) {
            element.classList.remove('is-invalid');
            field.valid = true;
        } else {
            element.classList.add('is-invalid');
            field.valid = false;
        }
        this.validateForm();
    }

    validateForm() {
        return this.validForm = this.fields.every(item => item.valid);
    }

    async login() {
        this.commonErrorElement.style.display = 'none';

        this.fields.forEach(field => {
            this.validateField(field, field.element);
        });
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            const result = await HttpUtils.request('/login', "POST", {
                email: email,
                password: password,
                rememberMe: this.rememberMe.checked
            })
            if (result.error || !result.response ||
                (result.response && (!result.response.tokens.accessToken ||
                    !result.response.tokens.refreshToken || !result.response.user.name ||
                    !result.response.user.lastName || !result.response.user.id))) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            //Сохранение в LocalStorage
            AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                id: result.response.user.id,
                name: result.response.user.name,
                lastName: result.response.user.lastName
            })

            //Перевод пользователя на главную страницу
            this.openNewRoute('/')
        }
    }
}