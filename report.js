/**
 * 报告页面逻辑
 */

// 中国儿童身高标准数据
const heightStandards = {
  boy: {
    age: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    P3:  [46.3, 71.2, 81.3, 89.3, 96.3, 102.1, 108.2, 114.0, 119.5, 124.6, 129.6, 134.9, 140.2, 146.3, 153.5, 159.8, 163.7, 166.0, 167.3],
    P25: [49.7, 74.8, 85.4, 94.0, 101.4, 107.6, 114.1, 120.3, 126.3, 131.8, 137.2, 142.9, 148.6, 155.2, 162.7, 169.2, 173.3, 175.6, 176.9],
    P50: [52.0, 77.3, 88.5, 97.5, 105.3, 111.9, 118.8, 125.4, 131.8, 137.6, 143.3, 149.3, 155.4, 162.3, 169.9, 176.5, 180.7, 183.0, 184.3],
    P75: [54.3, 79.9, 91.7, 101.1, 109.3, 116.3, 123.6, 130.6, 137.4, 143.5, 149.5, 155.8, 162.3, 169.4, 177.1, 183.8, 188.0, 190.3, 191.6],
    P97: [58.2, 84.4, 97.0, 107.4, 116.4, 124.0, 131.9, 139.5, 146.9, 153.6, 160.2, 167.1, 174.2, 181.7, 189.6, 196.5, 200.7, 203.0, 204.3]
  },
  girl: {
    age: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    P3:  [45.6, 69.5, 79.5, 87.5, 94.3, 100.0, 106.0, 111.8, 117.5, 123.0, 128.3, 133.9, 139.6, 145.3, 150.5, 153.5, 155.0, 155.8, 156.3],
    P25: [49.0, 73.2, 83.6, 92.2, 99.4, 105.5, 111.9, 118.1, 124.2, 130.1, 135.8, 141.8, 147.8, 153.8, 159.1, 162.1, 163.6, 164.4, 164.9],
    P50: [51.3, 75.8, 86.8, 95.8, 103.4, 109.8, 116.6, 123.0, 129.3, 135.5, 141.5, 147.8, 154.0, 160.1, 165.4, 168.4, 169.9, 170.7, 171.2],
    P75: [53.6, 78.5, 90.1, 99.5, 107.5, 114.2, 121.3, 128.0, 134.6, 141.1, 147.4, 153.9, 160.3, 166.5, 171.8, 174.8, 176.3, 177.1, 177.6],
    P97: [57.7, 83.3, 95.6, 105.7, 114.3, 121.6, 129.3, 136.6, 143.8, 150.9, 157.7, 164.7, 171.4, 177.8, 183.1, 186.1, 187.6, 188.4, 188.9]
  }
};

let growthChart = null;

// 检查登录和数据
window.addEventListener('load', function() {
  const user = localStorage.getItem('currentUser');
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const data = sessionStorage.getItem('assessmentData');
  if (!data) {
    alert('请先填写宝贝信息');
    window.location.href = 'baby-info.html';
    return;
  }

  const formData = JSON.parse(data);
  generateReport(formData);
});

// 计算年龄
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// 计算 BMI
function calculateBMI(height, weight) {
  const heightM = height / 100;
  return (weight / (heightM * heightM)).toFixed(1);
}

// 插值计算标准身高
function interpolateHeight(standard, age) {
  const ages = standard.age;
  if (age <= ages[0]) return { P3: standard.P3[0], P25: standard.P25[0], P50: standard.P50[0], P75: standard.P75[0], P97: standard.P97[0] };
  if (age >= ages[ages.length - 1]) return { P3: standard.P3[ages.length - 1], P25: standard.P25[ages.length - 1], P50: standard.P50[ages.length - 1], P75: standard.P75[ages.length - 1], P97: standard.P97[ages.length - 1] };
  
  let lowerIdx = 0;
  for (let i = 0; i < ages.length; i++) {
    if (ages[i] <= age) lowerIdx = i;
    else break;
  }
  const upperIdx = lowerIdx + 1;
  const ratio = (age - ages[lowerIdx]) / (ages[upperIdx] - ages[lowerIdx]);
  
  return {
    P3: standard.P3[lowerIdx] + (standard.P3[upperIdx] - standard.P3[lowerIdx]) * ratio,
    P25: standard.P25[lowerIdx] + (standard.P25[upperIdx] - standard.P25[lowerIdx]) * ratio,
    P50: standard.P50[lowerIdx] + (standard.P50[upperIdx] - standard.P50[lowerIdx]) * ratio,
    P75: standard.P75[lowerIdx] + (standard.P75[upperIdx] - standard.P75[lowerIdx]) * ratio,
    P97: standard.P97[lowerIdx] + (standard.P97[upperIdx] - standard.P97[lowerIdx]) * ratio
  };
}

// 计算百分位
function calculatePercentile(height, standards) {
  if (height <= standards.P3) return 3;
  if (height >= standards.P97) return 97;
  
  const percentiles = [
    { p: 3, h: standards.P3 },
    { p: 25, h: standards.P25 },
    { p: 50, h: standards.P50 },
    { p: 75, h: standards.P75 },
    { p: 97, h: standards.P97 }
  ];
  
  for (let i = 0; i < percentiles.length - 1; i++) {
    if (height >= percentiles[i].h && height <= percentiles[i + 1].h) {
      const ratio = (height - percentiles[i].h) / (percentiles[i + 1].h - percentiles[i].h);
      return percentiles[i].p + (percentiles[i + 1].p - percentiles[i].p) * ratio;
    }
  }
  
  return 50;
}

