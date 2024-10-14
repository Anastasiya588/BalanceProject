import {Dashboard} from "./components/dashboard";
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";
import {Incomes} from "./components/incomes";
import {CreateIncomes} from "./components/create-incomes";
import {EditIncomes} from "./components/edit-incomes";
import {Expenses} from "./components/expenses";
import {CreateExpenses} from "./components/create-expenses";
import {EditExpenses} from "./components/edit-expenses";
import {Operations} from "./components/operations";
import {CreateOperations} from "./components/create-operations";
import {EditOperations} from "./components/edit-operations";
import {Logout} from "./components/logout";
import {AuthUtils} from "../utils/auth-utils";
import {RouteType} from "./types/route.type";
import {PromiseOr} from "sass";

const feather = require('feather-icons');

export class Router {
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    readonly adaptiveMeta: HTMLElement | null;

    private routes: RouteType[];

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
                styles: ['datepicker.min.css'],
                scripts: ['datepicker.min.js'],
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
                    new Incomes(this.openNewRoute.bind(this))
                },
            },
            {
                route: '/categories/income/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/create-incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateIncomes(this.openNewRoute.bind(this))
                },
            },
            {
                route: '/categories/income/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/edit-incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditIncomes(this.openNewRoute.bind(this))
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
                    new CreateExpenses(this.openNewRoute.bind(this))
                },
            },
            {
                route: '/categories/expense/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/edit-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditExpenses(this.openNewRoute.bind(this))
                },
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/operations.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Operations(this.openNewRoute.bind(this))
                },
                styles: ['datepicker.min.css'],
                scripts: ['datepicker.min.js'],
            },
            {
                route: '/operations/create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/create-operations.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateOperations(this.openNewRoute.bind(this))
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
                    new EditOperations(this.openNewRoute.bind(this))
                },
                styles: ['datepicker.min.css'],
                scripts: ['datepicker.min.js'],
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this))
                },
            },

        ]

    }

    private initEvents(): void {
        //это отлавливаем когда пользователь загружает страницу
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        //это отлавливаем когда меняется url, т.е. пользователь перешел на другую страницу в рамках работающего приложения
        window.addEventListener('popstate', this.activateRoute.bind(this));

        document.addEventListener('click', this.clickHandler.bind(this));
    }

    private isAuthentificated(): boolean {
        return AuthUtils.getAuthInfo(AuthUtils.userInfoKey) !== null;
    }

    private async openNewRoute(url): Promise<void> {
        //текущий роут
        const currentRoute: string = window.location.pathname;
        //Чтобы сверху url отображался тот, на который нажали (т.е. обновляем url-адрес в браузере)
        history.pushState({}, '', url);

        //Так как может передаваться событие, то лучше сначала передать null, а потом currentRoute
        await this.activateRoute(null, currentRoute)
    }

    //Эта функция обрабатывает клик по ссылке и открывает новый роут(переход на другую страницу через функционал)
    private async clickHandler(e): Promise<void> {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const currentRoute: string = window.location.pathname;
            //Вырезаем из url http://localhost:9000 и заменяем на ''
            const url = element.href.replace(window.location.origin, '');
            if (!url || currentRoute === url.replace('#', '') || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    private async activateRoute(e: Event | null, oldRoute: string | null = null): Promise<void> {
        if (oldRoute) {
            //Получаем старый роут, с которого мы уходим
            const currentRoute: RouteType | undefined = this.routes.find(item => item.route === oldRoute);
            //удаляем стили и скрипты у текущего роута
            if (currentRoute) {
                if (currentRoute.styles && currentRoute.styles.length > 0) {
                    currentRoute.styles.forEach((style: string): void => {
                        document.querySelector(`link[href='/css/${style}']`).remove()
                    })
                }
                if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                    currentRoute.scripts.forEach((script: string): void => {
                        document.querySelector(`script[src='/js/${script}']`).remove()
                    })
                }
            }

        }
        //Получаем текущий url, а точнее все что идет после pathname
        const urlRoute: string = window.location.pathname;
        //Находим какому url-адресу относится текущий url-адрес когда проходим по всем нашим routes
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            const isPublicRoute: boolean = newRoute.route === '/login' || newRoute.route === '/signup';
            if (!isPublicRoute && !this.isAuthentificated()) {
                history.pushState({}, '', '/login');
                await this.activateRoute(null, '/login');
                return;
            }

            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach((style: string): void => {
                    const link: HTMLLinkElement = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '/css/' + style;
                    if (this.adaptiveMeta) {
                        document.head.insertBefore(link, this.adaptiveMeta);
                    }

                })
            }
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                newRoute.scripts.forEach(script => {
                    const scriptElement: HTMLScriptElement = document.createElement('script');
                    scriptElement.src = '/js/' + script;
                    document.body.appendChild(scriptElement);
                })
            }
            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerText = newRoute.title + ' | Finance';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock: HTMLElement | null = this.contentPageElement;
                if (newRoute.useLayout) {
                    if (this.contentPageElement) {
                        this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    }
                    contentBlock = document.getElementById('content-layout');
                }
                //запрос на получение страницы
                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                }
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            history.pushState({}, '', '/404');
            await this.activateRoute(null, null);
        }
    }


}




