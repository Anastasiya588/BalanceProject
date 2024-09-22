import {Dashboard} from "./components/dashboard.js";
import {Login} from "./components/login.js";
import {SignUp} from "./components/sign-up.js";
import {Incomes} from "./components/incomes.js";
import {CreateIncomes} from "./components/create-incomes.js";
import {EditIncomes} from "./components/edit-incomes.js";
import {Expenses} from "./components/expenses.js";
import {CreateExpenses} from "./components/create-expenses.js";
import {EditExpenses} from "./components/edit-expenses.js";
import {Operations} from "./components/operations.js";
import {CreateOperations} from "./components/create-operations.js";
import {EditOperations} from "./components/edit-operations.js";
import {Logout} from "./components/logout.js";
import {AuthUtils} from "../utils/auth-utils";

const feather = require('feather-icons');

export class Router {
    constructor() {

        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.adaptiveMeta = document.getElementById('adaptive-meta');

        feather.replace();

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard();
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
                load: () => {

                },
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                load: () => {
                    new Login(this.openNewRoute.bind(this))
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                load: () => {
                    new SignUp(this.openNewRoute.bind(this))
                },
            },
            {
                route: '/categories/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Incomes()
                },
            },
            {
                route: '/categories/income/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/create-incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateIncomes()
                },
            },
            {
                route: '/categories/income/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/edit-incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditIncomes()
                },
            },
            {
                route: '/categories/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses()
                },
            },
            {
                route: '/categories/expense/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/create-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateExpenses()
                },
            },
            {
                route: '/categories/expense/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/edit-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditExpenses()
                },
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/operations.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Operations()
                },
            },
            {
                route: '/operations/create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/create-operations.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateOperations()
                },
                styles: ['datepicker.min.css'],
                scripts: ['datepicker.min.js'],
            },
            {
                route: '/operations/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/edit-operations.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditOperations()
                },
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this))
                },
            },

        ]
    }

    initEvents() {
        //это отлавливаем когда пользователь загружает страницу
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        //это отлавливаем когда меняется url, т.е. пользователь перешел на другую страницу в рамках работающего приложения
        window.addEventListener('popstate', this.activateRoute.bind(this));

        document.addEventListener('click', this.clickHandler.bind(this));

    }

    isAuthentificated() {
        return AuthUtils.getAuthInfo(AuthUtils.userInfoKey) !== null;
    }

    async openNewRoute(url) {
        //текущий роут
        const currentRoute = window.location.pathname;
        //Чтобы сверху url отображался тот, на который нажали (т.е. обновляем url-адрес в браузере)
        history.pushState({}, '', url);

        //Так как может передаваться событие, то лучше сначала передать null, а потом currentRoute
        await this.activateRoute(null, currentRoute)
    }

    //Эта функция обрабатывает клик по ссылке и открывает новый роут(переход на другую страницу через функционал)
    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            //Вырезаем из url http://localhost:9000 и заменяем на ''
            const url = element.href.replace(window.location.origin, '');
            if (!url || currentRoute === url.replace('#', '') || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            //Получаем старый роут, с которого мы уходим
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            //удаляем стили и скрипты у текущего роута
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove()
                })
            }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove()
                })
            }
        }
        //Получаем текущий url, а точнее все что идет после pathname
        const urlRoute = window.location.pathname;
        //Находим какому url-адресу относится текущий url-адрес когда проходим по всем нашим routes
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            const isPublicRoute = newRoute.route === '/login' || newRoute.route === '/signup';
            if (!isPublicRoute && !this.isAuthentificated()) {
                history.pushState({}, '', '/login');
                await this.activateRoute(null, '/login');
                return;
            }

            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '/css/' + style;
                    document.head.insertBefore(link, this.adaptiveMeta);
                })
            }
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                newRoute.scripts.forEach(script => {
                    const scriptElement = document.createElement('script');
                    scriptElement.src = '/js/' + script;
                    document.body.appendChild(scriptElement);
                })
            }
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Finance';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                }
                //запрос на получение страницы
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found')
            history.pushState({}, '', '/404');
            await this.activateRoute();
        }
    }
}




