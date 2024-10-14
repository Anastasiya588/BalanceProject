import {Chart} from "chart.js/auto";
import {FileUtils} from "../../utils/file-utils";
import datepicker from "js-datepicker";
import {HttpUtils} from "../../utils/http-utils";


export class Dashboard {
    constructor() {
        this.incomeCanvas = document.getElementById('pie-chart-income');
        this.expensesCanvas = document.getElementById('pie-chart-expenses');
        this.line = document.getElementById('line');
        this.incomePie = document.getElementById('income-pie');
        this.expensePie = document.getElementById('expense-pie');


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
        FileUtils.showName();

        this.createFilter();

        this.getOperations().then();
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

    createFilter() {
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
            if (this.titleIncomeContainer) {
                this.clearExistingTitles(this.titleIncomeContainer);
            } else {
                console.warn('titleIncomeContainer не найден');
            }
            if (this.titleExpenseContainer) {
                this.clearExistingTitles(this.titleExpenseContainer);
            } else {
                console.warn('titleExpenseContainer не найден');
            }
            this.todayDate.classList.add('active');
            this.todayDate.style.color = 'white';
            this.tillDate.disabled = true;
            this.fromDate.disabled = true;
            this.fromDate.value = '';
            this.tillDate.value = '';
            this.dateFrom = '';
            this.dateTo = '';

            this.period = 'today';
            this.getOperations().then();
        })

        this.weekDate.addEventListener('click', () => {
            resetButtons();
            if (this.titleIncomeContainer) {
                this.clearExistingTitles(this.titleIncomeContainer);
            } else {
                console.warn('titleIncomeContainer не найден');
            }
            if (this.titleExpenseContainer) {
                this.clearExistingTitles(this.titleExpenseContainer);
            } else {
                console.warn('titleExpenseContainer не найден');
            }
            this.weekDate.classList.add('active');
            this.weekDate.style.color = 'white';
            this.tillDate.disabled = true;
            this.fromDate.disabled = true;
            this.fromDate.value = '';
            this.tillDate.value = '';
            this.dateFrom = '';
            this.dateTo = '';

            this.period = 'week';
            this.getOperations().then();
        })

        this.monthDate.addEventListener('click', () => {
            resetButtons();
            if (this.titleIncomeContainer) {
                this.clearExistingTitles(this.titleIncomeContainer);
            } else {
                console.warn('titleIncomeContainer не найден');
            }
            if (this.titleExpenseContainer) {
                this.clearExistingTitles(this.titleExpenseContainer);
            } else {
                console.warn('titleExpenseContainer не найден');
            }
            this.monthDate.classList.add('active');
            this.monthDate.style.color = 'white';
            this.tillDate.disabled = true;
            this.fromDate.disabled = true;
            this.fromDate.value = '';
            this.tillDate.value = '';
            this.dateFrom = '';
            this.dateTo = '';

            this.period = 'month';
            this.getOperations().then();
        })

        this.yearDate.addEventListener('click', () => {
            resetButtons();
            if (this.titleIncomeContainer) {
                this.clearExistingTitles(this.titleIncomeContainer);
            } else {
                console.warn('titleIncomeContainer не найден');
            }
            if (this.titleExpenseContainer) {
                this.clearExistingTitles(this.titleExpenseContainer);
            } else {
                console.warn('titleExpenseContainer не найден');
            }
            this.yearDate.classList.add('active');
            this.yearDate.style.color = 'white';
            this.tillDate.disabled = true;
            this.fromDate.disabled = true;
            this.fromDate.value = '';
            this.tillDate.value = '';
            this.dateFrom = '';
            this.dateTo = '';

            this.period = 'year';
            this.getOperations().then();
        })

