import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Helmet } from 'react-helmet-async';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement);

const chartOptions = {
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: function (value) {
                    return  value.toLocaleString();
                },
            },
        },
    },
};

const InventoryBarChart = ({ data, title, label }) => {
    const labels = data.map(item => item._id);
    const counts = data.map(item => item.count);
    
    const chartData = {
        labels: labels,
        datasets: [{
            label: label,
            data: counts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)', 'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    return (
        <section className="inventory-bar-chart">
            <Helmet>
                <title>{title} - Inventory Analytics</title>
                <meta name="description" content={`Bar chart showing ${title} for inventory categories.`} />
            </Helmet>
            <div>
                <h2>{ title }</h2>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </section>
    );
};

export default InventoryBarChart;
