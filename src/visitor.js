import React, { Component } from 'react';
import { Chart } from 'react-google-charts';
import './visitor.css';
// import axios from 'axios';

const l = console.log;

export default class Visitor extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
                "columns": [
                    { type: 'date', label: 'Date' },
                    { type: 'number', label: 'Count' },
                    { type: 'number', label: 'Uniques' },
                ]
            },
        };
    }

    render() {
        const { repo, chartConfig, visitorDetail } = this.state;
        l("vistor.render", this.state);
        if (!visitorDetail.views || visitorDetail.views.length === 0) {
            return <div>loading chart...</div>;
        }

        const rows = visitorDetail.views.map(view => {
            return Object.keys(view).map(key => {
                if (key === "timestamp")
                    return new Date(view[key]);
                return view[key];
            });
        });

        const chart = <Chart
            chartType={chartConfig.chartType}
            rows={rows}
            options={chartConfig.options}
            columns={chartConfig.columns}
            graph_id="LineChart"
            width="100%"
            height="150px"
        />;

        l("loading chart...");

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