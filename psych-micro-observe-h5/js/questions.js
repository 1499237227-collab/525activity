/**
 * 525 心理健康节 · 心理微观察 — RTC 题组（演示）
 * 5 维：觉察、亲和、稳定、规则、开放
 * 每题 1–5 分，部分题目反向计分
 */
(function (global) {
  const STEMS = [
    { dim: 0, text: '我能准确觉察当下身体与情绪的细微变化。', inv: false },
    { dim: 0, text: '我有时会忽略自己的真实感受，直到爆发才察觉。', inv: true },
    { dim: 1, text: '在冲突中，我愿意先倾听对方再表达自己。', inv: false },
    { dim: 1, text: '我倾向于用冷淡或讽刺保护自己。', inv: true },
    { dim: 2, text: '压力之下我仍能保持相对平稳的节奏。', inv: false },
    { dim: 2, text: '小事也容易让我长时间耿耿于怀。', inv: true },
    { dim: 3, text: '我喜欢提前规划，减少不确定性带来的焦虑。', inv: false },
    { dim: 3, text: '规则与清单会让我感到窒息、想逃离。', inv: true },
    { dim: 4, text: '我愿意尝试新方法，即使结果不确定。', inv: false },
    { dim: 4, text: '我更依赖熟悉路径，对冒险兴趣不大。', inv: true },
    { dim: 0, text: '我能区分「事实」与「我对事实的解释」。', inv: false },
    { dim: 1, text: '别人倾诉时，我会放下手机专注在场。', inv: false },
    { dim: 2, text: '失眠或食欲波动时，我能自我调节而不自责。', inv: false },
    { dim: 3, text: '工作或学习时，我习惯拆解目标并跟踪进度。', inv: false },
    { dim: 4, text: '陌生领域会激发我的好奇心而非恐惧。', inv: false },
  ];

  const QUESTIONS = [];
  let id = 1;
  while (QUESTIONS.length < 70) {
    for (let r = 0; r < STEMS.length && QUESTIONS.length < 70; r++) {
      const s = STEMS[r];
      QUESTIONS.push({
        id: id++,
        text: s.text,
        dim: s.dim,
        inv: s.inv,
      });
    }
  }

  global.MICRO_QUESTIONS = QUESTIONS;
})(typeof window !== 'undefined' ? window : globalThis);
