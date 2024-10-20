import {FileUtils} from "../../utils/file-utils";
import {HttpUtils} from "../../utils/http-utils";

export class EditExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.editExpenseInput = document.getElementById('edit-expenses-input');
        this.editExpenseId = parseInt(localStorage.getItem('editExpenseId'));

        this.init().then(title => {
            this.editExpenseInput.value = title;
        });
        this.saveBtn = document.getElementById('saveBtn');
        this.stylesLayoutCanvas();


        FileUtils.updateBalance().then();
        FileUtils.showCanvasBalance().then();
        FileUtils.showBalance().then();
        FileUtils.showName();

        this.editExpense().then();
    }

    async init() {
        const result = await HttpUtils.request('/categories/expense/' + this.editExpenseId)
        if (result) {
            return result.response.title;
        }

    }

    async editExpense() {
        const that = this;
        this.saveBtn.addEventListener('click', async function () {
            const result = await HttpUtils.request('/categories/expense/' + that.editExpenseId, 'PUT', true, {
                title: that.editExpenseInput.value
            })

            that.openNewRoute('/categories/expense')
        })
    }

    stylesLayoutCanvas() {
        const that = this;
        //Layout
        this.category = document.getElementById('category');
        this.toggleIcon = document.getElementById('toggleIcon');
        this.expenses = document.querySelectorAll('.expenses-link');
        this.incomes = document.querySelectorAll('.incomes-link');
        this.categoryNavItem = document.querySelectorAll('.category-nav-item');

        this.category.style.backgroundColor = '#0D6EFD';
        this.category.style.color = "white";
        this.toggleIcon.style.fill = "white";

        //OffCanvas Layout
        this.offcanvasCategory = document.getElementById('offcanvas-category');
        this.offcanvastoggleIcon = document.getElementById('offcanvas-toggleIcon')

        this.offcanvasCategory.style.backgroundColor = '#0D6EFD';
        this.offcanvasCategory.style.color = "white";
        this.offcanvastoggleIcon.style.fill = "white";

        document.getElementById('category-collapse').addEventListener('shown.bs.collapse', function () {
            for (let i = 0; i < that.categoryNavItem.length; i++) {
                that.categoryNavItem[i].style.border = "1px solid #0D6EFD";
                that.categoryNavItem[i].style.borderRadius = "7px";
            }
            for (let i = 0; i < that.incomes.length; i++) {
                that.incomes[i].style.setProperty('border-top-right-radius', '0', 'important');
                that.incomes[i].style.setProperty('border-top-left-radius', '0', 'important');
                that.incomes[i].style.setProperty('border-bottom-right-radius', '0', 'important');
                that.incomes[i].style.setProperty('border-bottom-left-radius', '0', 'important');

            }
            for (let j = 0; j < that.expenses.length; j++) {
                that.expenses[j].style.backgroundColor = '#0D6EFD';
                that.expenses[j].children[0].style.color = 'white';
                that.expenses[j].style.setProperty('border-bottom-left-radius', '6px', 'important');
                that.expenses[j].style.setProperty('border-bottom-right-radius', '6px', 'important');
                that.expenses[j].style.setProperty('border-top-right-radius', '0', 'important');
                that.expenses[j].style.setProperty('border-top-left-radius', '0', 'important');
            }

            that.category.style.setProperty('border-bottom-left-radius', '0', 'important');
            that.category.style.setProperty('border-bottom-right-radius', '0', 'important');
            that.category.setAttribute('aria-expanded', 'true');

            that.offcanvasCategory.style.setProperty('border-bottom-left-radius', '0', 'important');
            that.offcanvasCategory.style.setProperty('border-bottom-right-radius', '0', 'important');
            that.offcanvasCategory.setAttribute('aria-expanded', 'true');
        });

        document.getElementById('category-collapse').addEventListener('hidden.bs.collapse', function () {
            for (let j = 0; j < that.expenses.length; j++) {
                that.expenses[j].style.backgroundColor = '';
                for (let i = 0; i < that.categoryNavItem.length; i++) {
                    that.categoryNavItem[i].style.border = "none";
                }
            }

            that.category.style.setProperty('border-bottom-left-radius', '7px', 'important');
            that.category.style.setProperty('border-bottom-right-radius', '7px', 'important');
            that.category.setAttribute('aria-expanded', 'false');


            that.offcanvasCategory.style.setProperty('border-bottom-left-radius', '7px', 'important');
            that.offcanvasCategory.style.setProperty('border-bottom-right-radius', '7px', 'important');
            that.offcanvasCategory.setAttribute('aria-expanded', 'false');
        });
    }
}
