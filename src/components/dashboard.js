import {Chart} from "chart.js/auto";

export class Dashboard {
    constructor() {
        this.incomeCanvas = document.getElementById('pie-chart-income');
        this.expensesCanvas = document.getElementById('pie-chart-expenses');

        this.createCharts();

    }

    createCharts() {
        const getOrCreateLegendList = (chart, id) => {
            const legendContainer = document.getElementById(id);
            let listContainer = legendContainer.querySelector('ul');

            if (!listContainer) {
                listContainer = document.createElement('ul');
                listContainer.style.display = 'flex';
                listContainer.style.flexDirection = 'row';
                listContainer.style.margin = 0;
                listContainer.style.padding = 0;
                legendContainer.appendChild(listContainer);
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
                    li.style.margin = '20px 15px 40px 0';
                    // Добавляем стиль только для последнего элемента
                    if (index === items.length - 1) {
                        li.style.margin = '20px 0 40px 0';
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
                incomeItem.classList = 'pie-content me-4 mb-4 pb-3';
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
                expensesItem.classList = 'pie-content ms-4 mb-4 pb-3';
                expensesItem.appendChild(document.createElement('h2')).className = 'pi-title m-0';
                expensesItem.lastChild.textContent = 'Расходы';

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
}
