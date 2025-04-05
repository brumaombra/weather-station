import { formatUnitNumber } from '~/utils/formatter.js';

export default {
    series: [],
    chart: {
        height: 300,
        type: 'area',
        toolbar: {
            show: false
        }, zoom: {
            enabled: false
        }
    }, colors: ['#20bf6b', '#dc3545', '#0d6efd'],
    legend: {
        show: true
    }, dataLabels: {
        enabled: false
    }, stroke: {
        curve: 'smooth',
        width: 2
    }, grid: {
        strokeDashArray: 2
    }, xaxis: {
        type: 'category',
        tickPlacement: 'on',
        axisBorder: {
            show: false
        }, axisTicks: {
            show: false
        }, crosshairs: {
            stroke: {
                dashArray: 0
            }, dropShadow: {
                show: false
            }
        }, tooltip: {
            enabled: false
        }, labels: {
            style: {
                colors: '#9ca3af',
                fontSize: '13px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400
            }, formatter: title => { // It doesn't work :|
                return title;
            }
        }
    }, yaxis: {
        decimalsInFloat: 1,
        labels: {
            align: 'left',
            style: {
                colors: '#9ca3af',
                fontSize: '13px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400
            }, formatter: val => { // It doesn't work :|
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