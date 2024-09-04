import {Chart, registerables} from "chart.js";

Chart.register(...registerables);


export class Dashboard {
  constructor() {
      this.incomeCanvas = document.getElementById('pie-chart-income');
      console.log(this.incomeCanvas)
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
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.style.alignItems = 'center';
                    li.style.cursor = 'pointer';
                    li.style.display = 'flex';
                    li.style.flexDirection = 'row';
                    li.style.margin = '20px 15px 40px 10px';
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
        if (this.incomeCanvas && this.expensesCanvas) {
            try {
                // График доходов
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
                new Chart(this.expensesCanvas, {
                    type: 'pie',
                    data: {
                        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                        datasets: [{
                            backgroundColor: ["#320357", "#1ccb1c", "#FFFF00FF", "#66eeee", "#0000FFFF"],
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
            } catch (error) {
                console.error('Ошибка при создании графика:', error);
            }
        } else {
            console.error('Элементы canvas не найдены');
        }
    }
}
