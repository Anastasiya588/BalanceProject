import {FileUtils} from "../../utils/file-utils";
import {HttpUtils} from "../../utils/http-utils";

export class CreateIncomes {
    readonly openNewRoute: (url: string) => void;
    private createIncomeInput: HTMLElement | null;
    readonly saveBtn: HTMLElement | null;
    private category: HTMLElement | null;
    private toggleIcon: HTMLElement | null;
    private expenses: NodeListOf<Element>;
    private incomes: NodeListOf<Element>;
    private categoryNavItem: NodeListOf<Element>;
    private offcanvasCategory: HTMLElement | null;
    private offcanvastoggleIcon: HTMLElement | null;

    constructor(openNewRoute:{ (url: string): Promise<void>; (url: string): void; }) {
        this.openNewRoute = openNewRoute;

        this.createIncomeInput = document.getElementById('create-income-input');
        this.saveBtn = document.getElementById('saveBtn');

        this.category = document.getElementById('category');
        this.toggleIcon = document.getElementById('toggleIcon');
        this.expenses = document.querySelectorAll('.expenses-link');
        this.incomes = document.querySelectorAll('.incomes-link');
        this.categoryNavItem = document.querySelectorAll('.category-nav-item');
        this.offcanvasCategory = document.getElementById('offcanvas-category');
        this.offcanvastoggleIcon = document.getElementById('offcanvas-toggleIcon');

        this.stylesLayoutCanvas()

        FileUtils.updateBalance().then();
        FileUtils.showCanvasBalance().then();
        FileUtils.showBalance().then();
        FileUtils.showName();

        this.createIncome().then()
    }

    private async createIncome(): Promise<void> {
        const that: CreateIncomes = this;

        function updateSaveButtonState(): void {
            const inputValue: string = (that.createIncomeInput as HTMLInputElement).value.trim();
            const isDisabled: boolean = inputValue === '';
            if (that.saveBtn) {
                that.saveBtn.classList.toggle("disabled", isDisabled);
                that.saveBtn.style.pointerEvents = isDisabled ? 'none' : 'auto';
            }

        }

        if (that.createIncomeInput) {
            that.createIncomeInput.addEventListener('input', updateSaveButtonState);
        }
        updateSaveButtonState();
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', async function (): Promise<void> {
                await HttpUtils.request('/categories/income', 'POST', true, {
                    title: (that.createIncomeInput as HTMLInputElement).value
                });

                (that.createIncomeInput as HTMLInputElement).value = '';
                updateSaveButtonState();
                that.openNewRoute('/categories/income');
            })
        }
    }

    private stylesLayoutCanvas(): void {
        const that: CreateIncomes = this;
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
            categoryCollapse.addEventListener('shown.bs.collapse', function (): void {
                for (let j: number = 0; j < that.incomes.length; j++) {
                    (that.incomes[j] as HTMLElement).style.backgroundColor = '#0D6EFD';
                    (that.incomes[j].children[0] as HTMLElement).style.color = 'white';
                    (that.incomes[j] as HTMLElement).style.setProperty('border-top-right-radius', '0', 'important');
                    (that.incomes[j] as HTMLElement).style.setProperty('border-top-left-radius', '0', 'important');
                    (that.incomes[j] as HTMLElement).style.setProperty('border-bottom-right-radius', '0', 'important');
                    (that.incomes[j] as HTMLElement).style.setProperty('border-bottom-left-radius', '0', 'important');
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
                    that.category.style.backgroundColor = '#0D6EFD';
                    that.category.style.color = 'white';
                    that.category.style.setProperty('border-top-right-radius', '6px', 'important');
                    that.category.style.setProperty('border-top-left-radius', '6px', 'important');
                    that.category.style.setProperty('border-bottom-left-radius', '0', 'important');
                    that.category.style.setProperty('border-bottom-right-radius', '0', 'important');
                    that.category.setAttribute('aria-expanded', 'true');
                }
                if (that.toggleIcon) {
                    that.toggleIcon.style.fill = 'white';
                }
                if (that.offcanvasCategory) {
                    that.offcanvasCategory.style.setProperty('border-top-right-radius', '6px', 'important');
                    that.offcanvasCategory.style.setProperty('border-top-left-radius', '6px', 'important');
                    that.offcanvasCategory.style.setProperty('border-bottom-right-radius', '0', 'important');
                    that.offcanvasCategory.style.setProperty('border-bottom-left-radius', '0', 'important');
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