        this.allDate.addEventListener('click', () => {
            resetButtons();
            if (this.titleIncomeContainer) {
                this.clearExistingTitles(this.titleIncomeContainer);
            } else {
                console.warn('titleIncomeContainer не найден');
            }
            if (this.titleExpenseContainer) {
                this.clearExistingTitles(this.titleExpenseContainer);
            } else {
                console.warn('titleExpenseContainer не найден');
            }
            this.allDate.classList.add('active');
            this.allDate.style.color = 'white';
            this.tillDate.disabled = true;
            this.fromDate.disabled = true;
            this.fromDate.value = '';
            this.tillDate.value = '';
            this.dateFrom = '';
            this.dateTo = '';

            this.period = 'all';
            this.getOperations().then();
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
                    this.getOperations().then();
                    if (this.titleIncomeContainer) {
                        this.clearExistingTitles(this.titleIncomeContainer);
                    } else {
                        console.warn('titleIncomeContainer не найден');
                    }
                    if (this.titleExpenseContainer) {
                        this.clearExistingTitles(this.titleExpenseContainer);
                    } else {
                        console.warn('titleExpenseContainer не найден');
                    }
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

    async getOperations() {
        const result = await HttpUtils.request('/operations', 'GET', true, null, this.period, this.dateFrom, this.dateTo)
        if (result && result.response) {
            if (Array.isArray(result.response)) {
                const incomeData = result.response.filter(item => item.type === 'income');
                const incomeSummary = this.summarizeByCategory(incomeData);
                this.categoriesIncomeData = Object.keys(incomeSummary);
                this.amountIncomeData = Object.values(incomeSummary);


                const expenseData = result.response.filter(item => item.type === 'expense');
                const expenseSummary = this.summarizeByCategory(expenseData);
                this.categoriesExpenseData = Object.keys(expenseSummary); // категории
                this.amountExpenseData = Object.values(expenseSummary); // соответствующие суммы
            }
            this.createCharts();
        }
    }

    summarizeByCategory(data) {
        return data.reduce((acc, item) => {
            if (acc[item.category]) {
                acc[item.category] += item.amount; // Суммируем, если категория повторяется
            } else {
                acc[item.category] = item.amount;
            }
            return acc;
        }, {});
    }

    getRandomColor() {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor.padStart(6, '0')}FF`;
    }

    generateRandomColors(dataLength) {
        return Array.from({length: dataLength}, () => this.getRandomColor());
    }

    createCharts() {
        this.clearExistingTitles = (container) => {
            const existingTitle = container.querySelector('.pi-title');
            if (!container) {
                console.warn('Контейнер не найден для очистки заголовков');
                return;
            }
            if (existingTitle) {
                existingTitle.remove();
            }
        };

        const getOrCreateLegendList = (chart, id) => {
            const legendContainer = document.getElementById(id);
            let listContainer = legendContainer.querySelector('ul');

            if (!listContainer) {
                listContainer = document.createElement('ul');
                listContainer.style.display = 'flex';
                listContainer.style.flexDirection = 'row';
                listContainer.style.margin = '20px 0 40px 0';
                listContainer.style.padding = 0;
                legendContainer.appendChild(listContainer);
            }
            if (document.documentElement.clientWidth < 500) {
                listContainer.style.margin = '20px 0 20px 0';
            }
            return listContainer;
        };
        const htmlLegendPlugin = {
            id: 'htmlLegend',
            afterUpdate(chart, args, options) {
                const ul = getOrCreateLegendList(chart, options.containerID);
                while (ul.firstChild) {
                    ul.firstChild.remove();
                }
                const items = chart.options.plugins.legend.labels.generateLabels(chart);
                items.forEach((item, index) => {
                    const li = document.createElement('li');
                    li.style.alignItems = 'center';
                    li.style.cursor = 'pointer';
                    li.style.display = 'flex';
                    li.style.flexDirection = 'row';
                    li.style.margin = '0 15px 0 0';
                    li.style.padding = '0 0 0 0';
                    // Добавляем стиль только для последнего элемента
                    if (index === items.length - 1) {
                        li.style.margin = 0;
                    }
                    li.onclick = () => {
                        if (chart.config.type === 'pie' || chart.config.type === 'doughnut') {
                            chart.toggleDataVisibility(item.index);
                        } else {
                            chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                        }
                        chart.update();
                    };
                    const boxSpan = document.createElement('span');
                    boxSpan.style.background = item.fillStyle;
                    boxSpan.style.borderColor = item.strokeStyle;
                    boxSpan.style.borderWidth = item.lineWidth + 'px';
                    boxSpan.style.display = 'inline-block';
                    boxSpan.style.flexShrink = 0;
                    boxSpan.style.height = '10px';
                    boxSpan.style.marginRight = '10px';
                    boxSpan.style.width = '35px';

                    const textContainer = document.createElement('p');
                    textContainer.style.color = 'black';
                    textContainer.style.fontFamily = 'RobotoMedium';
                    textContainer.style.fontSize = '12px';
                    textContainer.style.margin = 0;
                    textContainer.style.padding = 0;
                    textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

                    const text = document.createTextNode(item.text);
                    textContainer.appendChild(text);
                    li.appendChild(boxSpan);
                    li.appendChild(textContainer);
                    ul.appendChild(li);
                });
            }
        };
        // Создание графиков
        try {
            const colorsIncomeChart = this.generateRandomColors(this.categoriesIncomeData.length);

            // График доходов
            if (this.incomeCanvas && this.expensesCanvas) {
                if (this.incomeChart) {
                    this.incomeChart.destroy();
                }

                // Создаем контейнер для заголовка доходов, если он отсутствует
                this.titleIncomeContainer = document.getElementById('income-title-container');
                if (!this.titleIncomeContainer) {
                    this.titleIncomeContainer = document.createElement('div');
                    this.titleIncomeContainer.id = 'income-title-container';
                    this.titleIncomeContainer.className = 'title-container';
                    this.incomePie.appendChild(this.titleIncomeContainer);
                }

                this.incomeItem = document.createElement('div');
                this.incomeItem.classList = 'pie-content mb-md-4 mb-sm-3 mb-3 pb-sm-3';
                if (document.documentElement.clientWidth > 1080) {
                    this.incomeItem.classList = 'me-4';
                }

                this.incomeTitle = this.incomeItem.querySelector('.pi-title');

                if (!this.incomeTitle) {
                    this.incomeTitle = document.createElement('h2');
                    this.incomeTitle.className = 'pi-title m-0';
                    this.incomeTitle.textContent = 'Доходы';
                    this.titleIncomeContainer.appendChild(this.incomeTitle);
                } else {
                    this.clearExistingTitles(this.titleIncomeContainer);
                    // Если заголовок существует, обновляем текст
                    this.incomeTitle.textContent = 'Доходы';
                }


                const incomeLegendContainer = document.createElement('div');
                incomeLegendContainer.id = 'legend-income-container';
                this.incomeItem.appendChild(incomeLegendContainer);

                this.incomeItem.appendChild(this.incomeCanvas);

                this.incomePie.appendChild(this.incomeItem);


                this.incomeCanvas.style.display = ""
                this.incomeChart = new Chart(this.incomeCanvas, {
                    type: 'pie',
                    data: {
                        labels: this.categoriesIncomeData,
                        datasets: [{
                            backgroundColor: colorsIncomeChart,
                            data: this.amountIncomeData,
                        }]
                    },
                    options: {
                        plugins: {
                            htmlLegend: {
                                containerID: 'legend-income-container',
                            },
                            legend: {
                                display: false,
                            },
                        },
                        responsive: true,
                    },
                    plugins: [htmlLegendPlugin],
                });


                if (this.expensesChart) {
                    this.expensesChart.destroy();
                }


                // График расходов
                const colorsExpenseChart = this.generateRandomColors(this.categoriesExpenseData.length);


                // Создаем контейнер для заголовка расходов, если он отсутствует
                this.titleExpenseContainer = document.getElementById('expense-title-container');
                if (!this.titleExpenseContainer) {
                    this.titleExpenseContainer = document.createElement('div');
                    this.titleExpenseContainer.id = 'expense-title-container';
                    this.titleExpenseContainer.className = 'title-container';
                    this.expensePie.appendChild(this.titleExpenseContainer);
                }

                this.expensesItem = document.createElement('div');
                this.expensesItem.classList = 'pie-content  mb-md-4 mb-sm-3 mb-3 pb-sm-3';


                this.expenseTitle = this.expensesItem.querySelector('.pi-title');
                if (!this.expenseTitle) {
                    this.expenseTitle = document.createElement('h2');
                    this.expenseTitle.className = 'pi-title m-0';
                    this.expenseTitle.textContent = 'Расходы';
                    this.titleExpenseContainer.appendChild(this.expenseTitle);
                } else {
                    this.clearExistingTitles(this.titleExpenseContainer);
                    // Если заголовок существует, обновляем текст
                    this.expenseTitle.textContent = 'Расходы';
                }

                if (document.documentElement.clientWidth > 1080) {
                    this.expensesItem.classList = 'ms-4';
                }

                const expensesLegendContainer = document.createElement('div');
                expensesLegendContainer.id = 'legend-expenses-container';
                this.expensesItem.appendChild(expensesLegendContainer);

                this.expensesItem.appendChild(this.expensesCanvas);

                this.expensePie.appendChild(this.expensesItem);


                // График расходов
                this.expensesChart = new Chart(this.expensesCanvas, {
                    type: 'pie',
                    data: {
                        labels: this.categoriesExpenseData,
                        datasets: [{
                            backgroundColor: colorsExpenseChart,
                            data: this.amountExpenseData,
                        }]
                    },
                    options: {
                        plugins: {
                            htmlLegend: {
                                containerID: 'legend-expenses-container',
                            },
                            legend: {
                                display: false,
                            },
                        },
                        responsive: true,
                    },
                    plugins: [htmlLegendPlugin],
                });
            } else {
                this.expensePie.style.display = "none"
            }

        } catch (error) {
            console.error('Ошибка при создании графика:', error);
        }
    }


    stylesLayoutCanvas() {
        //Layout and Offcanvas
        this.dashboardNavItem = document.querySelectorAll('.dashboard-nav-item');
        this.dashboardLink = document.getElementsByClassName('dashboard-link');
        this.dashboardSvg = document.querySelectorAll('.bi-house');

        this.category = document.getElementById('category');
        this.offcanvasCategory = document.getElementById('offcanvas-category');
        this.toggleIcon = document.getElementById('toggleIcon');
        this.offCanvasToggleIcon = document.getElementById('offcanvas-toggleIcon');
        this.categoryNavItem = document.querySelectorAll('.category-nav-item');
        this.expenses = document.querySelectorAll('.expenses-link');
        this.incomes = document.querySelectorAll('.incomes-link');

        for (let i = 0; i < this.dashboardNavItem.length; i++) {
            this.dashboardNavItem[i].style.backgroundColor = '#0D6EFD';
            this.dashboardNavItem[i].style.setProperty('border-radius', '7px', 'important');
        }
        for (let i = 0; i < this.dashboardLink.length; i++) {
            this.dashboardLink[i].style.color = "white";
        }
        for (let i = 0; i < this.dashboardSvg.length; i++) {
            this.dashboardSvg[i].style.fill = 'white'
        }


        const that = this;
        document.getElementById('category-collapse').addEventListener('shown.bs.collapse', function () {
            for (let j = 0; j < that.categoryNavItem.length; j++) {
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
