import {Chart, LegendItem, registerables, ChartOptions, Plugin} from "chart.js/auto";
import {FileUtils} from "../../utils/file-utils";
import datepicker, {DatepickerInstance} from "js-datepicker";
import {HttpUtils} from "../../utils/http-utils";
import {DefaultResponseType} from "../types/default-response.type";
import {OperationsResponseType} from "../types/operations-response.type";
import {OperationResponseType} from "../types/operation-response.type";
import {ChartHtmlLegendType} from "../types/chart-html-legend.type";
import {CustomChartOptions} from "../types/custom-chart-options.type";

export class Dashboard {
    readonly incomeCanvas: HTMLCanvasElement | null;
    readonly expensesCanvas: HTMLCanvasElement | null;
    readonly line: HTMLElement | null;
    readonly incomePie: HTMLElement | null;
    readonly expensePie: HTMLElement | null;
    readonly fromDate: HTMLElement | null;
    readonly tillDate: HTMLElement | null;
    readonly todayDate: HTMLElement | null;
    readonly weekDate: HTMLElement | null;
    readonly monthDate: HTMLElement | null;
    readonly yearDate: HTMLElement | null;
    readonly allDate: HTMLElement | null;
    readonly intervalDate: HTMLElement | null;
    private titleIncomeContainer: HTMLElement | null;
    private titleExpenseContainer: HTMLElement | null;
    readonly incomeItem: HTMLElement | null;
    readonly expensesItem: HTMLElement | null;
    private incomeTitle: Element | null;
    private expenseTitle: Element | null;
    private period: string | null;
    private dateFrom: string | null;
    private dateTo: string | null;
    private categoriesIncomeData: string[] | null;
    private categoriesExpenseData: string[] | null;
    private amountIncomeData: number[] | null;
    private amountExpenseData: number[] | null;
    // readonly clearExistingTitles: (container: HTMLElement) => void;
    private incomeChart: Chart<"bar" | "line" | "scatter" | "bubble" | "pie" | "doughnut" | "polarArea" | "radar", number[] | null, string> | null;
    private expensesChart: Chart<"bar" | "line" | "scatter" | "bubble" | "pie" | "doughnut" | "polarArea" | "radar", number[] | null, string> | null;

    private dashboardNavItem: NodeListOf<Element>;
    private dashboardLink: HTMLCollectionOf<Element>;
    private dashboardSvg: NodeListOf<Element>;

    private category: HTMLElement | null;
    private offcanvasCategory: HTMLElement | null;
    private toggleIcon: HTMLElement | null;
    private offCanvasToggleIcon: HTMLElement | null;
    private categoryNavItem: NodeListOf<Element>;
    private expenses: NodeListOf<Element>;
    private incomes: NodeListOf<Element>;

