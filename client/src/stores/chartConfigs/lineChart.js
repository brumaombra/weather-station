import { formatUnitNumber } from '@/utils/formatter.js';

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
        show: false
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
            }, formatter: title => {
                return title;
            }
        }
    }, yaxis: {
        labels: {
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
        breakpoint: 568,
        options: {
            chart: {
                height: 300
            }, labels: {
                style: {
                    colors: '#9ca3af',
                    fontSize: '11px',
                    fontFamily: 'Inter, ui-sans-serif',
                    fontWeight: 400
                },
                offsetX: -2,
                formatter: (title) => title.slice(0, 3)
            }, yaxis: {
                labels: {
                    align: 'left',
                    minWidth: 0,
                    maxWidth: 140,
                    style: {
                        colors: '#9ca3af',
                        fontSize: '11px',
                        fontFamily: 'Inter, ui-sans-serif',
                        fontWeight: 400
                    },
                    formatter: (value) => value >= 1000 ? `${value / 1000}k` : value
                }
            }
        }
    }]
};