import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {SignUpFieldType} from "../types/sign-up-field.type";

export class SignUp {
    readonly openNewRoute: (url: string) => void;
    readonly commonErrorElement: HTMLElement | null;
    readonly processElement: HTMLElement | null;
    readonly fields: SignUpFieldType[];
    private validForm: boolean;

    constructor(openNewRoute: (url: string) => void) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }
        this.commonErrorElement = document.getElementById('common-error');
        this.processElement = document.getElementById('process-button');
        if (this.processElement) {
            this.processElement.addEventListener('click', this.signup.bind(this));
        }

        this.fields = [
            {
                name: 'name',
                id: 'inputName',
                element: null,
                regex: /^(?:[А-ЯЁ][а-яё]+\s)+[А-ЯЁ][а-яё]+$/,
                valid: false,
            },
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
            },
            {
                name: 'repeatPassword',
                id: 'inputRepeatPassword',
                element: null,
                valid: false,
            }
        ];
        const that: SignUp = this;
        this.fields.forEach((item: SignUpFieldType): void => {
            item.element = document.getElementById(item.id);
            if (item.element) {
                item.element.onchange = function (): void {
                    that.validateField.call(that, item, this as HTMLInputElement);
                }
            }

        });
    }

    private validateField(field: SignUpFieldType, element: HTMLInputElement): void {
        if (field.name === 'repeatPassword') {
            const passwordField: SignUpFieldType | undefined = this.fields.find((field: SignUpFieldType) => field.name === 'password');
            if (passwordField && passwordField.element) {

                if (element && element.value === (passwordField.element as HTMLInputElement).value) {
                    element.classList.remove('is-invalid');
                    field.valid = true;
                } else {
                    element.classList.add('is-invalid');
                    field.valid = false;
                }
            }

        } else if (element.value && field.regex && element.value.match(field.regex)) {
            element.classList.remove('is-invalid');
            field.valid = true;
        } else {
            element.classList.add('is-invalid');
            field.valid = false;
        }

        this.validateForm();
    }

    private validateForm(): boolean {
        return this.validForm = this.fields.every((item: SignUpFieldType) => item.valid);
    }

    private async signup(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        this.fields.forEach((field: SignUpFieldType): void => {
            if (field.element) {
                this.validateField(field, field.element as HTMLInputElement);
            }
        });
        if (this.validateForm()) {
            const nameLastName: string = (this.fields.find((item: SignUpFieldType) => item.name === 'name')?.element as HTMLInputElement)?.value;
            const nameLastNameArray: string[] = nameLastName.split(' ');
            const name: string = nameLastNameArray[0];
            const lastName: string = nameLastNameArray[1];
            const email: string = (this.fields.find((item: SignUpFieldType) => item.name === 'email')?.element as HTMLInputElement)?.value;
            const password: string = (this.fields.find((item: SignUpFieldType) => item.name === 'password')?.element as HTMLInputElement)?.value;
            const passwordRepeat: string = (this.fields.find((item: SignUpFieldType) => item.name === 'repeatPassword')?.element as HTMLInputElement)?.value;

            const result = await HttpUtils.request('/signup', "POST", false, {
                name: name,
                lastName: lastName,
                email: email,
                password: password,
                passwordRepeat: passwordRepeat
            })

            if (result.error || !result.response ||
                (result.response && (!result.response.user.name ||
                    !result.response.user.lastName || !result.response.user.id || !result.response.user.email))) {
                if (this.commonErrorElement) {
                    this.commonErrorElement.style.display = 'block';
                }
                return;
            }

            AuthUtils.setUserInfo({
                id: result.response.user.id,
                name: result.response.user.name,
                lastName: result.response.user.lastName,
                email: result.response.user.email,
            })

            const loginResult = await HttpUtils.request('/login', "POST", false, {
                email: email,
                password: password
            });
            if (loginResult.error || !loginResult.response) {
                if (this.commonErrorElement) {
                    this.commonErrorElement.style.display = 'block';
                }
                return;
            }

            AuthUtils.setAuthInfo(loginResult.response.tokens.accessToken, loginResult.response.tokens.refreshToken, loginResult.response.user);

            //Перевод пользователя на главную страницу
            this.openNewRoute('/')
        }
    }
}