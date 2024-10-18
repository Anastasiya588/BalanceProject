import {HttpUtils} from "../../utils/http-utils";
import {FileUtils} from "../../utils/file-utils";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoriesIncomeResponse} from "../types/categories-income-response";

export class Incomes {
    readonly openNewRoute: (url: string) => void;
    readonly cards: Element | null;
    readonly cardAddIncome: HTMLElement | null;
    private deletePopUpBtns: NodeListOf<Element> | null;

    private category: HTMLElement | null;
    private offcanvasCategory: HTMLElement | null;
    private toggleIcon: HTMLElement | null;
    private offcanvastoggleIcon: HTMLElement | null;
    private expenses: NodeListOf<Element> | null;
    private incomes: NodeListOf<Element> | null;
    private categoryNavItem: NodeListOf<Element> | null;

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.stylesLayoutCanvas();


        FileUtils.updateBalance().then();
        FileUtils.showCanvasBalance().then();
        FileUtils.showBalance().then();
        FileUtils.showName();

        this.cards = document.querySelector('.cards')
        this.cardAddIncome = document.getElementById('card-add-income');

        this.createCards().then();
    }

    private async createCards(): Promise<void> {
        const result: DefaultResponseType | CategoriesIncomeResponse = await HttpUtils.request('/categories/income')

        if (!(result as DefaultResponseType).error && (result as CategoriesIncomeResponse).response) {
            for (let i: number = 0; i < (result as CategoriesIncomeResponse).response.length; i++) {
                let card: HTMLDivElement = document.createElement("div");
                card.classList.add("card p-3 rounded-3");

                let cardBody: HTMLDivElement = document.createElement("div");
                cardBody.classList.add("card-body p-1");

                let cardTitle: HTMLHeadingElement = document.createElement("h2");
                cardTitle.classList.add("card-title mb-2");
                cardTitle.innerText = (result as CategoriesIncomeResponse).response[i].title;

                let btnEdit: HTMLAnchorElement = document.createElement("a");
                btnEdit.setAttribute('href', "/categories/income/edit");
                btnEdit.classList.add("btn btn-primary py-2 px-3 me-2");
                btnEdit.innerText = "Редактировать";
                btnEdit.setAttribute('data-id', ((result as CategoriesIncomeResponse).response[i].id).toString());
                btnEdit.addEventListener('click', function () {
                    localStorage.setItem('editIncomeId', ((result as CategoriesIncomeResponse).response[i].id).toString());
                })


                let btnDelete: HTMLAnchorElement = document.createElement("a");
                btnDelete.setAttribute('href', "#");
                btnDelete.classList.add("btn btn-danger py-2 px-3 delete");
                btnDelete.innerText = "Удалить";
                btnDelete.setAttribute('data-id', ((result as CategoriesIncomeResponse).response[i].id).toString());

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(btnEdit);
                cardBody.appendChild(btnDelete);
                card.appendChild(cardBody);
                if (this.cards) {
                    this.cards.insertBefore(card, this.cardAddIncome as HTMLElement);
                }

            }

            let popUp: HTMLElement | null = document.getElementById('pop-up');
            this.deletePopUpBtns = document.querySelectorAll('.delete');

            this.deletePopUpBtns.forEach((delBtn: Element): void => {
                delBtn.addEventListener('click', function (): void {
                    const id: number = Number(delBtn.getAttribute('data-id'));
                    if (popUp) {
                        popUp.classList.remove('d-none');
                        popUp.classList.add('d-flex');
                    }

                    const agreeDelete: HTMLElement | null = document.getElementById('agree-delete');
                    const disagreeDelete: HTMLElement | null = document.getElementById('disagree-delete');
                    if (id) {
                        if (agreeDelete) {
                            agreeDelete.onclick = async function (): Promise<void> {
                                const delResult: DefaultResponseType = await HttpUtils.request('/categories/income/' + id, "DELETE", true)

                                if (!delResult.error) {
                                    const elementToRemove: Element | null = document.querySelector(`[data-id='${id}']`).closest('.card');
                                    if (elementToRemove) {
                                        elementToRemove.remove();
                                    }
                                }
                                if (popUp) {
                                    popUp.classList.remove('d-flex');
                                    popUp.classList.add('d-none');
                                }


                            }
                        }
                        if (disagreeDelete) {
                            disagreeDelete.onclick = function (): void {
                                if (popUp) {
                                    popUp.classList.remove('d-flex');
                                    popUp.classList.add('d-none');
                                }
                            }
                        }
                    }
                })
            })
        }
    }

    private stylesLayoutCanvas(): void {
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

        const that: Incomes = this;
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
                    if (that.categoryNavItem) {
                        for (let i: number = 0; i < that.categoryNavItem.length; i++) {
                            (that.categoryNavItem[i] as HTMLElement).style.border = "1px solid #0D6EFD";
                            (that.categoryNavItem[i] as HTMLElement).style.borderRadius = "7px";
                        }
                    }

                    if (that.expenses) {
                        for (let i: number = 0; i < that.expenses.length; i++) {
                            (that.expenses[i] as HTMLElement).style.setProperty('border-top-right-radius', '0', 'important');
                            (that.expenses[i] as HTMLElement).style.setProperty('border-top-left-radius', '0', 'important');
                        }
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
                }
            );

            categoryCollapse.addEventListener('hidden.bs.collapse', function (): void {
                if (that.incomes) {
                    for (let j: number = 0; j < that.incomes.length; j++) {
                        (that.incomes[j] as HTMLElement).style.backgroundColor = '';
                        if (that.categoryNavItem) {
                            for (let i: number = 0; i < that.categoryNavItem.length; i++) {
                                if (that.categoryNavItem) {
                                    (that.categoryNavItem[i] as HTMLElement).style.border = "none";
                                }
                            }

                        }

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
