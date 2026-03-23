/* ============================================================
   CommBridge – app.js
   ============================================================ */

// Global copy text store (fixes backtick-in-template-literal bug)
window._cb_texts = [];
function _cbCopy(btn, idx) {
  const text = window._cb_texts[idx] || '';
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✅ Copied!';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000);
    showToast('Copied to clipboard! ✨');
  }).catch(() => showToast('Copy failed — please select and copy manually.'));
}
function _store(text) {
  window._cb_texts.push(text);
  return window._cb_texts.length - 1;
}

// ── DATA ────────────────────────────────────────────────────

const SCENARIOS = [
  {
    id: 1, category: 'work', icon: '💼',
    title: 'Asking for a Raise',
    desc: 'Present your value professionally without sounding demanding.',
    what: 'Many people avoid asking for a raise because they fear rejection or seeming greedy. The key is anchoring the conversation in facts and timing it well.',
    steps: [
      'Choose the right moment — after a win, not during a stressful period.',
      'Prepare evidence: achievements, market data, key contributions.',
      'Practice your pitch aloud at least 3 times before the meeting.',
      'Stay calm if declined — ask what it would take to get there next cycle.'
    ],
    script: "\"Hi [Name], I'd love to schedule a quick chat about my compensation.\nOver the past [period], I've [specific achievement], which led to [outcome].\nBased on market data and my contributions, I believe a raise to $[amount] is fair.\nI'm committed to this role and excited about where we're heading — I'd love to discuss this soon.\""
  },
  {
    id: 2, category: 'work', icon: '🤝',
    title: 'Handling a Difficult Colleague',
    desc: 'Navigate conflict with a coworker without escalating tension.',
    what: 'Workplace friction is one of the top causes of stress. Addressing it directly — but diplomatically — prevents long-term damage to your team and mental health.',
    steps: [
      'Choose a private, neutral setting away from the team.',
      'Use "I" statements instead of "you" accusations.',
      'Focus on the specific behaviour, not the person\'s character.',
      'Agree on concrete changes you both commit to going forward.'
    ],
    script: "\"Hey [Name], do you have 10 minutes? I wanted to talk privately.\nI've noticed that when [specific situation], I feel [your feeling] because [impact].\nI don't think that's your intention, so I wanted to bring it up directly.\nCould we figure out a way to handle [situation] differently?\""
  },
  {
    id: 3, category: 'work', icon: '📢',
    title: 'Saying No to Extra Work',
    desc: 'Decline additional tasks without damaging your professional image.',
    what: 'Overcommitting leads to burnout and poor output. Learning to say no gracefully protects your quality of work and your relationships.',
    steps: [
      'Acknowledge the request warmly before declining.',
      'Be honest about your current capacity without over-explaining.',
      'Offer an alternative timeline or colleague if possible.',
      'Don\'t apologise excessively — a calm "no" is professional.'
    ],
    script: "\"Thank you for thinking of me for this! Right now I'm at full capacity with [current priorities].\nIf I take on more, I won't be able to give it the quality it deserves.\nCould we revisit this after [date], or could [colleague] step in for this one?\""
  },
  {
    id: 4, category: 'relationship', icon: '💔',
    title: 'Having the "We Need to Talk" Conversation',
    desc: 'Bring up a relationship issue without causing immediate defensiveness.',
    what: 'How you open a sensitive conversation determines its entire outcome. Framing matters more than content — start with care, not confrontation.',
    steps: [
      'Pick a calm moment — not when either person is tired, hungry, or rushed.',
      'Start with something positive or neutral to lower defences.',
      'Use "I feel…" not "You always…" — own your experience.',
      'Make it clear you want to solve it together, not score points.'
    ],
    script: "\"Can we find some time to talk? There's something on my mind and it's important to me.\nI want to talk about [topic] because I care about us.\nWhen [situation happens], I feel [emotion]. I don't think you mean to, but it affects me.\nI want us to figure this out together — what do you think?\""
  },
  {
    id: 5, category: 'relationship', icon: '🙏',
    title: 'Giving a Sincere Apology',
    desc: 'Apologise in a way that actually repairs trust.',
    what: 'Most apologies fail because they include "but", excuses, or are rushed. A genuine apology takes ownership and commits to change — nothing more, nothing less.',
    steps: [
      'Acknowledge exactly what you did wrong — be specific.',
      'Say "I\'m sorry" clearly, without any "but" following it.',
      'Acknowledge the impact on the other person empathetically.',
      'State clearly what you will do differently going forward.'
    ],
    script: "\"I need to apologise to you properly.\nWhat I did — [specific action] — was wrong.\nI'm sorry. Not as an excuse, but because I understand it hurt you.\nI imagine it felt [their likely feeling] and that's not okay.\nI'm going to [concrete change] so this doesn't happen again.\""
  },
  {
    id: 6, category: 'relationship', icon: '🔥',
    title: 'Expressing Unmet Needs',
    desc: 'Tell your partner what you need without making them feel attacked.',
    what: 'Unexpressed needs breed resentment over time. Communicating them clearly is an act of intimacy, not weakness — it invites the other person to show up for you.',
    steps: [
      'Journal your needs before the conversation so you\'re clear.',
      'Frame it as sharing your experience, not accusing them.',
      'Be specific — vague requests yield vague results.',
      'Give them space to respond without interrupting.'
    ],
    script: "\"I want to share something with you, and I hope we can talk about it openly.\nI've been feeling [emotion] lately, and I think it's because I need more [specific need].\nThis isn't about blaming you — it's about me understanding what I need and wanting us to find a way together.\nWould you be open to talking about this?\""
  },
  {
    id: 7, category: 'family', icon: '👨‍👩‍👧',
    title: 'Setting Boundaries with Parents',
    desc: 'Establish limits without sounding ungrateful or disrespectful.',
    what: 'Boundaries with parents are often the hardest due to guilt, history, and love. Clarity paired with consistency are your most important tools here.',
    steps: [
      'Be crystal clear in your own mind about what you need first.',
      'Use love as the framing — not frustration or past resentment.',
      'Be specific: "please call before visiting" not "stop intruding".',
      'Be prepared to repeat yourself — healthy boundaries often need reinforcing.'
    ],
    script: "\"Mum / Dad, I love you and I want our relationship to be really good.\nI need to ask for something that would genuinely help me: [specific boundary].\nThis isn't about pushing you away — it's about making sure I can show up well for both of us.\nCan we try this going forward?\""
  },
  {
    id: 8, category: 'family', icon: '😤',
    title: 'Addressing a Sibling Conflict',
    desc: 'Resolve long-standing tension without reopening old wounds.',
    what: 'Sibling conflicts often carry decades of unspoken history. Breaking the pattern requires someone to reach out first — that courage is not weakness, it\'s leadership.',
    steps: [
      'Assume good intent until proven otherwise.',
      'Choose a neutral location — not at a family gathering or holiday.',
      'Acknowledge your own part in the dynamic honestly.',
      'Focus on the future rather than relitigating the past.'
    ],
    script: "\"I've been thinking about us, and I don't want things to stay how they've been.\nI know we've had our issues, and I'll own my part in that.\nI'd like to clear the air if you're open to it.\nCan we talk — just the two of us, no blame game?\""
  },
  {
    id: 9, category: 'social', icon: '😬',
    title: 'Leaving a Conversation Gracefully',
    desc: 'Exit an awkward or draining social situation without being rude.',
    what: 'Nobody should feel socially trapped. A graceful exit is a skill that protects your energy and the other person\'s feelings simultaneously.',
    steps: [
      'Signal you\'re winding down: "Well…", "Before I go…".',
      'Give a genuine positive: "It was so good catching up."',
      'Offer a concrete reason — even a vague one is perfectly fine.',
      'Leave warmly and promptly — don\'t linger after signalling exit.'
    ],
    script: "\"It's been so great catching up! I need to head off — [early start / someone I said I'd catch].\nLet's [genuine plan or soft close].\nTake care!\""
  },
  {
    id: 10, category: 'social', icon: '🙅',
    title: 'Turning Down an Invitation',
    desc: 'Say no to social plans without over-explaining or ghosting.',
    what: 'FOMO and social guilt make declining feel harder than it is. A simple, warm "no" is far better than a flaky "maybe" that leaves everyone in limbo.',
    steps: [
      'Respond promptly — don\'t leave people hanging with silence.',
      'Be genuinely appreciative of being invited.',
      'Be clear — no "maybe next time" if you truly mean no.',
      'Optionally suggest an alternative that you\'d actually follow through on.'
    ],
    script: "\"Thank you so much for thinking of me — that sounds fun!\nI'm not going to be able to make it this time.\nI hope you all have a great time! Let's find another occasion soon.\""
  },
  {
    id: 11, category: 'work', icon: '🗣️',
    title: 'Giving Constructive Feedback',
    desc: 'Share criticism that actually helps rather than hurts.',
    what: 'Feedback delivered poorly does more damage than staying silent. The Situation-Behaviour-Impact model is proven to deliver feedback that lands and creates change.',
    steps: [
      'Be specific: "the report lacked supporting data" not "it wasn\'t good".',
      'Focus on the behaviour, never the person\'s personality.',
      'Explain the impact clearly so the person understands why it matters.',
      'End with a forward-looking question or offer of support.'
    ],
    script: "\"I wanted to share some feedback on [specific work].\nIn [situation], [specific behaviour] meant that [impact on team/outcome].\nI know you're capable of stronger work — I think if you [specific suggestion], it'll really shine.\nWhat support do you need to get there?\""
  },
  {
    id: 12, category: 'social', icon: '💬',
    title: 'Standing Up for Yourself',
    desc: 'Respond to dismissiveness or disrespect without aggression.',
    what: 'Being too passive fuels resentment; being aggressive escalates things. Assertiveness is the powerful skill that lives calmly between the two.',
    steps: [
      'Stay calm — a steady voice is more powerful than a raised one.',
      'Name the behaviour without making it a personal attack.',
      'State your expectation clearly and simply.',
      'Don\'t wait for their approval — say it and let it land.'
    ],
    script: "\"I want to name something — when [specific thing happened], it felt dismissive.\nI'm not sure if that was the intention, but it's not something I'm willing to overlook.\nI'd appreciate [specific change] going forward.\""
  }
];

