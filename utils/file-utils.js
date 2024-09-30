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


}