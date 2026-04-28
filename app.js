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
  },
  {
    id: 13, category: 'work', icon: '🆘',
    title: 'Asking for Help Without Feeling Weak',
    desc: 'Request assistance while demonstrating leadership and self-awareness.',
    what: 'Many professionals struggle to ask for help, fearing it looks like incompetence. In reality, asking for targeted help shows strong self-awareness and prioritizes the project over ego.',
    steps: [
      'Be specific about what you\'ve already tried to solve the issue.',
      'Clearly define what exactly you need help with (time, expertise, resources).',
      'Frame it as a collaboration to achieve the best result for the team.',
      'Thank them and offer to return the favor in the future.'
    ],
    script: "\"Hi [Name], I'm currently working on [Project] and I've hit a roadblock with [specific issue].\nI've already tried [A and B], but I know you have strong expertise in this area.\nCould I get 15 minutes of your time to get your perspective on [specific question]?\nI want to make sure we get this right.\""
  },
  {
    id: 14, category: 'relationship', icon: '💸',
    title: 'Discussing Finances with a Partner',
    desc: 'Talk about money without triggering anxiety or arguments.',
    what: 'Money is the number one source of relationship conflict. Approaching the topic neutrally, rather than as an audit, prevents defensiveness and fosters teamwork.',
    steps: [
      'Schedule a "money date" so neither person feels ambushed.',
      'Start with shared goals before looking at the numbers.',
      'Avoid placing blame for past spending; focus on future habits.',
      'Use "we" language instead of "you" language.'
    ],
    script: "\"I'd love for us to sit down this weekend and look at our finances together.\nMy goal isn't to scrutinise everything, but just to make sure we're on track for [shared goal, e.g., our holiday / saving].\nI think if we get on the same page, we'll both feel a lot less stressed.\nDoes Saturday morning work for you?\""
  },
  {
    id: 15, category: 'family', icon: '✋',
    title: 'Refusing Unsolicited Advice',
    desc: 'Handle well-meaning but overstepping family members gracefully.',
    what: 'Family members often give advice out of love, but it can feel controlling or dismissive. You can validate their care while firmly rejecting the advice.',
    steps: [
      'Acknowledge their good intentions immediately to disarm them.',
      'State your decision firmly without over-explaining your reasons.',
      'Pivot the conversation to a new, neutral topic.',
      'If they push, gently repeat your boundary.'
    ],
    script: "\"I know you're suggesting this because you care about me, and I appreciate that.\nHowever, I've already made my decision on how I'm handling [situation].\nIf I need a second opinion later, I'll definitely let you know.\nAnyway, how has [new topic] been going?\""
  },
  {
    id: 16, category: 'social', icon: '✂️',
    title: 'Ending a Toxic Friendship',
    desc: 'Step away from a draining relationship clearly and respectfully.',
    what: 'Ghosting a long-term friend often causes more anxiety and drama than a clean break. A direct, respectful conversation provides closure for both parties.',
    steps: [
      'Focus the conversation on your own needs, not their flaws.',
      'Keep it relatively brief — don\'t get drawn into an argument about the past.',
      'Be clear that this is a final decision, not a negotiation.',
      'Wish them well genuinely as you close the door.'
    ],
    script: "\"I'm reaching out because I need to be honest with you.\nOver the past few months, I've realised that our friendship is no longer healthy for me, and I need to step back from it.\nThis isn't an easy message to send, but I wanted to be direct rather than just fading out.\nI genuinely wish you all the best going forward.\""
  },
  {
    id: 17, category: 'work', icon: '🤝',
    title: 'Networking at an Event',
    desc: 'Introduce yourself without sounding salesy or desperate.',
    what: 'Networking is often awkward because people try to pitch themselves immediately. The best networking focuses on curiosity and building a genuine human connection first.',
    steps: [
      'Start with a contextual observation (the venue, the speaker, the food).',
      'Ask open-ended questions about what they do or what brought them here.',
      'Listen actively and find a common point of interest.',
      'Exit gracefully by exchanging details, rather than overstaying.'
    ],
    script: "\"Hi, I don't think we've met. I'm [Name]. What brought you to this event today?\nOh, that's interesting. I actually work in [your field]. How long have you been in [their field]?\nI've really enjoyed our chat. I'm going to grab a coffee, but I'd love to connect on LinkedIn if you're open to it.\""
  },
  {
    id: 18, category: 'work', icon: '🔄',
    title: 'Delegating a Task',
    desc: 'Assign work effectively without micromanaging.',
    what: 'Poor delegation leads to frustration on both sides. A good hand-off provides clear expectations and context while trusting the person to execute.',
    steps: [
      'Explain *why* this task is important and why you chose them.',
      'Clearly define what success looks like (the output, not the exact method).',
      'Set a specific deadline and check-in points.',
      'Ask if they have everything they need to start.'
    ],
    script: "\"I need your help with [Task]. Because of your experience with [skill], you're the best person for this.\nThe goal is to have [specific outcome] ready by [date].\nI trust your approach on how to get there. How does that timeline look to you?\nLet's check in on [Day] just to see if you need any support.\""
  },
  {
    id: 19, category: 'family', icon: '🧸',
    title: 'Apologising to a Child',
    desc: 'Model healthy accountability when you lose your temper.',
    what: 'Apologising to children teaches them that adults make mistakes too, and that relationships can be repaired. It builds deep emotional security.',
    steps: [
      'Get down to their eye level and use a calm voice.',
      'Name your mistake clearly without blaming their behaviour.',
      'Reassure them that your feelings are your responsibility.',
      'Ask for a hug or a reset to repair the connection.'
    ],
    script: "\"I need to say sorry to you. Earlier, I yelled because I was feeling stressed, and that wasn't okay.\nIt wasn't your fault that I lost my temper.\nI'm going to try to take deep breaths next time.\nCan we have a hug and start over?\""
  },
  {
    id: 20, category: 'social', icon: '🏡',
    title: 'Setting a Rule with Neighbors',
    desc: 'Address a nuisance respectfully to keep the peace.',
    what: 'Neighborly disputes can easily escalate. Addressing the issue early, politely, and collaboratively prevents long-term hostility and resentment.',
    steps: [
      'Assume they don\'t realise they are causing a problem.',
      'Frame the conversation around a shared goal (a peaceful neighborhood).',
      'State the issue clearly and propose a reasonable compromise.',
      'Keep it brief and friendly.'
    ],
    script: "\"Hi there! I wanted to chat with you quickly.\nWe've been hearing a lot of noise late at night, and I know these walls are pretty thin.\nWould it be possible to keep the volume down after 10 PM?\nI'd really appreciate it, and if we're ever too loud, please let us know too!\""
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
      { emoji: '🏘️', label: 'Neighbors / Community' },
      { emoji: '🛒', label: 'Customer Service / Retail' },
      { emoji: '🧑‍🏫', label: 'Academic / Educational' },
      { emoji: '🏥', label: 'Medical / Healthcare' }
    ]
  },
  {
    question: '😟 How would you describe the situation?',
    options: [
      { emoji: '⚡', label: 'There\'s unresolved conflict or tension' },
      { emoji: '😶', label: 'Something important went unsaid for too long' },
      { emoji: '🙅', label: 'I need to say no or set a boundary' },
      { emoji: '💔', label: 'Someone hurt me or let me down' },
      { emoji: '🗣️', label: 'I need to deliver difficult feedback' },
      { emoji: '🆘', label: 'I need to ask for help or support' },
      { emoji: '🤝', label: 'I need to negotiate or compromise' },
      { emoji: '🙇', label: 'I need to sincerely apologize' }
    ]
  },
  {
    question: '🎯 What outcome are you hoping for?',
    options: [
      { emoji: '🕊️', label: 'Resolve and restore the relationship' },
      { emoji: '🧹', label: 'Clear the air and move forward' },
      { emoji: '🔒', label: 'Set a firm boundary going forward' },
      { emoji: '💬', label: 'Simply be heard and understood' },
      { emoji: '⚖️', label: 'Reach a fair agreement or compromise' },
      { emoji: '🛑', label: 'De-escalate an angry or volatile situation' },
      { emoji: '💡', label: 'Gain clarity on where we both stand' },
      { emoji: '👋', label: 'End the relationship/engagement respectfully' }
    ]
  },
  {
    question: '🙋 How comfortable are you with direct conversation?',
    options: [
      { emoji: '😰', label: 'Very uncomfortable — I avoid confrontation' },
      { emoji: '😐', label: 'Somewhat — depends on the situation' },
      { emoji: '😌', label: 'Generally okay — I just need a framework' },
      { emoji: '💪', label: 'Comfortable — I just need the right words' },
      { emoji: '🔥', label: 'Too comfortable — I can come across aggressive' },
      { emoji: '🧊', label: 'I tend to shut down and give the silent treatment' },
      { emoji: '😢', label: 'I cry or get very emotional when confronting' },
      { emoji: '🌪️', label: 'I over-explain and lose my main point' }
    ]
  }
];

