import {FileUtils} from "../../utils/file-utils";
import {HttpUtils} from "../../utils/http-utils";
import datepicker, {DatepickerInstance} from "js-datepicker";
import {DefaultResponseType} from "../types/default-response.type";
import {OperationsResponseType} from "../types/operations-response.type";


export class Operations {
    readonly openNewRoute: (url: string) => void;
    readonly createIncomeBtn: HTMLElement | null;
    readonly createExpenseBtn: HTMLElement | null;
    readonly fromDate: HTMLElement | null;
    readonly tillDate: HTMLElement | null;
    private todayDate: HTMLElement | null;
    private weekDate: HTMLElement | null;
    private monthDate: HTMLElement | null;
    private yearDate: HTMLElement | null;
    private allDate: HTMLElement | null;
    private intervalDate: HTMLElement | null;
    private tableBody: HTMLElement | null;
    private tableRow: HTMLElement | null;
    private popup: HTMLElement | null;
    private tableSvgLinkDeleteElement: HTMLElement | null;
    private period: string | null;
    private dateFrom: string | null;
    private dateTo: string | null;

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

    constructor(openNewRoute: { (url: string): Promise<void>; (url: string): void; }) {
        this.openNewRoute = openNewRoute;
        this.todayDate = document.getElementById('filter-today');
        this.weekDate = document.getElementById('filter-week');
        this.monthDate = document.getElementById('filter-month');
        this.yearDate = document.getElementById('filter-year');
        this.allDate = document.getElementById('filter-all');
        this.intervalDate = document.getElementById('filter-interval');
        this.createIncomeBtn = document.getElementById('create-income');
        this.createExpenseBtn = document.getElementById('create-expense');
        this.dateFrom = '';
        this.dateTo = '';
        this.fromDate = document.getElementById('from-date');
        this.tillDate = document.getElementById('till-date');
        this.tableBody = document.getElementById('tbody');
        this.tableRow = document.createElement("tr");
        this.popup = document.getElementById('pop-up');
        this.tableSvgLinkDeleteElement = document.createElement("a");
        this.period = '';
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

        if (this.fromDate) {
            this.fromDate.addEventListener('input', () => this.resizeInput(this.fromDate as HTMLInputElement));
        }

        if (this.tillDate) {
            this.tillDate.addEventListener('input', () => this.resizeInput(this.tillDate as HTMLInputElement));
        }


        (this.tillDate as HTMLInputElement).disabled = true;
        (this.fromDate as HTMLInputElement).disabled = true;

        this.resizeInput(this.fromDate as HTMLInputElement);
        this.resizeInput(this.tillDate as HTMLInputElement);


        this.stylesLayoutCanvas();


        FileUtils.updateBalance().then();
        FileUtils.showCanvasBalance().then();
        FileUtils.showBalance().then();
        FileUtils.showName();

        this.editOperation();

        this.createFilter().then();
        this.createTable().then();
    }

    private resizeInput(input: HTMLInputElement): void {
        input.style.width = '41px';
        const newWidth: number = Math.max(input.scrollWidth, 41);
        input.style.width = newWidth + 'px';
    }

