import {FileUtils} from "../../utils/file-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class Expenses {
    constructor() {
        this.stylesLayoutCanvas();

        FileUtils.showCanvasBalance().then();

        this.cards = document.querySelector('.cards')
        this.cardAddExpense = document.getElementById('card-add-expense')

        this.createCards().then();
    }

    async createCards() {
        const result = await HttpUtils.request('/categories/expense')

        if (!result.error && result.response) {
            for (let i = 0; i < result.response.length; i++) {
                let card = document.createElement("div");
                card.classList = "card p-3 rounded-3";

                let cardBody = document.createElement("div");
                cardBody.classList = "card-body p-1";

                let cardTitle = document.createElement("h2");
                cardTitle.classList = "card-title mb-2";
                cardTitle.innerText = result.response[i].title;

                let btnEdit = document.createElement("a");
                btnEdit.setAttribute('href', "/categories/expense/edit");
                btnEdit.classList = "btn btn-primary py-2 px-3 me-2";
                btnEdit.innerText = "Редактировать";
                btnEdit.setAttribute('data-id', result.response[i].id);
                btnEdit.addEventListener('click', function () {
                    localStorage.setItem('editExpenseId', result.response[i].id);
                })


                let btnDelete = document.createElement("a");
                btnDelete.setAttribute('href', "#");
                btnDelete.classList = "btn btn-danger py-2 px-3 delete";
                btnDelete.innerText = "Удалить";
                btnDelete.setAttribute('data-id', result.response[i].id);

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(btnEdit);
                cardBody.appendChild(btnDelete);
                card.appendChild(cardBody);
                this.cards.insertBefore(card, this.cardAddExpense);
            }

            let popUp = document.getElementById('pop-up');
            this.deletePopUpBtns = document.querySelectorAll('.delete');

            this.deletePopUpBtns.forEach(delBtn => {
                delBtn.addEventListener('click', function () {
                    const id = delBtn.getAttribute('data-id');

                    popUp.classList.remove('d-none');
                    popUp.classList.add('d-flex');

                    const agreeDelete = document.getElementById('agree-delete');
                    const disagreeDelete = document.getElementById('disagree-delete');
                    if (id) {
                        agreeDelete.onclick = async function () {
                            const delResult = await HttpUtils.request('/categories/expense/' + id, "DELETE", true)

                            if (!delResult.error) {
                                const elementToRemove = document.querySelector(`[data-id='${id}']`).closest('.card');
                                if (elementToRemove) {
                                    elementToRemove.remove();
                                }
                            }

                            popUp.classList.remove('d-flex');
                            popUp.classList.add('d-none');

                        }
                        disagreeDelete.onclick = function () {
                            popUp.classList.remove('d-flex');
                            popUp.classList.add('d-none');
                        }
                    }
                })
            })
        }

    }

    stylesLayoutCanvas() {
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


        const that = this;
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