const TIPS = [
  { num: '01', title: 'Listen More Than You Speak', body: 'Most communication failures happen because we\'re rehearsing our reply instead of genuinely hearing. Aim for 60% listening, 40% talking.' },
  { num: '02', title: 'Use "I" Statements', body: '"I feel hurt when…" lands differently than "You always…". Own your experience — it disarms defensiveness instantly.' },
  { num: '03', title: 'The 24-Hour Rule', body: 'Never send a message or start a difficult conversation in the heat of the moment. Wait 24 hours and ask: is this still how I want to handle this?' },
  { num: '04', title: 'Name the Feeling', body: 'Labelling your emotion out loud — "I\'m feeling anxious about this" — activates the reasoning brain and calms the fight-or-flight response.' },
  { num: '05', title: 'Pause Before Responding', body: 'A 3-second pause before you speak makes you seem calmer, more thoughtful, and more authoritative — all at once.' },
  { num: '06', title: 'Ask, Don\'t Assume', body: '"What did you mean by that?" is one of the most powerful questions you can ask. Assumptions are the root of almost every misunderstanding.' },
  { num: '07', title: 'Validate First, Then Respond', body: 'Before making your point, acknowledge theirs: "That makes sense" or "I can see why you\'d feel that way" — it keeps the conversation open.' },
  { num: '08', title: 'Pick the Right Medium', body: 'Serious conversations need in-person or voice. Text strips away tone and facial cues, turning friendly messages into potential landmines.' },
  { num: '09', title: 'Know Your Triggers', body: 'Self-awareness is step one. Know which phrases, tones, or topics make you reactive — so you can catch yourself before you regret it.' },
];

