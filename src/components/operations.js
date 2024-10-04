import {FileUtils} from "../../utils/file-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";
import datepicker from "js-datepicker";


export class Operations {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.createIncomeBtn = document.getElementById('create-income');
        this.createExpenseBtn = document.getElementById('create-expense');

        this.fromDate = document.getElementById('from-date');
        this.tillDate = document.getElementById('till-date');


        this.fromDate.addEventListener('input', () => this.resizeInput(this.fromDate));
        this.tillDate.addEventListener('input', () => this.resizeInput(this.tillDate));

        this.tillDate.disabled = true;
        this.fromDate.disabled = true;

        this.resizeInput(this.fromDate);
        this.resizeInput(this.tillDate);


        this.stylesLayoutCanvas();


        FileUtils.updateBalance().then();
        FileUtils.showCanvasBalance().then();
        FileUtils.showBalance().then();

        this.editOperation();

        this.createFilter();
        this.createTable().then();
    }

    resizeInput(input) {
        input.style.width = '41px';
        const newWidth = Math.max(input.scrollWidth, 41);
        input.style.width = newWidth + 'px';
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    editOperation() {
        const that = this;
        this.createIncomeBtn.addEventListener('click', () => {
            localStorage.setItem('operationType', 'income');
            that.openNewRoute('/operations/create');
        });

        this.createExpenseBtn.addEventListener('click', () => {
            localStorage.setItem('operationType', 'expense');
            that.openNewRoute('/operations/create');
        });
    }

   async createFilter() {
        this.todayDate = document.getElementById('filter-today');
        this.weekDate = document.getElementById('filter-week');
        this.monthDate = document.getElementById('filter-month');
        this.yearDate = document.getElementById('filter-year');
        this.allDate = document.getElementById('filter-all');
        this.intervalDate = document.getElementById('filter-interval');
        const resetButtons = () => {
            const buttons = [this.todayDate, this.weekDate, this.monthDate, this.yearDate, this.allDate, this.intervalDate];
            buttons.forEach(button => {
                button.classList.remove('active');
                button.style.color = '';
            });


        };

        this.todayDate.addEventListener('click', () => {
            resetButtons();
            this.todayDate.classList.add('active');
            this.todayDate.style.color = 'white';
            this.tillDate.disabled = true;
            this.fromDate.disabled = true;
            this.fromDate.value = '';
            this.tillDate.value = '';
            this.dateFrom = '';
            this.dateTo = '';

            this.period = 'today';
            this.createTable().then();
        })

        this.weekDate.addEventListener('click', () => {
            resetButtons();
            this.weekDate.classList.add('active');
            this.weekDate.style.color = 'white';
            this.tillDate.disabled = true;
            this.fromDate.disabled = true;
            this.fromDate.value = '';
            this.tillDate.value = '';
            this.dateFrom = '';
            this.dateTo = '';

            this.period = 'week';
            this.createTable().then();
        })

        this.monthDate.addEventListener('click', () => {
            resetButtons();
            this.monthDate.classList.add('active');
            this.monthDate.style.color = 'white';
            this.tillDate.disabled = true;
            this.fromDate.disabled = true;
            this.fromDate.value = '';
            this.tillDate.value = '';
            this.dateFrom = '';
            this.dateTo = '';

            this.period = 'month';
            this.createTable().then();
        })

        this.yearDate.addEventListener('click', () => {
            resetButtons();
            this.yearDate.classList.add('active');
            this.yearDate.style.color = 'white';
            this.tillDate.disabled = true;
            this.fromDate.disabled = true;
            this.fromDate.value = '';
            this.tillDate.value = '';
            this.dateFrom = '';
            this.dateTo = '';

            this.period = 'year';
            this.createTable().then();
        })

        this.allDate.addEventListener('click', () => {
            resetButtons();
            this.allDate.classList.add('active');
            this.allDate.style.color = 'white';
            this.tillDate.disabled = true;
            this.fromDate.disabled = true;
            this.fromDate.value = '';
            this.tillDate.value = '';
            this.dateFrom = '';
            this.dateTo = '';

            this.period = 'all';
            this.createTable().then();
        })

        this.intervalDate.addEventListener('click', () => {
            resetButtons();
            if (this.fromDate) {
                const fromDate = datepicker(this.fromDate, {
                    customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                    customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                    overlayButton: "Ок",
                    overlayPlaceholder: 'Год',
                    showAllDates: true,
                    onSelect: (instance, date) => {
                        this.fromDate.value = this.formatDate(date);
                        this.resizeInput(this.fromDate);
                    }
                });
            }
            if (this.tillDate) {
                const tillDate = datepicker(this.tillDate, {
                    customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                    customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                    overlayButton: "Ок",
                    overlayPlaceholder: 'Введите год',
                    showAllDates: true,
                    onSelect: (instance, date) => {
                        this.tillDate.value = this.formatDate(date);
                        this.resizeInput(this.tillDate);
                    }
                });
            }
            this.intervalDate.classList.add('active');
            this.intervalDate.style.color = 'white';
            this.tillDate.disabled = false;
            this.fromDate.disabled = false;
            this.period = 'interval';

            const isEventListenersAdded = this.fromDate.dataset.eventListenersAdded === 'true';

            const updateDates = () => {
                this.dateFrom = this.fromDate.value;
                this.dateTo = this.tillDate.value;
                if (this.dateFrom && this.dateTo) {
                    this.createTable().then();
                }
            };


            if (!isEventListenersAdded) {
                this.fromDate.addEventListener('input', updateDates);
                this.tillDate.addEventListener('input', updateDates);
                // Установим флаг, что обработчики добавлены
                this.fromDate.dataset.eventListenersAdded = 'true';
                this.tillDate.dataset.eventListenersAdded = 'true';
            }
        })
    }

    async createTable() {
        this.tableBody = document.getElementById('tbody');
        this.tableBody.innerHTML = '';

        const result = await HttpUtils.request('/operations', 'GET', true, null, this.period, this.dateFrom, this.dateTo)

        if (result && result.response) {
            for (let i = 0; i < result.response.length; i++) {
                this.tableRow = document.createElement("tr");
                this.tableRow.classList = "border-bottom align-middle tr-element";
                this.tableRow.setAttribute('data-id', result.response[i].id);

                let tableThIdElement = document.createElement("th");
                tableThIdElement.setAttribute("scope", "row");
                tableThIdElement.classList = "p-3 th-id";
                tableThIdElement.innerText = i + 1

                let tableTdTypeElement = document.createElement("td");
                tableTdTypeElement.classList = "p-3 text-success td-type";

                if (result.response[i].type === 'income') {
                    tableTdTypeElement.classList.remove('text-danger');
                    tableTdTypeElement.classList.add('text-success');
                    tableTdTypeElement.innerText = "доход";
                } else if (result.response[i].type === 'expense') {
                    tableTdTypeElement.classList.remove('text-success');
                    tableTdTypeElement.classList.add('text-danger');
                    tableTdTypeElement.innerText = "расход";
                }

                let tableTdCategoryElement = document.createElement("td");
                tableTdCategoryElement.classList = "p-3 td-category";
                tableTdCategoryElement.innerText = result.response[i].category

                let tableTdSumElement = document.createElement("td");
                tableTdSumElement.classList = "p-3 td-sum d-flex justify-content-center";

                let amountTextNode = document.createTextNode(result.response[i].amount);
                tableTdSumElement.appendChild(amountTextNode);

                let tablePSumElement = document.createElement("p");
                tablePSumElement.classList = "dollar m-0";
                tablePSumElement.innerText = "$";

                tableTdSumElement.appendChild(tablePSumElement);

                let tableTdDateElement = document.createElement("td");
                tableTdDateElement.classList = "p-3 td-date";
                tableTdDateElement.style.width = "148px";
                tableTdDateElement.innerText = result.response[i].date

                let tableTdCommentElement = document.createElement("td");
                tableTdCommentElement.classList = "p-3 comment";
                tableTdCommentElement.innerText = result.response[i].comment

                let tableTdSvgsElement = document.createElement("td");
                tableTdSvgsElement.classList = "svgs py-3 ps-3 pe-0 align-middle border-0 align-items-center";

                let tableSvgsPElement = document.createElement("p");
                tableSvgsPElement.classList = "d-flex align-items-center my-auto";

                //SVG Delete
                this.tableSvgLinkDeleteElement = document.createElement("a");
                this.tableSvgLinkDeleteElement.setAttribute("href", "#");
                this.tableSvgLinkDeleteElement.classList = "text-decoration-none";

                let tableSvgDeleteElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                tableSvgDeleteElement.setAttribute("width", "16");
                tableSvgDeleteElement.setAttribute("height", "16");
                tableSvgDeleteElement.setAttribute("fill", "black");
                tableSvgDeleteElement.setAttribute("viewBox", "0 0 16 16");
                tableSvgDeleteElement.classList = "bi bi-trash me-2";

                let path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path1.setAttribute("d", "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z");
                tableSvgDeleteElement.appendChild(path1);

                let path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path2.setAttribute("d", "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z");
                tableSvgDeleteElement.appendChild(path2);

                //SVG Edit
                let tableSvgLinkEditElement = document.createElement("a");
                tableSvgLinkEditElement.setAttribute("href", "/operations/edit");
                tableSvgLinkEditElement.classList = "text-decoration-none";
                tableSvgLinkEditElement.addEventListener('click', function () {
                    localStorage.setItem('rowData-id', result.response[i].id);
                })
                let tableSvgEditElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                tableSvgEditElement.setAttribute("width", "16");
                tableSvgEditElement.setAttribute("height", "16");
                tableSvgEditElement.setAttribute("fill", "black");
                tableSvgEditElement.setAttribute("viewBox", "0 0 16 16");
                tableSvgEditElement.classList = "bi bi-pencil";

                let path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path3.setAttribute("d", "M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325");
                tableSvgEditElement.appendChild(path3);


                this.tableSvgLinkDeleteElement.appendChild(tableSvgDeleteElement);
                tableSvgLinkEditElement.appendChild(tableSvgEditElement);
                tableSvgsPElement.appendChild(this.tableSvgLinkDeleteElement);
                tableSvgsPElement.appendChild(tableSvgLinkEditElement);
                tableTdSvgsElement.appendChild(tableSvgsPElement);


                this.tableRow.appendChild(tableThIdElement)
                this.tableRow.appendChild(tableTdTypeElement)
                this.tableRow.appendChild(tableTdCategoryElement)
                this.tableRow.appendChild(tableTdSumElement)
                this.tableRow.appendChild(tableTdDateElement)
                this.tableRow.appendChild(tableTdCommentElement)
                this.tableRow.appendChild(tableTdSvgsElement)

                this.tableBody.appendChild(this.tableRow)
            }

            const deleteIcons = document.querySelectorAll('.bi-trash');
            deleteIcons.forEach(icon => {
                icon.closest('a').addEventListener('click', (event) => {
                    event.preventDefault();
                    let row = icon.closest('.tr-element');
                    this.showPopUp(row.getAttribute('data-id'));
                });
            });
        }
    }

    showPopUp(id) {
        this.popup = document.getElementById('pop-up');
        this.popup.classList.remove('d-none');
        this.popup.classList.add('d-flex');

        const agreeDelete = document.getElementById('agree-delete');
        const disagreeDelete = document.getElementById('disagree-delete');

        // Обработка согласия на удаление
        agreeDelete.onclick = async () => {
            const delResult = await HttpUtils.request('/operations/' + id, 'DELETE', true);
            if (!delResult.error) {
                const elementToRemove = document.querySelector(`[data-id='${id}']`);
                if (elementToRemove) {
                    elementToRemove.remove();
                }
            }
            this.popup.classList.remove('d-flex');
            this.popup.classList.add('d-none');
            FileUtils.updateBalance().then();
        };

        // Обработка отказа от удаления
        disagreeDelete.onclick = () => {
            this.popup.classList.remove('d-flex');
            this.popup.classList.add('d-none');
        };
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
            this.operationsSvg[i].style.fill = 'white'
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
