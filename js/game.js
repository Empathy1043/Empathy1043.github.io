// game.js
// game.js

// --------------- 生态模块 ---------------
const MangroveGame = (() => {
  // 可扩展物种列表
  const SPECIES = [
    { id:1, type:'egret',      emoji:'🦢', name:'白鹭',    fact:'白鹭：高处栖息的水鸟，善于俯瞰红树林生态。',      zone:{minY:0,   maxY:0.3} },
    { id:2, type:'tree',       emoji:'🌳', name:'红树苗',  fact:'红树苗：海岸小卫士，能防止侵蚀并净化水质。',       zone:{minY:0.3, maxY:0.6} },
    { id:3, type:'crab',       emoji:'🦀', name:'招潮蟹',  fact:'招潮蟹：滩涂里的搬运工，打洞改善土壤通气。',        zone:{minY:0.6, maxY:1.0} },
    { id:4, type:'mudskipper', emoji:'🐟', name:'泥跳鱼',  fact:'泥跳鱼：两栖鱼类，可在泥滩上跳跃并用皮肤呼吸。',    zone:{minY:0.6, maxY:1.0} },
    { id:5, type:'polychaete', emoji:'🪱', name:'多毛虫',  fact:'多毛虫：用羽毛状足过滤进食，分解有机质。',         zone:{minY:0.6, maxY:1.0} }
  ];
  const CONFIG = { MAX_STARS: 10 };
  let state = { stars:0, first:true, placed:new Set() };

  const audioFiles = {
    first: new Audio('https://liujinxiu-java1.oss-cn-beijing.aliyuncs.com/2025/05/495e0501-34ea-4997-90a6-d10cc0f34742.mp3'),
        success: new Audio('https://liujinxiu-java1.oss-cn-beijing.aliyuncs.com/2025/05/9068ca94-c981-4426-ac4a-1595d06d99b9.mp3'),
        error: new Audio('https://liujinxiu-java1.oss-cn-beijing.aliyuncs.com/2025/05/b77159a8-2ea3-49d9-9b4c-daa8da691009.mp3'),
        reset: new Audio('https://liujinxiu-java1.oss-cn-beijing.aliyuncs.com/2025/05/6733243f-196a-46bf-877a-1e07062d5f1a.mp3'),
        celebrate: new Audio('https://liujinxiu-java1.oss-cn-beijing.aliyuncs.com/2025/05/c0baeb11-d5e6-46b3-9781-68bb4d6ae77c.mp3'),
        hint: new Audio('https://liujinxiu-java1.oss-cn-beijing.aliyuncs.com/2025/05/hint.mp3')

  };
  const QUIZ = [
    {
      q: '哪种红树林植物最先生根防止海岸侵蚀？',
      options: ['红树苗', '黑红树', '白红树', '珠果树'],
      answer: 0
    },
    {
      q: '招潮蟹最擅长什么？',
      options: ['飞行', '打洞', '奔跑', '筑巢'],
      answer: 1
    },
    {
      q: '哪种鱼类可以在泥滩上跳跃呼吸？',
      options: ['泥跳鱼', '鲤鱼', '石斑鱼', '鳐鱼'],
      answer: 0
    },
    {
      q: '白鹭主要以什么为食？',
      options: ['树叶', '小鱼小虾', '种子', '树皮'],
      answer: 1
    }
  ];
  let quizIndex = 0, quizScore = 0;

  // 生态拖放处理
  const dragHandler = {
    init() {
      this.renderPool();
      // 只选择生态池中的生物
      document.querySelectorAll('#animal-pool .puzzle-piece').forEach(p => {
        p.draggable = true;
        p.addEventListener('dragstart', e => this.start(e));
        p.addEventListener('dragend',   e => this.end(e));
      });
      // 只在 main-area 上监听 drop
      const area = document.getElementById('main-area');
      area.addEventListener('dragover', e => e.preventDefault());
      area.addEventListener('drop',     e => this.drop(e));
    },
    renderPool() {
      const pool = document.getElementById('animal-pool');
      pool.innerHTML = '';
      SPECIES.forEach(s => {
        const d = document.createElement('div');
        d.className = 'puzzle-piece';
        d.dataset.id = s.id;
        d.textContent = `${s.emoji} ${s.name}`;
        pool.appendChild(d);
      });
    },
    start(e) {
      if (state.first) {
        audioFiles.first.cloneNode().play();
        state.first = false;
      }
      e.dataTransfer.setData('text/plain', e.target.dataset.id);
      e.target.classList.add('dragging');
    },
    end(e) {
      e.target.classList.remove('dragging');
    },
    drop(e) {
      e.preventDefault();
      const id   = Number(e.dataTransfer.getData('text/plain'));
      const spec = SPECIES.find(s => s.id === id);
      const piece= document.querySelector(`#animal-pool .puzzle-piece[data-id="${id}"]`);
      const area = e.currentTarget.getBoundingClientRect();
      const relY = (e.clientY - area.top) / area.height;

      if (relY >= spec.zone.minY && relY <= spec.zone.maxY) {
        const offsetX = piece.offsetWidth/2;
        const offsetY = piece.offsetHeight/2;
        const left  = e.clientX - area.left - offsetX;
        const top   = e.clientY - area.top  - offsetY;
        this.correct(piece, spec, left, top);
      } else {
        this.wrong(piece);
      }
    },
    correct(piece, spec, left, top) {
      if (state.placed.has(spec.id)) return;
      state.placed.add(spec.id);
      piece.classList.add('correct');
      audioFiles.success.cloneNode().play();
      showInfo(spec.fact);
      piece.style.position = 'absolute';
      piece.style.left     = `${left}px`;
      piece.style.top      = `${top}px`;
      piece.style.zIndex   = 10;
      document.getElementById('main-area').appendChild(piece);
      this.updateStars(1);
      if (state.placed.size === SPECIES.length) {
        const btn = document.querySelector('.hint-btn');
        btn.textContent = '📝 去答题';
        btn.onclick = startBonusLevel;
      }
    },
    wrong(piece) {
      piece.classList.add('wrong');
      audioFiles.error.cloneNode().play();
      setTimeout(() => piece.classList.remove('wrong'), 500);
    },
    updateStars(n) {
      state.stars = Math.min(state.stars + n, CONFIG.MAX_STARS);
      document.getElementById('starCount').textContent = state.stars;
      if (state.stars === 5) {
        audioFiles.celebrate.cloneNode().play();
        alert('已集齐5星，点击答题解锁更多知识！');
      }
    }
  };

  // 科普提示
  function showInfo(text) {
    const pop = document.createElement('div');
    pop.className = 'info-popup';
    pop.textContent = text;
    document.body.appendChild(pop); 
    setTimeout(() => pop.remove(), 3000);
  }

  // 问答模块（同前略）
function startBonusLevel() {
    document.getElementById('quiz-modal').classList.remove('hidden');
    quizIndex = 0;
    quizScore = 0;
    showQuizQuestion();
  }

  function showQuizQuestion() {
    const item   = QUIZ[quizIndex];
    document.getElementById('quiz-question').textContent = item.q;
    const optsEl = document.getElementById('quiz-options');
    optsEl.innerHTML = '';
    item.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = opt;
      btn.onclick = () => handleAnswer(idx);
      optsEl.appendChild(btn);
    });
    document.getElementById('quiz-close').onclick = () => {
      document.getElementById('quiz-modal').classList.add('hidden');
    };
  }

  function handleAnswer(selected) {
    const item = QUIZ[quizIndex];
    const optsEl = document.getElementById('quiz-options');
    Array.from(optsEl.children).forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === item.answer) btn.classList.add('correct');
      if (idx === selected && idx !== item.answer) btn.classList.add('wrong');
    });
    // 播放问答音效
    if (selected === item.answer) {
      quizScore++;
      dragHandler.updateStars(1);
      audioFiles.success.cloneNode().play();
    } else {
      audioFiles.error.cloneNode().play();
    }
    setTimeout(()=>{
      quizIndex++;
      if (quizIndex < QUIZ.length) showQuizQuestion();
      else finishQuiz();
    }, 1000);
  }

  function finishQuiz() {
    document.getElementById('quiz-question').textContent =
      `答题结束！你答对了 ${quizScore} / ${QUIZ.length} 题。`;
    document.getElementById('quiz-options').innerHTML = '';
    const close = document.getElementById('quiz-close');
    close.textContent = '关闭';
    close.onclick = () => document.getElementById('quiz-modal').classList.add('hidden');
  }

  function init() {
    dragHandler.init();
  }
  function reset() {
    state = { stars:0, first:true, placed:new Set() };
    document.getElementById('starCount').textContent = '0';
    document.getElementById('main-area').innerHTML = `
      <div class="zone-overlay">
        <div class="zone-line" style="top:0%"><span>上层（白鹭）</span></div>
        <div class="zone-line" style="top:30%"><span>中层（红树苗）</span></div>
        <div class="zone-line" style="top:60%"><span>底层（底栖生物）</span></div>
      </div>`;
    dragHandler.init();
    audioFiles.reset.cloneNode().play();
  }

  return { init, reset };
})();


