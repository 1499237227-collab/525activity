/**
 * 525 心理健康节 · 心理微观察 — 交互与评分逻辑
 */
(function () {
  const DIM_LABELS = ['自我觉察', '人际亲和', '情绪稳定', '规则计划', '开放探索'];

  /** 五维分项解读：按分数低/中/高三档（约 40、62 为界） */
  const DIM_NOTE_TIERS = [
    [
      '内在信号辨识度偏低：情绪起伏时容易「事后才反应过来」；建议每日 1～2 次短时身体扫描。',
      '多数时候能觉察状态变化；压力高峰时觉察可能略延迟，可记录触发情境以便复盘。',
      '对内在体验较敏感，利于提前调节；注意避免反刍式自我观察加重焦虑。',
    ],
    [
      '在关系中偏独立，主动连接与维护信任的投入相对有限；可有意识增加可预期的小互动。',
      '能维持基本合作与信任；冲突情境下建议明确「事实—感受—请求」结构。',
      '倾向建立稳定互惠关系；注意边界与自我消耗，避免过度迎合。',
    ],
    [
      '情绪起伏相对明显，压力下易出现分心或躯体紧张；建议规律作息与适度运动。',
      '情绪整体可控，偶有明显波动；建议标注高频触发场景并做预案。',
      '情绪调节资源较足，恢复节奏相对稳定；可持续练习正念或放松训练巩固。',
    ],
    [
      '结构与计划性偏弱，多任务时易产生混乱感；建议用清单拆分「下一步唯一动作」。',
      '具备一定规划能力；变动情境下可用外部提醒与截止时间锚定执行。',
      '善于拆分目标与步骤；注意保留弹性，避免因过度控制引发紧张。',
    ],
    [
      '对新体验与不确定性的容忍度偏低，倾向沿用熟悉路径；可设定「微冒险」小实验。',
      '在熟悉领域内愿意尝试；跨出舒适区需要更强动机，可寻找同伴支持。',
      '好奇与探索动机较强；注意在发散与落地执行之间做阶段性收束。',
    ],
  ];

  function dimNoteForScore(dimIndex, score) {
    var s = Math.round(score);
    var tier = s >= 62 ? 2 : s >= 40 ? 1 : 0;
    return DIM_NOTE_TIERS[dimIndex][tier];
  }

  function buildDimNotes(profile) {
    var out = [];
    for (var i = 0; i < 5; i++) {
      out.push({
        label: DIM_LABELS[i],
        score: Math.round(profile[i]),
        note: dimNoteForScore(i, profile[i]),
      });
    }
    return out;
  }

  function buildSummaryParagraphs(profile, animal, mhStatus, mhLevel) {
    var avg = profile.reduce(function (a, b) {
      return a + b;
    }, 0) / 5;
    var idxHi = 0;
    var idxLo = 0;
    var max = profile[0];
    var min = profile[0];
    for (var i = 1; i < 5; i++) {
      if (profile[i] > max) {
        max = profile[i];
        idxHi = i;
      }
      if (profile[i] < min) {
        min = profile[i];
        idxLo = i;
      }
    }
    return [
      '本次测评基于自我报告式量表（70 题），五维颗粒合并均值约 ' +
        avg.toFixed(0) +
        ' 分（0～100）。心理健康综合指数（MHS）呈现为「' +
        mhStatus +
        '」（五级中的第 ' +
        mhLevel +
        ' 级，仅供纵向与复测比较，非诊断）。RTC 算法匹配的动物人格类型为「' +
        animal.label +
        '」：为通俗隐喻，不具备医学或病理学含义。',
      '相对优势维为「' +
        DIM_LABELS[idxHi] +
        '」（' +
        Math.round(profile[idxHi]) +
        ' 分）；相对发展维为「' +
        DIM_LABELS[idxLo] +
        '」（' +
        Math.round(profile[idxLo]) +
        ' 分）。请结合下方雷达、分项解读与第三模块「我的心理状态问题」中的关注点与自助建议综合阅读。',
    ];
  }

  function buildPsychIssues(stress, mhLevel, mhStatus, avg) {
    var items = [];
    items.push('综合指数（MHS）为「' + mhStatus + '」：请结合近两周睡眠、食欲、注意力与社会功能变化理解，而非单点分数。');
    if (avg < 48) {
      items.push('五维合并均值偏低：提示多维度资源同时承压的概率上升，建议优先稳定作息与减少酒精/咖啡因刺激。');
    }
    if (mhLevel >= 4) {
      items.push('分级提示需提高关注：若出现持续低落、自伤念头、幻觉妄想或社会功能明显受损，请立即前往医院心理科/精神科或危机热线。');
    }
    [3, 2, 1].forEach(function (k) {
      var arr = stress[k] || [];
      arr.forEach(function (t) {
        items.push('压力谱系提示：' + t);
      });
    });
    return items.slice(0, 8);
  }

  const RTC_LEVELS = ['过低', '偏低', '常态', '偏高', '过高'];

  function scoreToLevelIdx(score) {
    var s = Math.round(score);
    if (s < 20) {
      return 0;
    }
    if (s < 40) {
      return 1;
    }
    if (s < 60) {
      return 2;
    }
    if (s < 80) {
      return 3;
    }
    return 4;
  }

  function secondPartTitle() {
    var map = {
      girlfriend: '第二部份检测　你男朋友对你表现的看法',
      boyfriend: '第二部份检测　你女朋友对你表现的看法',
      wife: '第二部份检测　你丈夫对你表现的看法',
      husband: '第二部份检测　你妻子对你表现的看法',
      mother: '第二部份检测　子女对你表现的看法',
      father: '第二部份检测　子女对你表现的看法',
      worker: '第二部份检测　职场中他人对你表现的看法',
      student: '第二部份检测　师长与同伴对你表现的看法',
    };
    return map[state.identity] || '第二部份检测　他人对你表现的看法';
  }

  function renderSensitivityBlocksHost(el, profile) {
    if (!el) {
      return;
    }
    el.innerHTML = '';
    var row = document.createElement('div');
    row.className = 'rtc-sens-row';
    for (var i = 0; i < 5; i++) {
      var idx = scoreToLevelIdx(profile[i]);
      var item = document.createElement('div');
      item.className = 'rtc-sens-item';
      item.innerHTML =
        '<span class="rtc-sens-item__name">' +
        DIM_LABELS[i] +
        '</span><div class="rtc-sens-block rtc-sens-block--' +
        idx +
        '">' +
        RTC_LEVELS[idx] +
        '</div>';
      row.appendChild(item);
    }
    el.appendChild(row);
  }

  function renderSingleMeterHost(el, score, subNote) {
    if (!el) {
      return;
    }
    var idx = scoreToLevelIdx(score);
    var pct = Math.max(5, Math.min(100, score));
    el.innerHTML =
      '<div class="rtc-single-meter"><div class="rtc-single-meter__track"><div class="rtc-single-meter__fill" style="width:' +
      pct +
      '%"></div></div><p class="rtc-single-meter__label">检测结果：' +
      RTC_LEVELS[idx] +
      '</p><p class="rtc-single-meter__sub">' +
      (subNote || '') +
      ' · 参考分 ' +
      Math.round(score) +
      '/100（示意）</p></div>';
  }

  function buildCareerSnippet(animalLabel, traits) {
    if (typeof RTC_REPORT_COPY !== 'undefined' && RTC_REPORT_COPY.buildCareerHtml) {
      return RTC_REPORT_COPY.buildCareerHtml(animalLabel, traits);
    }
    var tags = traits
      .slice(0, 5)
      .map(function (t) {
        return '<span>' + t + '相关</span>';
      })
      .join('');
    return (
      '<p>结合颗粒类型「' +
      animalLabel +
      '」，较易在需要<strong>推进、协调与独立判断</strong>的工作情境中发挥。</p><div class="rtc-career__tags">' +
      tags +
      '<span>管理协调</span><span>项目推进</span></div>'
    );
  }

  function buildEightIssuesList(profile, mhLevel) {
    var names =
      typeof RTC_REPORT_COPY !== 'undefined' && RTC_REPORT_COPY.issueNames
        ? RTC_REPORT_COPY.issueNames.slice()
        : [
            '情绪波动与睡眠节律',
            '人际敏感与反馈期待',
            '焦虑与担忧循环',
            '自我批评与完美主义',
            '注意力与执行效率',
            '躯体化不适（紧绷/疲劳）',
            '社交回避与孤独感',
            '意义感与动力下滑',
          ];
    var out = [];
    for (var i = 0; i < 8; i++) {
      var base = profile[i % 5] + mhLevel * 4 + i * 6;
      var sev = 'ok';
      var r = base % 5;
      if (r === 0 || r === 1) {
        sev = 'alert';
      } else if (r === 2) {
        sev = 'watch';
      }
      if (mhLevel >= 4 && i < 2) {
        sev = 'alert';
      }
      out.push({ name: names[i], sev: sev });
    }
    return out;
  }

  /**
   * 身份定频：恋爱 / 婚姻 / 亲子 / 职场 / 学业
   * reason 为场景说明；hook 为代入式一句问；couple 为双影装饰（恋爱与婚姻）
   */
  const IDENTITIES = [
    {
      id: 'girlfriend',
      label: '女朋友',
      reason: '恋爱关系中的心理状态评估',
      hook: '在「被在乎」与「怕受伤」之间，你的情绪落点在哪里？',
      accent: '#f472b6',
      couple: true,
    },
    {
      id: 'boyfriend',
      label: '男朋友',
      reason: '恋爱关系中的心理状态评估',
      hook: '想靠近也怕窒息——你在恋爱里最耗能的是什么？',
      accent: '#60a5fa',
      couple: true,
    },
    {
      id: 'wife',
      label: '妻子',
      reason: '婚姻关系中的心理健康分析',
      hook: '亲密与责任交错时，你还剩下多少情绪带宽？',
      accent: '#ec4899',
      couple: true,
    },
    {
      id: 'husband',
      label: '丈夫',
      reason: '婚姻关系中的心理健康分析',
      hook: '沉默扛事还是被读成冷漠？你在婚姻里如何被误解？',
      accent: '#f97316',
      couple: true,
    },
    {
      id: 'mother',
      label: '母亲',
      reason: '亲子关系中的心理状态了解',
      hook: '付出与委屈常常同框——你听见自己的需求了吗？',
      accent: '#fbbf24',
      couple: false,
    },
    {
      id: 'father',
      label: '父亲',
      reason: '亲子关系中的心理状态了解',
      hook: '严厉或沉默背后，你在保护谁、又在压抑什么？',
      accent: '#ea580c',
      couple: false,
    },
    {
      id: 'worker',
      label: '工作者',
      reason: '职场压力与心理健康评估',
      hook: '绩效、人际与意义感——哪一根弦长期绷得最紧？',
      accent: '#0ea5e9',
      couple: false,
    },
    {
      id: 'student',
      label: '学生',
      reason: '学业压力与心理状态分析',
      hook: '成绩、同辈比较与未来焦虑——深夜反刍的是哪一颗颗粒？',
      accent: '#34d399',
      couple: false,
    },
  ];

  let nebulaApi = null;

  const PRICE_FULL = 19.9;
  const PRICE_OTHERS = 12.9;
  const DISCOUNT = 0.7;

  /** 演示：正式环境由 App 注入 CeceBridge.openCashier */
  function buildActivityShareUrl() {
    var u = location.href.split('#')[0];
    var sep = u.indexOf('?') >= 0 ? '&' : '?';
    return u + sep + 'src=activity_share&campaign=psych_micro_525';
  }

  function openCeceCashier(opts, onAfterDemo) {
    opts = opts || {};
    var sku = opts.sku || 'psych_report';
    var amountYuan = opts.amountYuan != null ? opts.amountYuan : state.guessExact ? PRICE_OTHERS : PRICE_FULL;
    var payload = {
      sku: sku,
      amountYuan: amountYuan,
      biz: 'psych_micro_observe_525',
      title: opts.title || '心理微观察 · 报告解锁',
    };
    var bridge = window.CeceBridge || window.ceceBridge;
    if (bridge && typeof bridge.openCashier === 'function') {
      bridge.openCashier(payload);
      return;
    }
    if (bridge && typeof bridge.openRecharge === 'function') {
      bridge.openRecharge(payload);
      return;
    }
    console.info('[CeceCashier demo]', payload);
    alert(
      '演示：将拉起测测 App 内「充值」收银台\n\n' +
        'SKU: ' +
        sku +
        '\n应付约: ¥' +
        amountYuan +
        '\n\n正式环境：原生弹层含测测币面额九宫格、当前余额、需充值差额、支付宝/微信充值、《测测币充值协议》勾选等。\n\n点「确定」后将进入已解锁预览。'
    );
    if (typeof onAfterDemo === 'function') {
      onAfterDemo();
    }
  }

  function applyDemoUnlockVisuals() {
    var exact = state.guessExact;
    if (!exact) {
      var wrap = $('reportSelfWrap');
      var lockEl = $('reportSelfLock');
      if (wrap) {
        wrap.classList.remove('is-locked');
      }
      if (lockEl) {
        lockEl.hidden = true;
      }
    }
    var frost = $('reportOtherFrost');
    if (frost) {
      frost.classList.add('is-unlocked');
      var mask = frost.querySelector('.report-frost__mask');
      if (mask) {
        mask.hidden = true;
        mask.setAttribute('hidden', '');
        mask.setAttribute('aria-hidden', 'true');
      }
    }
    var adviceCard = $('reportAdviceWrap');
    if (adviceCard) {
      adviceCard.classList.add('is-unlocked');
    }
  }

  function shareActivityLink() {
    var url = buildActivityShareUrl();
    var title = 'RTC微颗粒心理测评 · 525 心理健康节';
    var text = '来测测完成心理微观察测评；点击链接将尝试打开或下载测测 App';
    if (navigator.share) {
      navigator
        .share({ title: title, text: text, url: url })
        .catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        function () {
          showToast('活动链接已复制');
        },
        function () {
          window.prompt('复制活动链接', url);
        }
      );
    } else {
      window.prompt('复制活动链接', url);
    }
  }

  function shareGroupInvite() {
    var base = location.href.split('#')[0];
    var inviteUrl = base + (base.indexOf('?') >= 0 ? '&' : '?') + 'ref=group_invite&src=wechat';
    var title = '邀请你成团 · 心理微观察 7 折';
    var text =
      '好友通过微信打开测测小程序可领 7 折券（需登录）；分享者在规则满足后同步获得 7 折券。链接：' + inviteUrl;
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: text,
          url: inviteUrl,
        })
        .catch(function () {});
    } else {
      alert(
        '演示：将分享至微信会话\n\n' +
          '好友点击打开测测小程序指定活动页；被邀请人领券后引导回 App 使用。\n\n' +
          '示例链接：\n' +
          inviteUrl
      );
    }
  }

  function fallbackDownloadCanvas(canvas, moduleKey) {
    try {
      var u = canvas.toDataURL('image/png');
      var a = document.createElement('a');
      a.href = u;
      a.download = '心理微观察-' + moduleKey + '.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('图片已触发下载，可从相册分享');
    } catch (e) {
      showToast('请重试或截图保存');
    }
  }

  function shareReportModule(moduleKey) {
    var map = { self: 'reportPartSelf', other: 'reportPartOther', advice: 'reportPartAdvice' };
    var id = map[moduleKey];
    var el = id ? $(id) : null;
    if (!el) return;
    if (typeof html2canvas !== 'function') {
      showToast('分享模块需加载 html2canvas');
      return;
    }
    showToast('正在生成本模块图片…');
    html2canvas(el, {
      scale: Math.min(2, (window.devicePixelRatio || 1) * 1.5),
      useCORS: true,
      logging: false,
      backgroundColor: null,
    })
      .then(function (canvas) {
        canvas.toBlob(
          function (blob) {
            if (!blob) {
              showToast('生成失败');
              return;
            }
            var fname = '心理微观察-' + moduleKey + '.png';
            var file = new File([blob], fname, { type: 'image/png' });
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
              navigator
                .share({
                  files: [file],
                  title: '心理微观察',
                  text: '分享我的测评结果片段',
                })
                .catch(function () {
                  fallbackDownloadCanvas(canvas, moduleKey);
                });
            } else {
              fallbackDownloadCanvas(canvas, moduleKey);
            }
          },
          'image/png',
          0.92
        );
      })
      .catch(function (err) {
        console.warn(err);
        showToast('截图失败，请重试');
      });
  }

  const state = {
    view: 'landing',
    identity: null,
    qIndex: 0,
    answers: [],
    scores: [0, 0, 0, 0, 0],
    counts: [0, 0, 0, 0, 0],
    selectedAnimalId: null,
    animalOptions: [],
    trueAnimal: null,
    matchPercent: 0,
    guessExact: false,
    reportBundle: null,
    /** 演示：关闭收银台弹窗后视为已付费，用于预览完整样式 */
    demoPaid: false,
    modalAnimalId: null,
  };

  const els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function updateStepRail(viewName) {
    const rail = $('stepRail');
    if (!rail) return;
    const order = ['identity', 'quiz', 'guess', 'report'];
    const idx = order.indexOf(viewName);
    if (viewName === 'landing' || idx === -1) {
      rail.hidden = true;
      return;
    }
    rail.hidden = false;
    rail.querySelectorAll('.step-rail__item').forEach(function (item, i) {
      item.classList.remove('is-active', 'is-done');
      if (i < idx) {
        item.classList.add('is-done');
      }
      if (i === idx) {
        item.classList.add('is-active');
      }
    });
  }

  function showView(name) {
    state.view = name;
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
    document.querySelectorAll('.view').forEach(function (v) {
      v.classList.toggle('is-active', v.dataset.view === name);
      var main = v.querySelector('.view-main');
      if (main) {
        main.scrollTop = 0;
      }
    });
    var root = $('appRoot');
    if (root) {
      root.setAttribute('data-phase', name);
    }
    if (name === 'landing') {
      if (nebulaApi && !nebulaApi.isRunning()) {
        nebulaApi.start();
      }
    } else {
      if (nebulaApi && nebulaApi.isRunning()) {
        nebulaApi.stop();
      }
    }
    updateLensForView(name);
    updateStepRail(name);
  }

  function updateLensForView(view) {
    const lens = $('microLens');
    if (!lens) return;
    if (view === 'quiz') {
      lens.style.display = 'block';
      updateLensBlur();
    } else if (view === 'landing') {
      lens.style.display = 'none';
    } else {
      lens.style.display = 'none';
    }
  }

  function updateLensBlur() {
    const total = window.MICRO_QUESTIONS.length;
    const done = state.qIndex;
    const pct = total ? done / total : 0;
    const blur = Math.max(0, 24 * (1 - pct));
    document.documentElement.style.setProperty('--lens-blur', blur.toFixed(1) + 'px');
  }

  function recordAnswer(score) {
    const q = window.MICRO_QUESTIONS[state.qIndex];
    let val = score;
    if (q.inv) val = 6 - score;
    state.answers[state.qIndex] = val;
    const d = q.dim;
    state.scores[d] += val;
    state.counts[d] += 1;

    const prevIndex = state.qIndex;
    state.qIndex += 1;

    const milestones = [20, 40, 60];
    if (milestones.indexOf(state.qIndex) !== -1) {
      showToast(encourageAt(state.qIndex));
    }

    if (state.qIndex >= window.MICRO_QUESTIONS.length) {
      finalizeScores();
      setupGuess();
      showView('guess');
      return;
    }

    renderQuestion();
    updateLensBlur();
    updateProgressRing();
  }

  function encourageAt(n) {
    const lines = [
      '扫描进行中，你内在的「温柔颗粒」正在显现…',
      '已完成 ' + n + ' 题：认知图谱逐渐对焦。',
      '深度采样中：偏差与优势同样珍贵。',
    ];
    if (n === 20) return lines[0];
    if (n === 40) return lines[1];
    return lines[2];
  }

  let toastTimer;
  function showToast(msg) {
    const layer = $('toastLayer');
    const text = $('toastText');
    if (!layer || !text) return;
    text.textContent = msg;
    layer.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      layer.classList.remove('is-visible');
    }, 3200);
  }

  function finalizeScores() {
    const s = [];
    for (let i = 0; i < 5; i++) {
      const c = state.counts[i] || 1;
      const raw = state.scores[i] / c;
      const normalized = ((raw - 1) / 4) * 100;
      s.push(Math.max(0, Math.min(100, normalized)));
    }
    state.profile = s;
  }

  function rebuildGuessOptions() {
    const truth = state.trueAnimal;
    const P = state.profile;
    if (typeof window.pickSimilarAnimalPool === 'function') {
      state.animalOptions = shuffle(window.pickSimilarAnimalPool(P, truth, 6));
    } else {
      const all = window.MICRO_ANIMALS.slice();
      const rest = all.filter(function (a) {
        return a.id !== truth.id;
      });
      state.animalOptions = shuffle([truth].concat(shuffle(rest).slice(0, 5)));
    }
  }

  function openGuessModal(a) {
    state.modalAnimalId = a.id;
    const modal = $('guessDetailModal');
    const body = $('guessDetailBody');
    if (!modal || !body) {
      return;
    }
    const traits = a.traitLines
      .map(function (t) {
        return '<p class="guess-portrait__trait">' + t + '</p>';
      })
      .join('');
    body.innerHTML =
      '<h2 class="guess-portrait__title" id="guessDetailTitle">我的性格画像</h2>' +
      '<p class="guess-portrait__category" data-archetype="' +
      a.archetype +
      '">' +
      a.categoryLabel +
      '</p>' +
      '<div class="guess-portrait__emoji" aria-hidden="true">' +
      a.emoji +
      '</div>' +
      '<p class="guess-portrait__badge">' +
      a.label +
      '</p>' +
      '<div class="guess-portrait__traits">' +
      traits +
      '</div>';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeGuessModal() {
    const modal = $('guessDetailModal');
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }
    state.modalAnimalId = null;
  }

  function confirmGuessFromModal() {
    const id = state.modalAnimalId;
    if (!id) {
      return;
    }
    selectAnimal(id);
    closeGuessModal();
  }

  function setupGuess() {
    state.guessExact = false;
    const P = state.profile;
    state.trueAnimal = window.pickTrueAnimal(P);
    state.selectedAnimalId = null;
    state.modalAnimalId = null;
    rebuildGuessOptions();
    renderAnimalPool();
    var guessIdEl = $('guessIdentityLabel');
    if (guessIdEl) {
      guessIdEl.textContent = identityLabel();
    }
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function identityLabel() {
    const id = state.identity;
    const f = IDENTITIES.find(function (x) {
      return x.id === id;
    });
    return f ? f.label : '对方';
  }

  function cosineVec(a, b) {
    let dot = 0;
    let na = 0;
    let nb = 0;
    for (let i = 0; i < 5; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }
    if (!na || !nb) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
  }

  function profileNorm() {
    const P = state.profile.map(function (x) {
      return x / 100;
    });
    return P;
  }

  function selectAnimal(id) {
    state.selectedAnimalId = id;
    renderAnimalPool();
    const sub = $('btnSubmitGuess');
    if (sub) {
      sub.disabled = !id;
    }
  }

  function renderAnimalPool() {
    const pool = $('animalPool');
    if (!pool) {
      return;
    }
    pool.innerHTML = '';
    pool.className = 'animal-deck animal-deck--six';

    state.animalOptions.forEach(function (a) {
      const sel = state.selectedAnimalId === a.id;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'animal-tile' + (sel ? ' is-selected' : '');
      b.dataset.id = a.id;
      b.dataset.archetype = a.archetype;
      b.setAttribute('role', 'option');
      b.setAttribute('aria-selected', sel ? 'true' : 'false');
      b.innerHTML =
        '<span class="animal-tile__emoji" aria-hidden="true">' +
        a.emoji +
        '</span><span class="animal-tile__cat">' +
        a.categoryLabel +
        '</span><span class="animal-tile__name">' +
        a.label +
        '</span><span class="animal-tile__detail" role="button" tabindex="0">详情</span><span class="animal-tile__check" aria-hidden="true"></span>';
      b.addEventListener('click', function (e) {
        if (e.target.closest('.animal-tile__detail')) {
          e.stopPropagation();
          openGuessModal(a);
          return;
        }
        selectAnimal(a.id);
      });
      pool.appendChild(b);
    });

    const hint = $('animalHint');
    if (hint) {
      hint.textContent = state.selectedAnimalId ? '已选择 · 可点下方确认选择' : '点选一颗粒；点「详情」可查看画像要点';
    }
  }

  function submitGuess() {
    state.demoPaid = false;
    const guess = state.animalOptions.find(function (x) {
      return x.id === state.selectedAnimalId;
    });
    const truth = state.trueAnimal;
    const exact = !!(guess && truth && guess.id === truth.id);
    let match = 0;
    if (guess) {
      const P = profileNorm();
      match = exact ? 100 : Math.round(cosineVec(P, guess.v) * 100);
    }
    state.matchPercent = match;
    state.guessExact = exact;

    if (exact) {
      $('geniusBurst').classList.add('is-on');
      $('geniusMatch').textContent = '100';
      setTimeout(function () {
        $('geniusBurst').classList.remove('is-on');
        showView('report');
        renderReport();
      }, 2200);
    } else {
      showView('report');
      renderReport();
    }
  }

  function pickEightTraits(profile) {
    const pool = [
      '要求的',
      '勇敢的',
      '开朗的',
      '控制的',
      '表达的',
      '自主的',
      '冒险的',
      '热心的',
      '细腻的',
      '稳健的',
      '敏锐的',
      '独立的',
    ];
    const seed = Math.floor(profile.reduce(function (a, b) {
      return a + b;
    }, 0)) % 4;
    const out = [];
    for (let i = 0; i < 8; i++) {
      out.push(pool[(i + seed) % pool.length]);
    }
    return out;
  }

  function buildStressTiers(profile, avg) {
    return {
      3: avg < 38 ? ['存在回避或拖延的苗头'] : [],
      2: avg < 52 ? ['间歇性动力不足'] : [],
      1: ['对评价较敏感', '作息波动', '偶发焦虑', '期待被理解', '希望反馈更明确'],
    };
  }

  function deriveReportBundle(profile, animal, identityLabel) {
    const avg = profile.reduce(function (a, b) {
      return a + b;
    }, 0) / 5;
    const mhLevel = Math.max(1, Math.min(5, Math.round(5 - avg / 22)));
    const mhWords = ['优秀', '良好', '一般', '不佳', '需关注'];
    const mhStatus = mhWords[mhLevel - 1];
    const hints = [
      'MHS 简版为科普向分级：建议 6～12 个月复测，或与线下/长版测评交叉验证。',
      '建议 4～6 个月复测，并记录情绪波动与触发情境，观察五维颗粒是否稳定。',
      '建议约 3 个月复测，可配合情绪日记；若多维度同时下移建议预约访谈。',
      '建议 2 个月复测，并降低自我苛责频率；若出现失眠或注意力显著下降请咨询专业人士。',
      '该分级提示需要优先关注：建议尽快寻求专业心理支持，并与信任关系保持沟通。',
    ];
    const traits = pickEightTraits(profile);
    const bullets =
      typeof RTC_REPORT_COPY !== 'undefined' && RTC_REPORT_COPY.buildPart1Bullets
        ? RTC_REPORT_COPY.buildPart1Bullets(animal.label, profile)
        : [
            {
              icon: '◆',
              text:
                '五维颗粒与作答一致性支持「' +
                animal.label +
                '」原型：在目标感与执行路径上呈现偏控制—推进型特征，与相似向量样本的常见叙事一致。',
            },
            {
              icon: '◇',
              text:
                '不确定情境中你更依赖经验图式与直觉整合；当被要求即时表态时，外在表现易被误读为「固执」，实为对心理节奏的自我保护。',
            },
            {
              icon: '○',
              text:
                '关系场域中偏好深加工社交：愿与同频者深度沟通，对低信噪互动较敏感；可预期的反馈有助于降低关系成本。',
            },
          ];
    const stress = buildStressTiers(profile, avg);
    const dimNotes = buildDimNotes(profile);
    const summaryParagraphs = buildSummaryParagraphs(profile, animal, mhStatus, mhLevel);
    const psychIssues = buildPsychIssues(stress, mhLevel, mhStatus, avg);
    const other = {
      mh: {
        level: Math.min(5, mhLevel + (mhLevel < 3 ? 1 : 0)),
        status: '在对方叙事里，易被误读为「强势」或「冷感」',
        hint: '身份化视角会放大期待与投射，与自我报告可能存在合理温差；解读时建议对照第一部分的五维剖面。',
      },
      traits: traits.map(function (t) {
        return '被读作「' + t + '」';
      }),
      bullets:
        typeof RTC_REPORT_COPY !== 'undefined' && RTC_REPORT_COPY.buildPart2Bullets
          ? RTC_REPORT_COPY.buildPart2Bullets(identityLabel)
          : [
              '在「' +
                identityLabel +
                '」的观察脚本里，你的直接表达更易被编码为「强势」，未必被理解为「清晰」或「边界」。',
              '当你沉默或延迟回应时，对方更倾向解释为冷感或不在意，而较少归因为「内在整理或过载」。',
              '你对独处与恢复的需求，在对方语言中常被翻译成疏离；可通过「可预期的小更新」降低误读概率。',
            ],
      stress: {
        3: [],
        2: ['担心让你失望', '害怕冲突升级'],
        1: ['沟通节奏不一致', '对承诺较敏感', '需要更多确定感', '情绪易被小事触发', '期待被看见'],
      },
    };
    const advice =
      typeof RTC_REPORT_COPY !== 'undefined' && RTC_REPORT_COPY.buildAdvice
        ? RTC_REPORT_COPY.buildAdvice(animal.label, identityLabel, mhStatus)
        : '结合「' +
          animal.label +
          '」颗粒与当前 MHS：未来两周建议每日 10～15 分钟「无评判」书写（只描述事实与身体感受）；在与「' +
          identityLabel +
          '」相关的重要对话前，用三句话写清事实、感受与请求，减少指责与读心式断言；睡前一小时降低屏幕与信息刺激，将自我批评外化为「旁白观察」。若持续疲惫、失眠、情绪低落加重或出现自伤念头，请优先联系持证心理咨询或医疗机构。本段为科普自助建议，不构成个体化治疗方案。';
    return {
      mhLevel: mhLevel,
      mhStatus: mhStatus,
      mhHint: hints[mhLevel - 1],
      traits: traits,
      bullets: bullets,
      stress: stress,
      other: other,
      advice: advice,
      summaryParagraphs: summaryParagraphs,
      dimNotes: dimNotes,
      psychIssues: psychIssues,
    };
  }

  function renderStressTiers(el, stress) {
    if (!el) return;
    el.innerHTML = '';
    const tiers = [
      { k: 3, label: '较高心理负荷 · 建议优先评估与自我调节', cls: 'stress-tier--3' },
      { k: 2, label: '中等波动 · 建议持续观察与记录', cls: 'stress-tier--2' },
      { k: 1, label: '一般性关注点 · 可作为日常自我关照线索', cls: 'stress-tier--1' },
    ];
    tiers.forEach(function (t) {
      const items = stress[t.k] || [];
      if (!items.length && t.k !== 1) return;
      const wrap = document.createElement('div');
      wrap.className = 'stress-tier ' + t.cls;
      wrap.innerHTML =
        '<div class="stress-tier__label">' + t.label + '</div><div class="stress-tier__pills"></div>';
      const pills = wrap.querySelector('.stress-tier__pills');
      items.forEach(function (text) {
        const s = document.createElement('span');
        s.className = 'stress-pill';
        s.textContent = text;
        pills.appendChild(s);
      });
      if (pills.children.length) {
        el.appendChild(wrap);
      }
    });
  }

  function renderOtherMirrorInner(bundle, idLabel, profileAdj) {
    var o = bundle.other;
    var traits = o.traits
      .slice(0, 8)
      .map(function (t) {
        return '<span class="report-pill">' + t + '</span>';
      })
      .join('');
    var parseBlock =
      typeof RTC_REPORT_COPY !== 'undefined' && RTC_REPORT_COPY.getPart2ExternalParse
        ? '<p class="rtc-parse rtc-parse--block">' + RTC_REPORT_COPY.getPart2ExternalParse() + '</p>'
        : o.bullets
            .map(function (text) {
              return '<p>' + text + '</p>';
            })
            .join('');
    var portraitNote =
      '在「' + idLabel + '」视角下，外在可被感知为以上标签组合（第二部份为线上示意解读）。';
    return (
      '<section class="rtc-sec"><h4 class="rtc-sec__title">1. 外在表现画像</h4><p class="rtc-sec__hint">检测结果</p><div class="report-pill-row" style="margin-bottom:10px">' +
      traits +
      '</div><p class="rtc-placeholder-note">' +
      portraitNote +
      '</p></section>' +
      '<section class="rtc-sec"><h4 class="rtc-sec__title">2. 外在表现解析</h4><div class="rtc-parse">' +
      parseBlock +
      '</div></section>' +
      '<section class="rtc-sec"><h4 class="rtc-sec__title">3. 敏感度</h4><p class="rtc-sec__def">对事情或变化的敏锐性</p><p class="rtc-sec__hint">检测结果</p><div id="rtcP2Sens" class="rtc-sens-host"></div><div id="rtcP2SensNote" class="rtc-sec__body"></div></section>' +
      '<section class="rtc-sec"><h4 class="rtc-sec__title">4. 自信心</h4><p class="rtc-sec__def">面对挑战时自信的程度</p><p class="rtc-sec__hint">检测结果</p><div id="rtcP2Conf" class="rtc-single-meter-host"></div><div id="rtcP2ConfNote" class="rtc-sec__body"></div></section>' +
      '<section class="rtc-sec"><h4 class="rtc-sec__title">5. 抗压力</h4><p class="rtc-sec__def">遇到问题能承受多少压力</p><p class="rtc-sec__hint">检测结果</p><div id="rtcP2Resist" class="rtc-single-meter-host"></div><div id="rtcP2ResistNote" class="rtc-sec__body"></div></section>'
    );
  }

  function renderReport() {
    const idLabel = identityLabel();
    const animal = state.trueAnimal;
    const bundle = deriveReportBundle(state.profile, animal, idLabel);
    state.reportBundle = bundle;
    const P = state.profile;

    var p2title = $('reportPart2Title');
    if (p2title) {
      p2title.textContent = secondPartTitle();
    }

    var p3role = $('reportP3Role');
    if (p3role) {
      p3role.textContent = idLabel;
    }

    $('reportAnimalEmoji').textContent = animal.emoji;
    $('reportAnimalName').textContent = animal.label;
    $('reportAnimalLine').textContent = animal.oneLine;

    var parseEl = $('rtcP1Parse');
    if (parseEl) {
      if (typeof RTC_REPORT_COPY !== 'undefined' && RTC_REPORT_COPY.buildPart1ParseHtml) {
        parseEl.innerHTML = RTC_REPORT_COPY.buildPart1ParseHtml(animal, P);
      } else {
        parseEl.innerHTML = '';
        bundle.bullets.forEach(function (b) {
          var p = document.createElement('p');
          p.textContent = b.text;
          parseEl.appendChild(p);
        });
      }
    }

    renderSensitivityBlocksHost($('rtcP1Sens'), P);

    var confScore = (P[3] + P[1]) / 2;
    var resistScore = P[2];
    renderSingleMeterHost($('rtcP1Conf'), confScore, '（线上示意）');
    renderSingleMeterHost($('rtcP1Resist'), resistScore, '（线上示意）');

    function fillRtcNote(id, fn) {
      var el = $(id);
      if (!el || typeof RTC_REPORT_COPY === 'undefined' || typeof fn !== 'function') {
        return;
      }
      el.textContent = fn.call(RTC_REPORT_COPY);
    }
    fillRtcNote('rtcP1SensNote', RTC_REPORT_COPY.getPart1SensNote);
    fillRtcNote('rtcP1ConfNote', RTC_REPORT_COPY.getPart1ConfNote);
    fillRtcNote('rtcP1ResistNote', RTC_REPORT_COPY.getPart1StressNote);

    var careerEl = $('rtcP1Career');
    if (careerEl) {
      if (typeof RTC_REPORT_COPY !== 'undefined' && RTC_REPORT_COPY.buildCareerHtml) {
        careerEl.innerHTML = RTC_REPORT_COPY.buildCareerHtml(animal.label);
      } else {
        careerEl.innerHTML = buildCareerSnippet(animal.label, bundle.traits);
      }
    }

    $('dimList').innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const li = document.createElement('li');
      li.innerHTML = '<span>' + DIM_LABELS[i] + '</span><span>' + Math.round(P[i]) + '</span>';
      $('dimList').appendChild(li);
    }

    drawRadar();

    var profileOther = P.map(function (x, i) {
      return Math.max(0, Math.min(100, x * 0.94 + (i % 2) * 2));
    });
    const frostInner = $('reportOtherInner');
    if (frostInner) {
      frostInner.innerHTML = renderOtherMirrorInner(bundle, idLabel, profileOther);
      renderSensitivityBlocksHost($('rtcP2Sens'), profileOther);
      var confO = (profileOther[3] + profileOther[1]) / 2;
      renderSingleMeterHost($('rtcP2Conf'), confO, '（线上示意）');
      renderSingleMeterHost($('rtcP2Resist'), profileOther[2], '（线上示意）');
      fillRtcNote('rtcP2SensNote', RTC_REPORT_COPY.getPart2SensNote);
      fillRtcNote('rtcP2ConfNote', RTC_REPORT_COPY.getPart2ConfNote);
      fillRtcNote('rtcP2ResistNote', RTC_REPORT_COPY.getPart2StressNote);
    }

    const pay = $('paywallHook');
    if (pay && !state.demoPaid) {
      pay.textContent = '解锁后查看「' + idLabel + '」视角下：外在画像、解析与敏感/自信/抗压（第二部份）。';
    }
    if (pay && state.demoPaid) {
      pay.textContent = '第二部份已解锁，可阅读完整内容。';
    }

    var issuesEight =
      typeof RTC_REPORT_COPY !== 'undefined' && RTC_REPORT_COPY.buildPsychIssuesRich
        ? RTC_REPORT_COPY.buildPsychIssuesRich(P, bundle.mhLevel)
        : buildEightIssuesList(P, bundle.mhLevel);
    var p3count = $('reportP3Count');
    if (p3count) {
      p3count.textContent = '本次检测心理状态问题：' + issuesEight.length + ' 项';
    }
    var psychEl = $('reportPsychIssues');
    if (psychEl) {
      psychEl.innerHTML = '';
      issuesEight.forEach(function (item) {
        var li = document.createElement('li');
        li.className = 'rtc-issue-item';
        var dot = document.createElement('span');
        dot.className = 'rtc-issue-dot rtc-issue-dot--' + item.sev;
        var wrap = document.createElement('div');
        wrap.className = 'rtc-issue-item__main';
        var nameEl = document.createElement('span');
        nameEl.className = 'rtc-issue-item__name';
        nameEl.textContent = item.name;
        wrap.appendChild(nameEl);
        if (item.desc) {
          var descEl = document.createElement('p');
          descEl.className = 'rtc-issue-item__desc';
          descEl.textContent = item.desc;
          wrap.appendChild(descEl);
        }
        li.appendChild(dot);
        li.appendChild(wrap);
        psychEl.appendChild(li);
      });
    }

    const adv = $('reportAdviceText');
    if (adv) {
      adv.textContent = bundle.advice;
    }

    updateReportPayUI();
  }

  function updateReportPayUI() {
    const exact = state.guessExact;
    const wrap = $('reportSelfWrap');
    const lockEl = $('reportSelfLock');
    const tip = $('reportPayTip');
    const primary = $('btnPayPrimary');
    const gh = $('reportPayGroupHint');
    const gFull = (PRICE_FULL * DISCOUNT).toFixed(2);
    const gOther = (PRICE_OTHERS * DISCOUNT).toFixed(2);

    if (state.demoPaid) {
      applyDemoUnlockVisuals();
      if (tip) {
        tip.innerHTML =
          '<strong>演示预览</strong>：已模拟支付完成，下方为解锁后的完整报告样式。刷新或重新测评将重置。';
      }
      if (primary) {
        primary.textContent = '已解锁（演示预览）';
        primary.disabled = true;
      }
      if (gh) {
        gh.innerHTML = '仍可邀请好友成团 · 共享 7 折（演示逻辑）';
      }
      return;
    }

    if (primary) {
      primary.disabled = false;
    }

    var frostEl = $('reportOtherFrost');
    if (frostEl) {
      frostEl.classList.remove('is-unlocked');
      var m = frostEl.querySelector('.report-frost__mask');
      if (m) {
        m.hidden = false;
        m.removeAttribute('hidden');
        m.setAttribute('aria-hidden', 'false');
      }
    }
    var advCardReset = $('reportAdviceWrap');
    if (advCardReset) {
      advCardReset.classList.remove('is-unlocked');
    }

    if (exact) {
      if (lockEl) {
        lockEl.hidden = true;
      }
      if (wrap) {
        wrap.classList.remove('is-locked');
      }
      if (tip) {
        tip.innerHTML =
          '你已获得「自我性格分析」全文。<strong>第二、三部分</strong>需单独解锁：他人镜像 + 我的心理状态问题 <strong>¥' +
          PRICE_OTHERS +
          '</strong>。';
      }
      if (primary) {
        primary.textContent = '¥' + PRICE_OTHERS + ' 解锁他人镜像 + 心理状态';
      }
      if (gh) {
        gh.textContent =
          '邀请好友一起测 · 成团全员 7 折 · 人均约 <strong>¥' + gOther + '</strong>（原价 ¥' + PRICE_OTHERS + '）';
      }
      if ($('btnUnlockOther')) {
        $('btnUnlockOther').textContent = '¥' + PRICE_OTHERS + ' 解锁';
      }
      if ($('paywallHook')) {
        $('paywallHook').textContent =
          '解锁后可读第二部份（外在画像与敏感/自信/抗压）及第三部份「我的心理状态问题」完整内容。';
      }
    } else {
      if (lockEl) {
        lockEl.hidden = false;
      }
      if (wrap) {
        wrap.classList.add('is-locked');
      }
      if (tip) {
        tip.innerHTML =
          '未猜中动物人格：<strong>自我性格分析</strong>与后续内容均已锁定。请一次性支付 <strong>¥' +
          PRICE_FULL +
          '</strong> 解锁<strong>完整报告</strong>（自我 + 他人视角 + 后续建议）。';
      }
      if (primary) {
        primary.textContent = '¥' + PRICE_FULL + ' 解锁完整报告';
      }
      if (gh) {
        gh.textContent =
          '邀请好友一起测 · 成团全员 7 折 · 人均约 <strong>¥' + gFull + '</strong>（原价 ¥' + PRICE_FULL + '）';
      }
      if ($('btnUnlockOther')) {
        $('btnUnlockOther').textContent = '¥' + PRICE_FULL + ' 随完整报告解锁';
      }
      if ($('paywallHook')) {
        $('paywallHook').textContent = '支付完整报告后，将一并解锁本模块与「我的心理状态问题」。';
      }
    }
  }

  function drawRadar() {
    const canvas = $('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);
    const cx = size / 2;
    const cy = size / 2 + 4;
    const R = 70;
    const labels = DIM_LABELS;
    const vals = state.profile;

    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(26,77,78,0.12)';
    ctx.lineWidth = 1;
    for (let g = 1; g <= 4; g++) {
      ctx.beginPath();
      const rr = (R * g) / 4;
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.stroke();
    }

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
      const v = vals[i] / 100;
      const rr = R * v;
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(26, 138, 126, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(26, 138, 126, 0.9)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '11px "PingFang SC", sans-serif';
    ctx.fillStyle = 'rgba(26,77,78,0.72)';
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
      const lx = cx + Math.cos(a) * (R + 18);
      const ly = cy + Math.sin(a) * (R + 22);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], lx, ly);
    }
  }

  function renderQuestion() {
    const q = window.MICRO_QUESTIONS[state.qIndex];
    $('qIndex').textContent = String(state.qIndex + 1);
    $('qTotal').textContent = String(window.MICRO_QUESTIONS.length);
    $('questionText').textContent = q.text;
  }

  function updateProgressRing() {
    const total = window.MICRO_QUESTIONS.length;
    const pct = total ? state.qIndex / total : 0;
    const circumference = 2 * Math.PI * 22;
    const offset = circumference * (1 - pct);
    const fg = document.getElementById('progressFg');
    if (fg) fg.style.strokeDashoffset = String(offset);
    $('progressPct').textContent = Math.round(pct * 100) + '%';
  }

  function bindLikert() {
    const opts = [
      { label: '非常不同意', val: 1 },
      { label: '不太同意', val: 2 },
      { label: '中立', val: 3 },
      { label: '比较同意', val: 4 },
      { label: '非常同意', val: 5 },
    ];
    const wrap = $('likert');
    wrap.innerHTML = '';
    opts.forEach(function (o) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = o.label;
      b.addEventListener('click', function () {
        recordAnswer(o.val);
      });
      wrap.appendChild(b);
    });
  }

  function initNebulaIfNeeded() {
    var c = $('nebulaCanvas');
    if (!c || typeof window.initNebula !== 'function') return;
    nebulaApi = window.initNebula(c);
    nebulaApi.start();
  }

  function initLandingProbe() {
    var msgs = [
      '正在探测你的心理频率…',
      '正在校准显微镜焦距…',
      '微粒共振中，请保持呼吸…',
    ];
    var i = 0;
    setInterval(function () {
      if (state.view !== 'landing') return;
      var el = $('landingProbe');
      if (!el) return;
      i = (i + 1) % msgs.length;
      el.textContent = msgs[i];
    }, 3200);
  }

  function initIdentity() {
    const grid = $('identityGrid');
    grid.innerHTML = '';
    IDENTITIES.forEach(function (item) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'identity-card';
      b.dataset.id = item.id;
      b.style.setProperty('--card-glow', item.accent);
      b.innerHTML =
        '<span class="identity-card__label">' +
        item.label +
        '</span><span class="identity-card__reason">' +
        item.reason +
        '</span><span class="identity-card__hook">' +
        item.hook +
        '</span>';
      b.addEventListener('click', function () {
        if (window.MicroAudio) {
          MicroAudio.playMagnet();
        }
        state.identity = item.id;
        document.documentElement.style.setProperty('--identity-accent', item.accent);
        grid.querySelectorAll('.identity-card').forEach(function (el) {
          el.classList.toggle('is-selected', el.dataset.id === item.id);
        });
        $('btnStartQuiz').disabled = false;
        var stage = $('identityStage');
        if (stage) {
          stage.classList.add('identity-stage--attract');
          window.setTimeout(function () {
            stage.classList.remove('identity-stage--attract');
          }, 650);
        }
        var sil = $('identitySilhouette');
        if (sil) {
          if (item.couple) {
            sil.classList.add('is-visible');
          } else {
            sil.classList.remove('is-visible');
          }
        }
      });
      grid.appendChild(b);
    });
  }

  function wire() {
    $('btnBackLanding').addEventListener('click', function () {
      showView('landing');
    });
    $('btnEnter').addEventListener('click', function () {
      if (window.MicroAudio) {
        MicroAudio.unlock();
        MicroAudio.startAmbient();
      }
      showView('identity');
    });
    $('btnStartQuiz').addEventListener('click', function () {
      if (!state.identity) return;
      state.qIndex = 0;
      state.answers = [];
      state.scores = [0, 0, 0, 0, 0];
      state.counts = [0, 0, 0, 0, 0];
      bindLikert();
      renderQuestion();
      updateProgressRing();
      updateLensBlur();
      showView('quiz');
    });
    $('btnBackIdentity').addEventListener('click', function () {
      showView('identity');
    });
    $('btnSubmitGuess').addEventListener('click', submitGuess);
    var bd = $('guessDetailBackdrop');
    var cl = $('guessDetailClose');
    var pk = $('guessDetailPick');
    if (bd) {
      bd.addEventListener('click', closeGuessModal);
    }
    if (cl) {
      cl.addEventListener('click', closeGuessModal);
    }
    if (pk) {
      pk.addEventListener('click', confirmGuessFromModal);
    }
    $('btnCloseGenius').addEventListener('click', function () {
      $('geniusBurst').classList.remove('is-on');
      showView('report');
      renderReport();
    });
    function payPrimaryDemo() {
      openCeceCashier(
        {
          sku: state.guessExact ? 'psych_others_advice' : 'psych_report_full',
          amountYuan: state.guessExact ? PRICE_OTHERS : PRICE_FULL,
          title: state.guessExact ? '解锁他人视角 + 心理状态' : '解锁完整报告',
        },
        function () {
          state.demoPaid = true;
          applyDemoUnlockVisuals();
          updateReportPayUI();
          renderReport();
        }
      );
    }
    var bp = $('btnPayPrimary');
    if (bp) {
      bp.addEventListener('click', payPrimaryDemo);
    }
    var bg = $('btnPayGroupInline');
    if (bg) {
      bg.addEventListener('click', shareGroupInvite);
    }
    var uo = $('btnUnlockOther');
    if (uo) {
      uo.addEventListener('click', payPrimaryDemo);
    }
    var ua = $('btnUnlockAdvice');
    if (ua) {
      ua.addEventListener('click', payPrimaryDemo);
    }
    var landShare = $('btnShareLanding');
    if (landShare) {
      landShare.addEventListener('click', shareActivityLink);
    }
    var shareBtns = [
      { id: 'btnShareModuleSelf', key: 'self' },
      { id: 'btnShareModuleOther', key: 'other' },
      { id: 'btnShareModuleAdvice', key: 'advice' },
    ];
    shareBtns.forEach(function (item) {
      var b = $(item.id);
      if (b) {
        b.addEventListener('click', function () {
          shareReportModule(item.key);
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initIdentity();
    initNebulaIfNeeded();
    initLandingProbe();
    var root = $('appRoot');
    if (root) {
      root.setAttribute('data-phase', 'landing');
    }
    state.view = 'landing';
    wire();
    document.documentElement.style.setProperty('--lens-blur', '22px');
  });
})();
