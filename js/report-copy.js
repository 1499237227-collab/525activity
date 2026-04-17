/**
 * 《RTC微颗粒心理检测 · 科学应用版》报告正文
 * 内容来源：docs/结果参考.doc（可在此文件直接改字，勿改 app.js 逻辑）
 */
(function (global) {
  var DIM_LABELS = ['自我觉察', '人际亲和', '情绪稳定', '规则计划', '开放探索'];

  function pickHiLo(profile) {
    var idxHi = 0;
    var idxLo = 0;
    for (var i = 1; i < 5; i++) {
      if (profile[i] > profile[idxHi]) {
        idxHi = i;
      }
      if (profile[i] < profile[idxLo]) {
        idxLo = i;
      }
    }
    return {
      highDim: DIM_LABELS[idxHi],
      lowDim: DIM_LABELS[idxLo],
      highScore: Math.round(profile[idxHi]),
      lowScore: Math.round(profile[idxLo]),
    };
  }

  /** 结果参考.doc · 第一部份「性格解析」示例：控制型·纯老虎（全文） */
  var DOC_PARSE_PURE_TIGER =
    '<p>你属于典型的「控制型·纯老虎」性格。外表强势果敢，内心有一套清晰的标准和原则，希望一切在掌控之中。你不喜欢拖沓和犹豫，更接受不了「差不多就行」，做事讲究效率与结果，一旦认定方向，就会用最大的力气去冲刺。你天生带着一点「领导者」的锋芒，习惯主动出击，安排节奏、分配资源、盯进度，都能做得井井有条。别人眼中的压力，在你看来只是必须解决的任务。</p>' +
    '<p>你不爱虚头巴脑的客套，更反感形式主义，哪怕话说得直接一点、硬一点，也希望一切都「来真格的」。你愿意为目标付出，很少轻言放弃，但也容易因为高标准而对自己和身边人苛刻。适合你的环境，是目标清晰、责任明确、能让你主导项目推进和关键决策的舞台。在学会适当放松和信任他人的前提下，你的执行力与掌控力会成为团队最可靠的「定海神针」。</p>';

  function narrativeByArchetype(archetype, animalLabel, hl) {
    var typeStr = '「' + animalLabel + '」';
    var maps = {
      expressive:
        '<p>你的颗粒更接近表现型' +
        typeStr +
        '：重视表达与氛围，愿意把想法与热情外显出来，在人群中常扮演「带动节奏」的角色。相对优势维度为「' +
        hl.highDim +
        '」（' +
        hl.highScore +
        ' 分）；相对发展维度为「' +
        hl.lowDim +
        '」（' +
        hl.lowScore +
        ' 分）。建议在重要场合保留「事实—感受—请求」的表达结构，让热情与边界同时被看见。</p>',
      gentle:
        '<p>你的颗粒更接近温和型' +
        typeStr +
        '：重视关系与稳定，愿意花时间经营信任，在冲突情境里倾向先降温、再解决。相对优势维度为「' +
        hl.highDim +
        '」（' +
        hl.highScore +
        ' 分）；相对发展维度为「' +
        hl.lowDim +
        '」（' +
        hl.lowScore +
        ' 分）。建议在照顾他人的同时，为自我需求预留可预期的表达窗口，避免长期压抑后的爆发。</p>',
      control:
        '<p>你的颗粒更接近控制型' +
        typeStr +
        '：重视目标、标准与结果，习惯把复杂任务拆成可执行的步骤，并持续跟进。相对优势维度为「' +
        hl.highDim +
        '」（' +
        hl.highScore +
        ' 分）；相对发展维度为「' +
        hl.lowDim +
        '」（' +
        hl.lowScore +
        ' 分）。建议在高压推进中穿插「可验证的小胜利」，用节奏感降低对自己与团队的隐性消耗。</p>',
      analytical:
        '<p>你的颗粒更接近分析型' +
        typeStr +
        '：重视事实、逻辑与风险，在决策前倾向收集与比对信息。相对优势维度为「' +
        hl.highDim +
        '」（' +
        hl.highScore +
        ' 分）；相对发展维度为「' +
        hl.lowDim +
        '」（' +
        hl.lowScore +
        ' 分）。建议在「想得更清楚」与「先动起来」之间设定截止时间，避免过度分析带来的拖延。</p>',
    };
    return maps[archetype] || maps.control;
  }

  /** 结果参考.doc · 敏感度/自信/抗压（第一部份）说明段 */
  var DOC_P1_SENS =
    '对人与事，除非是你想知道的、非留意不可的或迫切了解的，否则通常你习惯依当时的实际情况再决定做出相应的反应。';
  var DOC_P1_CONF =
    '随遇而安的自信形象，对人对事要求度容易随遇而安，做事不是非常高的标准；对于想得到的事务会一直争取，当得不到时你会觉得有些不舒服，同时期望下一次好好努力争取，容易用谦虚及和善的信心度处理问题；对于高的工作挑战及压力仍会执行，只是心里产生评估、保留、小心的想法。';
  var DOC_P1_STRESS =
    '表示需要大量投入工作或活动的动机，是要有需求的或有意义的；如果投入的事务是有价值的，有可能在实际的事件中自然提高你的抗压力；反之未达到期望或不愿做的事务可能会使你需要更多休息或补充食物，如此精力才能有效付出。';

  /** 结果参考.doc · 第二部份外在表现解析（全文） */
  var DOC_PART2_PARSE =
    '你是一位路遥知马力的人，对人温和友善，具有包容心，能协助或支持他人，能持之以恒坚持不懈，充满耐心与耐力，能用时间换取空间，不伤和气不树敌，凡事以和为贵，能大度地看待问题，强调和睦相处和谐共事，有自我的原则及立场，做人问心无愧，不喜欢常常被改变或临时被通知，做事希望有足够的时间做准备，讨厌被人控制，能独立自主充满自信，能设定目标及推动进展，敢于要求及控制人但不会令人难堪，重视工作成果，对事进展容易一步一脚印步步为营，但也不失去乐观及正面看待问题的态度，与他人交流及沟通能产生新创意，在乎别人想法与感受，为人热忱助人，对人不过多计较，性格较为开朗随性，不拘小节也不重视细节，对于细微事务容易请人代为处理或授权，强调组织和谐，对于条条框框及制度并不在意，但如有规定也能遵守，喜欢自由自在的工作环境。';

  var DOC_P2_SENS = DOC_P1_SENS;
  var DOC_P2_CONF =
    '是属于凡事不过份强求，对人与事得过且过的标准，看状况建立高或低一点的期望值。';
  var DOC_P2_STRESS =
    '表示除工作的正常压力外再多一些的工作量或压力对于你而言是能承受的、是能抗压的。如果你觉得应该比此指数高不符合你的想法，有可能是过多的精力投入所导致此结果。';

  /** 适合的职业发展（结果参考.doc 原文） */
  var DOC_CAREER_TAGS = [
    '术艺',
    '文艺',
    '写作',
    '美编',
    '客服',
    '行政工作',
    '幼教老师',
    '秘书',
    '支援工作',
    '作家',
  ];

  /** 第三部份 8 项：前 3 条与说明摘自结果参考.doc */
  var ISSUES_DOC = [
    {
      name: '无时间观念的倾向',
      desc:
        '以及合理的时间分配，可能在忙碌中失去生活重心；最近对事情的处理偏随性进行，没有轻重缓急的意识的现象。',
    },
    {
      name: '粗心的倾向',
      desc: '最近处理事情容易考虑不周，有可能会白忙或重新调整，导致产生自我能量耗损的现象。',
    },
    {
      name: '低抗压的倾向',
      desc:
        '最近感觉精力不够使用，有可能是个人体质、身心或疾病原因等造成，导致无法承受高度抗压的现象。',
    },
    { name: '情绪波动与睡眠节律', desc: '建议关注情绪起伏与作息联动，避免长期熬夜加重身心耗竭。' },
    { name: '人际敏感与反馈期待', desc: '对他人评价与反馈较敏感时，可用「事实—感受—请求」降低误读。' },
    { name: '焦虑与担忧循环', desc: '担忧反复出现时可记录触发情境，区分可控与不可控因素。' },
    { name: '自我期待与完美主义', desc: '高标准驱动同时也易自我苛责，可为任务设定「足够好」的完成线。' },
    { name: '精力恢复与内在动力', desc: '持续疲惫或动力下滑时，优先排查睡眠、营养与负荷结构。' },
  ];

  global.RTC_REPORT_COPY = {
    issueNames: ISSUES_DOC.map(function (x) {
      return x.name;
    }),

    /** 第一部份性格解析 HTML */
    buildPart1ParseHtml: function (animal, profile) {
      if (animal.label === '纯老虎' && animal.archetype === 'control') {
        return DOC_PARSE_PURE_TIGER;
      }
      var hl = pickHiLo(profile);
      return narrativeByArchetype(animal.archetype, animal.label, hl);
    },

    getPart1SensNote: function () {
      return DOC_P1_SENS;
    },
    getPart1ConfNote: function () {
      return DOC_P1_CONF;
    },
    getPart1StressNote: function () {
      return DOC_P1_STRESS;
    },

    /** 第二部份：单一长段外在表现解析 */
    getPart2ExternalParse: function () {
      return DOC_PART2_PARSE;
    },
    getPart2SensNote: function () {
      return DOC_P2_SENS;
    },
    getPart2ConfNote: function () {
      return DOC_P2_CONF;
    },
    getPart2StressNote: function () {
      return DOC_P2_STRESS;
    },

    buildCareerHtml: function (animalLabel) {
      var tags = DOC_CAREER_TAGS.map(function (t) {
        return '<span>' + t + '</span>';
      }).join('');
      return (
        '<p class="rtc-career__lead">您的性格在哪些岗位更能发挥所长（以下为结果参考中的方向列举，可按实际择业调整）。</p>' +
        '<div class="rtc-career__tags">' +
        tags +
        '</div>'
      );
    },

    /** 兼容旧接口：不再用于主解析，保留兜底 */
    buildPart1Bullets: function (animalLabel, profile) {
      var hl = pickHiLo(profile);
      return [
        {
          icon: '◆',
          text:
            '根据五维颗粒剖面，您的测评结果与「' +
            animalLabel +
            '」相匹配。相对优势维度为「' +
            hl.highDim +
            '」（' +
            hl.highScore +
            ' 分）；相对发展维度为「' +
            hl.lowDim +
            '」（' +
            hl.lowScore +
            ' 分）。',
        },
      ];
    },

    buildPart2Bullets: function (identityLabel) {
      return [DOC_PART2_PARSE];
    },

    buildAdvice: function (animalLabel, identityLabel, mhStatus) {
      return (
        '结合「' +
        animalLabel +
        '」人格特征与本次五维颗粒，心理健康综合指数（MHS）呈现为「' +
        mhStatus +
        '」。未来两周建议：每日 10～15 分钟「无评判」书写（只记录事实与身体感受）；在与「' +
        identityLabel +
        '」相关的重要对话前，用三句话写清事实、感受与请求。若持续疲惫、失眠、情绪低落加重或出现自伤念头，请优先联系持证心理咨询或医疗机构。本段为科普自助建议，不构成个体化诊断或治疗方案。'
      );
    },

    /** 8 项心理状态问题（含说明，供列表渲染） */
    buildPsychIssuesRich: function (profile, mhLevel) {
      var out = [];
      for (var i = 0; i < ISSUES_DOC.length; i++) {
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
        out.push({
          name: ISSUES_DOC[i].name,
          desc: ISSUES_DOC[i].desc,
          sev: sev,
        });
      }
      return out;
    },
  };
})(typeof window !== 'undefined' ? window : this);