    private formatDate(date: Date): string {
        const year: number = date.getFullYear();
        const month: string = String(date.getMonth() + 1).padStart(2, '0');
        const day: string = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private editOperation(): void {
        const that: Operations = this;
        if (this.createIncomeBtn) {
            this.createIncomeBtn.addEventListener('click', () => {
                localStorage.setItem('operationType', 'income');
                that.openNewRoute('/operations/create');
            });
        }

        if (this.createExpenseBtn) {
            this.createExpenseBtn.addEventListener('click', () => {
                localStorage.setItem('operationType', 'expense');
                that.openNewRoute('/operations/create');
            });
        }
    }

    private async createFilter(): Promise<void> {
        
        const resetButtons = (): void => {
            const buttons: (HTMLElement | null)[] = [this.todayDate, this.weekDate, this.monthDate, this.yearDate, this.allDate, this.intervalDate];
            buttons.forEach((button: HTMLElement|null): void => {
                if(button) {
                button.classList.remove('active');
                button.style.color = '';
                }
               
            });


        };

        if (this.todayDate) {
            this.todayDate.addEventListener('click', ():void => {
                resetButtons();
                if (this.todayDate) {
                    this.todayDate.classList.add('active');
                    this.todayDate.style.color = 'white';
                }
                (this.tillDate as HTMLInputElement).disabled = true;
                (this.fromDate as HTMLInputElement).disabled = true;
                (this.fromDate as HTMLInputElement).value = '';
                (this.tillDate as HTMLInputElement).value = '';
                this.dateFrom = '';
                this.dateTo = '';

                this.period = 'today';
                this.createTable().then();
            })
        }

        if (this.weekDate) {
            this.weekDate.addEventListener('click', ():void => {
                resetButtons();
                if (this.weekDate) {
                    this.weekDate.classList.add('active');
                    this.weekDate.style.color = 'white';
                }
                (this.tillDate as HTMLInputElement).disabled = true;
                (this.fromDate as HTMLInputElement).disabled = true;
                (this.fromDate as HTMLInputElement).value = '';
                (this.tillDate as HTMLInputElement).value = '';
                this.dateFrom = '';
                this.dateTo = '';

                this.period = 'week';
                this.createTable().then();
            })
        }

        if (this.monthDate) {
            this.monthDate.addEventListener('click', ():void => {
                resetButtons();
                if (this.monthDate) {
                    this.monthDate.classList.add('active');
                    this.monthDate.style.color = 'white';
                }
                (this.tillDate as HTMLInputElement).disabled = true;
                (this.fromDate as HTMLInputElement).disabled = true;
                (this.fromDate as HTMLInputElement).value = '';
                (this.tillDate as HTMLInputElement).value = '';
                this.dateFrom = '';
                this.dateTo = '';

                this.period = 'month';
                this.createTable().then();
            })
        }

        if (this.yearDate) {
            this.yearDate.addEventListener('click', ():void => {
                resetButtons();
                if (this.yearDate) {
                    this.yearDate.classList.add('active');
                    this.yearDate.style.color = 'white';
                }
                (this.tillDate as HTMLInputElement).disabled = true;
                (this.fromDate as HTMLInputElement).disabled = true;
                (this.fromDate as HTMLInputElement).value = '';
                (this.tillDate as HTMLInputElement).value = '';
                this.dateFrom = '';
                this.dateTo = '';

                this.period = 'year';
                this.createTable().then();
            })
        }

        if (this.allDate) {
            this.allDate.addEventListener('click', (): void => {
                resetButtons();
                if (this.allDate) {
                    this.allDate.classList.add('active');
                    this.allDate.style.color = 'white';
                }
                (this.tillDate as HTMLInputElement).disabled = true;
                (this.fromDate as HTMLInputElement).disabled = true;
                (this.fromDate as HTMLInputElement).value = '';
                (this.tillDate as HTMLInputElement).value = '';
                this.dateFrom = '';
                this.dateTo = '';

                this.period = 'all';
                this.createTable().then();
            })
        }
        if (this.intervalDate) {
            this.intervalDate.addEventListener('click', (): void => {
                resetButtons();
                if (this.fromDate) {
                    const fromDate: DatepickerInstance = datepicker(this.fromDate, {
                        customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                        customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                        overlayButton: "Ок",
                        overlayPlaceholder: 'Год',
                        showAllDates: true,
                        onSelect: (instance: DatepickerInstance, date: Date | undefined): void => {
                            (this.fromDate as HTMLInputElement).value = this.formatDate(date as Date);
                            this.resizeInput(this.fromDate as HTMLInputElement);
                        }
                    });
                }
                if (this.tillDate) {
                    const tillDate: DatepickerInstance = datepicker(this.tillDate, {
                        customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                        customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                        overlayButton: "Ок",
                        overlayPlaceholder: 'Введите год',
                        showAllDates: true,
                        onSelect: (instance:DatepickerInstance, date: Date | undefined): void => {
                            if (date) {
                                (this.tillDate as HTMLInputElement).value = this.formatDate(date as Date);
                            }

                            this.resizeInput(this.tillDate as HTMLInputElement);
                        }
                    });
                }
                if (this.intervalDate) {
                    this.intervalDate.classList.add('active');
                    this.intervalDate.style.color = 'white';
                }

                (this.tillDate as HTMLInputElement).disabled = true;
                (this.fromDate as HTMLInputElement).disabled = true;
                this.period = 'interval';
                if (this.fromDate) {
                    const isEventListenersAdded = this.fromDate.dataset.eventListenersAdded === 'true';
                


                const updateDates = ():void => {
                    this.dateFrom = (this.fromDate as HTMLInputElement).value;
                    this.dateTo = (this.tillDate as HTMLInputElement).value;
                    if (this.dateFrom && this.dateTo) {
                        this.createTable().then();
                    }
                };


                if (!isEventListenersAdded) {
                    if (this.fromDate) {
                        this.fromDate.addEventListener('input', updateDates);
                        // Установим флаг, что обработчики добавлены
                        this.fromDate.dataset.eventListenersAdded = 'true';
                    }
                    if (this.tillDate) {
                        this.tillDate.addEventListener('input', updateDates);
                        // Установим флаг, что обработчики добавлены
                        this.tillDate.dataset.eventListenersAdded = 'true';
                    }
                }
            }
            })
        }

    }

    private async createTable(): Promise<void> {
        if (this.tableBody) {
            this.tableBody.innerHTML = '';
        }

        const result: DefaultResponseType | OperationsResponseType = await HttpUtils.request('/operations', 'GET', true, null, this.period, this.dateFrom, this.dateTo)

        if ((result as OperationsResponseType) && (result as OperationsResponseType).response) {
            for (let i: number = 0; i < (result as OperationsResponseType).response.length; i++) {
                if(this.tableRow) {
                      this.tableRow.classList.add("border-bottom align-middle tr-element");
                this.tableRow.setAttribute('data-id', ((result as OperationsResponseType).response[i].id).toString());
                }
              

                let tableThIdElement: HTMLTableCellElement = document.createElement("th");
                tableThIdElement.setAttribute("scope", "row");
                tableThIdElement.classList.add("p-3 th-id");
                tableThIdElement.innerText = (i + 1).toString()

                let tableTdTypeElement: HTMLTableCellElement = document.createElement("td");
                tableTdTypeElement.classList.add("p-3 text-success td-type");

                if ((result as OperationsResponseType).response[i].type === 'income') {
                    tableTdTypeElement.classList.remove('text-danger');
                    tableTdTypeElement.classList.add('text-success');
                    tableTdTypeElement.innerText = "доход";
                } else if ((result as OperationsResponseType).response[i].type === 'expense') {
                    tableTdTypeElement.classList.remove('text-success');
                    tableTdTypeElement.classList.add('text-danger');
                    tableTdTypeElement.innerText = "расход";
                }

                let tableTdCategoryElement: HTMLTableCellElement = document.createElement("td");
                tableTdCategoryElement.classList.add("p-3 td-category");
                tableTdCategoryElement.innerText = (result as OperationsResponseType).response[i].category

                let tableTdSumElement: HTMLTableCellElement = document.createElement("td");
                tableTdSumElement.classList.add("p-3 td-sum d-flex justify-content-center");

                let amountTextNode: Text = document.createTextNode(((result as OperationsResponseType).response[i].amount).toString());
                tableTdSumElement.appendChild(amountTextNode);

                let tablePSumElement: HTMLParagraphElement = document.createElement("p");
                tablePSumElement.classList.add("dollar m-0");
                tablePSumElement.innerText = "$";

                tableTdSumElement.appendChild(tablePSumElement);

                let tableTdDateElement: HTMLTableCellElement = document.createElement("td");
                tableTdDateElement.classList.add("p-3 td-date");
                tableTdDateElement.style.width = "148px";
                tableTdDateElement.innerText = (result as OperationsResponseType).response[i].date

                let tableTdCommentElement: HTMLTableCellElement = document.createElement("td");
                tableTdCommentElement.classList.add("p-3 comment");
                tableTdCommentElement.innerText = (result as OperationsResponseType).response[i].comment

                let tableTdSvgsElement: HTMLTableCellElement = document.createElement("td");
                tableTdSvgsElement.classList.add("svgs py-3 ps-3 pe-0 align-middle border-0 align-items-center");

                let tableSvgsPElement: HTMLParagraphElement = document.createElement("p");
                tableSvgsPElement.classList.add("d-flex align-items-center my-auto");

                //SVG Delete
              if(this.tableSvgLinkDeleteElement) {
                this.tableSvgLinkDeleteElement.setAttribute("href", "#");
                this.tableSvgLinkDeleteElement.classList.add("text-decoration-none");
              }
                

                let tableSvgDeleteElement: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                tableSvgDeleteElement.setAttribute("width", "16");
                tableSvgDeleteElement.setAttribute("height", "16");
                tableSvgDeleteElement.setAttribute("fill", "black");
                tableSvgDeleteElement.setAttribute("viewBox", "0 0 16 16");
                tableSvgDeleteElement.classList.add("bi bi-trash me-2");

                let path1: SVGPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path1.setAttribute("d", "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z");
                tableSvgDeleteElement.appendChild(path1);

                let path2: SVGPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path2.setAttribute("d", "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z");
                tableSvgDeleteElement.appendChild(path2);

                //SVG Edit
                let tableSvgLinkEditElement: HTMLAnchorElement = document.createElement("a");
                tableSvgLinkEditElement.setAttribute("href", "/operations/edit");
                tableSvgLinkEditElement.classList.add("text-decoration-none");
                tableSvgLinkEditElement.addEventListener('click', function () {
                    localStorage.setItem('rowData-id', ((result as OperationsResponseType).response[i].id).toString());
                })
                let tableSvgEditElement: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                tableSvgEditElement.setAttribute("width", "16");
                tableSvgEditElement.setAttribute("height", "16");
                tableSvgEditElement.setAttribute("fill", "black");
                tableSvgEditElement.setAttribute("viewBox", "0 0 16 16");
                tableSvgEditElement.classList.add("bi bi-pencil");

                let path3: SVGPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path3.setAttribute("d", "M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325");
                tableSvgEditElement.appendChild(path3);

if( this.tableSvgLinkDeleteElement) {
                this.tableSvgLinkDeleteElement.appendChild(tableSvgDeleteElement);
                tableSvgLinkEditElement.appendChild(tableSvgEditElement);
                tableSvgsPElement.appendChild(this.tableSvgLinkDeleteElement);
                tableSvgsPElement.appendChild(tableSvgLinkEditElement);
                tableTdSvgsElement.appendChild(tableSvgsPElement);
}

if(this.tableRow) {
      this.tableRow.appendChild(tableThIdElement)
                this.tableRow.appendChild(tableTdTypeElement)
                this.tableRow.appendChild(tableTdCategoryElement)
                this.tableRow.appendChild(tableTdSumElement)
                this.tableRow.appendChild(tableTdDateElement)
                this.tableRow.appendChild(tableTdCommentElement)
                this.tableRow.appendChild(tableTdSvgsElement)
                if (this.tableBody) {
                    this.tableBody.appendChild(this.tableRow)
                }
}
              
            }

            const deleteIcons: NodeListOf<Element> = document.querySelectorAll('.bi-trash');
            deleteIcons.forEach((icon: Element) => {
                const anchor = icon.closest('a');
                if(anchor) {
                    anchor.addEventListener('click', (event: MouseEvent): void => {
                    event.preventDefault();
                    let row: Element |null = icon.closest('.tr-element');
                   if (row) {
                       this.showPopUp(Number(row.getAttribute('data-id')));
                   }
                });
                }
               });
        }
    }

    private showPopUp(id: number): void {
        
        if (this.popup) {
            this.popup.classList.remove('d-none');
            this.popup.classList.add('d-flex');
        }


        const agreeDelete: HTMLElement | null = document.getElementById('agree-delete');
        const disagreeDelete: HTMLElement | null = document.getElementById('disagree-delete');

        // Обработка согласия на удаление
        if (agreeDelete) {
            agreeDelete.onclick = async (): Promise<void> => {
                const delResult: DefaultResponseType = await HttpUtils.request('/operations/' + id, 'DELETE', true);
                if (!delResult.error) {
                    const elementToRemove: Element |null = document.querySelector(`[data-id='${id}']`);
                    if (elementToRemove) {
                        elementToRemove.remove();
                    }
                }
                if (this.popup) {
                    this.popup.classList.remove('d-flex');
                    this.popup.classList.add('d-none');
                }
                FileUtils.updateBalance().then();
                FileUtils.showCanvasBalance().then();
                FileUtils.showBalance().then();
            };
        }

        // Обработка отказа от удаления
        if (disagreeDelete) {
            disagreeDelete.onclick = (): void => {
                if (this.popup) {
                    this.popup.classList.remove('d-flex');
                    this.popup.classList.add('d-none');
                }
            };
        }
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
        for (let i:number = 0; i < this.operationsLink.length; i++) {
            (this.operationsLink[i] as HTMLElement).style.color = "white";
        }
    }
    if(this.operationsSvg) {
        for (let i:number = 0; i < this.operationsSvg.length; i++) {
            (this.operationsSvg[i] as HTMLElement).style.fill = 'white'
        }
    }
        const that: Operations = this;
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
                    for (let i:number = 0; i < that.incomes.length; i++) {
                        (that.incomes[i] as HTMLElement).style.setProperty('border-top-right-radius', '0', 'important');
                        (that.incomes[i] as HTMLElement).style.setProperty('border-top-left-radius', '0', 'important');
                        (that.incomes[i] as HTMLElement).style.setProperty('border-bottom-right-radius', '0', 'important');
                        (that.incomes[i] as HTMLElement).style.setProperty('border-bottom-left-radius', '0', 'important');

                    }
                }
                if (that.expenses) {
                    for (let i:number = 0; i < that.expenses.length; i++) {
                        (that.expenses[i] as HTMLElement).style.setProperty('border-top-right-radius', '0', 'important');
                        (that.expenses[i] as HTMLElement).style.setProperty('border-top-left-radius', '0', 'important');
                    }
                }

