import { formatUnitNumber } from '~/utils/formatter.js';

export default {
    series: [],
    chart: {
        height: 300,
        type: 'scatter',
        toolbar: {
            show: false
        }, zoom: {
            enabled: false
        }
    }, colors: ['#20bf6b'],
    legend: {
        show: false
    }, dataLabels: {
        enabled: false
    }, xaxis: {
        tickAmount: 10,
        tooltip: {
            enabled: false
        }, labels: {
            style: {
                colors: '#9ca3af',
                fontSize: '13px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400
            }, formatter: val => {
                return formatUnitNumber(val);
            }
        }
    }, yaxis: {
        decimalsInFloat: 1,
        tickAmount: 7,
        labels: {
            align: 'left',
            style: {
                colors: '#9ca3af',
                fontSize: '13px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400
            }, formatter: val => {
                return formatUnitNumber(val);
            }
        }
    }, responsive: [{
        breakpoint: 640,
        options: {
            chart: {
                height: 300
            }, labels: {
                offsetX: -2,
                style: {
                    colors: '#9ca3af',
                    fontSize: '11px',
                    fontFamily: 'Inter, ui-sans-serif',
                    fontWeight: 400
                }, formatter: title => { // It doesn't work :|
                    return title;
                }
            }, yaxis: {
                decimalsInFloat: 1,
                labels: {
                    align: 'left',
                    style: {
                        colors: '#9ca3af',
                        fontSize: '11px',
                        fontFamily: 'Inter, ui-sans-serif',
                        fontWeight: 400
                    }, formatter: val => { // It doesn't work :|
                        return formatUnitNumber(val);
                    }
                }
            }
        }
    }]
};