const TEMPLATES = [
  {
    icon: '📧', title: 'Requesting a Meeting with Your Manager',
    meta: 'Professional · Email / Chat',
    text: 'Hi [Name],\n\nI hope you\'re doing well. I\'d love to schedule 15-20 minutes with you this week to discuss [topic].\n\nA few points I\'d like to cover:\n- [Point 1]\n- [Point 2]\n\nPlease let me know a time that works best for you — I\'m flexible around your schedule.\n\nThanks so much,\n[Your Name]'
  },
  {
    icon: '💌', title: 'Reconnecting After a Falling Out',
    meta: 'Personal · Text / Message',
    text: 'Hey [Name],\n\nI\'ve been thinking about you and realised it\'s been a while. I know things got awkward between us and I don\'t want to leave it like that.\n\nI value [our friendship / what we had] and I\'m reaching out because I think we\'re worth figuring it out.\n\nWould you be open to catching up, even briefly?\n\nTake care,\n[Your Name]'
  },
  {
    icon: '🙏', title: 'Apologising to a Friend',
    meta: 'Personal · Text / In-person',
    text: 'Hey [Name],\n\nI owe you an apology. What I did / said — [specific action] — wasn\'t okay, and I\'ve been sitting with that.\n\nI\'m sorry. You didn\'t deserve that and I should have handled it differently.\n\nI hope we can move forward from this. I really do value your friendship.\n\n[Your Name]'
  },
  {
    icon: '🚫', title: 'Setting a Boundary Professionally',
    meta: 'Professional · Email',
    text: 'Hi [Name],\n\nThank you for reaching out. I wanted to be transparent with you — I\'m currently at capacity and need to protect my bandwidth to deliver quality work on my existing commitments.\n\nGoing forward, I\'ll need [specific boundary, e.g. 48h notice for urgent requests].\n\nI hope we can find a workflow that works for us both. Happy to discuss further if helpful.\n\nBest,\n[Your Name]'
  },
  {
    icon: '🤝', title: 'Clearing the Air After a Conflict',
    meta: 'Personal or Professional · In-person / Call',
    text: 'I\'ve been thinking about our last conversation and I want to clear the air.\n\nI think we both said things in the heat of the moment and I don\'t want that to define things between us.\n\nI\'m sorry for [your part]. I\'d like to move forward without this weighing on us.\n\nCan we start fresh?'
  },
  {
    icon: '💪', title: 'Asking for Help Without Feeling Weak',
    meta: 'Personal or Professional · Any',
    text: 'Hi [Name],\n\nI hope this finds you well. I wanted to reach out because I\'m working through [situation] and I\'d genuinely value your perspective / support.\n\nSpecifically, I could use help with [specific ask].\n\nI know your time is valuable and even a short conversation would mean a lot.\n\nThank you,\n[Your Name]'
  },
];

