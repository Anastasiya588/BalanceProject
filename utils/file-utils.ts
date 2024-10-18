import {HttpUtils} from "./http-utils";
import {AuthUtils} from "./auth-utils";
import {DefaultResponseType} from "../src/types/default-response.type";
import {GetBalanceEsponseType} from "../src/types/get-balance.type";
import {UserInfoType} from "../src/types/user-info.type";
import {AuthInfoType} from "../src/types/auth-info.type";
import {OperationsResponseType} from "../src/types/operations-response.type";
import {OperationResponseType} from "../src/types/operation-response.type";
import {UpdateBalanceType} from "../src/types/update-balance.type";

export class FileUtils {
    public static userName: HTMLElement | null;
    public static offcanvasUserName: HTMLElement | null;
    public static balance: NodeListOf<HTMLElement>;

    public static showName(): void {
        this.userName = document.getElementById('userName');
        this.offcanvasUserName = document.getElementById('offcanvasUserName');
        let userInfo: UserInfoType | string | null | AuthInfoType = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
        if (userInfo && typeof userInfo !== 'string' && 'name' in userInfo && 'lastName' in userInfo) {
            const fullName: string = `${userInfo.name} ${userInfo.lastName}`;
            if (this.userName) {
                this.userName.innerText = fullName;
                (this.userName as HTMLElement).style.overflowWrap = 'break-word'
            }
            if (this.offcanvasUserName) {
                this.offcanvasUserName.innerText = fullName
            }

        }
    }

    public static async showCanvasBalance(): Promise<void> {
        try {
            const offcanvasBalanceElement: HTMLElement | null = document.getElementById('offcanvas-balance-number');
            if (offcanvasBalanceElement) {
                offcanvasBalanceElement.innerText = (0).toString();
            }

            // Выполняем запрос на получение баланса
            const result: DefaultResponseType | GetBalanceEsponseType = await HttpUtils.request('/balance');
            if (result) {
                if ((result as DefaultResponseType).error !== undefined) {
                    throw new Error((result as DefaultResponseType).message);
                }
            }

            if ((result as GetBalanceEsponseType) && (result as GetBalanceEsponseType).response.balance) {
                const balanceValue: number = (result as GetBalanceEsponseType).response.balance;

                const offcanvasElement: HTMLElement | null = document.getElementById('menuRight');
                if (offcanvasElement && offcanvasBalanceElement) {
                    offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
                        return offcanvasBalanceElement.innerText = balanceValue.toString();
                    });
                }

            } else {
                console.error('Balance value is not found or is not a number', result);
            }
        } catch (error) {
            console.error('Error fetching the balance:', error);
        }

    }

    public static async showBalance(): Promise<void> {
        try {
            this.updateBalance().then()
            this.balance = document.querySelectorAll('.balance-number');

            const result: DefaultResponseType | GetBalanceEsponseType = await HttpUtils.request('/balance');
            this.balance.forEach((elem: HTMLElement): void => {
                elem.innerText = (0).toString();
            });
            if (result) {
                if (this.balance.length === 0) {
                    return;
                }
                const balanceValue: number = (result as GetBalanceEsponseType).response.balance;

                if (balanceValue) {
                    this.balance.forEach((elem) => {
                        elem.innerText = balanceValue.toString();
                    });

                }
            }
        } catch (error) {
            console.error('Error fetching the balance:', error);
        }
    }

    public static async updateBalance(): Promise<number> {
        const result: DefaultResponseType | OperationsResponseType = await HttpUtils.request('/operations', 'GET', true, null, 'all')
        let sum: number = 0;
        if (result) {
            if (Array.isArray((result as OperationsResponseType).response)) {
                sum = (result as OperationsResponseType).response.reduce((acc: number, operation: OperationResponseType): number => {
                    const amount: number = Number(operation.amount);
                    if (operation.type === 'expense') {
                        return acc - amount;
                    } else if (operation.type === 'income') {
                        return acc + amount;
                    }
                    return acc;
                }, 0);
            }
            return sum;
        }

        try {
            const result: DefaultResponseType | UpdateBalanceType = await HttpUtils.request('/balance', 'PUT', true, {
                "newBalance": Number(sum)
            });

        } catch (error) {
            console.error('Error fetching the balance:', error);
        }
    }
}