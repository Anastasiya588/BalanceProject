import {Chart} from "chart.js/auto";
import {FileUtils} from "../../utils/file-utils";
import datepicker from "js-datepicker";


export class Dashboard {
    constructor() {
        this.incomeCanvas = document.getElementById('pie-chart-income');
        this.expensesCanvas = document.getElementById('pie-chart-expenses');

        this.fromDate = document.getElementById('from-date');
        this.tillDate = document.getElementById('till-date');

        function resizeInput(input) {
            input.style.width = '41px';
            const newWidth = Math.max(input.scrollWidth, 41);
            input.style.width = newWidth + 'px';
        }

        this.fromDate.addEventListener('input', () => resizeInput(this.fromDate));
        this.tillDate.addEventListener('input', () => resizeInput(this.tillDate));

        this.tillDate.disabled = true;
        this.fromDate.disabled = true;

        resizeInput(this.fromDate);
        resizeInput(this.tillDate);

        if (this.fromDate) {
            const fromDate = datepicker(this.fromDate, {
                customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                overlayButton: "Ок",
                overlayPlaceholder: 'Год',
                showAllDates: true,
                onSelect: (instance, date) => {
                    this.fromDate.value = this.formatDate(date);
                    resizeInput(this.fromDate);
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
                    resizeInput(this.tillDate);
                }
            });
        }


        this.stylesLayoutCanvas();

        FileUtils.showCanvasBalance().then();

        this.createFilter();
        this.createCharts();

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
            this.todayDate.classList.add('active');
            this.todayDate.style.color = 'white';
            this.tillDate.disabled = true;
            this.fromDate.disabled = true;
            this.fromDate.value = '';
            this.tillDate.value = '';
            this.dateFrom = '';
            this.dateTo = '';

            this.period = 'today';
            // this.createTable().then();
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
            // this.createTable().then();
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
            // this.createTable().then();
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
            // this.createTable().then();
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
            // this.createTable().then();
        })

        this.intervalDate.addEventListener('click', () => {
            resetButtons();
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
                    // this.createTable().then();
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

    createCharts() {
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
            // График доходов
            if (this.incomeCanvas && this.expensesCanvas) {
                const incomeItem = document.createElement('div');
                incomeItem.classList = 'pie-content mb-md-4 mb-sm-3 mb-3 pb-sm-3';
                if (document.documentElement.clientWidth > 1080) {
                    incomeItem.classList = 'me-4';
                }
                incomeItem.appendChild(document.createElement('h2')).className = 'pi-title m-0';
                incomeItem.lastChild.textContent = 'Доходы';
                const incomeLegendContainer = document.createElement('div');
                incomeLegendContainer.id = 'legend-income-container';
                incomeItem.appendChild(incomeLegendContainer);

                incomeItem.appendChild(this.incomeCanvas);

                const incomePieItem = document.querySelector('.pie-item:nth-child(1)');
                incomePieItem.appendChild(incomeItem);


                new Chart(this.incomeCanvas, {
                    type: 'pie',
                    data: {
                        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                        datasets: [{
                            backgroundColor: ["#FF0000FF", "#FF4500FF", "#FFFF00FF", "#008000FF", "#0000FFFF"],
                            data: [500, 100, 300, 50, 450],
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

                // График расходов
                const expensesItem = document.createElement('div');
                expensesItem.classList = 'pie-content  mb-md-4 mb-sm-3 mb-3 pb-sm-3';
                expensesItem.appendChild(document.createElement('h2')).className = 'pi-title m-0';
                expensesItem.lastChild.textContent = 'Расходы';
                if (document.documentElement.clientWidth > 1080) {
                    expensesItem.classList = 'ms-4';
                }

                const expensesLegendContainer = document.createElement('div');
                expensesLegendContainer.id = 'legend-expenses-container';
                expensesItem.appendChild(expensesLegendContainer);

                expensesItem.appendChild(this.expensesCanvas);

                const expensesPieItem = document.querySelector('.pie-item:nth-child(3)');
                expensesPieItem.appendChild(expensesItem);


                // График расходов
                new Chart(this.expensesCanvas, {
                    type: 'pie',
                    data: {
                        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                        datasets: [{
                            backgroundColor: ["#FF0000FF", "#FF4500FF", "#FFFF00FF", "#008000FF", "#0000FFFF"],
                            data: [500, 100, 300, 50, 450],
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
                console.error('Элементы canvas не найдены');
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
        this.incomes = document.getElementsByClassName('incomes-link');
        this.categoryNavItem = document.querySelectorAll('.category-nav-item');


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
            for (let j = 0; j < that.incomes.length; j++) {
                that.categoryNavItem[j].style.border = "1px solid #0D6EFD";
                that.categoryNavItem[j].style.setProperty('border-top-right-radius', '7px', 'important');
                that.categoryNavItem[j].style.setProperty('border-top-left-radius', '7px', 'important');
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
