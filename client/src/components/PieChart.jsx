import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, CategoryScale, PieController } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Helmet } from "react-helmet-async";

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, CategoryScale, PieController );

const labels =  Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleDateString('en-IN', { month: 'short' });
}).reverse();

const backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
];
const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
];

const DonationPieChart = ({ counts, title }) => {
    let count = [];
    counts.map((el)=> {
        return count.unshift(el.count);
    });
    const chartData = {
        labels: labels,
        datasets: [{
            data: count,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1
        }]
    };

    return (
        <>
        <Helmet>
            <title>{title} - Donation And Expense Statistics</title>
            <meta name="description" content={`View the donation and expense statistics for the past few months: ${labels.join(', ')}`} />
        </Helmet>
        <div>
            <h2>{ title }</h2>
            <Pie data={chartData} />
        </div>
        </>
    );
};

export default DonationPieChart;
