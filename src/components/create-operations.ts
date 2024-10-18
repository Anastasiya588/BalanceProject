import datepicker, {DatepickerInstance} from "js-datepicker";
import {FileUtils} from "../../utils/file-utils";
import {HttpUtils} from "../../utils/http-utils";
import {DefaultResponseType} from "../types/default-response.type";
import { CategoriesOperationsCreateResponse} from "../types/category-operations-create-response";

export class CreateOperations {
    readonly openNewRoute: (url: string) => void;
    readonly title: HTMLElement | null;
    readonly typeSelect: HTMLElement | null;
    private categorySelect: HTMLElement | null;
    readonly dateInputElement: HTMLElement | null;
    private commentInputElement: HTMLElement | null;
    private sumInput: HTMLElement | null;
    private saveBtn: HTMLElement | null;

    private operationsNavItem: NodeListOf<Element> | null;
    private operationsLink: HTMLCollectionOf<Element> | null;
    private operationsSvg: NodeListOf<Element> | null;
    private category: HTMLElement | null;
    private offcanvasCategory: HTMLElement | null;
    private toggleIcon: HTMLElement | null;
    private offCanvasToggleIcon: HTMLElement | null;
    private expenses: NodeListOf<Element> | null;
    private incomes: NodeListOf<Element> | null;
    private categoryNavItem: NodeListOf<Element> | null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.title = document.getElementById('create-operations-title')

        this.typeSelect = document.getElementById('type-select');
        this.categorySelect = document.getElementById('category-select');

        this.dateInputElement = document.getElementById('date-input');
        this.commentInputElement = document.getElementById('comment-input');

        if (this.dateInputElement) {
            const chooseDate: DatepickerInstance = datepicker(this.dateInputElement, {
                customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                overlayButton: "Ок",
                overlayPlaceholder: 'Введите год',
                showAllDates: true,
                onSelect: (instance: DatepickerInstance, date: Date | undefined): void => {
                    (this.dateInputElement as HTMLInputElement).value = this.formatDate(date as Date);
                }
            });
        }
        this.sumInput = document.getElementById('sum-input')

        this.saveBtn = document.getElementById('saveBtn')

        this.stylesLayoutCanvas();


        FileUtils.updateBalance().then();
        FileUtils.showCanvasBalance().then();
        FileUtils.showBalance().then();
        FileUtils.showName();

        this.loadInitialData();
        if (this.typeSelect) {
            this.typeSelect.addEventListener('change', (): void => {
                localStorage.setItem('operationType', (this.typeSelect as HTMLInputElement).value);
                const operationType: string | null = localStorage.getItem('operationType');
                if (operationType === 'income') {
                    if (this.title) {
                        this.title.innerText = 'Создание дохода'
                    }

                } else if (operationType === 'expense') {
                    if (this.title) {
                        this.title.innerText = 'Создание расхода'
                    }
                }
                this.loadCategories().then();
            });
        }


