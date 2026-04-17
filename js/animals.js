/**
 * 16 种 RTC 微颗粒性格（4 原型 × 4 气质）
 * 文案与结构对齐《科学应用版》性格画像卡：原型 + 称谓 + 三句 + 全球相似占比（示意）
 * v[5]: 自我觉察、人际亲和、情绪稳定、规则计划、开放探索（0～1，用于算法匹配）
 */
(function (global) {
  /** @type {{ id: string, archetype: string, categoryLabel: string, label: string, emoji: string, traitLines: string[], globalPercent: number, oneLine: string, v: number[] }[]} */
  const RAW = [
    // —— 表现型 · 孔雀 ——
    {
      archetype: 'expressive',
      label: '勇猛的孔雀',
      emoji: '🦚',
      traitLines: ['本性编织美丽梦想', '有人看趋势我是自带趋势', '我起头大家有肉吃'],
      globalPercent: 6.5,
      v: [0.42, 0.52, 0.48, 0.44, 0.78],
    },
    {
      archetype: 'expressive',
      label: '聪明的孔雀',
      emoji: '🦚',
      traitLines: ['本性真诚待人透明沟通', '有一眼看穿真假的真功夫', '对我好我加倍奉还'],
      globalPercent: 5.5,
      v: [0.48, 0.56, 0.52, 0.5, 0.74],
    },
    {
      archetype: 'expressive',
      label: '温和的孔雀',
      emoji: '🦚',
      traitLines: ['本性对人包容有爱心', '做事心软有求必应', '自带人缘好运多'],
      globalPercent: 5,
      v: [0.44, 0.62, 0.58, 0.42, 0.68],
    },
    {
      archetype: 'expressive',
      label: '纯孔雀',
      emoji: '🦚',
      traitLines: ['本性明天会更好', '爱表现对人真诚热心', '自带创意的开心果'],
      globalPercent: 8,
      v: [0.4, 0.54, 0.5, 0.4, 0.82],
    },
    // —— 温和型 · 熊猫 ——
    {
      archetype: 'gentle',
      label: '聪明的熊猫',
      emoji: '🐼',
      traitLines: ['本性深耕治理追求公平', '拥有金头脑不易外露', '看准的事不轻易放弃'],
      globalPercent: 6.5,
      v: [0.55, 0.72, 0.62, 0.58, 0.42],
    },
    {
      archetype: 'gentle',
      label: '会说话的熊猫',
      emoji: '🐼',
      traitLines: ['本性凝聚人心的传教士', '牺牲奉献顾全大局', '做人有情有义广结善缘'],
      globalPercent: 3,
      v: [0.5, 0.82, 0.68, 0.45, 0.4],
    },
    {
      archetype: 'gentle',
      label: '勇猛的熊猫',
      emoji: '🐼',
      traitLines: ['本性认真努力越挫越猛', '人可负我我不负人', '善于稳定中求发展'],
      globalPercent: 6.5,
      v: [0.52, 0.65, 0.72, 0.62, 0.38],
    },
    {
      archetype: 'gentle',
      label: '纯熊猫',
      emoji: '🐼',
      traitLines: ['本性追求家和万事兴', '有韧性及耐力处理事情', '乐于协助别人的好保姆'],
      globalPercent: 7,
      v: [0.48, 0.78, 0.75, 0.48, 0.36],
    },
    // —— 控制型 · 老虎 ——
    {
      archetype: 'control',
      label: '温和的老虎',
      emoji: '🐯',
      traitLines: ['本性行侠仗义走天下', '对你客气是尊重', '别搞事有钱大家分'],
      globalPercent: 4.5,
      v: [0.48, 0.46, 0.58, 0.68, 0.52],
    },
    {
      archetype: 'control',
      label: '聪明的老虎',
      emoji: '🐯',
      traitLines: ['本性讲义气明道理', '谁犯错别怪我无情', '不玩套路只看实际'],
      globalPercent: 7.5,
      v: [0.55, 0.42, 0.55, 0.72, 0.5],
    },
    {
      archetype: 'control',
      label: '会说话的老虎',
      emoji: '🐯',
      traitLines: ['本性有梦想就干', '我讲过的话我负责', '天生领袖风采财运源源不绝'],
      globalPercent: 9,
      v: [0.52, 0.5, 0.52, 0.65, 0.62],
    },
    {
      archetype: 'control',
      label: '纯老虎',
      emoji: '🐯',
      traitLines: ['本性爱拼才会赢', '不吹虚不玩假做事靠本领', '勇往直前追求人生目标'],
      globalPercent: 7,
      v: [0.5, 0.4, 0.58, 0.75, 0.55],
    },
    // —— 分析型 · 猫头鹰 ——
    {
      archetype: 'analytical',
      label: '会说话的猫头鹰',
      emoji: '🦉',
      traitLines: ['本性普渡众生的救世主', '做事有方有圆有紧有松', '我的苦恼没人懂'],
      globalPercent: 2.5,
      v: [0.78, 0.42, 0.48, 0.65, 0.44],
    },
    {
      archetype: 'analytical',
      label: '纯猫头鹰',
      emoji: '🦉',
      traitLines: ['本性事实求是讲道理', '善于分析研究做事严谨', '一不小心自己挖坑往里掉'],
      globalPercent: 8,
      v: [0.75, 0.38, 0.52, 0.72, 0.42],
    },
    {
      archetype: 'analytical',
      label: '勇猛的猫头鹰',
      emoji: '🦉',
      traitLines: ['本性打前顾后我在行', '守财门道我样样来', '莫怪我出奇不意吓倒你'],
      globalPercent: 6,
      v: [0.72, 0.4, 0.55, 0.7, 0.48],
    },
    {
      archetype: 'analytical',
      label: '温和的猫头鹰',
      emoji: '🦉',
      traitLines: ['本性我的低调你学不来', '心中一把尺待人做事', '追求目标永不放弃'],
      globalPercent: 7.5,
      v: [0.7, 0.48, 0.58, 0.68, 0.4],
    },
  ];

  const CATEGORY_BY_ARCH = {
    expressive: '表现型',
    gentle: '温和型',
    control: '控制型',
    analytical: '分析型',
  };

  function splitLabelParts(label) {
    var i = label.indexOf('的');
    if (i === -1) {
      if (label.indexOf('纯') === 0) {
        return { tone: '纯', animal: label.slice(1) };
      }
      return { tone: '', animal: label };
    }
    return { tone: label.slice(0, i), animal: label.slice(i + 1) };
  }

  const ANIMALS = RAW.map(function (row, i) {
    var parts = splitLabelParts(row.label);
    var one =
      row.traitLines[0] +
      '；' +
      row.traitLines[1] +
      '（' +
      CATEGORY_BY_ARCH[row.archetype] +
      '·' +
      row.label +
      '）';
    return {
      id: 'a' + i,
      archetype: row.archetype,
      categoryLabel: CATEGORY_BY_ARCH[row.archetype],
      label: row.label,
      emoji: row.emoji,
      traitLines: row.traitLines.slice(),
      globalPercent: row.globalPercent,
      oneLine: one,
      v: row.v.slice(),
      code: row.label,
      shortLabel: row.label,
      tone: parts.tone,
      animal: parts.animal,
    };
  });

  function pickTrueAnimal(profile) {
    const P = profile.map(function (x) {
      return x / 100;
    });
    let best = ANIMALS[0];
    let bestSim = -1;
    ANIMALS.forEach(function (a) {
      let dot = 0;
      let na = 0;
      let nb = 0;
      for (let i = 0; i < 5; i++) {
        dot += P[i] * a.v[i];
        na += P[i] * P[i];
        nb += a.v[i] * a.v[i];
      }
      const sim = na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
      if (sim > bestSim) {
        bestSim = sim;
        best = a;
      }
    });
    return best;
  }

  /**
   * 从 16 颗中选出与 profile 最相近的 n 颗（必含 trueAnimal，用于推荐池）
   */
  function pickSimilarPool(profile, trueAnimal, n) {
    const P = profile.map(function (x) {
      return x / 100;
    });
    const scored = ANIMALS.map(function (a) {
      let dot = 0;
      let na = 0;
      let nb = 0;
      for (let i = 0; i < 5; i++) {
        dot += P[i] * a.v[i];
        na += P[i] * P[i];
        nb += a.v[i] * a.v[i];
      }
      const sim = na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
      return { a: a, sim: sim };
    }).sort(function (x, y) {
      return y.sim - x.sim;
    });
    const out = [];
    const seen = {};
    out.push(trueAnimal);
    seen[trueAnimal.id] = true;
    for (var i = 0; i < scored.length && out.length < n; i++) {
      if (!seen[scored[i].a.id]) {
        out.push(scored[i].a);
        seen[scored[i].a.id] = true;
      }
    }
    return out;
  }

  global.MICRO_ANIMALS = ANIMALS;
  global.pickTrueAnimal = pickTrueAnimal;
  global.pickSimilarAnimalPool = pickSimilarPool;
})(typeof window !== 'undefined' ? window : globalThis);
