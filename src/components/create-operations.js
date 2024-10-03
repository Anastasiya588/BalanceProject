import datepicker from "js-datepicker";
import {FileUtils} from "../../utils/file-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class CreateOperations {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.title = document.getElementById('create-operations-title')

        this.typeSelect = document.getElementById('type-select');
        this.categorySelect = document.getElementById('category-select');

        this.dateInputElement = document.getElementById('date-input');
        this.commentInputElement = document.getElementById('comment-input');

        if (this.dateInputElement) {
            const chooseDate = datepicker(this.dateInputElement, {
                customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                overlayButton: "Ок",
                overlayPlaceholder: 'Введите год',
                showAllDates: true,
                onSelect: (instance, date) => {
                    this.dateInputElement.value = this.formatDate(date);
                }
            });
        }
        this.sumInput = document.getElementById('sum-input')

        this.saveBtn = document.getElementById('saveBtn')

        this.stylesLayoutCanvas();

        FileUtils.showCanvasBalance().then();

        this.loadInitialData();

        this.typeSelect.addEventListener('change', () => {
            localStorage.setItem('operationType', this.typeSelect.value);
            const operationType = localStorage.getItem('operationType');
            if (operationType === 'income') {
                this.title.innerText = 'Создание дохода'
            } else if (operationType === 'expense') {
                this.title.innerText = 'Создание расхода'
            }
            this.loadCategories().then();
        });

        this.createOperation().then();
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    loadInitialData() {
        const operationType = localStorage.getItem('operationType');
        if (operationType === 'income') {
            this.title.innerText = 'Создание дохода'
        } else if (operationType === 'expense') {
            this.title.innerText = 'Создание расхода'
        }

        if (operationType && this.typeSelect) {
            this.typeSelect.value = operationType;
            this.loadCategories().then();
        }
    }

    async loadCategories() {
        const type = this.typeSelect.value;
        let categoryUrl = '';

        if (type === 'income') {
            categoryUrl = '/categories/income';
        } else if (type === 'expense') {
            categoryUrl = '/categories/expense';
        }

        if (categoryUrl) {
            const result = await HttpUtils.request(categoryUrl);
            if (!result.error && result.response) {
                this.createCategories(result.response);
            }
        }

    }

    createCategories(categories) {
        this.categorySelect.innerHTML = '';
        for (const cat of categories) {
            const option = document.createElement('option');
            option.innerText = cat.title;
            option.value = cat.id;
            this.categorySelect.appendChild(option);
        }
    }

    validateForm() {
        let isValid = true;
        if (this.sumInput.value) {
            this.sumInput.classList.remove('is-invalid');
        } else {
            this.sumInput.classList.add('is-invalid');
            isValid = false;
        }

        if (this.dateInputElement.value) {
            this.dateInputElement.classList.remove('is-invalid');
        } else {
            this.dateInputElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.commentInputElement.value) {
            this.commentInputElement.classList.remove('is-invalid');
        } else {
            this.commentInputElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid
    }

    async createOperation() {
        this.saveBtn.addEventListener('click', async () => {
            const operationType = this.typeSelect.value;

            if (this.validateForm() === true) {
                const categoryId = Number(this.categorySelect.value);

                const result = await HttpUtils.request('/operations', 'POST', true, {
                    type: operationType,
                    amount: this.sumInput.value,
                    date: this.dateInputElement.value,
                    comment: this.commentInputElement.value,
                    category_id: categoryId
                })

                this.openNewRoute('/operations');
                this.sumInput.value = '';
                this.dateInputElement.value = '';
                this.commentInputElement.value = '';
            }

        })
    }

    stylesLayoutCanvas() {
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

        for (let i = 0; i < this.operationsNavItem.length; i++) {
            this.operationsNavItem[i].style.backgroundColor = '#0D6EFD';
            this.operationsNavItem[i].style.setProperty('border-radius', '7px', 'important');
        }

        for (let i = 0; i < this.operationsLink.length; i++) {
            this.operationsLink[i].style.color = "white";
        }

        for (let i = 0; i < this.operationsSvg.length; i++) {
            this.operationsSvg[i].style.fill = 'white';
        }

        const that = this;
        document.getElementById('category-collapse').addEventListener('shown.bs.collapse', function () {
            for (let j = 0; j < that.incomes.length; j++) {
                that.categoryNavItem[j].style.border = "1px solid #0D6EFD";
                that.categoryNavItem[j].style.borderRadius = "7px";
            }
            for (let i = 0; i < that.incomes.length; i++) {
                that.incomes[i].style.setProperty('border-top-right-radius', '0', 'important');
                that.incomes[i].style.setProperty('border-top-left-radius', '0', 'important');
                that.incomes[i].style.setProperty('border-bottom-right-radius', '0', 'important');
                that.incomes[i].style.setProperty('border-bottom-left-radius', '0', 'important');

            }
            for (let i = 0; i < that.expenses.length; i++) {
                that.expenses[i].style.setProperty('border-top-right-radius', '0', 'important');
                that.expenses[i].style.setProperty('border-top-left-radius', '0', 'important');
            }

            that.category.style.backgroundColor = '#0D6EFD';
            that.category.style.color = 'white';
            that.toggleIcon.style.fill = 'white';

            that.category.style.setProperty('border-top-right-radius', '6px', 'important');
            that.category.style.setProperty('border-top-left-radius', '6px', 'important');
            that.category.style.setProperty('border-bottom-right-radius', '0', 'important');
            that.category.style.setProperty('border-bottom-left-radius', '0', 'important');
            that.category.setAttribute('aria-expanded', 'true');

            that.offcanvasCategory.style.backgroundColor = '#0D6EFD';
            that.offcanvasCategory.style.color = 'white';
            that.offCanvasToggleIcon.style.fill = 'white';

            that.offcanvasCategory.style.setProperty('border-top-right-radius', '6px', 'important');
            that.offcanvasCategory.style.setProperty('border-top-left-radius', '6px', 'important');
            that.offcanvasCategory.style.setProperty('border-bottom-right-radius', '0', 'important');
            that.offcanvasCategory.style.setProperty('border-bottom-left-radius', '0', 'important');
            that.offcanvasCategory.setAttribute('aria-expanded', 'true');
        });

        document.getElementById('category-collapse').addEventListener('hidden.bs.collapse', function () {
            for (let i = 0; i < that.categoryNavItem.length; i++) {
                that.categoryNavItem[i].style.border = "none";
            }
            that.category.style.backgroundColor = '';
            that.category.style.color = '';
            that.toggleIcon.style.fill = '';

            that.offcanvasCategory.style.backgroundColor = '';
            that.offcanvasCategory.style.color = '';
            that.offCanvasToggleIcon.style.fill = '';

            that.category.style.setProperty('border-bottom-left-radius', '7px', 'important');
            that.category.style.setProperty('border-bottom-right-radius', '7px', 'important');
            that.category.setAttribute('aria-expanded', 'false');

            that.offcanvasCategory.style.setProperty('border-bottom-left-radius', '7px', 'important');
            that.offcanvasCategory.style.setProperty('border-bottom-right-radius', '7px', 'important');
            that.offcanvasCategory.setAttribute('aria-expanded', 'false');
        });
    }
}
