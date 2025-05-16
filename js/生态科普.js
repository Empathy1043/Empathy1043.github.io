//广东省红树林生态分布（2025年）
document.addEventListener('DOMContentLoaded', function() {
    const mangroveData = [
  { "name": "湛江市", "value": 6521.85, "proportion": "57.2%" },  // 国家级保护区
  { "name": "茂名市", "value": 792.51,  "proportion": "7.0%" },   // 茂名茂港保护区
  { "name": "阳江市", "value": 969.29, "proportion": "8.5%" },   // 程村湾示范区
  { "name": "江门市", "value": 898.90, "proportion": "7.9%" },   // 镇海湾核心区
  { "name": "珠海市", "value": 500.00, "proportion": "4.4%" },   // 淇澳岛湿地
  { "name": "惠州市", "value": 388.22, "proportion": "3.4%" },   // 考洲洋湾区
  { "name": "深圳市", "value": 296.00, "proportion": "2.6%" },   // 福田保护区
  { "name": "广州市", "value": 403.90, "proportion": "3.5%" },   // 南沙、番禺区
  { "name": "汕头市", "value": 144.00, "proportion": "1.3%" },   // 汕头湿地
  { "name": "汕尾市", "value": 240.00, "proportion": "2.1%" },   // 梅海育苗场等
  { "name": "其他地区", "value": 245.33, "proportion": "2.2%" }  // 东莞、潮州、揭阳等散点和修复项目
];

// 自定义颜色映射
const protectionLevels = [
    { min: 7000, color: '#1b4332', label: '核心保护区' },
    { min: 1000, max: 7000, color: '#2d6a4f', label: '重点区域' },
    { min: 500, max: 1000, color: '#40916c', label: '示范区' },
    { min: 100, max: 500, color: '#74c69d', label: '一般区域' },
    { max: 100, color: '#b7e4c7', label: '零星分布' }
];

    function initChart() {
        // 保持原有逻辑，修改样式类名为CSS中定义的
        const chart = echarts.init(document.getElementById('map'));
        const option = {
            title: {
                text: '广东省红树林生态分布（2025年）',
                subtext: '数据来源：广东省林业局...',
                left: 'center',
                textStyle: {
                    color: '#1a4d3c',
                    fontSize: 22,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderColor: '#74c69d',
            formatter: params => `
                <div style="
                    padding: 12px;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,75,50,0.1);
                    color: #2d6048;
                ">
                    <strong style="font-size:16px">${params.name}</strong>
                    <hr style="margin:8px 0;border-color:#eee">
                    <div style="line-height:1.6">
                        <span style="display:inline-block;width:70px">分布面积：</span> 
                        ${params.data.value.toLocaleString()}公顷<br>
                        <span style="display:inline-block;width:70px">全省占比：</span> 
                        ${params.data.proportion}<br>
                        ${getSpecialLabel(params.data.name)}
                    </div>
                </div>`
        },
        visualMap: {
            type: 'piecewise',
            left: '3%',
            bottom: '12%',
            pieces: protectionLevels,
            textStyle: { 
                color: '#2d6048',
                fontSize: 14
            },
            itemWidth: 20,
            itemHeight: 12
        },
        series: [{
            type: 'map',
            map: 'GD',
            name: '红树林分布',
            roam: true,
            label: {
                show: true,
                fontSize: 12,
                color: '#284b63',
                fontWeight: 'bold'
            },
            itemStyle: {
                areaColor: '#e9f5ef',
                borderColor: '#93c9d8',
                borderWidth: 0.8
            },
            emphasis: {
                label: { 
                    show: true,
                    color: '#fff',
                    fontSize: 14,
                    textBorderColor: '#1a4d3c',
                    textBorderWidth: 2
                },
                itemStyle: { 
                    areaColor: '#2d6a4f',
                    borderWidth: 1.2
                }
              },
              data: mangroveData,
          }]
        };
        chart.setOption(option);
        // 自适应窗口
        window.addEventListener('resize', () => chart.resize());
    }

    // 保持原有地图加载逻辑
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/440000_full.json')
        .then(response => response.json())
        .then(geoJson => {
            echarts.registerMap('GD', geoJson);
            initChart();
        });

    // 特殊区域标注说明
    function getSpecialLabel(cityName) {
        const specialAreas = {
            '湛江市': '★ 含湛江红树林国家级自然保护区',
            '深圳市': '★ 含福田国际重要湿地',
            '珠海市': '★ 淇澳-担杆岛省级自然保护区'
        };
        return specialAreas[cityName] || '';
    }
});
//生态完整度js动画
            // 统一动画控制
            document.addEventListener('DOMContentLoaded', () => {
              const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    const statBar = entry.target.querySelector('.stat-bar');
                    const percentElem = entry.target.querySelector('.percent');
                    const targetPercent = parseInt(statBar.dataset.percent);
            
                    // 重置动画状态
                    statBar.style.transition = 'none';
                    statBar.style.width = '0%';
                    percentElem.textContent = '0';
                    void statBar.offsetWidth;
            
                    // 启动动画
                    statBar.style.transition = 'width 1.8s ease';
                    statBar.style.width = `${targetPercent}%`;
            
                    // 数字递增效果
                    let current = 0;
                    const interval = setInterval(() => {
                      current++;
                      percentElem.textContent = current;
                      if (current >= targetPercent) clearInterval(interval);
                    }, 1800 / targetPercent);
                    
                    observer.unobserve(entry.target);
                  }
                });
              }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });
            
              document.querySelectorAll('.eco-stats').forEach(el => observer.observe(el));
            });