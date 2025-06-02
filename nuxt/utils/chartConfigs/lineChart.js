export default {
    series: [],
    chart: {
        height: 300,
        type: 'area',
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        },
        fontFamily: 'inherit',
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
        },
        background: 'transparent'
    },
    colors: ['#20bf6b', '#dc3545', '#0d6efd'],
    grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4,
        xaxis: {
            lines: {
                show: true
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        }
    },
    tooltip: {
        theme: 'light',
        x: {
            show: true
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        labels: {
            style: {
                colors: '#6B7280',
                fontSize: '12px',
                fontFamily: 'inherit'
            }
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        },
        tooltip: {
            enabled: false
        }
    },
    yaxis: {
        decimalsInFloat: 1,
        labels: {
            style: {
                colors: '#6B7280',
                fontSize: '12px',
                fontFamily: 'inherit'
            }
        }
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '14px',
        fontFamily: 'inherit',
        labels: {
            colors: '#374151'
        }
    }, responsive: [{
        breakpoint: 640,
        options: {
            chart: {
                height: 300
            }, labels: {
                offsetX: -2
            }, yaxis: {
                decimalsInFloat: 1,
                labels: {
                    align: 'left'
                }
            }
        }
    }]
};