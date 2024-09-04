import {Dashboard} from "./components/dashboard.js";
import {Login} from "./components/login.js";
import {SignUp} from "./components/sign-up.js";
import {FileUtils} from "../utils/file-utils.js";


const feather = require('feather-icons');

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');

        feather.replace();

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load() {
                    new Dashboard();
                },
                scripts: ['chart.umd.js']
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
                filePathTemplate: '/templates/page/auth/login.html',
                load: () => {
                    new Login()
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                load: () => {
                    new SignUp()
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

    async OpenNewRoute(url) {
        //изменение url адреса
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    // код для изменения url, чтобы страницы не перезагружались, так как это SPA приложение
    async clickHandler(e) {

        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;

        }

        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;

            const url = element.href.replace(window.location.origin, '');
            if (!url || currentRoute === url.replace('#', '') || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.OpenNewRoute(url);

        }
    }


    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            // if (currentRoute.styles && currentRoute.styles.length > 0) {
            //     currentRoute.styles.forEach(style => {
            //         document.querySelector(`link[href='/css/${style}']`).remove();
            //     })
            // }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                })
            }
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }


        //Получаем текущий url, а точнее все что идет после pathname
        const urlRoute = window.location.pathname;
        //Находим какому url-адресу относится текущий url-адрес когда проходим по всем нашим routes
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
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




