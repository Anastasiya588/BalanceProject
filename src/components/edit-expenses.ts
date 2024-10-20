import {FileUtils} from "../../utils/file-utils";
import {HttpUtils} from "../../utils/http-utils";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoryExpenseEditResponse} from "../types/category-expense-edit-response";

export class EditExpenses {
    readonly openNewRoute: (url: string) => void;
    private editExpenseInput: HTMLElement | null;
    readonly saveBtn: HTMLElement | null;
    readonly editExpenseId: string | null;
    private category: HTMLElement | null;
    private toggleIcon: HTMLElement | null;
    private expenses: NodeListOf<Element>;
    private incomes: NodeListOf<Element>;
    private categoryNavItem: NodeListOf<Element>;
    private offcanvasCategory: HTMLElement | null;
    private offcanvastoggleIcon: HTMLElement | null;

    constructor(openNewRoute: { (url: string): Promise<void>; (url: string): void; }) {
        this.openNewRoute = openNewRoute;

        this.editExpenseInput = document.getElementById('edit-expenses-input');
        this.category = document.getElementById('category');
        this.toggleIcon = document.getElementById('toggleIcon');
        this.expenses = document.querySelectorAll('.expenses-link');
        this.incomes = document.querySelectorAll('.incomes-link');
        this.categoryNavItem = document.querySelectorAll('.category-nav-item');
        this.offcanvasCategory = document.getElementById('offcanvas-category');
        this.offcanvastoggleIcon = document.getElementById('offcanvas-toggleIcon');
        this.editExpenseId= localStorage.getItem('editExpenseId');

        this.init().then((title: string|undefined): void => {
            if(title) {
                (this.editExpenseInput as HTMLInputElement).value = title;
            }
            
        });
        this.saveBtn = document.getElementById('saveBtn');
        this.stylesLayoutCanvas();


        FileUtils.updateBalance().then();
        FileUtils.showCanvasBalance().then();
        FileUtils.showBalance().then();
        FileUtils.showName();

        this.editExpense().then();
    }

    private async init(): Promise<string|undefined> {
        const result: DefaultResponseType | CategoryExpenseEditResponse = await HttpUtils.request('/categories/expense/' + this.editExpenseId)
        if (result) {
            return (result as CategoryExpenseEditResponse).response.title;
        }

    }

    private async editExpense(): Promise<void> {
        const that: EditExpenses = this;
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', async function (): Promise<void> {
                await HttpUtils.request('/categories/expense/' + that.editExpenseId, 'PUT', true, {
                    title: (that.editExpenseInput as HTMLInputElement).value
                })

                that.openNewRoute('/categories/expense')
            })
        }
    }

    private stylesLayoutCanvas(): void {
        const that: EditExpenses = this;
        //Layout
        

        if (this.category) {
            this.category.style.backgroundColor = '#0D6EFD';
            this.category.style.color = "white";
        }

        if (this.toggleIcon) {
            this.toggleIcon.style.fill = "white";
        }

        //OffCanvas Layout
        

        if (this.offcanvasCategory) {
            this.offcanvasCategory.style.backgroundColor = '#0D6EFD';
            this.offcanvasCategory.style.color = "white";
        }
        if (this.offcanvastoggleIcon) {
            this.offcanvastoggleIcon.style.fill = "white";
        }
        const categoryCollapse: HTMLElement | null = document.getElementById('category-collapse');
        if (categoryCollapse) {
            categoryCollapse.addEventListener('shown.bs.collapse', function () {
                for (let i: number = 0; i < that.categoryNavItem.length; i++) {
                    (that.categoryNavItem[i] as HTMLElement).style.border = "1px solid #0D6EFD";
                    (that.categoryNavItem[i] as HTMLElement).style.borderRadius = "7px";
                }
                for (let i: number = 0; i < that.incomes.length; i++) {
                    (that.incomes[i] as HTMLElement).style.setProperty('border-top-right-radius', '0', 'important');
                    (that.incomes[i] as HTMLElement).style.setProperty('border-top-left-radius', '0', 'important');
                    (that.incomes[i] as HTMLElement).style.setProperty('border-bottom-right-radius', '0', 'important');
                    (that.incomes[i] as HTMLElement).style.setProperty('border-bottom-left-radius', '0', 'important');

                }
                for (let j: number = 0; j < that.expenses.length; j++) {
                    (that.expenses[j] as HTMLElement).style.backgroundColor = '#0D6EFD';
                    (that.expenses[j].children[0] as HTMLElement).style.color = 'white';
                    (that.expenses[j] as HTMLElement).style.setProperty('border-bottom-left-radius', '6px', 'important');
                    (that.expenses[j] as HTMLElement).style.setProperty('border-bottom-right-radius', '6px', 'important');
                    (that.expenses[j] as HTMLElement).style.setProperty('border-top-right-radius', '0', 'important');
                    (that.expenses[j] as HTMLElement).style.setProperty('border-top-left-radius', '0', 'important');
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
                for (let j: number = 0; j < that.expenses.length; j++) {
                    (that.expenses[j] as HTMLElement).style.backgroundColor = '';
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
