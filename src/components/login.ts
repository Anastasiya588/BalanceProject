import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {LoginFieldType} from "../types/login-field.type";

export class Login {
    readonly openNewRoute: (url: string) => void;
    readonly processElement: HTMLElement | null;
    readonly rememberMe: HTMLElement | null;
    readonly commonErrorElement: HTMLElement | null;
    private fields: LoginFieldType[];
    private validForm: boolean;

    constructor(openNewRoute: { (url: string): Promise<void>; (url: string): void; }) {
        this.openNewRoute = openNewRoute;
        this.processElement = document.getElementById('process-button');
        this.rememberMe = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');
        this.fields=[];
        this.validForm = false;
       
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
        }

      
        if (this.processElement) {
            this.processElement.addEventListener('click', this.login.bind(this))
        }

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
        const that: Login = this;
        this.fields.forEach((item: LoginFieldType): void => {
            item.element = document.getElementById(item.id);
            if (item.element) {
                item.element.onchange = function (): void {
                    that.validateField.call(that, item, this as HTMLInputElement);
                }
            }

        });
    }

    private validateField(field: LoginFieldType, element: HTMLInputElement): void {
        if (element.value && element.value.match(field.regex)) {
            element.classList.remove('is-invalid');
            field.valid = true;
        } else {
            element.classList.add('is-invalid');
            field.valid = false;
        }
        this.validateForm();
    }

    private validateForm(): boolean {
        return this.validForm = this.fields.every((item: LoginFieldType) => item.valid);
    }

    private async login(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        this.fields.forEach((field: LoginFieldType): void => {
            this.validateField(field, field.element as HTMLInputElement);
        });
        if (this.validateForm()) {
            const email: string = (this.fields.find((item: LoginFieldType) => item.name === 'email')?.element as HTMLInputElement)?.value;
            const password: string = (this.fields.find((item: LoginFieldType) => item.name === 'password')?.element as HTMLInputElement)?.value;

            const result = await HttpUtils.request('/login', "POST", false, {
                email: email,
                password: password,
                rememberMe: (this.rememberMe as HTMLInputElement).checked
            })
            if (result.error || !result.response ||
                (result.response && (!result.response.tokens.accessToken ||
                    !result.response.tokens.refreshToken || !result.response.user.name ||
                    !result.response.user.lastName || !result.response.user.id))) {
                if (this.commonErrorElement) {
                    this.commonErrorElement.style.display = 'block';
                }

                return;
            }

            //Сохранение в LocalStorage
            AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                id: result.response.user.id,
                name: result.response.user.name,
                lastName: result.response.user.lastName
            })

            //Перевод пользователя на главную страницу
            this.openNewRoute('/');

        }
    }
}