    constructor() {
        this.incomeCanvas = document.getElementById('pie-chart-income') as HTMLCanvasElement;
        this.expensesCanvas = document.getElementById('pie-chart-expenses') as HTMLCanvasElement;
        this.line = document.getElementById('line');
        this.incomePie = document.getElementById('income-pie');
        this.expensePie = document.getElementById('expense-pie');

        this.fromDate = document.getElementById('from-date');
        this.tillDate = document.getElementById('till-date');
        this.todayDate = document.getElementById('filter-today');
        this.weekDate = document.getElementById('filter-week');
        this.monthDate = document.getElementById('filter-month');
        this.yearDate = document.getElementById('filter-year');
        this.allDate = document.getElementById('filter-all');
        this.intervalDate = document.getElementById('filter-interval');
        this.titleIncomeContainer = document.getElementById('income-title-container');
        this.titleExpenseContainer = document.getElementById('expense-title-container');
        this.incomeItem = document.createElement('div');
        this.incomeTitle = this.incomeItem.querySelector('.pi-title');
        this.expensesItem = document.createElement('div');
        this.expenseTitle = this.expensesItem.querySelector('.pi-title');
        this.dateFrom = '';
        this.dateTo = '';
        this.period = '';
        this.dashboardNavItem = document.querySelectorAll('.dashboard-nav-item');
        this.dashboardLink = document.getElementsByClassName('dashboard-link');
        this.dashboardSvg = document.querySelectorAll('.bi-house');
        this.categoriesIncomeData = null;
        this.categoriesExpenseData = null;
        this.amountIncomeData = null;
        this.amountExpenseData = null;
        this.category = document.getElementById('category');
        this.offcanvasCategory = document.getElementById('offcanvas-category');
        this.toggleIcon = document.getElementById('toggleIcon');
        this.offCanvasToggleIcon = document.getElementById('offcanvas-toggleIcon');
        this.categoryNavItem = document.querySelectorAll('.category-nav-item');
        this.expenses = document.querySelectorAll('.expenses-link');
        this.incomes = document.querySelectorAll('.incomes-link');
        this.incomeChart = null;
        this.expensesChart = null;
        // this.clearExistingTitles = (container: HTMLElement): void => {
        //     const existingTitle: Element | null = container.querySelector('.pi-title');
        //     if (!container) {
        //         console.warn('Контейнер не найден для очистки заголовков');
        //         return;
        //     }
        //     if (existingTitle) {
        //         existingTitle.remove();
        //     }
        // };

        if (this.fromDate) {
            this.fromDate.addEventListener('input', () => this.resizeInput(this.fromDate as HTMLInputElement));
        }

        if (this.tillDate) {
            this.tillDate.addEventListener('input', () => this.resizeInput(this.tillDate as HTMLInputElement));
        }

        (this.tillDate as HTMLInputElement).disabled = true;
        (this.fromDate as HTMLInputElement).disabled = true;

        this.resizeInput((this.fromDate as HTMLInputElement));
        this.resizeInput((this.tillDate as HTMLInputElement));

        this.stylesLayoutCanvas();

        FileUtils.updateBalance().then();
        FileUtils.showCanvasBalance().then();
        FileUtils.showBalance().then();
        FileUtils.showName();

        this.createFilter();

        this.getOperations().then();
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

    private async createFilter(): Promise<void> {

        const resetButtons = (): void => {
            const buttons: (HTMLElement | null)[] = [this.todayDate, this.weekDate, this.monthDate, this.yearDate, this.allDate, this.intervalDate];
            buttons.forEach((button: HTMLElement | null): void => {
                if (button) {
                    button.classList.remove('active');
                    button.style.color = '';
                }

            });


        };
        if (this.todayDate) {
            this.todayDate.addEventListener('click', (): void => {
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
                this.getOperations().then();
            })
        }
        if (this.weekDate) {
            this.weekDate.addEventListener('click', (): void => {
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
                this.getOperations().then();
            })
        }
        if (this.monthDate) {
            this.monthDate.addEventListener('click', (): void => {
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
                this.getOperations().then();
            })
        }

        if (this.yearDate) {
            this.yearDate.addEventListener('click', (): void => {
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
                this.getOperations().then();
            })
        }

        if (this.allDate) {
            this.allDate.addEventListener('click', (): void => {
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
                this.getOperations().then();
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
                        onSelect: (instance: DatepickerInstance, date: Date | undefined): void => {
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
                (this.tillDate as HTMLInputElement).disabled = false;
                (this.fromDate as HTMLInputElement).disabled = false;
                this.period = 'interval';

                const updateDates = (): void => {
                    this.dateFrom = (this.fromDate as HTMLInputElement).value;
                    this.dateTo = (this.tillDate as HTMLInputElement).value;
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

                if (this.fromDate) {
                    const isEventListenersAdded = this.fromDate.dataset.eventListenersAdded === 'true';

                    if (!isEventListenersAdded) {
                        if (this.fromDate) {
                            this.fromDate.addEventListener('input', updateDates);
                            // Установим флаг, что обработчики добавлены
                            this.fromDate.dataset.eventListenersAdded = 'true';
                        }
                        if (this.tillDate) {
                            this.tillDate.addEventListener('input', updateDates);
                        }

                        if (this.fromDate) {
                            // Установим флаг, что обработчики добавлены
                            this.fromDate.dataset.eventListenersAdded = 'true';
                        }
                        if (this.tillDate) {
                            this.tillDate.dataset.eventListenersAdded = 'true';
                        }
                    }
                }
            })
        }
    }

    private async getOperations(): Promise<void> {
        const result: DefaultResponseType | OperationsResponseType = await HttpUtils.request('/operations', 'GET', true, null, this.period, this.dateFrom, this.dateTo)
        if (result && (result as OperationsResponseType).response) {
            if (Array.isArray((result as OperationsResponseType).response)) {
                const incomeData: OperationResponseType[] = (result as OperationsResponseType).response.filter((item: OperationResponseType) => item.type === 'income');
                const incomeSummary: { [key: string]: number } = this.summarizeByCategory(incomeData);
                this.categoriesIncomeData = Object.keys(incomeSummary);
                this.amountIncomeData = Object.values(incomeSummary);


                const expenseData: OperationResponseType[] = (result as OperationsResponseType).response.filter((item: OperationResponseType) => item.type === 'expense');
                const expenseSummary: { [key: string]: number } = this.summarizeByCategory(expenseData);
                this.categoriesExpenseData = Object.keys(expenseSummary); // категории
                this.amountExpenseData = Object.values(expenseSummary); // соответствующие суммы
            }
            this.createCharts();
        }
    }

    private summarizeByCategory(data: OperationResponseType[]): { [key: string]: number } {
        return data.reduce((acc: { [key: string]: number }, item: OperationResponseType) => {
            if (acc[item.category]) {
                acc[item.category] += item.amount; // Суммируем, если категория повторяется
            } else {
                acc[item.category] = item.amount;
            }
            return acc;
        }, {});
    }

    private getRandomColor(): string {
        const randomColor: string = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor.padStart(6, '0')}`;
    }

    private generateRandomColors(dataLength: number): string[] {
        return Array.from({length: dataLength}, () => this.getRandomColor());
    }

    private clearExistingTitles = (container: HTMLElement): void => {
        const existingTitle: Element | null = container.querySelector('.pi-title');
        if (!container) {
            console.warn('Контейнер не найден для очистки заголовков');
            return;
        }
        if (existingTitle) {
            existingTitle.remove();
        }
    };

    private createCharts(): void {
        if (this.titleIncomeContainer) {
            this.clearExistingTitles(this.titleIncomeContainer);
        } else {
            if (!this.titleIncomeContainer) {
                this.titleIncomeContainer = document.createElement('div');
                this.titleIncomeContainer.id = 'income-title-container';
                this.titleIncomeContainer.className = 'title-container';
                if (this.incomePie) {
                    this.incomePie.appendChild(this.titleIncomeContainer);
                }

            }
        }
        if (this.titleExpenseContainer) {
            this.clearExistingTitles(this.titleExpenseContainer);
        } else {
            if (!this.titleExpenseContainer) {
                this.titleExpenseContainer = document.createElement('div');
                this.titleExpenseContainer.id = 'expense-title-container';
                this.titleExpenseContainer.className = 'title-container';
                if (this.expensePie) {
                    this.expensePie.appendChild(this.titleExpenseContainer);
                }

            }

        }
        const getOrCreateLegendList = (chart: Chart, id: string) => {
            const legendContainer: HTMLElement | null = document.getElementById((id).toString());
            if (legendContainer) {
                let listContainer: HTMLElement | null = legendContainer.querySelector('ul');


                if (!listContainer) {
                    listContainer = document.createElement('ul');
                    listContainer.style.display = 'flex';
                    listContainer.style.flexDirection = 'row';
                    listContainer.style.margin = '20px 0 40px 0';
                    listContainer.style.padding = (0).toString();
                    legendContainer.appendChild(listContainer);
                }
                if (document.documentElement.clientWidth < 500) {
                    listContainer.style.margin = '20px 0 20px 0';
                }
                return listContainer;
            }
        };
        const htmlLegendPlugin: ChartHtmlLegendType = {
            id: 'htmlLegend',
            afterUpdate(chart: Chart, args: any, options: { containerID: string }): void {
                const ul: HTMLElement | undefined = getOrCreateLegendList(chart, options.containerID);

                if (ul) {
                    while (ul.firstChild) {
                        ul.firstChild.remove();
                    }
                }

                if (chart && chart.options && chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                    const items: LegendItem[] = (chart.options.plugins as any).legend.labels.generateLabels(chart);

                    items.forEach((item: LegendItem, index: number): void => {
                        const li: HTMLElement = document.createElement('li');
                        li.style.alignItems = 'center';
                        li.style.cursor = 'pointer';
                        li.style.display = 'flex';
                        li.style.flexDirection = 'row';
                        li.style.margin = '0 15px 0 0';
                        li.style.padding = '0 0 0 0';
                        // Добавляем стиль только для последнего элемента
                        if (index === items.length - 1) {
                            li.style.margin = (0).toString();
                        }
                        li.onclick = (): void => {
                            if (item.index !== undefined) {
                                if ((chart.config as any).type === 'pie' || (chart.config as any).type === 'doughnut') {
                                    chart.toggleDataVisibility(item.index);
                                } else {
                                    if (item.datasetIndex !== undefined) {
                                        chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                                    }
                                }
                            }
                            chart.update();
                        };
                        const boxSpan: HTMLSpanElement = document.createElement('span');
                        if (item.fillStyle) {
                            boxSpan.style.background = (item.fillStyle).toString();
                        }
                        if (item.strokeStyle) {
                            boxSpan.style.borderColor = (item.strokeStyle).toString();
                        }
                        boxSpan.style.borderWidth = item.lineWidth + 'px';
                        boxSpan.style.display = 'inline-block';
                        boxSpan.style.flexShrink = (0).toString();
                        boxSpan.style.height = '10px';
                        boxSpan.style.marginRight = '10px';
                        boxSpan.style.width = '35px';

                        const textContainer: HTMLParagraphElement = document.createElement('p');
                        textContainer.style.color = 'black';
                        textContainer.style.fontFamily = 'RobotoMedium';
                        textContainer.style.fontSize = '12px';
                        textContainer.style.margin = (0).toString();
                        textContainer.style.padding = (0).toString();
                        textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

                        const text: Text = document.createTextNode(item.text);
                        textContainer.appendChild(text);
                        li.appendChild(boxSpan);
                        li.appendChild(textContainer);
                        if (ul) {
                            ul.appendChild(li);
                        }
                    });
                }
            }
        };

        // Создание графиков
        // try {


        if (this.categoriesIncomeData) {
            const colorsIncomeChart: string[] = this.generateRandomColors(this.categoriesIncomeData.length);


            // График доходов
            if (this.incomeCanvas && this.expensesCanvas) {
                if (this.incomeChart) {
                    this.incomeChart.destroy();
                }

                // Создаем контейнер для заголовка доходов, если он отсутствует

                if (!this.titleIncomeContainer) {
                    this.titleIncomeContainer = document.createElement('div');
                    this.titleIncomeContainer.id = 'income-title-container';
                    this.titleIncomeContainer.className = 'title-container';
                    if (this.incomePie) {
                        this.incomePie.appendChild(this.titleIncomeContainer);
                    }

                }

                if (this.incomeItem) {
                    this.incomeItem.classList.add('pie-content', 'mb-md-4', 'mb-sm-3', 'mb-3', 'pb-sm-3');
                    if (document.documentElement.clientWidth > 1080) {
                        this.incomeItem.classList.add('me-4');
                    }
                }


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


                const incomeLegendContainer: HTMLDivElement = document.createElement('div');
                incomeLegendContainer.id = 'legend-income-container';
                if (this.incomeItem) {
                    this.incomeItem.appendChild(incomeLegendContainer);

                    this.incomeItem.appendChild(this.incomeCanvas);

                    if (this.incomePie) {
                        this.incomePie.appendChild(this.incomeItem);
                    }
                }

                this.incomeCanvas.style.display = "";

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
                    } as CustomChartOptions,
                    plugins: [htmlLegendPlugin],
                });

            }
            if (this.expensesChart) {
                this.expensesChart.destroy();
            }


            // График расходов
            if (this.categoriesExpenseData) {
                const colorsExpenseChart: string[] = this.generateRandomColors(this.categoriesExpenseData.length);


                // Создаем контейнер для заголовка расходов, если он отсутствует

                if (!this.titleExpenseContainer) {
                    this.titleExpenseContainer = document.createElement('div');
                    this.titleExpenseContainer.id = 'expense-title-container';
                    this.titleExpenseContainer.className = 'title-container';
                    if (this.expensePie) {
                        this.expensePie.appendChild(this.titleExpenseContainer);
                    }

                }

                if (this.expensesItem) {
                    this.expensesItem.classList.add('pie-content', 'mb-md-4', 'mb-sm-3', 'mb-3', 'pb-sm-3');
                }

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

                if (this.expensesItem) {
                    if (document.documentElement.clientWidth > 1080) {
                        this.expensesItem.classList.add('ms-4');
                    }

                    const expensesLegendContainer: HTMLDivElement = document.createElement('div');
                    expensesLegendContainer.id = 'legend-expenses-container';
                    this.expensesItem.appendChild(expensesLegendContainer);
                    if (this.expensesCanvas) {
                        this.expensesItem.appendChild(this.expensesCanvas);
                    }

                    if (
                        this.expensePie) {
                        this.expensePie.appendChild(this.expensesItem);
                    }
                }


                // График расходов
                if (this.expensesCanvas) {
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
                        } as CustomChartOptions,
                        plugins: [htmlLegendPlugin],
                    });
                }

            }
        } else {
            if (this.expensePie) {
                this.expensePie.style.display = "none"
            }

        }
        // } catch (error) {
        //     console.error('Ошибка при создании графика:', error);
        // }
    }


    private stylesLayoutCanvas(): void {
        //Layout and Offcanvas

        for (let i: number = 0; i < this.dashboardNavItem.length; i++) {
            (this.dashboardNavItem[i] as HTMLElement).style.backgroundColor = '#0D6EFD';
            (this.dashboardNavItem[i] as HTMLElement).style.setProperty('border-radius', '7px', 'important');
        }
        for (let i: number = 0; i < this.dashboardLink.length; i++) {
            (this.dashboardLink[i] as HTMLElement).style.color = "white";
        }
        for (let i: number = 0; i < this.dashboardSvg.length; i++) {
            (this.dashboardSvg[i] as HTMLElement).style.fill = 'white'
        }


        const that: Dashboard = this;
        const categoryCollapse: HTMLElement | null = document.getElementById('category-collapse');
        if (categoryCollapse) {
            categoryCollapse.addEventListener('shown.bs.collapse', function (): void {
                for (let j: number = 0; j < that.categoryNavItem.length; j++) {
                    (that.categoryNavItem[j] as HTMLElement).style.border = "1px solid #0D6EFD";
                    (that.categoryNavItem[j] as HTMLElement).style.borderRadius = "7px";
                }
                for (let i: number = 0; i < that.incomes.length; i++) {
                    (that.incomes[i] as HTMLElement).style.setProperty('border-top-right-radius', '0', 'important');
                    (that.incomes[i] as HTMLElement).style.setProperty('border-top-left-radius', '0', 'important');
                    (that.incomes[i] as HTMLElement).style.setProperty('border-bottom-right-radius', '0', 'important');
                    (that.incomes[i] as HTMLElement).style.setProperty('border-bottom-left-radius', '0', 'important');

                }
                for (let i: number = 0; i < that.expenses.length; i++) {
                    (that.expenses[i] as HTMLElement).style.setProperty('border-top-right-radius', '0', 'important');
                    (that.expenses[i] as HTMLElement).style.setProperty('border-top-left-radius', '0', 'important');
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
                for (let i: number = 0; i < that.categoryNavItem.length; i++) {
                    (that.categoryNavItem[i] as HTMLElement).style.border = "none";
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
