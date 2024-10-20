import datepicker, {DatepickerInstance} from "js-datepicker";
import {FileUtils} from "../../utils/file-utils";
import {HttpUtils} from "../../utils/http-utils";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoriesOperationsCreateResponse} from "../types/category-operations-create-response";
import {OperationEditResponseType} from "../types/operation-edit-response.type";

export class EditOperations {
    readonly openNewRoute: (url: string) => void;
    readonly title: HTMLElement | null;
    readonly typeSelect: HTMLElement | null;
    readonly categorySelect: HTMLElement | null;
    readonly dateInputElement: HTMLElement | null;
    private commentInputElement: HTMLElement | null;
    private sumInput: HTMLElement | null;
    readonly editBtn: HTMLElement | null;
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
    readonly id: number | null;

    constructor(openNewRoute: { (url: string): Promise<void>; (url: string): void; }) {
        this.openNewRoute = openNewRoute;

        this.title = document.getElementById('edit-operations-title')
        this.typeSelect = document.getElementById('type-select');
        this.categorySelect = document.getElementById('category-select');

        this.dateInputElement = document.getElementById('date-input');
        this.commentInputElement = document.getElementById('comment-input');
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

        this.editBtn = document.getElementById('editBtn')
        this.id = Number(localStorage.getItem('rowData-id'));

        this.stylesLayoutCanvas();

        FileUtils.updateBalance().then();
        FileUtils.showCanvasBalance().then();
        FileUtils.showBalance().then();
        FileUtils.showName();
        this.init().then()
        if (this.typeSelect) {
            this.typeSelect.addEventListener('change', (): void => {
                localStorage.setItem('operationType', (this.typeSelect as HTMLInputElement).value);
                this.updateTitle();
                this.loadCategories().then();
            });

            this.editOperations();
        }
    }

    private updateTitle(): void {
        const operationType: string | null = localStorage.getItem('operationType')
        if (operationType === 'income') {
            if (this.title) {
                this.title.innerText = 'Редактирование дохода'
            }
        } else if (operationType === 'expense') {
            if (this.title) {
                this.title.innerText = 'Редактирование расхода'
            }
        }
    }

    private async init(): Promise<void> {
        const result: DefaultResponseType | OperationEditResponseType = await HttpUtils.request('/operations/' + this.id)

        if (result && (result as OperationEditResponseType).response) {
            (this.typeSelect as HTMLInputElement).value = (result as OperationEditResponseType).response.type;
            localStorage.setItem('operationType', (this.typeSelect as HTMLInputElement).value);
            (this.sumInput as HTMLInputElement).value = ((result as OperationEditResponseType).response.amount).toString();
            (this.dateInputElement as HTMLInputElement).value = (result as OperationEditResponseType).response.date;
            (this.commentInputElement as HTMLInputElement).value = (result as OperationEditResponseType).response.comment;
            this.updateTitle();
            await this.loadCategories();

            const categoryId = await this.getCategoryIdByTitle((result as OperationEditResponseType).response.category);
            if (categoryId && categoryId !== undefined) {
                (this.categorySelect as HTMLSelectElement).value = categoryId.toString();
            }     
        }

    }

    private editOperations(): void {
        if (this.editBtn) {
            this.editBtn.addEventListener('click', async (): Promise<void> => {
                const operationType: string = (this.typeSelect as HTMLInputElement).value;
                if (this.validateForm()) {
                    const categoryId: number = Number((this.categorySelect as HTMLSelectElement).value);

                    await HttpUtils.request('/operations/' + this.id, 'PUT', true, {
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
            })
        }

        FileUtils.updateBalance().then();
        FileUtils.showCanvasBalance().then();
        FileUtils.showBalance().then();
    }

    private formatDate(date: Date): string {
        const year: number = date.getFullYear();
        const month: string = String(date.getMonth() + 1).padStart(2, '0');
        const day: string = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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

    private createCategories(categories: [{ id: number; title: string; }]): void {
        if (this.categorySelect) {
            this.categorySelect.innerHTML = '';
        }

        for (const cat of categories) {
            const option: HTMLOptionElement = document.createElement('option');
            option.innerText = cat.title;
            option.value = (cat.id).toString();
            if (this.categorySelect) {
                this.categorySelect.appendChild(option);
            }
        }
    }

    private async getCategoryIdByTitle(title: string): Promise<string | null> {
        const options: HTMLOptionElement[] = Array.from((this.categorySelect as HTMLSelectElement).options);
        const selectedOption: HTMLOptionElement | undefined = options.find((option: HTMLOptionElement) => option.innerText === title);
        return selectedOption ? selectedOption.value : null;
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if ((this.sumInput as HTMLInputElement).value) {
            (this.sumInput as HTMLInputElement).classList.remove('is-invalid');
        } else {
            (this.sumInput as HTMLInputElement).classList.add('is-invalid');
            isValid = false;
        }

        if ((this.dateInputElement as HTMLInputElement).value) {
            (this.dateInputElement as HTMLInputElement).classList.remove('is-invalid');
        } else {
            (this.dateInputElement as HTMLInputElement).classList.add('is-invalid');
            isValid = false;
        }
        if ((this.commentInputElement as HTMLInputElement).value) {
            (this.commentInputElement as HTMLInputElement).classList.remove('is-invalid');
        } else {
            (this.commentInputElement as HTMLInputElement).classList.add('is-invalid');
            isValid = false;
        }

        return isValid
    }

    private stylesLayoutCanvas(): void {
        //Layout and Offcanvas
        
if(this.operationsNavItem) {
     for (let i: number = 0; i < this.operationsNavItem.length; i++) {
            (this.operationsNavItem[i] as HTMLElement).style.backgroundColor = '#0D6EFD';
            (this.operationsNavItem[i] as HTMLElement).style.setProperty('border-radius', '7px', 'important');
        }
}
       
        
if(this.operationsLink) {
        for (let i: number = 0; i < this.operationsLink.length; i++) {
            (this.operationsLink[i] as HTMLElement).style.color = "white";
        }
    }
    if(this.operationsSvg) {
        for (let i: number = 0; i < this.operationsSvg.length; i++) {
            (this.operationsSvg[i] as HTMLElement).style.fill = 'white';
        }
    }
        const that: EditOperations = this;
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