        this.createOperation().then();
    }

    private formatDate(date: Date): string {
        const year: number = date.getFullYear();
        const month: string = String(date.getMonth() + 1).padStart(2, '0');
        const day: string = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private loadInitialData(): void {
        const operationType: string | null = localStorage.getItem('operationType');
        if (operationType === 'income') {
            if (this.title) {
                this.title.innerText = 'Создание дохода'
            }

        } else if (operationType === 'expense') {
            if (this.title) {
                this.title.innerText = 'Создание расхода'
            }

        }

        if (operationType && this.typeSelect) {
            (this.typeSelect as HTMLInputElement).value = operationType;
            this.loadCategories().then();
        }
    }

    private async loadCategories(): Promise<void> {
        const type: string = (this.typeSelect as HTMLInputElement).value;
        let categoryUrl: string = '';

        if (type === 'income') {
            categoryUrl = '/categories/income';
        } else if (type === 'expense') {
            categoryUrl = '/categories/expense';
        }

        if (categoryUrl) {
            const result: DefaultResponseType | CategoriesOperationsCreateResponse = await HttpUtils.request(categoryUrl);
            if (!(result as DefaultResponseType).error && (result as CategoriesOperationsCreateResponse).response) {
                this.createCategories((result as CategoriesOperationsCreateResponse).response);
            }
        }

    }

    private createCategories(categories): void {
        if (this.categorySelect) {
            this.categorySelect.innerHTML = '';
        }

        for (const cat of categories) {
            const option: HTMLOptionElement = document.createElement('option');
            option.innerText = cat.title;
            option.value = cat.id;
            if (this.categorySelect) {
                this.categorySelect.appendChild(option);
            }
        }
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if (this.sumInput) {
            if ((this.sumInput as HTMLInputElement).value) {
                this.sumInput.classList.remove('is-invalid');
            } else {
                this.sumInput.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (this.dateInputElement) {
            if ((this.dateInputElement as HTMLInputElement).value) {
                this.dateInputElement.classList.remove('is-invalid');
            } else {
                this.dateInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        if (this.commentInputElement) {
            if ((this.commentInputElement as HTMLInputElement).value) {
                this.commentInputElement.classList.remove('is-invalid');
            } else {
                this.commentInputElement.classList.add('is-invalid');
                isValid = false;
            }
        }

        return isValid
    }

    private async createOperation(): Promise<void> {
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', async (): Promise<void> => {
                const operationType: string = (this.typeSelect as HTMLInputElement).value;

                if (this.validateForm()) {
                    const categoryId: number = Number((this.categorySelect as HTMLInputElement).value);

                    await HttpUtils.request('/operations', 'POST', true, {
                        type: operationType,
                        amount: Number((this.sumInput as HTMLInputElement).value),
                        date: (this.dateInputElement as HTMLInputElement).value,
                        comment: (this.commentInputElement as HTMLInputElement).value,
                        category_id: categoryId
                    })

                    this.openNewRoute('/operations');
                    (this.sumInput as HTMLInputElement).value = '';
                    (this.dateInputElement as HTMLInputElement).value = '';
                    (this.commentInputElement as HTMLInputElement).value = '';
                }

                FileUtils.updateBalance().then();
            })
        }

    }

    private stylesLayoutCanvas(): void {
        //Layout and Offcanvas
        this.operationsNavItem = document.querySelectorAll('.operations-nav-item');
        this.operationsLink = document.getElementsByClassName('operations-link');
        this.operationsSvg = document.querySelectorAll('.bi-cash-coin');

        this.category = document.getElementById('category');
        this.offcanvasCategory = document.getElementById('offcanvas-category');
        this.toggleIcon = document.getElementById('toggleIcon');
        this.offCanvasToggleIcon = document.getElementById('offcanvas-toggleIcon');
        this.expenses = document.querySelectorAll('.expenses-link');
        this.incomes = document.querySelectorAll('.incomes-link');
        this.categoryNavItem = document.querySelectorAll('.category-nav-item');

        for (let i: number = 0; i < this.operationsNavItem.length; i++) {
            (this.operationsNavItem[i] as HTMLElement).style.backgroundColor = '#0D6EFD';
            (this.operationsNavItem[i] as HTMLElement).style.setProperty('border-radius', '7px', 'important');
        }

        for (let i: number = 0; i < this.operationsLink.length; i++) {
            (this.operationsLink[i] as HTMLElement).style.color = "white";
        }

        for (let i: number = 0; i < this.operationsSvg.length; i++) {
            (this.operationsSvg[i] as HTMLElement).style.fill = 'white';
        }

        const that: CreateOperations = this;
        const categoryCollapse: HTMLElement | null = document.getElementById('category-collapse');
        if (categoryCollapse) {
            categoryCollapse.addEventListener('shown.bs.collapse', function (): void {
                if (that.incomes) {
                    for (let j: number = 0; j < that.incomes.length; j++) {
                        if (that.categoryNavItem) {
                            (that.categoryNavItem[j] as HTMLElement).style.border = "1px solid #0D6EFD";
                            (that.categoryNavItem[j] as HTMLElement).style.borderRadius = "7px";
                        }
                    }
                    for (let i: number = 0; i < that.incomes.length; i++) {
                        (that.incomes[i] as HTMLElement).style.setProperty('border-top-right-radius', '0', 'important');
                        (that.incomes[i] as HTMLElement).style.setProperty('border-top-left-radius', '0', 'important');
                        (that.incomes[i] as HTMLElement).style.setProperty('border-bottom-right-radius', '0', 'important');
                        (that.incomes[i] as HTMLElement).style.setProperty('border-bottom-left-radius', '0', 'important');

                    }
                }
                if (that.expenses) {
                    for (let i: number = 0; i < that.expenses.length; i++) {
                        (that.expenses[i] as HTMLElement).style.setProperty('border-top-right-radius', '0', 'important');
                        (that.expenses[i] as HTMLElement).style.setProperty('border-top-left-radius', '0', 'important');
                    }
                }

                if (that.category) {
                    that.category.style.backgroundColor = '#0D6EFD';
                    that.category.style.color = 'white';
                    that.category.style.setProperty('border-top-right-radius', '6px', 'important');
                    that.category.style.setProperty('border-top-left-radius', '6px', 'important');
                    that.category.style.setProperty('border-bottom-right-radius', '0', 'important');
                    that.category.style.setProperty('border-bottom-left-radius', '0', 'important');
                    that.category.setAttribute('aria-expanded', 'true');
                }

                if (that.toggleIcon) {
                    that.toggleIcon.style.fill = 'white';
                }

                if (that.offcanvasCategory) {
                    that.offcanvasCategory.style.backgroundColor = '#0D6EFD';
                    that.offcanvasCategory.style.color = 'white';
                    that.offcanvasCategory.style.setProperty('border-top-right-radius', '6px', 'important');
                    that.offcanvasCategory.style.setProperty('border-top-left-radius', '6px', 'important');
                    that.offcanvasCategory.style.setProperty('border-bottom-right-radius', '0', 'important');
                    that.offcanvasCategory.style.setProperty('border-bottom-left-radius', '0', 'important');
                    that.offcanvasCategory.setAttribute('aria-expanded', 'true');
                }
                if (that.offCanvasToggleIcon) {
                    that.offCanvasToggleIcon.style.fill = 'white';
                }


            });

            categoryCollapse.addEventListener('hidden.bs.collapse', function (): void {
                if (that.categoryNavItem) {
                    for (let i: number = 0; i < that.categoryNavItem.length; i++) {
                        (that.categoryNavItem[i] as HTMLElement).style.border = "none";
                    }
                }
                if (that.category) {
                    that.category.style.backgroundColor = '';
                    that.category.style.color = '';
                    that.category.style.setProperty('border-bottom-left-radius', '7px', 'important');
                    that.category.style.setProperty('border-bottom-right-radius', '7px', 'important');
                    that.category.setAttribute('aria-expanded', 'false');
                }
                if (that.toggleIcon) {
                    that.toggleIcon.style.fill = '';
                }
                if (that.offcanvasCategory) {
                    that.offcanvasCategory.style.backgroundColor = '';
                    that.offcanvasCategory.style.color = '';
                    that.offcanvasCategory.style.setProperty('border-bottom-left-radius', '7px', 'important');
                    that.offcanvasCategory.style.setProperty('border-bottom-right-radius', '7px', 'important');
                    that.offcanvasCategory.setAttribute('aria-expanded', 'false');
                }
                if (that.offCanvasToggleIcon) {
                    that.offCanvasToggleIcon.style.fill = '';
                }
            });
        }
    }
}
