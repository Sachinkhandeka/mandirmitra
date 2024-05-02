import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement);

const labels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleDateString('en-IN', { month: 'long' });
}).reverse();

const chartOptions = {
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: function (value) {
                    return '₹' + value.toLocaleString();
                },
            },
        },
    },
};

const DonationBarChart = ({ donationAmnt }) => {
    let amount = [];
    let total = 0 ; 
    donationAmnt.map((el)=> {
        total += el.donationAmount;
        return amount.unshift(el.donationAmount);
    });
    const data = {
        labels: labels,
        datasets: [{
            label: 'Donation Amount',
            data: amount,
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
        <div>
            <h2>Monthly Donation Amounts</h2>
            <Bar data={data} options={chartOptions} />
        </div>
    );
};

export default DonationBarChart;