// Removed static RESULT_SCRIPT and RESULT_TIPS - using dynamic generation instead

// ── INIT ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  renderScenarios();
  initFilters();
  renderTips();
  renderTemplates();
  initWizard();
  initModal();
  initAnalyzer();
  initParticles();
  initScrollAnimations();
});

// ── SCROLL ANIMATIONS ───────────────────────────────────────
window.scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function initScrollAnimations() {
  observeElements(document.body);
}

function observeElements(container) {
  if (!container) return;
  container.querySelectorAll('.fade-in').forEach(el => window.scrollObserver.observe(el));
}

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
    const hiddenClass = (s.category !== 'work') ? ' hidden' : '';
    return '<div class="scenario-card fade-in' + hiddenClass + '" data-id="' + s.id + '" data-category="' + s.category + '" tabindex="0" role="button">' +
      '<div class="sc-icon">' + s.icon + '</div>' +
      '<div class="sc-tag ' + s.category + '">' + s.category + '</div>' +
      '<div class="sc-title">' + s.title + '</div>' +
      '<div class="sc-desc">' + s.desc + '</div>' +
      '</div>';
  }).join('');
  if (window.scrollObserver) observeElements(grid);

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
    return '<div class="tip-card fade-in">' +
      '<div class="tip-num">' + t.num + '</div>' +
      '<div><div class="tip-title">' + t.title + '</div>' +
      '<div class="tip-body">' + t.body + '</div></div>' +
      '</div>';
  }).join('');
  if (window.scrollObserver) observeElements(grid);
}

// ── TEMPLATES ────────────────────────────────────────────────

function renderTemplates() {
  const list = document.getElementById('templatesList');
  if (!list) return;
  list.innerHTML = TEMPLATES.map(function(t, i) {
    const idx = _store(t.text);
    return '<div class="template-item fade-in" id="tmpl-' + i + '">' +
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
      '<button class="btn btn-sm btn-outline" style="margin-top:16px" onclick="_cbCopy(this,' + idx + '); event.stopPropagation()">📋 Copy Template</button>' +
      '</div></div></div>';
  }).join('');
  if (window.scrollObserver) observeElements(list);
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
    stepLabel.textContent = 'Analyzing your situation ✨';
    backBtn.style.display = 'none';
    nextBtn.style.display = 'none'; // hide until done

    body.innerHTML = '<div style="text-align:center; padding: 40px 0;"><div class="ai-spinner" style="margin:0 auto 16px;"></div><p style="color:var(--text-muted)">Crafting your personalised strategy...</p></div>';

    // Kick off generation
    if (apiKeys.gemini || apiKeys.groq || apiKeys.openrouter) {
      runWizardAi(wizardAnswers).then(renderWizardResults).catch(function(err) {
        console.error(err);
        renderWizardResults(generateFallbackWizard(wizardAnswers));
      });
    } else {
      setTimeout(function() { renderWizardResults(generateFallbackWizard(wizardAnswers)); }, 800);
    }
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

// ── WIZARD DYNAMIC ENGINE ─────────────────────────────────────

function renderWizardResults(data) {
  var body = document.getElementById('wizardBody');
  var stepLabel = document.getElementById('stepLabel');
  var nextBtn = document.getElementById('wizardNext');
  
  stepLabel.textContent = 'Your Results ✨';
  nextBtn.style.display = 'inline-flex';
  nextBtn.textContent = '🔄 Start Over';

  var scriptIdx = _store(data.script);
  var tipsHtml = (data.tips || []).map(function(t) { return '<li>' + t + '</li>'; }).join('');

  body.innerHTML =
    '<div class="wizard-result">' +
    '<h3>🎯 Your Personalised Communication Strategy</h3>' +
    '<div class="result-script">' + data.script.replace(/\n/g, '<br>') + '</div>' +
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
}

function generateFallbackWizard(answers) {
  var areaIdx = answers[0] || 0;
  var sitIdx = answers[1] || 0;
  var goalIdx = answers[2] || 0;
  var comfIdx = answers[3] || 0;

  var script = "Start by choosing the right time and place — somewhere private and calm.\n\nOpen with:\n";
  if (areaIdx === 0) script += '"Do you have a moment to align on a recent situation? I want to make sure we are on the same page."\n\n';
  else if (areaIdx === 1) script += '"I love you and I want us to communicate well. There is something on my mind we need to discuss."\n\n';
  else script += '"I value our relationship and I want to be honest with you about something."\n\n';

  script += 'Then:\n';
  if (sitIdx === 0) script += '- Address the tension: "I’ve noticed some friction between us recently..."\n';
  else if (sitIdx === 1) script += '- Bring up the unsaid: "I haven\'t brought this up before, but..."\n';
  else if (sitIdx === 2) script += '- Draw a line: "I need to set a boundary regarding..."\n';
  else script += '- Express your feelings using "I feel" statements, without blaming.\n';

  script += '\nClose with:\n';
  if (goalIdx === 0) script += '"How can we solve this together so we can move forward?"';
  else if (goalIdx === 2) script += '"I hope you can respect this boundary moving forward."';
  else script += '"What are your thoughts on this?"';

  var tips = [
    'Take 3 deep breaths before you start — it slows your nervous system.',
    'Focus on the issue, not the person.'
  ];
  if (comfIdx === 0) tips.push('Write down your key points in advance so you don\'t lose track.');
  if (comfIdx === 3) tips.push('Make sure you listen as much as you speak.');
  else tips.push('If emotions run high, suggest a 5-minute pause.');

  return { script: script, tips: tips };
}

async function runWizardAi(answers) {
  var area = WIZARD_STEPS[0].options[answers[0] || 0].label;
  var sit = WIZARD_STEPS[1].options[answers[1] || 0].label;
  var goal = WIZARD_STEPS[2].options[answers[2] || 0].label;
  var comf = WIZARD_STEPS[3].options[answers[3] || 0].label;

  var prompt = "You are an expert communication coach.\n" +
    "The user needs a script to navigate a difficult conversation.\n" +
    "Area: " + area + "\n" +
    "Situation: " + sit + "\n" +
    "Goal: " + goal + "\n" +
    "Comfort Level: " + comf + "\n\n" +
    "Provide a highly effective, empathetic, and assertive script they can use. Also provide 3 actionable, specific psychological tips for them.\n" +
    "Return ONLY valid JSON in this format:\n" +
    "{\n" +
    '  "script": "<the multi-paragraph script>",\n' +
    '  "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]\n' +
    "}";

  // Use the existing provider fallback logic
  var providerChain = [];
  if (primaryProvider === 'gemini') { providerChain = ['gemini', 'groq', 'openrouter']; }
  else if (primaryProvider === 'groq') { providerChain = ['groq', 'gemini', 'openrouter']; }
  else { providerChain = ['openrouter', 'gemini', 'groq']; }

  for (var i = 0; i < providerChain.length; i++) {
    var p = providerChain[i];
    if (!apiKeys[p]) continue;
    try {
      if (p === 'gemini') return await _callGeminiWizard(apiKeys.gemini, prompt);
      if (p === 'groq') return await _callGroqWizard(apiKeys.groq, prompt);
      if (p === 'openrouter') return await _callOpenRouterWizard(apiKeys.openrouter, prompt);
    } catch (err) {
      console.warn(p + ' wizard failed:', err);
    }
  }
  throw new Error('All configured AI providers failed.');
}

async function _callGeminiWizard(key, prompt) {
  var res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + key, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json' } })
  });
  if (!res.ok) throw new Error('Gemini error');
  var data = await res.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
}

