import React, { Component } from 'react';
import { Chart } from 'react-google-charts';
import './visitor.css';

const l = console.log;

export default class Visitor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            repo: props.repo,
            visitorDetail: props.visitorDetail,
            chartConfig: {
                chartType: "LineChart",
                colors: ['#a52714', '#097138'],
                options: {
                    title: 'Date vs. Views',
                    hAxis: { title: 'Date' },
                    vAxis: { title: 'Views' },
                },
                columns: [
                    { type: 'date', label: 'Date' },
                    { type: 'number', label: 'Count' },
                    { type: 'number', label: 'Uniques' },
                ]
            },
        };
    }

    render() {
        const { id, repo, chartConfig, visitorDetail } = this.state;

        const rows = visitorDetail.views.map(view => {
            return Object.keys(view).map(key => {
                if (key === "timestamp")
                    return new Date(view[key]);
                return view[key];
            });
        });

        let chart = <Chart
            chartType={chartConfig.chartType}
            rows={rows}
            options={chartConfig.options}
            columns={chartConfig.columns}
            graph_id={id}
            width="100%"
            height="300px"
            chartPackages={['corechart']}
        />;

        if (!rows || rows.length === 0) {
            chart = <div>No data to display...</div>;
        }

        return (
            <div className="Visitor">
                <header className="Visitor-header">{repo}</header>
                <section className="Visitor-content">
                    {chart}
                </section>
            </div>
        );
    }
}