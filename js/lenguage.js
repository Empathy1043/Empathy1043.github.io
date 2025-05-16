// lenguage.js
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有图表
    initCharts();
});

function initCharts() {
    // 全球分布地图
    const worldMapChart = echarts.init(document.getElementById('worldMap'));
    const worldMapOption = {
        backgroundColor: '#e8f5e9',
        tooltip: {
            trigger: 'item',
            formatter: '{b}'
        },
        visualMap: {
            min: 0,
            max: 100,
            text: ['高', '低'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ['#b8e0d2', '#4a8f6d']
            },
            textStyle: {
                color: '#333'
            }
        },
        series: [{
            name: '红树林分布',
            type: 'map',
            map: 'world',
            roam: true,
            emphasis: {
                label: {
                    show: true
                }
            },
            data: [
                { name: 'China', value: 80 },
                { name: 'Indonesia', value: 90 },
                { name: 'Brazil', value: 70 },
                { name: 'Australia', value: 60 },
                { name: 'Mexico', value: 50 },
                { name: 'Nigeria', value: 40 },
                { name: 'Vietnam', value: 65 },
                { name: 'Malaysia', value: 75 },
                { name: 'Thailand', value: 55 },
                { name: 'Bangladesh', value: 45 }
            ]
        }]
    };
    worldMapChart.setOption(worldMapOption);

    // 碳汇对比图表
    const carbonChart = echarts.init(document.getElementById('carbonChart'));
    const carbonOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#999'
                }
            },
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'category',
            data: ['海莲林', '热带雨林', '温带森林', '草原'],
            axisLine: {
                lineStyle: {
                    color: '#999'
                }
            },
            axisLabel: {
                color: '#666'
            }
        },
        series: [{
            name: '年固碳量 (t/ha)',
            type: 'bar',
            data: [
                { value: 12.55, itemStyle: { color: '#4a8f6d' } },
                { value: 11.55, itemStyle: { color: '#8db596' } },
                { value: 7.3, itemStyle: { color: '#b8e0d2' } },
                { value: 2.5, itemStyle: { color: '#d9f2e6' } }
            ],
            label: {
                show: true,
                position: 'right',
                formatter: '{c} t/ha',
                color: '#333'
            }
        }]
    };
    carbonChart.setOption(carbonOption);

    // 食物链图表
    const foodChainChart = echarts.init(document.getElementById('foodChain'));
    const foodChainOption = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'sankey',
                data: [
                    { name: '凋落物' },
                    { name: '分解者' },
                    { name: '小型鱼类' },
                    { name: '大型鱼类' },
                    { name: '鸟类' },
                    { name: '顶级捕食者' }
                ],
                links: [
                    { source: '凋落物', target: '分解者', value: 10 },
                    { source: '分解者', target: '小型鱼类', value: 8 },
                    { source: '小型鱼类', target: '大型鱼类', value: 6 },
                    { source: '小型鱼类', target: '鸟类', value: 4 },
                    { source: '大型鱼类', target: '顶级捕食者', value: 3 },
                    { source: '鸟类', target: '顶级捕食者', value: 2 }
                ],
                emphasis: {
                    focus: 'adjacency'
                },
                levels: [
                    {
                        depth: 0,
                        itemStyle: {
                            color: '#8db596'
                        },
                        lineStyle: {
                            color: 'source',
                            opacity: 0.6
                        }
                    },
                    {
                        depth: 1,
                        itemStyle: {
                            color: '#4a8f6d'
                        }
                    },
                    {
                        depth: 2,
                        itemStyle: {
                            color: '#3a7a5d'
                        }
                    }
                ],
                lineStyle: {
                    color: 'gradient',
                    curveness: 0.5
                },
                label: {
                    color: '#333'
                }
            }
        ]
    };
    foodChainChart.setOption(foodChainOption);

    // 生态服务价值图表
    const ecosystemValueChart = echarts.init(document.getElementById('ecosystemValue'));
    const ecosystemValueOption = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center',
            textStyle: {
                color: '#333'
            }
        },
        series: [
            {
                name: '生态服务价值',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold',
                        formatter: '{b}\n{c}%'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 35, name: '海岸防护', itemStyle: { color: '#4a8f6d' } },
                    { value: 25, name: '碳汇功能', itemStyle: { color: '#8db596' } },
                    { value: 20, name: '生物多样性', itemStyle: { color: '#b8e0d2' } },
                    { value: 15, name: '渔业资源', itemStyle: { color: '#d9f2e6' } },
                    { value: 5, name: '旅游休闲', itemStyle: { color: '#edf8f3' } }
                ]
            }
        ]
    };
    ecosystemValueChart.setOption(ecosystemValueOption);

    // 响应式调整
    window.addEventListener('resize', function () {
        worldMapChart.resize();
        carbonChart.resize();
        foodChainChart.resize();
        ecosystemValueChart.resize();
    });

    // 初始化潮汐模拟
    simulateTide();
}

// 潮汐模拟动画
function simulateTide() {
    const highTide = document.querySelector('.water-level[data-tide="high"]');
    const lowTide = document.querySelector('.water-level[data-tide="low"]');

    setInterval(() => {
        highTide.style.height = '70%';
        lowTide.style.height = '30%';

        setTimeout(() => {
            highTide.style.height = '30%';
            lowTide.style.height = '70%';
        }, 3000);
    }, 6000);
}

// 固碳量计算器
function calculateCarbon() {
    const area = document.getElementById('area-input').value;
    const result = area * 12.55; // 海莲林固碳系数
    document.getElementById('result').innerText = result.toFixed(2);
}