async function _callGroqWizard(key, prompt) {
  var res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST', headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama3-8b-8192', messages: [{ role: 'system', content: 'You always return valid JSON.'}, { role: 'user', content: prompt }] })
  });
  if (!res.ok) throw new Error('Groq error');
  var data = await res.json();
  var resultText = data.choices[0].message.content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(resultText);
}

async function _callOpenRouterWizard(key, prompt) {
  var res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST', headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json', 'HTTP-Referer': window.location.href, 'X-Title': 'CommBridge' },
    body: JSON.stringify({ model: 'openrouter/free', messages: [{ role: 'system', content: 'You always return valid JSON.'}, { role: 'user', content: prompt }] })
  });
  if (!res.ok) throw new Error('OpenRouter error');
  var data = await res.json();
  var resultText = data.choices[0].message.content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(resultText);
}

// ── UTILS ────────────────────────────────────────────────────

function showToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

// ── COMMSSCORE ANALYZER ───────────────────────────────────────

// Pattern libraries — each entry has a regex and a human label
const AGGRESSIVE = [
  { re: /\byou (always|never|constantly|keep)\b/gi,             label: 'Absolute accusation' },
  { re: /\byou'?re (so|such|just|completely|totally)\b/gi,      label: 'Character attack' },
  { re: /\bshut up\b/gi,                                         label: 'Dismissive command' },
  { re: /\bstop (being|doing|acting)\b/gi,                       label: 'Commanding' },
  { re: /\byou (should|must|have to|need to)\b/gi,              label: 'Demanding language' },
  { re: /\bthat'?s (stupid|ridiculous|absurd|dumb|wrong)\b/gi,  label: 'Dismissive framing' },
  { re: /\byour fault\b/gi,                                      label: 'Blame language' },
  { re: /\byou (don't|never) (listen|care|understand)\b/gi,     label: 'Blame language' },
  { re: /\beveryone (knows|agrees|thinks)\b/gi,                  label: 'False generalisation' },
  { re: /\byou (made|are making) me\b/gi,                        label: 'Externalising blame' },
  { re: /\bwhy (can'?t|don'?t|won'?t) you\b/gi,                label: 'Rhetorical blame' },
  { re: /\byou (are|were) (wrong|terrible|awful|bad)\b/gi,      label: 'Character judgment' },
];

const PASSIVE = [
  { re: /\bmaybe\b/gi,                                           label: 'Hedging' },
  { re: /\bi guess\b/gi,                                         label: 'Uncertainty hedge' },
  { re: /\bkind of\b/gi,                                         label: 'Minimising' },
  { re: /\bsort of\b/gi,                                         label: 'Minimising' },
  { re: /\bif that'?s okay\b/gi,                                 label: 'Permission-seeking' },
  { re: /\bif you don'?t mind\b/gi,                              label: 'Permission-seeking' },
  { re: /\bi'?m sorry (to bother|for (asking|interrupting))\b/gi, label: 'Excessive apology' },
  { re: /\bnever mind\b/gi,                                      label: 'Self-dismissal' },
  { re: /\bdoesn'?t matter\b/gi,                                 label: 'Self-dismissal' },
  { re: /\bi just wanted\b/gi,                                   label: 'Minimising opener' },
  { re: /\bi can'?t\b/gi,                                        label: 'Helplessness language' },
  { re: /\bwhatever\b/gi,                                        label: 'Disengagement' },
  { re: /\bi suppose\b/gi,                                       label: 'Uncertainty hedge' },
  { re: /\bno worries\b/gi,                                      label: 'Dismissing own needs' },
];

const ASSERTIVE = [
  { re: /\bi feel\b/gi,                                          label: 'Owns emotion ✓' },
  { re: /\bi need\b/gi,                                          label: 'Clear need ✓' },
  { re: /\bi'?d like\b/gi,                                       label: 'Assertive request ✓' },
  { re: /\bi appreciate\b/gi,                                    label: 'Positive framing ✓' },
  { re: /\bi understand\b/gi,                                    label: 'Empathy signal ✓' },
  { re: /\bi noticed\b/gi,                                       label: 'Objective observation ✓' },
  { re: /\bi believe\b/gi,                                       label: 'Confident stance ✓' },
  { re: /\bi'?m (concerned|worried) (about|that)\b/gi,          label: 'Owns concern ✓' },
  { re: /\blet'?s\b/gi,                                          label: 'Collaborative language ✓' },
  { re: /\bwe could\b/gi,                                        label: 'Collaborative language ✓' },
  { re: /\bi'?d appreciate\b/gi,                                 label: 'Assertive request ✓' },
  { re: /\bcan we\b/gi,                                          label: 'Inviting dialogue ✓' },
  { re: /\bwhat i'?m (hoping|looking) for\b/gi,                 label: 'States outcome ✓' },
];

// Smart rewrite substitution rules (order matters - specific rules first)
const REWRITE_RULES = [
  // Specific multi-word patterns first (before general "you never/always")
  [/\byou (don't|never) listen\b/gi, "I sometimes feel unheard"],
  [/\byou (don't|never) care\b/gi,  "I need to feel more cared for"],
  [/\byou (don't|never) understand\b/gi, "I'd love for us to understand each other better"],
  // General patterns
  [/\byou always\b/gi,              "I've noticed that you often"],
  [/\byou never\b/gi,               "I feel like sometimes you don't"],
  [/\byou constantly\b/gi,          "I've noticed that you frequently"],
  [/\byou keep\b/gi,                "I've noticed you continue to"],
  [/\byou should\b/gi,              "I'd really appreciate if you could"],
  [/\byou must\b/gi,                "I'd love it if you could"],
  [/\byou have to\b/gi,             "It would help me if you could"],
  [/\byou need to\b/gi,             "I need you to"],
  [/\byou made me\b/gi,             "I felt"],
  [/\byou are making me\b/gi,       "I'm feeling"],
  [/\byour fault\b/gi,              "something that affected me"],
  [/\bshut up\b/gi,                 "I need a moment to be heard too"],
  [/\byou('re| are) so\b/gi,        "I've been feeling"],
  [/\bmaybe i could\b/gi,           "I'd like to"],
  [/\bi guess i\b/gi,               "I"],
  [/\bkind of\b/gi,                 ""],
  [/\bsort of\b/gi,                 ""],
  [/\bif that'?s okay\b/gi,         ""],
  [/\bif you don'?t mind\b/gi,      ""],
  [/\bi just wanted\b/gi,           "I wanted"],
  [/\bnever mind\b/gi,              "actually, this matters to me"],
  [/\bdoesn'?t matter\b/gi,         "it does matter to me"],
  [/\bwhatever\b/gi,                "I'd like to find a solution"],
  [/\bi suppose\b/gi,               "I think"],
  [/\bi can'?t\b/gi,                "I find it difficult to"],
  [/\bwhy (can'?t|don'?t|won'?t) you\b/gi, "I'd love for you to"],
  [/\bthat'?s (stupid|ridiculous|absurd|dumb)\b/gi, "I see this differently"],
  [/\bno worries\b/gi,              "this is something that matters to me"],
];

// Smart opener suggestions when text is short or lacks assertive framing
const ASSERTIVE_OPENERS = [
  "I wanted to share something important with you.",
  "There's something on my mind I'd like to talk through.",
  "I value our relationship, and I want to be honest with you.",
  "I feel it's important to talk about this directly.",
];

let analyzerDebounce = null;
let lastRewriteText = '';
let lastAnalyzedText = '';
let apiKeys = { gemini: '', groq: '', openrouter: '' };
let primaryProvider = 'gemini';
let isAiAnalyzing = false;

function initAnalyzer() {
  const textarea = document.getElementById('analyzerInput');
  const copyBtn = document.getElementById('rewriteCopyBtn');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const analyzeHint = document.getElementById('analyzeHint');
  if (!textarea) return;

  // ── Load saved API key ──
  initApiKeyUI();

  // ── Input handler: just update word count + enable/disable button ──
  textarea.addEventListener('input', function() {
    updateWordCount(textarea.value);
    var hasText = textarea.value.trim().length >= 2;

    if (analyzeBtn) {
      analyzeBtn.disabled = !hasText || isAiAnalyzing;
    }

    if (!hasText) {
      resetAnalyzerUI();
      if (analyzeHint) analyzeHint.textContent = 'Type a message, then click to analyze';
    } else {
      if (analyzeHint) {
        if (apiKeys.gemini || apiKeys.groq || apiKeys.openrouter) {
          analyzeHint.textContent = 'Click the button or press Ctrl+Enter';
        } else {
          analyzeHint.textContent = 'Add an API key above to enable AI analysis';
        }
      }
    }
  });

  // ── Analyze button click ──
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', function() {
      triggerAnalysis(textarea);
    });
  }

  // ── Ctrl+Enter keyboard shortcut ──
  textarea.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      triggerAnalysis(textarea);
    }
  });

  // ── Copy button ──
  copyBtn && copyBtn.addEventListener('click', function() {
    if (!lastRewriteText) { showToast('Nothing to copy yet — analyze a message first!'); return; }
    navigator.clipboard.writeText(lastRewriteText)
      .then(function() {
        copyBtn.textContent = '\u2705 Copied!';
        copyBtn.disabled = true;
        setTimeout(function() { copyBtn.textContent = '\ud83d\udccb Copy Rewrite'; copyBtn.disabled = false; }, 2000);
        showToast('Smart rewrite copied! \u2728');
      })
      .catch(function() { showToast('Copy failed — please select and copy manually.'); });
  });
}

function triggerAnalysis(textarea) {
  var text = textarea.value.trim();
  if (!text || text.length < 2 || isAiAnalyzing) return;

  var analyzeBtn = document.getElementById('analyzeBtn');
  var analyzeHint = document.getElementById('analyzeHint');

  if (apiKeys.gemini || apiKeys.groq || apiKeys.openrouter) {
    // AI-powered analysis
    runAiAnalysis(text);
  } else {
    // Regex-only fallback
    runAnalysis(text);
    if (analyzeHint) analyzeHint.textContent = 'Using basic mode — add an API key for AI analysis';
  }
}

// ── API Key Management ────────────────────────────────────────

function initApiKeyUI() {
  // Load from URL first (to support sharing), then fallback to localStorage
  var urlParams = new URLSearchParams(window.location.search);
  
  apiKeys.gemini = urlParams.get('gemini') || localStorage.getItem('commbridge_gemini_key') || '';
  apiKeys.groq = urlParams.get('groq') || localStorage.getItem('commbridge_groq_key') || '';
  apiKeys.openrouter = urlParams.get('openrouter') || localStorage.getItem('commbridge_openrouter_key') || '';
  primaryProvider = urlParams.get('provider') || localStorage.getItem('commbridge_primary_provider') || 'gemini';

  // If keys were in URL, automatically save them to local storage so they persist
  if (urlParams.get('gemini')) localStorage.setItem('commbridge_gemini_key', apiKeys.gemini);
  if (urlParams.get('groq')) localStorage.setItem('commbridge_groq_key', apiKeys.groq);
  if (urlParams.get('openrouter')) localStorage.setItem('commbridge_openrouter_key', apiKeys.openrouter);
  if (urlParams.get('provider')) localStorage.setItem('commbridge_primary_provider', primaryProvider);

  updateApiKeyStatus();
  updateShareableUrl();

  var toggleBtn = document.getElementById('apiKeyToggle');
  var saveBtn = document.getElementById('apiKeySave');
  var clearBtn = document.getElementById('apiKeyClear');
  var panel = document.getElementById('apiKeyPanel');
  var input = document.getElementById('apiKeyInput');
  var providerSelect = document.getElementById('apiProvider');

  if (providerSelect) {
    providerSelect.value = primaryProvider;
    providerSelect.addEventListener('change', function() {
      primaryProvider = providerSelect.value;
      localStorage.setItem('commbridge_primary_provider', primaryProvider);
      updateApiInputForProvider();
    });
    updateApiInputForProvider();
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      panel.classList.toggle('open');
      toggleBtn.textContent = panel.classList.contains('open') ? 'Close' : 'Configure';
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      var key = input.value.trim();
      if (!key) { showToast('Please enter an API key'); return; }
      apiKeys[primaryProvider] = key;
      localStorage.setItem('commbridge_' + primaryProvider + '_key', key);
      panel.classList.remove('open');
      if (toggleBtn) toggleBtn.textContent = 'Configure';
      updateApiKeyStatus();
      updateShareableUrl();
      showToast(primaryProvider.toUpperCase() + ' API key saved! \u2728');
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      apiKeys[primaryProvider] = '';
      localStorage.removeItem('commbridge_' + primaryProvider + '_key');
      input.value = '';
      updateApiKeyStatus();
      updateShareableUrl();
      showToast(primaryProvider.toUpperCase() + ' key cleared.');
    });
  }
}

function updateShareableUrl() {
  var url = new URL(window.location.href);
  if (apiKeys.gemini) url.searchParams.set('gemini', apiKeys.gemini); else url.searchParams.delete('gemini');
  if (apiKeys.groq) url.searchParams.set('groq', apiKeys.groq); else url.searchParams.delete('groq');
  if (apiKeys.openrouter) url.searchParams.set('openrouter', apiKeys.openrouter); else url.searchParams.delete('openrouter');
  if (primaryProvider) url.searchParams.set('provider', primaryProvider); else url.searchParams.delete('provider');
  window.history.replaceState({}, '', url);
}

function updateApiInputForProvider() {
  var input = document.getElementById('apiKeyInput');
  var desc = document.getElementById('apiKeyDesc');
  if (!input || !desc) return;
  
  if (primaryProvider === 'gemini') {
    desc.innerHTML = 'Enter a free <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google Gemini API key</a> for AI-powered tone analysis. <strong>Keys are stored locally. The app will automatically fall back to other providers if your quota runs out.</strong>';
    input.value = apiKeys.gemini;
  } else if (primaryProvider === 'groq') {
    desc.innerHTML = 'Enter a free <a href="https://console.groq.com/keys" target="_blank" rel="noopener">Groq API key</a> for ultra-fast Llama 3 analysis. <strong>Keys are stored locally.</strong>';
    input.value = apiKeys.groq;
  } else if (primaryProvider === 'openrouter') {
    desc.innerHTML = 'Enter an <a href="https://openrouter.ai/keys" target="_blank" rel="noopener">OpenRouter API key</a> to access free and premium models. <strong>Keys are stored locally.</strong>';
    input.value = apiKeys.openrouter;
  }
}

function updateApiKeyStatus() {
  var statusEl = document.getElementById('apiKeyStatus');
  if (!statusEl) return;
  var hasAnyKey = apiKeys.gemini || apiKeys.groq || apiKeys.openrouter;
  if (hasAnyKey) {
    statusEl.textContent = '\u2713 AI mode active (' + primaryProvider + ')';
    statusEl.classList.add('active');
  } else {
    statusEl.textContent = 'No key set — using basic mode';
    statusEl.classList.remove('active');
  }
}

// ── Gemini AI Analysis ────────────────────────────────────────

async function runAiAnalysis(text) {
  var hasAnyKey = apiKeys.gemini || apiKeys.groq || apiKeys.openrouter;
  if (!hasAnyKey || !text.trim()) return;
  if (isAiAnalyzing) return;
  isAiAnalyzing = true;

  var analyzeBtn = document.getElementById('analyzeBtn');
  var analyzeHint = document.getElementById('analyzeHint');
  var statusEl = document.getElementById('analyzerStatus');

  if (analyzeBtn) {
    analyzeBtn.classList.add('loading');
    analyzeBtn.disabled = true;
    var btnText = analyzeBtn.querySelector('.analyze-btn-text');
    if (btnText) btnText.textContent = 'Analyzing...';
  }
  if (analyzeHint) analyzeHint.textContent = '';
  if (statusEl) {
    statusEl.innerHTML = '<span class="ai-loading"><span class="ai-spinner"></span>AI is analyzing your message...</span>';
  }

  const PROVIDER_ORDER = ['gemini', 'groq', 'openrouter'];
  var providersToTry = [primaryProvider];
  PROVIDER_ORDER.forEach(p => {
    if (p !== primaryProvider && apiKeys[p]) providersToTry.push(p);
  });

  var result = null;
  var finalErr = null;

  try {
    for (var i = 0; i < providersToTry.length; i++) {
      var provider = providersToTry[i];
      if (!apiKeys[provider]) continue;
      
      if (statusEl && i > 0) {
        statusEl.innerHTML = '<span class="ai-loading"><span class="ai-spinner"></span>Falling back to ' + provider + '...</span>';
      }
      
      try {
        if (provider === 'gemini') {
          result = await tryGemini(text);
        } else if (provider === 'groq') {
          result = await callGroq(text);
        } else if (provider === 'openrouter') {
          result = await callOpenRouter(text);
        }
        
        if (result) break; // Success!
      } catch (err) {
        console.warn(provider + ' failed:', err.message);
        finalErr = err;
      }
    }

    if (result) {
      applyAiResults(result, text);
      lastAnalyzedText = text;
      if (analyzeHint) analyzeHint.textContent = 'Analysis complete \u2714';
    } else {
      throw finalErr || new Error("All AI providers failed.");
    }
  } catch (err) {
    console.warn('AI analysis failed:', err ? err.message : 'Unknown');
    // Fall back to regex
    runAnalysis(text);
    if (statusEl) {
      var errStr = err ? err.message : "Error";
      var shortErr = errStr.length > 80 ? errStr.substring(0, 80) + '...' : errStr;
      statusEl.textContent = '\u26a0\ufe0f ' + shortErr;
    }
    if (analyzeHint) analyzeHint.textContent = 'AI failed — showing basic analysis. Try again later.';
  } finally {
    isAiAnalyzing = false;
    if (analyzeBtn) {
      analyzeBtn.classList.remove('loading');
      analyzeBtn.disabled = false;
      var btnText2 = analyzeBtn.querySelector('.analyze-btn-text');
      if (btnText2) btnText2.textContent = 'Analyze with AI';
    }
  }
}

async function tryGemini(text) {
  try {
    return await callGemini(text, 'gemini-2.0-flash');
  } catch (primaryErr) {
    console.warn('Primary Gemini model failed, trying fallback:', primaryErr.message);
    return await callGemini(text, 'gemini-2.0-flash-lite');
  }
}

async function callGemini(text, model) {
  model = model || 'gemini-2.0-flash';
  var prompt = [
    buildSystemPrompt(),
    "",
    "MESSAGE TO ANALYZE: \"" + text.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + "\""
  ].join("\n");

  var url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKeys.gemini;

  var response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
        responseMimeType: "application/json"
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    })
  });

  if (!response.ok) {
    var errData = await response.json().catch(function() { return {}; });
    var errMsg = (errData.error && errData.error.message) || 'API returned ' + response.status;
    console.error('Gemini API error:', errMsg, errData);
    throw new Error(errMsg);
  }

  var data = await response.json();

  // Check if response was blocked by safety filters
  if (data.promptFeedback && data.promptFeedback.blockReason) {
    console.warn('Gemini blocked response:', data.promptFeedback);
    throw new Error('Content blocked: ' + data.promptFeedback.blockReason);
  }

  var rawText = data.candidates && data.candidates[0] && data.candidates[0].content &&
                data.candidates[0].content.parts && data.candidates[0].content.parts[0] &&
                data.candidates[0].content.parts[0].text;

  if (!rawText) {
    // Check if candidate was blocked
    var finishReason = data.candidates && data.candidates[0] && data.candidates[0].finishReason;
    if (finishReason === 'SAFETY') {
      console.warn('Gemini safety block on candidate:', data.candidates[0]);
      throw new Error('Safety filter triggered — try rephrasing');
    }
    console.error('Empty Gemini response:', JSON.stringify(data));
    throw new Error('Empty response from Gemini');
  }

  // Strip markdown code fences if present
  rawText = rawText.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    return JSON.parse(rawText);
  } catch (parseErr) {
    console.error('Failed to parse Gemini JSON:', rawText);
    throw new Error('Invalid JSON from AI');
  }
}

function buildSystemPrompt() {
  return [
    "You are CommScore, an expert communication coach AI.",
    "Your job is to analyze ANY text a user types and provide a highly effective, emotionally intelligent rewrite.",
    "Rules:",
    "1. Always respond with valid JSON.",
    "2. If the text is gibberish/nonsensical, say so.",
    "3. The 'rewrite' MUST dramatically improve the message. Transform passive, aggressive, or passive-aggressive language into clear, mature, assertive, and respectful communication. NEVER just repeat the user's input.",
    "4. Even for short inputs (e.g. 'leave me alone'), expand them into polite but firm boundary statements.",
    "5. For 'patterns', you MUST dynamically identify phrases from the text that set the tone. Create at least 1-3 patterns for ANY text. Label them descriptively (e.g., 'Aggressive Blame', 'Overly Passive', 'Clear Boundary'). The 'phrase' must exactly match a substring in the user's text.",
    "Respond with ONLY valid JSON in this exact structure:",
    "{",
    '  "toneScore": <number from -100 to 100. CRITICAL SCALE: -100 = Extremely Passive. 0 = Perfectly Assertive. +100 = Extremely Aggressive. (Do NOT give 100 for assertive! Assertive must be exactly 0)>,',
    '  "toneLabel": "<one of: Passive, Slightly Passive, Assertive, Slightly Aggressive, Aggressive>",',
    '  "powerScore": <number 0-100. 0=Gibberish/Weak. 50=Average. 100=Highly effective, mature, respectful boundary setting>,',
    '  "scoreDesc": "<2-3 word descriptor like: Excellent communicator, Room to improve, High conflict risk>",',
    '  "patterns": [{"type": "<aggressive|passive|assertive>", "label": "<descriptive name>", "phrase": "<exact substring from the message>"}],',
    '  "rewrite": "<a highly effective, transformed, emotionally intelligent version of the message>",',
    '  "explanation": "<1-2 sentences explaining why the rewrite is better>"',
    "}"
  ].join('\n');
}

async function callGroq(text) {
  var response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKeys.groq
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: 'MESSAGE TO ANALYZE: "' + text + '"' }
      ],
      temperature: 0.3
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('Groq Error ' + response.status + ': ' + errorText);
  }
  var data = await response.json();
  var resultText = data.choices[0].message.content;
  return JSON.parse(resultText);
}

async function callOpenRouter(text) {
  var response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKeys.openrouter,
      'HTTP-Referer': window.location.href,
      'X-Title': 'CommBridge'
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: 'MESSAGE TO ANALYZE: "' + text + '"' }
      ],
      temperature: 0.3
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('OpenRouter Error ' + response.status + ': ' + errorText);
  }
  var data = await response.json();
  var resultText = data.choices[0].message.content;
  
  resultText = resultText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(resultText);
}

function applyAiResults(ai, originalText) {
  // ── Tone gauge ──
  var toneScore = Math.max(-100, Math.min(100, ai.toneScore || 0));
  setGaugeNeedle(toneScore);
  setGaugeToneLabel(ai.toneLabel || 'Analyzing...');

  // ── Power score ring ──
  var powerScore = Math.max(0, Math.min(100, ai.powerScore || 50));
  setScoreRing(powerScore, powerScore, ai.scoreDesc || '');

  // ── Patterns ──
  var patternsEl = document.getElementById('patternsList');
  if (patternsEl && ai.patterns && ai.patterns.length > 0) {
    patternsEl.innerHTML = ai.patterns.map(function(p) {
      return '<span class="pattern-badge badge-' + (p.type || 'assertive') + '">' + escapeHtml(p.label) + '</span>';
    }).join('');
  } else if (patternsEl) {
    patternsEl.innerHTML = '<span class="patterns-empty">No flagged patterns — looking good! \ud83c\udf89</span>';
  }

  // ── Annotated text (highlight detected phrases in original) ──
  var annotatedEl = document.getElementById('annotatedText');
  if (annotatedEl && ai.patterns && ai.patterns.length > 0) {
    var html = escapeHtml(originalText);
    // Sort patterns by phrase length descending to avoid partial replacements
    var sortedPatterns = ai.patterns.slice().sort(function(a, b) {
      return (b.phrase || '').length - (a.phrase || '').length;
    });
    sortedPatterns.forEach(function(p) {
      if (!p.phrase) return;
      var escaped = escapeHtml(p.phrase);
      var re = new RegExp('(' + escaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      html = html.replace(re, '<mark class="hl-' + (p.type || 'assertive') + '" title="' + escapeHtml(p.label) + '">$1</mark>');
    });
    annotatedEl.innerHTML = html;
  } else if (annotatedEl) {
    annotatedEl.innerHTML = escapeHtml(originalText);
  }

  // ── Rewrite ──
  var rewriteEl = document.getElementById('rewriteText');
  if (rewriteEl && ai.rewrite) {
    lastRewriteText = ai.rewrite;
    rewriteEl.innerHTML = escapeHtml(ai.rewrite);
  }

  // ── Status ──
  var statusEl = document.getElementById('analyzerStatus');
  if (statusEl) {
    var issues = (ai.patterns || []).filter(function(p) { return p.type !== 'assertive'; }).length;
    if (issues === 0) {
      statusEl.textContent = '\u2728 ' + (ai.toneLabel || 'Assertive') + ' — ' + (ai.explanation || 'strong communication');
    } else {
      statusEl.textContent = '\u26a0\ufe0f ' + issues + ' pattern' + (issues > 1 ? 's' : '') + ' flagged \u00b7 ' + (ai.toneLabel || 'Mixed') + ' (AI)';
    }
  }
}

function updateWordCount(text) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const el = document.getElementById('analyzerWordCount');
  if (el) el.textContent = words + (words === 1 ? ' word' : ' words');
}

function resetAnalyzerUI() {
  updateWordCount('');
  const statusEl = document.getElementById('analyzerStatus');
  if (statusEl) statusEl.textContent = 'Start typing to analyze ✨';

  setGaugeNeedle(0);
  setScoreRing(0, '—', 'Awaiting input');
  setGaugeToneLabel('—');

  const patternsList = document.getElementById('patternsList');
  if (patternsList) patternsList.innerHTML = '<span class="patterns-empty">Patterns appear as you type…</span>';

  const annotated = document.getElementById('annotatedText');
  if (annotated) annotated.innerHTML = 'Your annotated message will appear here.';

  const rewrite = document.getElementById('rewriteText');
  if (rewrite) rewrite.innerHTML = 'Your improved version will appear here.';

  lastRewriteText = '';
}

function runAnalysis(text) {
  if (!text.trim()) return;

  // ── Find all matches ─────────────────────────────────────────
  const aggressiveMatches = findMatches(text, AGGRESSIVE, 'aggressive');
  const passiveMatches    = findMatches(text, PASSIVE,    'passive');
  const assertiveMatches  = findMatches(text, ASSERTIVE,  'assertive');

  const agCount  = aggressiveMatches.length;
  const pasCount = passiveMatches.length;
  const assCount = assertiveMatches.length;
  const total    = agCount + pasCount + assCount;

  // ── Tone score: -1 (full passive) ↔ 0 (assertive) ↔ +1 (full aggressive)
  // Range used for gauge needle: -90° (passive) → 0° (assertive) → +90° (aggressive)
  let toneScore = 0; // −100 … +100
  if (total > 0) {
    toneScore = ((agCount - pasCount) / (agCount + pasCount + assCount)) * 100;
  }
  // Clamp
  toneScore = Math.max(-100, Math.min(100, toneScore));

  // Nudge score toward assertive if many assertive phrases
  if (assCount >= 2 && agCount === 0 && pasCount === 0) toneScore = 0;

  // ── Power Score (0–100, higher = more assertive + effective) ──
  const baseScore  = 50;
  const assBonus   = Math.min(assCount * 8, 30);
  const agPenalty  = Math.min(agCount * 10, 35);
  const pasPenalty = Math.min(pasCount * 6, 25);
  const words      = text.trim().split(/\s+/).length;
  const lengthBonus = words >= 10 && words <= 80 ? 5 : (words < 5 ? -10 : 0);

  let powerScore = baseScore + assBonus - agPenalty - pasPenalty + lengthBonus;
  powerScore = Math.max(0, Math.min(100, Math.round(powerScore)));

  // ── Descriptors ───────────────────────────────────────────────
  const { toneLabel, toneDesc, scoreDesc } = getDescriptors(toneScore, powerScore);

  // ── Annotated text ────────────────────────────────────────────
  const allMatches = [...aggressiveMatches, ...passiveMatches, ...assertiveMatches]
    .sort((a, b) => a.start - b.start);
  const annotatedHtml = buildAnnotatedHtml(text, allMatches);

  // ── Smart rewrite ─────────────────────────────────────────────
  const rewriteResult = buildSmartRewrite(text, agCount, pasCount, assCount);
  lastRewriteText = rewriteResult.plain;

  // ── Update UI ─────────────────────────────────────────────────
  updateAnalyzerStatus(agCount, pasCount, assCount, toneLabel);
  setGaugeNeedle(toneScore);
  setGaugeToneLabel(toneLabel);
  setScoreRing(powerScore, powerScore, scoreDesc);
  updatePatternBadges([...aggressiveMatches, ...passiveMatches, ...assertiveMatches]);

  const annotatedEl = document.getElementById('annotatedText');
  if (annotatedEl) annotatedEl.innerHTML = annotatedHtml || escapeHtml(text);

  const rewriteEl = document.getElementById('rewriteText');
  if (rewriteEl) rewriteEl.innerHTML = rewriteResult.html;
}

// ── Pattern matching ──────────────────────────────────────────

function findMatches(text, patterns, type) {
  const results = [];
  patterns.forEach(p => {
    let m;
    const re = new RegExp(p.re.source, p.re.flags.replace('g', '') + 'g');
    while ((m = re.exec(text)) !== null) {
      results.push({ start: m.index, end: m.index + m[0].length, text: m[0], label: p.label, type });
    }
  });
  return results;
}

// ── Annotated HTML builder (handles overlapping ranges) ──────

function buildAnnotatedHtml(text, matches) {
  if (!matches.length) return escapeHtml(text);

  // Merge overlapping intervals, priority: aggressive > passive > assertive
  const priority = { aggressive: 3, passive: 2, assertive: 1 };
  const sorted   = [...matches].sort((a, b) => a.start - b.start || priority[b.type] - priority[a.type]);

  const merged = [];
  sorted.forEach(m => {
    const last = merged[merged.length - 1];
    if (last && m.start < last.end) {
      // Overlap — keep higher-priority type
      if (priority[m.type] > priority[last.type]) {
        last.type  = m.type;
        last.label = m.label;
        last.end   = Math.max(last.end, m.end);
      } else {
        last.end = Math.max(last.end, m.end);
      }
    } else {
      merged.push({ ...m });
    }
  });

  let html = '';
  let cursor = 0;
  merged.forEach(m => {
    if (m.start > cursor) html += escapeHtml(text.slice(cursor, m.start));
    html += `<mark class="hl-${m.type}" title="${escapeHtml(m.label)}">${escapeHtml(text.slice(m.start, m.end))}</mark>`;
    cursor = m.end;
  });
  if (cursor < text.length) html += escapeHtml(text.slice(cursor));
  return html;
}

// ── Pattern badge sidebar ─────────────────────────────────────

function updatePatternBadges(matches) {
  const el = document.getElementById('patternsList');
  if (!el) return;
  if (!matches.length) {
    el.innerHTML = '<span class="patterns-empty">No flagged patterns — looking good! 🎉</span>';
    return;
  }

  // Deduplicate by label + type
  const seen  = new Set();
  const unique = matches.filter(m => {
    const key = m.type + '|' + m.label;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });

  el.innerHTML = unique.map(m =>
    `<span class="pattern-badge badge-${m.type}">${m.label}</span>`
  ).join('');
}

// ── Gauge needle (SVG rotation) ───────────────────────────────
// toneScore: −100 (passive) → 0 (assertive) → +100 (aggressive)
// Needle rotation: −90° → 0° → +90°

function setGaugeNeedle(toneScore) {
  const needle = document.getElementById('gaugeNeedle');
  if (!needle) return;
  const deg = (toneScore / 100) * 90;
  needle.style.transform = `rotate(${deg}deg)`;
}

function setGaugeToneLabel(label) {
  const el = document.getElementById('gaugeToneLabel');
  if (el) el.textContent = label;
}

// ── Score ring (SVG stroke-dashoffset) ───────────────────────

function setScoreRing(score, display, descriptor) {
  const circle = document.getElementById('scoreRingCircle');
  const numEl  = document.getElementById('scoreNumber');
  const descEl = document.getElementById('scoreDescriptor');
  const circumference = 251.3;

  if (circle) {
    const offset = circumference - (score / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }
  if (numEl)  numEl.textContent  = display === '—' ? '—' : display;
  if (descEl) descEl.textContent = descriptor;
}

// ── Status bar ────────────────────────────────────────────────

function updateAnalyzerStatus(agCount, pasCount, assCount, toneLabel) {
  const el = document.getElementById('analyzerStatus');
  if (!el) return;
  const issues = agCount + pasCount;
  if (issues === 0 && assCount === 0) {
    el.textContent = 'Analyzing…';
  } else if (issues === 0) {
    el.textContent = `✨ ${toneLabel} — strong communication`;
  } else {
    el.textContent = `⚠️ ${issues} pattern${issues > 1 ? 's' : ''} flagged · ${toneLabel}`;
  }
}

// ── Descriptors ───────────────────────────────────────────────

function getDescriptors(toneScore, powerScore) {
  let toneLabel, toneDesc;
  if (toneScore < -40)      { toneLabel = 'Passive';            toneDesc = "Your message plays it very safe -- consider being clearer about what you need."; }
  else if (toneScore < -15) { toneLabel = 'Slightly Passive';   toneDesc = "You're hedging a bit. Adding clear 'I' statements will strengthen your message."; }
  else if (toneScore <= 15) { toneLabel = 'Assertive \u2713';   toneDesc = "You're communicating clearly and respectfully -- well balanced."; }
  else if (toneScore <= 45) { toneLabel = 'Slightly Aggressive'; toneDesc = "Watch the intensity -- a few phrases may put the other person on the defensive."; }
  else                       { toneLabel = 'Aggressive';         toneDesc = "Several phrases here are likely to cause defensiveness or escalation."; }

  let scoreDesc;
  if (powerScore >= 80)      scoreDesc = 'Excellent communicator';
  else if (powerScore >= 65) scoreDesc = 'Strong & clear';
  else if (powerScore >= 50) scoreDesc = 'Room to strengthen';
  else if (powerScore >= 35) scoreDesc = 'Needs reworking';
  else                        scoreDesc = 'High risk of conflict';

  return { toneLabel, toneDesc, scoreDesc };
}

// ── Smart rewrite engine ──────────────────────────────────────

function buildSmartRewrite(originalText, agCount, pasCount, assCount) {
  if (!originalText.trim()) return { html: 'Your improved version will appear here.', plain: '' };

  let text = originalText;

  // Apply substitution rules
  REWRITE_RULES.forEach(([re, replacement]) => {
    text = text.replace(re, replacement);
  });

  // Collapse extra spaces introduced by empty replacements
  text = text.replace(/\s{2,}/g, ' ').trim();

  // Capitalise first character
  text = text.charAt(0).toUpperCase() + text.slice(1);

  // If there were aggressive patterns and text doesn't already start with an assertive opener
  const hasAssertiveOpener = /^i (feel|need|noticed|believe|think|want|appreciate|understand)/i.test(text);
  if (agCount > 0 && !hasAssertiveOpener) {
    const opener = ASSERTIVE_OPENERS[Math.floor(Math.random() * ASSERTIVE_OPENERS.length)];
    text = opener + ' ' + text.charAt(0).toLowerCase() + text.slice(1);
  }

  // Ensure sentence ends with punctuation
  if (text && !/[.!?]$/.test(text.trim())) text = text.trim() + '.';

  const plain = text;
  const html  = escapeHtml(text).replace(/\n/g, '<br>');

  return { html, plain };
}

// ── HTML escape ───────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── INTERACTIVE 3D PARTICLE BACKGROUND ────────────────────────

function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // ── Config ──
  const PARTICLE_COUNT = 280;
  const CONNECT_DIST = 250;
  const MOUSE_RADIUS = 200;
  const MOUSE_FORCE = 0.06;
  const BASE_SPEED = 0.35;
  const DEPTH_LAYERS = 3;

  // ── State ──
  let W, H;
  let mouseX = -9999, mouseY = -9999;
  let scrollY = 0;
  let particles = [];
  let animId;

  // ── Colors matching the design system ──
  const COLORS = [
    { r: 59, g: 54,  b: 156 },   // vibrant indigo
    { r: 10, g: 122, b: 92 },    // vibrant emerald
    { r: 138, g: 15,  b: 15 }    // vibrant crimson
  ];

  // ── Particle class ──
  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.z = Math.random();  // 0 (far) → 1 (close)
    this.layer = Math.floor(this.z * DEPTH_LAYERS);
    var sizeRange = 1.5 + this.z * 2.5;  // far particles smaller
    this.radius = sizeRange + Math.random() * 2;
    this.baseRadius = this.radius;
    // Velocity — deeper particles move slower (parallax feel)
    var speed = BASE_SPEED * (0.3 + this.z * 0.7);
    var angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    // Pick a color
    var c = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.r = c.r; this.g = c.g; this.b = c.b;
    // Opacity — deeper particles are dimmer
    this.baseAlpha = 0.45 + this.z * 0.5;
    this.alpha = this.baseAlpha;
    // Pulse phase
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.01 + Math.random() * 0.02;
  };

  Particle.prototype.update = function(dt) {
    // Pulse glow
    this.pulse += this.pulseSpeed;
    var pulseFactor = 1 + Math.sin(this.pulse) * 0.25;
    this.radius = this.baseRadius * pulseFactor;
    this.alpha = this.baseAlpha * (0.7 + Math.sin(this.pulse) * 0.3);

    // Move
    this.x += this.vx;
    this.y += this.vy;

    var parallaxY = scrollY * (0.05 + this.z * 0.15);
    var parallaxX = (mouseX !== -9999 ? (mouseX - W/2) * (0.05 + this.z * 0.1) : 0);

    // Wrap rendered coordinates so they are always visible on screen
    var rx = (this.x - parallaxX) % (W + 40);
    if (rx < -20) rx += W + 40;
    var ry = (this.y - parallaxY) % (H + 40);
    if (ry < -20) ry += H + 40;
    
    this.renderX = rx;
    this.renderY = ry;

    // Mouse repulsion based on visual position
    var dx = this.renderX - mouseX;
    var dy = this.renderY - mouseY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < MOUSE_RADIUS && dist > 0) {
      var force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE * (1 + this.z);
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
      // Brighten near cursor
      this.alpha = Math.min(1, this.alpha + 0.2 * (1 - dist / MOUSE_RADIUS));
      this.radius = this.baseRadius * pulseFactor * (1 + 0.5 * (1 - dist / MOUSE_RADIUS));
    }

    // Damping
    this.vx *= 0.995;
    this.vy *= 0.995;

    // Clamp velocity
    var maxV = BASE_SPEED * 2;
    var v = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (v > maxV) { this.vx = (this.vx / v) * maxV; this.vy = (this.vy / v) * maxV; }
  };

  Particle.prototype.draw = function() {
    // Outer glow
    ctx.beginPath();
    ctx.arc(this.renderX, this.renderY, this.radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + (this.alpha * 0.15) + ')';
    ctx.fill();

    // Core dot
    ctx.beginPath();
    ctx.arc(this.renderX, this.renderY, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.alpha + ')';
    ctx.fill();
  };

  // ── Connection lines ──
  function drawConnections() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var a = particles[i], b = particles[j];
        // Only connect same or adjacent depth layers
        if (Math.abs(a.layer - b.layer) > 1) continue;
        var dx = a.renderX - b.renderX;
        var dy = a.renderY - b.renderY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          var opacity = (1 - dist / CONNECT_DIST) * 0.5 * Math.min(a.alpha, b.alpha) / 0.6;
          // Blend colors
          var cr = Math.round((a.r + b.r) / 2);
          var cg = Math.round((a.g + b.g) / 2);
          var cb = Math.round((a.b + b.b) / 2);
          ctx.beginPath();
          ctx.moveTo(a.renderX, a.renderY);
          ctx.lineTo(b.renderX, b.renderY);
          ctx.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + opacity + ')';
          ctx.lineWidth = 0.8 + Math.min(a.z, b.z) * 1.0;
          ctx.stroke();
        }
      }
    }
  }

  // ── Mouse glow halo ──
  function drawMouseGlow() {
    if (mouseX < -1000) return;
    var grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, MOUSE_RADIUS * 1.2);
    grad.addColorStop(0,   'rgba(30, 27, 75, 0.08)');
    grad.addColorStop(0.5, 'rgba(6, 78, 59, 0.03)');
    grad.addColorStop(1,   'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(mouseX - MOUSE_RADIUS * 1.5, mouseY - MOUSE_RADIUS * 1.5,
                 MOUSE_RADIUS * 3, MOUSE_RADIUS * 3);
  }

  // ── Resize ──
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  // ── Create particles ──
  function createParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  // ── Animation loop ──
  function animate() {
    ctx.clearRect(0, 0, W, H);

    // Update + draw particles (sorted by depth — far ones first)
    particles.sort(function(a, b) { return a.z - b.z; });
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
    }

    drawConnections();
    drawMouseGlow();

    for (var i = 0; i < particles.length; i++) {
      particles[i].draw();
    }

    animId = requestAnimationFrame(animate);
  }

  // ── Event listeners ──
  window.addEventListener('resize', function() {
    resize();
  });

  // Track mouse (use document, not canvas, since canvas has pointer-events:none)
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', function() {
    mouseX = -9999;
    mouseY = -9999;
  });

  // Track scroll for parallax
  window.addEventListener('scroll', function() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
  }, { passive: true });

  // Touch support
  document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  document.addEventListener('touchend', function() {
    mouseX = -9999;
    mouseY = -9999;
  });

  // ── Start ──
  resize();
  createParticles();
  animate();

  // ── Performance: pause when tab hidden ──
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animate();
    }
  });
}