// 预测身高
function predictHeight(gender, fatherHeight, motherHeight, currentHeight, age) {
  let geneticHeight = gender === 'boy' ? (fatherHeight + motherHeight + 13) / 2 : (fatherHeight + motherHeight - 13) / 2;
  const currentGeneticRatio = currentHeight / geneticHeight;
  let predictedHeight = geneticHeight;
  
  if (currentGeneticRatio < 0.9 && age < 12) predictedHeight = geneticHeight - 3;
  else if (currentGeneticRatio > 1.1 && age < 12) predictedHeight = geneticHeight + 3;
  
  return {
    predicted: Math.round(predictedHeight),
    genetic: Math.round(geneticHeight),
    min: Math.round(geneticHeight - 5),
    max: Math.round(geneticHeight + 5)
  };
}

// 生成报告
function generateReport(data) {
  const age = calculateAge(data.birthDate);
  const bmi = calculateBMI(data.currentHeight, data.currentWeight);
  const standard = heightStandards[data.gender];
  const currentStandards = interpolateHeight(standard, age);
  const percentile = calculatePercentile(data.currentHeight, currentStandards);
  const prediction = predictHeight(data.gender, data.fatherHeight, data.motherHeight, data.currentHeight, age);

  // 显示宝贝信息
  document.getElementById('childInfoGrid').innerHTML = `
    <div class="child-info-item">
      <div class="child-info-label">姓名</div>
      <div class="child-info-value">${data.childName}</div>
    </div>
    <div class="child-info-item">
      <div class="child-info-label">性别</div>
      <div class="child-info-value">${data.gender === 'boy' ? '男孩' : '女孩'}</div>
    </div>
    <div class="child-info-item">
      <div class="child-info-label">年龄</div>
      <div class="child-info-value">${age}岁</div>
    </div>
    <div class="child-info-item">
      <div class="child-info-label">BMI</div>
      <div class="child-info-value">${bmi}</div>
    </div>
  `;

  // 显示当前身高状态
  document.getElementById('currentHeight').textContent = data.currentHeight;
  document.getElementById('percentile').textContent = `P${Math.round(percentile)}`;
  document.getElementById('surpassPercent').textContent = Math.round(percentile);
  document.getElementById('percentileFill').style.width = `${percentile}%`;

  // 显示身高预测
  document.getElementById('predictedHeight').textContent = prediction.predicted;
  document.getElementById('geneticHeight').textContent = prediction.genetic;
  document.getElementById('heightRange').textContent = `${prediction.min}~${prediction.max}`;

  // 绘制生长曲线
  drawGrowthChart(data.gender, age, data.currentHeight);

  // 保存到数据库
  if (typeof db !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    db.saveRecord({
      userPhone: user.phone,
      childName: data.childName,
      gender: data.gender,
      birthDate: data.birthDate,
      age: age,
      height: data.currentHeight,
      weight: data.currentWeight,
      fatherHeight: data.fatherHeight,
      motherHeight: data.motherHeight,
      targetHeight: data.targetHeight,
      percentile: Math.round(percentile),
      predictedHeight: prediction.predicted,
      geneticHeight: prediction.genetic,
      bmi: bmi
    });
  }
}

// 绘制生长曲线
function drawGrowthChart(gender, currentAge, currentHeight) {
  const ctx = document.getElementById('growthChart').getContext('2d');
  const standard = heightStandards[gender];
  
  if (growthChart) growthChart.destroy();
  
  const labels = standard.age;
  const childData = new Array(labels.length).fill(null);
  const ageIndex = Math.round(currentAge);
  if (ageIndex >= 0 && ageIndex < labels.length) {
    childData[ageIndex] = currentHeight;
  }
  
  growthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.map(a => a + '岁'),
      datasets: [
        { label: 'P97', data: standard.P97, borderColor: '#e74c3c', borderWidth: 2, borderDash: [5, 5], fill: false, pointRadius: 0 },
        { label: 'P50', data: standard.P50, borderColor: '#27ae60', borderWidth: 2, fill: false, pointRadius: 0 },
        { label: 'P3', data: standard.P3, borderColor: '#9b59b6', borderWidth: 2, borderDash: [5, 5], fill: false, pointRadius: 0 },
        { label: '您的孩子', data: childData, borderColor: '#2d3436', backgroundColor: '#2d3436', borderWidth: 3, pointRadius: 6, fill: false }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.5,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { min: 40, max: 200 }
      }
    }
  });
}

// 保存为图片
function saveAsImage() {
  const container = document.querySelector('.container');
  
  html2canvas(container, {
    scale: 2,
    backgroundColor: '#ffffff',
    logging: false,
    useCORS: true
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `身高评估报告_${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    alert('报告已保存！');
  }).catch(err => {
    alert('保存失败，请截图保存');
    console.error(err);
  });
}

// 返回首页
function backToHome() {
  window.location.href = 'baby-info.html';
}
