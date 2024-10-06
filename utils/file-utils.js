import {HttpUtils} from "./http-utils.js";
import {AuthUtils} from "./auth-utils.js";

export class FileUtils {
    static showName() {
        this.userName = document.getElementById('userName');
        this.offcanvasUserName = document.getElementById('offcanvasUserName');
        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
        if (userInfo) {
            const fullName = `${userInfo.name} ${userInfo.lastName}`;
            this.userName.innerText = fullName;
            this.userName.overflowWrap = 'break-word'
            this.offcanvasUserName.innerText = fullName
        }

    }

    static async showCanvasBalance() {
        try {
            const offcanvasBalanceElement = document.getElementById('offcanvas-balance-number');
            offcanvasBalanceElement.innerText = 0;
            // Выполняем запрос на получение баланса
            const result = await HttpUtils.request('/balance');

            if (result && result.response && result.response.balance) {
                const balanceValue = result.response.balance;

                const offcanvasElement = document.getElementById('menuRight');
                offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
                    return offcanvasBalanceElement.innerText = balanceValue;
                });
            } else {
                console.error('Balance value is not found or is not a number', result);
            }
        } catch (error) {
            console.error('Error fetching the balance:', error);
        }

    }

    static async showBalance() {
        try {
            this.updateBalance().then()
            this.balance = document.querySelectorAll('.balance-number');

            const result = await HttpUtils.request('/balance');
            this.balance.forEach((elem) => {
                elem.innerText = 0;
            });
            if (result) {
                if (this.balance.length === 0) {
                    return;
                }
                const balanceValue = result.response.balance;

                if (balanceValue) {
                    this.balance.forEach((elem) => {
                        elem.innerText = balanceValue;
                    });

                }
            }
        } catch (error) {
            console.error('Error fetching the balance:', error);
        }
    }

    static async updateBalance() {
        const result = await HttpUtils.request('/operations', 'GET', true, null, 'all')
        let sum = 0;
        if (result) {
            console.log(result)
            if (Array.isArray(result.response)) {
                sum = result.response.reduce((acc, operation) => {
                    const amount = Number(operation.amount); // Преобразуем в число
                    if (operation.type === 'expense') {
                        return acc - amount;
                    } else if (operation.type === 'income') {
                        return acc + amount;
                    }
                    return acc;
                }, 0);
            }
            console.log(sum)
            return sum;
        }

        try {
            const result = await HttpUtils.request('/balance', 'PUT', true, {
                "newBalance": Number(sum)
            });

        } catch (error) {
            console.error('Error fetching the balance:', error);
        }
    }
}