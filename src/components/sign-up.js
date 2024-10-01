import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }
        this.commonErrorElement = document.getElementById('common-error');
        this.processElement = document.getElementById('process-button');
        this.processElement.addEventListener('click', this.signup.bind(this));

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
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });
    }

    validateField(field, element) {
        if (field.name === 'repeatPassword') {
            const passwordField = this.fields.find(field => field.name === 'password');
            if (element.value && element.value === passwordField.element.value) {
                element.classList.remove('is-invalid');
                field.valid = true;
            } else {
                element.classList.add('is-invalid');
                field.valid = false;
            }
        } else if (element.value && element.value.match(field.regex)) {
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

    async signup() {
        this.commonErrorElement.style.display = 'none';

        this.fields.forEach(field => {
            this.validateField(field, field.element);
        });
        if (this.validateForm()) {
            const nameLastName = this.fields.find(item => item.name === 'name').element.value;
            const nameLastNameArray = nameLastName.split(' ');
            const name = nameLastNameArray[0];
            const lastName = nameLastNameArray[1];
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            const passwordRepeat = this.fields.find(item => item.name === 'repeatPassword').element.value;
            // request (Ответ)

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
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setUserInfo({
                id: result.response.user.id,
                name: result.response.user.name,
                lastName: result.response.user.lastName,
                email: result.response.user.email,
            })
            //Перевод пользователя на главную страницу
            this.openNewRoute('/')
        }
    }
}