const WIZARD_STEPS = [
  {
    question: '🌍 What area of life is the communication challenge in?',
    options: [
      { emoji: '💼', label: 'Work / Professional' },
      { emoji: '❤️', label: 'Romantic Relationship' },
      { emoji: '👨‍👩‍👧', label: 'Family' },
      { emoji: '🤝', label: 'Friendship / Social' },
    ]
  },
  {
    question: '😟 How would you describe the situation?',
    options: [
      { emoji: '⚡', label: 'There\'s unresolved conflict or tension' },
      { emoji: '😶', label: 'Something important went unsaid for too long' },
      { emoji: '🙅', label: 'I need to say no or set a boundary' },
      { emoji: '💔', label: 'Someone hurt me or let me down' },
    ]
  },
  {
    question: '🎯 What outcome are you hoping for?',
    options: [
      { emoji: '🕊️', label: 'Resolve and restore the relationship' },
      { emoji: '🧹', label: 'Clear the air and move forward' },
      { emoji: '🔒', label: 'Set a firm boundary going forward' },
      { emoji: '💬', label: 'Simply be heard and understood' },
    ]
  },
  {
    question: '🙋 How comfortable are you with direct conversation?',
    options: [
      { emoji: '😰', label: 'Very uncomfortable — I avoid confrontation' },
      { emoji: '😐', label: 'Somewhat — depends on the situation' },
      { emoji: '😌', label: 'Generally okay — I just need a framework' },
      { emoji: '💪', label: 'Comfortable — I just need the right words' },
    ]
  }
];

const RESULT_SCRIPT = 'Start by choosing the right time and place — somewhere private and calm.\n\nOpen with:\n"I\'ve been wanting to talk about something. I care about [this relationship / situation] and I think it\'s worth addressing."\n\nThen:\n- Share your experience using "I feel / I noticed / I\'ve been affected by..."\n- Avoid accusatory language — describe the behaviour, not the person\n- Name the outcome you want: "What I\'m hoping for is..."\n\nClose with:\n"I\'m not trying to attack you — I just want us to figure this out together. What are your thoughts?"';

const RESULT_TIPS = [
  'Take 3 deep breaths before you start — it slows your nervous system',
  'Write down 3 key points in advance so you don\'t lose track mid-conversation',
  'If emotions run high, suggest a 5-minute pause rather than stopping completely',
  'End the conversation with a specific agreement or clear next step'
];