                (that.category as HTMLElement).style.backgroundColor = '#0D6EFD';
                (that.category as HTMLElement).style.color = 'white';
                (that.toggleIcon as HTMLElement).style.fill = 'white';

                (that.category as HTMLElement).style.setProperty('border-top-right-radius', '6px', 'important');
                (that.category as HTMLElement).style.setProperty('border-top-left-radius', '6px', 'important');
                (that.category as HTMLElement).style.setProperty('border-bottom-right-radius', '0', 'important');
                (that.category as HTMLElement).style.setProperty('border-bottom-left-radius', '0', 'important');
                if (that.category) {
                    that.category.setAttribute('aria-expanded', 'true');
                }


                (that.offcanvasCategory as HTMLElement).style.backgroundColor = '#0D6EFD';
                (that.offcanvasCategory as HTMLElement).style.color = 'white';
                (that.offCanvasToggleIcon as HTMLElement).style.fill = 'white';

                (that.offcanvasCategory as HTMLElement).style.setProperty('border-top-right-radius', '6px', 'important');
                (that.offcanvasCategory as HTMLElement).style.setProperty('border-top-left-radius', '6px', 'important');
                (that.offcanvasCategory as HTMLElement).style.setProperty('border-bottom-right-radius', '0', 'important');
                (that.offcanvasCategory as HTMLElement).style.setProperty('border-bottom-left-radius', '0', 'important');
                if (that.offcanvasCategory) {
                    that.offcanvasCategory.setAttribute('aria-expanded', 'true');
                }

            });

            categoryCollapse.addEventListener('hidden.bs.collapse', function (): void {
                if (that.categoryNavItem) {
                    for (let i: number = 0; i < that.categoryNavItem.length; i++) {
                        (that.categoryNavItem[i] as HTMLElement).style.border = "none";
                    }
                }

                (that.category as HTMLElement).style.backgroundColor = '';
                (that.category as HTMLElement).style.color = '';
                (that.toggleIcon as HTMLElement).style.fill = '';

                (that.offcanvasCategory as HTMLElement).style.backgroundColor = '';
                (that.offcanvasCategory as HTMLElement).style.color = '';
                (that.offCanvasToggleIcon as HTMLElement).style.fill = '';

                (that.category as HTMLElement).style.setProperty('border-bottom-left-radius', '7px', 'important');
                (that.category as HTMLElement).style.setProperty('border-bottom-right-radius', '7px', 'important');
                if (that.category) {
                    that.category.setAttribute('aria-expanded', 'false');
                }

                (that.offcanvasCategory as HTMLElement).style.setProperty('border-bottom-left-radius', '7px', 'important');
                (that.offcanvasCategory as HTMLElement).style.setProperty('border-bottom-right-radius', '7px', 'important');
                if (that.offcanvasCategory) {
                    that.offcanvasCategory.setAttribute('aria-expanded', 'false');
                }

            });
        }

    }
}
