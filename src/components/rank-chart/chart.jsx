// components/LineChart.jsx
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import crosshairPlugin from 'chartjs-plugin-crosshair';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
    crosshairPlugin
);

const uzMonths = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
];

const LineChart = ({ year = new Date().getFullYear(), data = [] }) => {
    const labels = uzMonths;

    const filledData = Array.from({ length: 12 }, (_, i) => data[i] ?? null);

    const chartData = {
        labels,
        datasets: [
            {
                data: filledData,
                borderColor: '#ea641e',
                backgroundColor: '#ffffffb9',
                tension: 0,
                borderWidth: 2,
                fill: false,
                stepped: false,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#ffffff',
                borderColor: '#ea641e',
                borderWidth: 1,
                titleColor: '#000000',
                bodyColor: '#000000',
                padding: 10,
                cornerRadius: 5,
                displayColors: false,
                bodyFont: {
                    weight: 'bold'
                },
                callbacks: {
                    title: function (context) {
                        return `${year}-yil, ${uzMonths[context[0].dataIndex]}`;
                    },
                    label: function (context) {
                        return `${context.parsed.y}-o‘rin`;
                    }
                }
            },
            crosshair: {
                line: {
                    color: '#888',
                    width: 1,
                    dashPattern: [0],
                },
                sync: {
                    enabled: false,
                },
                zoom: {
                    enabled: false,
                },
                animation: {
                    duration: 0
                },
                snap: {
                    enabled: true,
                    mode: 'nearest',
                    threshold: 10
                }
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                reverse: true,
                min: 1,
                max: 30,
                ticks: { stepSize: 5 },
                grid: {
                    display: true,
                }
            },
            x: {
                grid: {
                    display: false,
                }
            },
        },
        elements: {
            line: {
                tension: 0,
                cubicInterpolationMode: 'default',
                capBezierPoints: false,
            },
            point: {
                radius: 0,
                hoverRadius: 4,
                hitRadius: 5,
            },
        },
    };
    return <Line data={chartData} options={options} />;
};

export default LineChart;