// ── INIT ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  renderScenarios();
  initFilters();
  renderTips();
  renderTemplates();
  initWizard();
  initModal();
});

// ── NAVBAR ───────────────────────────────────────────────────

function initNav() {
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  menuBtn && menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks && navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── SCENARIOS ────────────────────────────────────────────────

function renderScenarios() {
  const grid = document.getElementById('scenariosGrid');
  if (!grid) return;
  grid.innerHTML = SCENARIOS.map(s => {
    return '<div class="scenario-card" data-id="' + s.id + '" data-category="' + s.category + '" tabindex="0" role="button">' +
      '<div class="sc-icon">' + s.icon + '</div>' +
      '<div class="sc-tag ' + s.category + '">' + s.category + '</div>' +
      '<div class="sc-title">' + s.title + '</div>' +
      '<div class="sc-desc">' + s.desc + '</div>' +
      '</div>';
  }).join('');

  grid.querySelectorAll('.scenario-card').forEach(card => {
    card.addEventListener('click', () => openScenario(Number(card.dataset.id)));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openScenario(Number(card.dataset.id)); });
  });
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.scenario-card').forEach(card => {
        card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
      });
    });
  });
}

// ── MODAL ────────────────────────────────────────────────────

function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  closeBtn && closeBtn.addEventListener('click', closeModal);
  overlay && overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openScenario(id) {
  const s = SCENARIOS.find(x => x.id === id);
  if (!s) return;
  const scriptIdx = _store(s.script);
  const content = document.getElementById('modalContent');
  const stepsHtml = s.steps.map(function(step) { return '<li>' + step + '</li>'; }).join('');
  content.innerHTML =
    '<div class="modal-emoji">' + s.icon + '</div>' +
    '<div class="sc-tag ' + s.category + '" style="margin-bottom:10px">' + s.category + '</div>' +
    '<div class="modal-title">' + s.title + '</div>' +
    '<p style="color:var(--text-muted);font-size:0.92rem;margin-top:6px">' + s.desc + '</p>' +
    '<div class="modal-section"><h4>💡 Why This Happens</h4><p>' + s.what + '</p></div>' +
    '<div class="modal-section"><h4>📋 Step-by-Step Strategy</h4><ul>' + stepsHtml + '</ul></div>' +
    '<div class="modal-section"><h4>🗣️ Example Script</h4>' +
    '<div class="script-box">' + s.script.replace(/\n/g, '<br>') + '</div>' +
    '<button class="btn btn-sm btn-outline" style="margin-top:12px" onclick="_cbCopy(this,' + scriptIdx + ')">📋 Copy Script</button>' +
    '</div>';
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── TIPS ─────────────────────────────────────────────────────

function renderTips() {
  const grid = document.getElementById('tipsGrid');
  if (!grid) return;
  grid.innerHTML = TIPS.map(function(t) {
    return '<div class="tip-card">' +
      '<div class="tip-num">' + t.num + '</div>' +
      '<div><div class="tip-title">' + t.title + '</div>' +
      '<div class="tip-body">' + t.body + '</div></div>' +
      '</div>';
  }).join('');
}

// ── TEMPLATES ────────────────────────────────────────────────

function renderTemplates() {
  const list = document.getElementById('templatesList');
  if (!list) return;
  list.innerHTML = TEMPLATES.map(function(t, i) {
    const idx = _store(t.text);
    return '<div class="template-item" id="tmpl-' + i + '">' +
      '<div class="template-header" onclick="toggleTemplate(' + i + ')">' +
      '<div class="tmpl-left">' +
      '<div class="tmpl-icon">' + t.icon + '</div>' +
      '<div><div class="tmpl-title">' + t.title + '</div>' +
      '<div class="tmpl-meta">' + t.meta + '</div></div>' +
      '</div>' +
      '<div class="tmpl-chevron">▼</div>' +
      '</div>' +
      '<div class="template-body">' +
      '<div class="template-text">' + t.text.replace(/\n/g, '<br>') + '</div>' +
      '<div class="template-actions">' +
      '<button class="btn btn-sm btn-primary" onclick="_cbCopy(this,' + idx + ')">📋 Copy Template</button>' +
      '</div></div></div>';
  }).join('');
}

function toggleTemplate(i) {
  const item = document.getElementById('tmpl-' + i);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.template-item').forEach(function(el) { el.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}

// ── WIZARD ───────────────────────────────────────────────────

var wizardStep = 0;
var wizardAnswers = [];
var totalSteps = WIZARD_STEPS.length;

function initWizard() {
  wizardStep = 0;
  wizardAnswers = [];
  renderWizardStep();

  var nextBtn = document.getElementById('wizardNext');
  var backBtn = document.getElementById('wizardBack');
  nextBtn && nextBtn.addEventListener('click', wizardNext);
  backBtn && backBtn.addEventListener('click', wizardBack);
}

function renderWizardStep() {
  var body = document.getElementById('wizardBody');
  var progressFill = document.getElementById('progressFill');
  var stepLabel = document.getElementById('stepLabel');
  var backBtn = document.getElementById('wizardBack');
  var nextBtn = document.getElementById('wizardNext');
  if (!body || !progressFill || !stepLabel || !backBtn || !nextBtn) return;

  if (wizardStep >= totalSteps) {
    progressFill.style.width = '100%';
    stepLabel.textContent = 'Your Results ✨';
    backBtn.style.display = 'none';
    nextBtn.textContent = '🔄 Start Over';

    var scriptIdx = _store(RESULT_SCRIPT);
    var tipsHtml = RESULT_TIPS.map(function(t) { return '<li>' + t + '</li>'; }).join('');

    body.innerHTML =
      '<div class="wizard-result">' +
      '<h3>🎯 Your Personalised Communication Strategy</h3>' +
      '<div class="result-script">' + RESULT_SCRIPT.replace(/\n/g, '<br>') + '</div>' +
      '<p style="font-weight:700;margin-bottom:10px;font-size:0.9rem;margin-top:16px;">Pro tips for your situation:</p>' +
      '<ul class="result-tips">' + tipsHtml + '</ul>' +
      '<button class="btn btn-sm btn-outline" style="margin-top:20px" onclick="_cbCopy(this,' + scriptIdx + ')">📋 Copy Script</button>' +
      '</div>';

    // Rebind Start Over
    nextBtn.replaceWith(nextBtn.cloneNode(true));
    var freshNext = document.getElementById('wizardNext');
    freshNext && freshNext.addEventListener('click', function() {
      wizardStep = 0;
      wizardAnswers = [];
      freshNext.textContent = 'Next →';
      freshNext.replaceWith(freshNext.cloneNode(true));
      var reboundNext = document.getElementById('wizardNext');
      reboundNext && reboundNext.addEventListener('click', wizardNext);
      renderWizardStep();
    });
    return;
  }

  var step = WIZARD_STEPS[wizardStep];
  progressFill.style.width = (((wizardStep) / totalSteps) * 100) + '%';
  stepLabel.textContent = 'Step ' + (wizardStep + 1) + ' of ' + totalSteps;
  backBtn.style.display = wizardStep > 0 ? 'inline-flex' : 'none';
  nextBtn.textContent = wizardStep === totalSteps - 1 ? 'See My Results ✨' : 'Next →';

  var optionsHtml = step.options.map(function(o, i) {
    var sel = wizardAnswers[wizardStep] === i ? ' selected' : '';
    return '<button class="wizard-option' + sel + '" data-idx="' + i + '">' +
      '<span>' + o.emoji + '</span><span>' + o.label + '</span></button>';
  }).join('');

  body.innerHTML = '<p class="wizard-question">' + step.question + '</p>' +
    '<div class="wizard-options">' + optionsHtml + '</div>';

  body.querySelectorAll('.wizard-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      body.querySelectorAll('.wizard-option').forEach(function(o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      wizardAnswers[wizardStep] = Number(opt.dataset.idx);
    });
  });
}

function wizardNext() {
  if (wizardStep < totalSteps && wizardAnswers[wizardStep] === undefined) {
    showToast('Please select an option first 👆');
    return;
  }
  wizardStep++;
  renderWizardStep();
}

function wizardBack() {
  if (wizardStep > 0) {
    wizardStep--;
    renderWizardStep();
  }
}

// ── UTILS ────────────────────────────────────────────────────

function showToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 3000);
}