// --------------- 拼图模块 ---------------
async function initPuzzle() {
  const GRID = 4, piecePx = 100;
  const grid = document.getElementById('grid');
  const pool = document.getElementById('pool');
  const info = document.getElementById('info-content');
  const img  = document.getElementById('source-img');
  await new Promise(r => img.complete ? r() : img.onload = r);

  // 清空旧内容
  grid.innerHTML = '';
  pool.innerHTML = '';

  // 生成格子
  for (let i = 0; i < GRID*GRID; i++) {
    const cell = document.createElement('div');
    cell.className = 'puzzle-cell';
    cell.dataset.index = i;
    grid.appendChild(cell);
  }

  // 生成碎片
  const FACTS = [
        '红树苗：红树林幼苗，固定泥沙、防止侵蚀。',
        '红树叶：厚实存盐，帮助植物在盐碱环境生存。',
        '支柱根：支撑并呼吸，让树木稳固生长。',
        '气根：向上伸展，帮助根系在水中呼吸。',
        '根际微生物：共生分解有机质并固定氮素。',
        '多毛虫：分解腐殖质，改善土壤透气。',
        '小鱼幼苗：在根系间安全觅食、成长。',
        '招潮蟹：翻动泥沙，有助于土壤通气。',
        '白鹭等鸟类：在枝头建巢，维持生态平衡。',
        '红树种子：先在母株发芽，再漂浮传播繁殖。',
        '红树花：吸引昆虫传粉，促进繁殖。',
        '叶背盐晶：帮助排盐，适应盐碱环境。',
        '防波作用：红树带减缓风浪冲击。',
        '净化水质：根系截留污染物，净化海水。',
        '碳汇功能：红树林是高效“蓝碳”库。',
        '生物多样性：为上百种鱼鸟昆虫提供栖息地。'
      ];
  let pieces = [];
  for (let i = 0; i < GRID*GRID; i++) {
    const r = Math.floor(i/GRID), c = i%GRID;
    const d = document.createElement('div');
    d.className = 'puzzle-piece';
    d.draggable = true;
    d.dataset.index = i;
    d.style.backgroundImage = `url("${img.src}")`;
    d.style.backgroundPosition = `-${c*piecePx}px -${r*piecePx}px`;
    d.style.width = d.style.height = piecePx + 'px';
    pieces.push(d);
  }
  pieces.sort(() => 0.5 - Math.random()).forEach(d => pool.appendChild(d));

  // 拖放逻辑
  let placed = 0;
  pieces.forEach(p => {
    p.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', p.dataset.index);
      p.classList.add('dragging');
    });
    p.addEventListener('dragend', () => p.classList.remove('dragging'));
  });
  grid.querySelectorAll('.puzzle-cell').forEach(cell => {
    cell.addEventListener('dragover', e => e.preventDefault());
    cell.addEventListener('drop', e => {
      const idx = e.dataTransfer.getData('text/plain');
      if (!cell.classList.contains('filled') && cell.dataset.index === idx) {
        const piece = document.querySelector(`.puzzle-piece[data-index="${idx}"]`);
        piece.style.width = piece.style.height = '100%';
        cell.appendChild(piece);
        cell.classList.add('filled');
        info.textContent = FACTS[idx];
        if (++placed === GRID*GRID) {
          setTimeout(() => alert('恭喜你完成拼图！猜出这是什么植物了嘛~'), 100);
        }
      }
    });
  });
}

// --------------- 初始化入口 ---------------
window.addEventListener('DOMContentLoaded', () => {
  MangroveGame.init(); // 启动生态模块
  initPuzzle();        // 启动拼图模块
  // game.js — 在底部的初始化里追加
window.addEventListener('DOMContentLoaded', () => {
  MangroveGame.init();
  initPuzzle();

  // 绑定 hint
    const hintBtn = document.querySelector('.hint-btn');
    if (hintBtn) hintBtn.addEventListener('click', giveHint);
    });

});

// 普通提示
function giveHint() {
  alert('提示：将生物拖到对应高度区间，或收集完星星后进入问答！');
}
