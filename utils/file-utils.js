import {HttpUtils} from "./http-utils.js";

export class FileUtils {
    static async showCanvasBalance() {
        try {
            // Выполняем запрос на получение баланса
            const result = await HttpUtils.request('/balance');

            // Проверяем, есть ли поле balance и является ли оно числом
            if (result && result.response && typeof result.response.balance === 'number') {
                const balanceValue = result.response.balance;

                const offcanvasElement = document.getElementById('menuRight');
                offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
                    const offcanvasBalanceElement = document.getElementById('offcanvas-balance-number');
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
            const result = await HttpUtils.request('/balance');

            if (result) {
                this.balance = document.querySelectorAll('.balance-number');
                if (this.balance.length === 0) {
                    return;
                }
                console.log('Balance Response:', result);

                const balanceValue = result.response.balance;

                if (typeof balanceValue === 'number') {
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
        console.log(result)
        if (result) {
            if (Array.isArray(result.response)) {
                sum = result.response.reduce((acc, operation) => {
                    if (operation.type === 'expense') {
                        return acc - operation.amount;
                    } else if (operation.type === 'income') {
                        return acc + operation.amount;
                    }
                    return acc;
                }, 0);
            } else {
                console.error('Результат не является массивом');
            }
            console.log(sum)
            return sum;
        }

        try {
            const result = await HttpUtils.request('/balance', 'PUT', true, {
                "newBalance": sum
            });

            if (result) {
                this.finalBalance = result.balance;
               return this.finalBalance
            }
        } catch (error) {
            console.error('Error fetching the balance:', error);
        }
    }
}