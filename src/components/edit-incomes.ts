import {HttpUtils} from "../../utils/http-utils";
import {FileUtils} from "../../utils/file-utils";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoryIncomeEditResponse} from "../types/category-income-edit-response";

export class EditIncomes {
    readonly openNewRoute: (url: string) => void;
    private editIncomeInput: HTMLElement | null;
    readonly saveBtn: HTMLElement | null;
    readonly editIncomeId: number | null;
    private category: HTMLElement | null;
    private toggleIcon: HTMLElement | null;
    private expenses: NodeListOf<Element>;
    private incomes: NodeListOf<Element>;
    private categoryNavItem: NodeListOf<Element>;
    private offcanvasCategory: HTMLElement | null;
    private offcanvastoggleIcon: HTMLElement | null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.editIncomeInput = document.getElementById('edit-income-input');
        this.editIncomeId = parseInt(localStorage.getItem('editIncomeId'));

        this.init().then((title:string):void => {
            (this.editIncomeInput as HTMLInputElement).value = title;
        });
        this.saveBtn = document.getElementById('saveBtn');

        this.stylesLayoutCanvas();


        FileUtils.updateBalance().then();
        FileUtils.showCanvasBalance().then();
        FileUtils.showBalance().then();
        FileUtils.showName();

        this.editIncome().then();
    }

    private async init(): Promise<string> {
        const result: DefaultResponseType | CategoryIncomeEditResponse = await HttpUtils.request('/categories/income/' + this.editIncomeId)
        if (result) {
            return (result as CategoryIncomeEditResponse).response.title;
        }

    }

    private async editIncome(): Promise<void> {
        const that: EditIncomes = this;
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', async function (): Promise<void> {
                await HttpUtils.request('/categories/income/' + that.editIncomeId, 'PUT', true, {
                    title: (that.editIncomeInput as HTMLInputElement).value
                })

                that.openNewRoute('/categories/income')
            })
        }

    }

    private stylesLayoutCanvas(): void {
        const that: EditIncomes = this;
        //Layout
        this.category = document.getElementById('category');
        this.toggleIcon = document.getElementById('toggleIcon');
        this.expenses = document.querySelectorAll('.expenses-link');
        this.incomes = document.querySelectorAll('.incomes-link');
        this.categoryNavItem = document.querySelectorAll('.category-nav-item');

        if (this.category) {
            this.category.style.backgroundColor = '#0D6EFD';
            this.category.style.color = "white";
        }

        if (this.toggleIcon) {
            this.toggleIcon.style.fill = "white";
        }

        //OffCanvas Layout
        this.offcanvasCategory = document.getElementById('offcanvas-category');
        this.offcanvastoggleIcon = document.getElementById('offcanvas-toggleIcon')

        if (this.offcanvasCategory) {
            this.offcanvasCategory.style.backgroundColor = '#0D6EFD';
            this.offcanvasCategory.style.color = "white";
        }
        if (this.offcanvastoggleIcon) {
            this.offcanvastoggleIcon.style.fill = "white";
        }

        const categoryCollapse: HTMLElement | null = document.getElementById('category-collapse');
        if (categoryCollapse) {
            categoryCollapse.addEventListener('shown.bs.collapse', function (): void {
                if (that.incomes) {
                    for (let j: number = 0; j < that.incomes.length; j++) {
                        (that.incomes[j] as HTMLElement).style.backgroundColor = '#0D6EFD';
                        (that.incomes[j].children[0] as HTMLElement).style.color = 'white';
                        (that.incomes[j] as HTMLElement).style.setProperty('border-top-right-radius', '0', 'important');
                        (that.incomes[j] as HTMLElement).style.setProperty('border-top-left-radius', '0', 'important');
                        (that.incomes[j] as HTMLElement).style.setProperty('border-bottom-right-radius', '0', 'important');
                        (that.incomes[j] as HTMLElement).style.setProperty('border-bottom-left-radius', '0', 'important');
                    }
                }
                for (let i: number = 0; i < that.categoryNavItem.length; i++) {
                    (that.categoryNavItem[i] as HTMLElement).style.border = "1px solid #0D6EFD";
                    (that.categoryNavItem[i] as HTMLElement).style.borderRadius = "7px";
                }

                for (let i: number = 0; i < that.expenses.length; i++) {
                    (that.expenses[i] as HTMLElement).style.setProperty('border-top-right-radius', '0', 'important');
                    (that.expenses[i] as HTMLElement).style.setProperty('border-top-left-radius', '0', 'important');
                }

                if (that.category) {
                    that.category.style.setProperty('border-bottom-left-radius', '0', 'important');
                    that.category.style.setProperty('border-bottom-right-radius', '0', 'important');
                    that.category.setAttribute('aria-expanded', 'true');
                }
                if (that.offcanvasCategory) {
                    that.offcanvasCategory.style.setProperty('border-bottom-left-radius', '0', 'important');
                    that.offcanvasCategory.style.setProperty('border-bottom-right-radius', '0', 'important');
                    that.offcanvasCategory.setAttribute('aria-expanded', 'true');
                }
            });

            categoryCollapse.addEventListener('hidden.bs.collapse', function (): void {
                for (let j: number = 0; j < that.incomes.length; j++) {
                    (that.incomes[j] as HTMLElement).style.backgroundColor = '';
                    for (let i: number = 0; i < that.categoryNavItem.length; i++) {
                        (that.categoryNavItem[i] as HTMLElement).style.border = "none";
                    }
                }
                if (that.category) {
                    that.category.style.setProperty('border-bottom-left-radius', '7px', 'important');
                    that.category.style.setProperty('border-bottom-right-radius', '7px', 'important');
                    that.category.setAttribute('aria-expanded', 'false');
                }
                if (that.offcanvasCategory) {
                    that.offcanvasCategory.style.setProperty('border-bottom-left-radius', '7px', 'important');
                    that.offcanvasCategory.style.setProperty('border-bottom-right-radius', '7px', 'important');
                    that.offcanvasCategory.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
}
