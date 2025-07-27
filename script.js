/**
 * script.js — المنطق البرمجي المنظم لـ English Mastery
 *  - تقسيم إلى وحدات (Modules)
 *  - لكل وحدة اختبار مكوّن من سؤالين مميزين
 *  - إدارة الحالة، العرض، الوقت، والحفظ في localStorage
 *  - أحداث معيارية تسهّل التوسعة لاحقاً
 */

/* ────────────────────────────────────────────────────────────────────────── */
/* 1. DATA MODULE — بيانات الوحدات والأسئلة لكل وحدة                         */
/* ────────────────────────────────────────────────────────────────────────── */
const DataModule = (() => {
  // تعريف الوحدات
  const units = [
    { id: 1, title: "الوحدة الأولى", description: "القواعد الأساسية والكلمات الشائعة", icon: "fas fa-book-open" },
    { id: 2, title: "الوحدة الثانية", description: "الأزمنة البسيطة", icon: "fas fa-clock" },
    { id: 3, title: "الوحدة الثالثة", description: "الأزمنة المستمرة", icon: "fas fa-hourglass-half" },
    { id: 4, title: "الوحدة الرابعة", description: "المبني للمعلوم والمجهول", icon: "fas fa-exchange-alt" },
    { id: 5, title: "الوحدة الخامسة", description: "الأسماء والضمائر", icon: "fas fa-font" },
    { id: 6, title: "الوحدة السادسة", description: "الصفات والظروف", icon: "fas fa-adjust" },
    { id: 7, title: "الوحدة السابعة", description: "أدوات الربط", icon: "fas fa-link" },
    { id: 8, title: "الوحدة الثامنة", description: "الجمل الشرطية", icon: "fas fa-code-branch" },
    { id: 9, title: "الوحدة التاسعة", description: "المقارنات", icon: "fas fa-balance-scale" },
    { id: 10, title: "الوحدة العاشرة", description: "المصادر والأفعال الناقصة", icon: "fas fa-infinity" },
    { id: 11, title: "الوحدة الحادية عشر", description: "الاختبارات المتقدمة", icon: "fas fa-graduation-cap" },
    { id: 12, title: "الوحدة الثانية عشر", description: "المراجعة النهائية", icon: "fas fa-star" }
  ];

  // لكل وحدة، اختبار مكوّن من سؤالين فريدين
  const quizData = {
    1: [
      {
        id: "1_1",
        question: "اختر الشكل الصحيح للمضيّر من 'to be' في الجملة: 'She ___ happy.'",
        options: ["is", "are", "am", "be"],
        correctIndex: 0
      },
      {
        id: "1_2",
        question: "ما معنى الكلمة 'book' عندما تأتي كفعل؟",
        options: ["ينام", "يحجز", "يكتب", "يقفز"],
        correctIndex: 1
      }
    ],
    2: [
      {
        id: "2_1",
        question: "في زمن الـ Simple Past: 'They ___ football yesterday.' أيُّ صيغة صحيحة؟",
        options: ["play", "played", "plays", "playing"],
        correctIndex: 1
      },
      {
        id: "2_2",
        question: "ما هي الصيغة الصحيحة لـ 'I ___ you last week.'؟",
        options: ["call", "called", "calling", "calls"],
        correctIndex: 1
      }
    ],
    3: [
      {
        id: "3_1",
        question: "الجملة الصحيحة في الـ Present Continuous: 'We ___ dinner now.'؟",
        options: ["eat", "eats", "are eating", "eating"],
        correctIndex: 2
      },
      {
        id: "3_2",
        question: "اختر الشكل الصحيح: 'He ___ TV at the moment.'",
        options: ["watches", "watching", "is watching", "watched"],
        correctIndex: 2
      }
    ],
    4: [
      {
        id: "4_1",
        question: "حوّل الجملة للمبني للمجهول: 'They build the house.'",
        options: [
          "The house built by them.",
          "The house is built by them.",
          "The house was built by them.",
          "The house being built by them."
        ],
        correctIndex: 2
      },
      {
        id: "4_2",
        question: "اختر الشكل الصحيح للمبني للمعلوم: 'The letter ___ yesterday.'",
        options: ["is sent", "was sent", "sent", "sends"],
        correctIndex: 1
      }
    ],
    5: [
      {
        id: "5_1",
        question: "اختر الضمير المناسب في الفراغ: 'This is ___ book.'",
        options: ["mine", "my", "me", "I"],
        correctIndex: 0
      },
      {
        id: "5_2",
        question: "ما الفرق بين 'they' و 'them'؟",
        options: [
          "ذكر وأنثى",
          "مفرد وجمع",
          "فاعل ومفعول به",
          "ماضي ومستقبل"
        ],
        correctIndex: 2
      }
    ],
    6: [
      {
        id: "6_1",
        question: "اختر الصفة الصحيحة: 'She is a very ___ person.'",
        options: ["quickly", "quick", "quicker", "quickest"],
        correctIndex: 1
      },
      {
        id: "6_2",
        question: "حدد الظروف من بين الخيارات:",
        options: ["happy", "quickly", "large", "small"],
        correctIndex: 1
      }
    ],
    7: [
      {
        id: "7_1",
        question: "أيُّ أداة ربط تُستخدم للربط بين جملتين متعارضتين؟",
        options: ["and", "but", "or", "so"],
        correctIndex: 1
      },
      {
        id: "7_2",
        question: "اختر أداة الربط المناسبة: 'I’ll go ___ you come.'",
        options: ["unless", "and", "because", "so"],
        correctIndex: 0
      }
    ],
    8: [
      {
        id: "8_1",
        question: "اكمل الجملة الشرطية: 'If it rains, we ___ at home.'",
        options: ["stay", "will stay", "stayed", "staying"],
        correctIndex: 1
      },
      {
        id: "8_2",
        question: "أيُّ نوع من الجمل الشرطية في المثال: 'If I were rich...'؟",
        options: ["Type 0", "Type 1", "Type 2", "Type 3"],
        correctIndex: 2
      }
    ],
    9: [
      {
        id: "9_1",
        question: "اختر المقارنة الصحيحة: 'This book is ___ that one.'",
        options: ["more interesting", "interestinger", "most interesting", "as interesting"],
        correctIndex: 0
      },
      {
        id: "9_2",
        question: "أيُّ صيغة للمقارنة تُستخدم للمساواة؟",
        options: ["as ... as", "more ... than", "less ... than", "the ... est"],
        correctIndex: 0
      }
    ],
    10: [
      {
        id: "10_1",
        question: "ما المصدر الصحيح للفعل 'to write'؟",
        options: ["writing", "wrote", "written", "writes"],
        correctIndex: 0
      },
      {
        id: "10_2",
        question: "اختر الفعل الناقص في الفراغ: 'She ___ arrive soon.'",
        options: ["can", "arrived", "will", "is"],
        correctIndex: 0
      }
    ],
    11: [
      {
        id: "11_1",
        question: "في اختبار المتقدم: أيُّ زمن تُستخدم فيه 'had been doing'؟",
        options: ["Past Perfect", "Past Continuous", "Past Perfect Continuous", "Present Perfect Continuous"],
        correctIndex: 2
      },
      {
        id: "11_2",
        question: "ما الفرق بين 'must' و 'have to'؟",
        options: [
          "لا فرق",
          "تعبر عن ضرورة داخلية وخارجية",
          "واجب وغير واجب",
          "مستقبل وماضي"
        ],
        correctIndex: 1
      }
    ],
    12: [
      {
        id: "12_1",
        question: "الاختبار النهائي: ما صيغة الـ Present Perfect؟",
        options: ["have + past participle", "has + present participle", "had + past participle", "will have + past participle"],
        correctIndex: 0
      },
      {
        id: "12_2",
        question: "في مراجعة كاملة: اختر الزمن الصحيح: 'They ___ here since morning.'",
        options: ["are working", "have been working", "worked", "work"],
        correctIndex: 1
      }
    ]
  };

  return { units, quizData };
})();

/* ────────────────────────────────────────────────────────────────────────── */
/* 2. TIMER MODULE — إدارة المؤقت والعد التنازلي                                */
/* ────────────────────────────────────────────────────────────────────────── */
const TimerModule = (() => {
  let duration = 0;        // بالثواني
  let intervalId = null;
  let onTick = null;
  let onExpire = null;

  function start(initialSeconds, tickCallback, expireCallback) {
    stop();
    duration = initialSeconds;
    onTick = tickCallback;
    onExpire = expireCallback;

    // أول عرض
    onTick(formatTime(duration));

    intervalId = setInterval(() => {
      duration--;
      if (duration < 0) {
        stop();
        onExpire();
      } else {
        onTick(formatTime(duration));
      }
    }, 1000);
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return { start, stop };
})();

/* ────────────────────────────────────────────────────────────────────────── */
/* 3. QUIZ ENGINE MODULE — منطق الاختبار والحساب                              */
/* ────────────────────────────────────────────────────────────────────────── */
const QuizEngine = (() => {
  let currentUnitId = null;
  let questions = [];
  let answers = [];
  let startTime = null;
  let onUpdateProgress = null;

  function init(unitId, updateProgressCb) {
    currentUnitId = unitId;
    questions = DataModule.quizData[unitId].map(q => ({ ...q }));
    answers = Array(questions.length).fill(null);
    startTime = Date.now();
    onUpdateProgress = updateProgressCb;
  }

  function answerQuestion(index, optionIndex) {
    answers[index] = optionIndex;
    onUpdateProgress(calculateProgress());
  }

  function calculateProgress() {
    const answered = answers.filter(a => a !== null).length;
    return { current: answered, total: questions.length };
  }

  function getQuestion(index) {
    return questions[index];
  }

  function getTotalQuestions() {
    return questions.length;
  }

  function getAnswers() {
    return answers;
  }

  function getElapsedTime() {
    return Math.floor((Date.now() - startTime) / 1000);
  }

  function calculateResults() {
    const correctCount = questions.reduce((sum, q, idx) =>
      sum + (answers[idx] === q.correctIndex ? 1 : 0), 0);
    const wrongCount = questions.length - correctCount;
    const percent = Math.round((correctCount / questions.length) * 100);
    return { correctCount, wrongCount, total: questions.length, percent };
  }

  return {
    init,
    answerQuestion,
    getQuestion,
    getTotalQuestions,
    getAnswers,
    getElapsedTime,
    calculateResults
  };
})();

/* ────────────────────────────────────────────────────────────────────────── */
/* 4. UI CONTROLLER MODULE — التعامل مع الـ DOM والعرض                        */
/* ────────────────────────────────────────────────────────────────────────── */
const UIController = (() => {
  // Sections
  const sections = {
    units: document.getElementById("units-section"),
    quiz: document.getElementById("quiz-section"),
    results: document.getElementById("results-section")
  };

  // عناصر عامة
  const unitsContainer     = document.querySelector(".units-container");
  const quizContainer      = document.querySelector(".quiz-container");
  const progressBarEl      = document.querySelector(".progress-bar");
  const progressTextEl     = document.querySelector(".progress-text");
  const timerEl            = document.getElementById("time");
  const currentUnitEl      = document.getElementById("current-unit");
  const prevBtn            = document.getElementById("prev-question");
  const nextBtn            = document.getElementById("next-question");
  const submitBtn          = document.getElementById("submit-quiz");
  const scoreEl            = document.getElementById("score");
  const totalEl            = document.getElementById("total");
  const correctEl          = document.getElementById("correct-count");
  const wrongEl            = document.getElementById("wrong-count");
  const percentEl          = document.getElementById("percentage");
  const timeTakenEl        = document.getElementById("time-taken");
  const backUnitsBtn       = document.getElementById("back-to-units");
  const backTestsBtn       = document.getElementById("back-to-tests-from-results");

  let currentQuestionIdx = 0;

  // تفعيل وحدة العرض فقط
  function show(sectionName) {
    Object.values(sections).forEach(sec => sec.classList.remove("active"));
    sections[sectionName].classList.add("active");
  }

  // رسم بطاقة كل وحدة
  function renderUnits() {
    unitsContainer.innerHTML = "";
    DataModule.units.forEach(u => {
      const card = document.createElement("div");
      card.className = "unit-card";
      card.innerHTML = `
        <i class="${u.icon}"></i>
        <h3>${u.title}</h3>
        <p>${u.description}</p>`;
      card.addEventListener("click", () => onUnitSelect(u.id, u.title));
      unitsContainer.append(card);
    });
    show("units");
  }

  // عند اختيار وحدة
  function onUnitSelect(unitId, title) {
    QuizEngine.init(unitId, updateProgress);
    currentQuestionIdx = 0;
    currentUnitEl.textContent = title;
    renderQuestion();
    TimerModule.start(300, updateTimer, onTimeExpire);
    show("quiz");
  }

  // عرض السؤال الحالي
  function renderQuestion() {
    const q     = QuizEngine.getQuestion(currentQuestionIdx);
    const total = QuizEngine.getTotalQuestions();
    quizContainer.innerHTML = `
      <div class="question-number">السؤال ${currentQuestionIdx + 1} من ${total}</div>
      <div class="question-text">${q.question}</div>
      <div class="options">
        ${q.options.map((opt, i) => `
          <label class="option">
            <input type="radio" name="ans" value="${i}" ${QuizEngine.getAnswers()[currentQuestionIdx] === i ? "checked" : ""}>
            <span class="checkmark"></span>
            <span>${opt}</span>
          </label>
        `).join("")}
      </div>
    `;
    updateProgress(QuizEngine.calculateProgress());
    bindOptionEvents();
    updateNavButtons();
  }

  // ربط أحداث الاختيارات
  function bindOptionEvents() {
    document.querySelectorAll("input[name='ans']").forEach(inp => {
      inp.addEventListener("change", e => {
        QuizEngine.answerQuestion(currentQuestionIdx, +e.target.value);
      });
    });
  }

  // تحديث شريط التقدم والنص
  function updateProgress({ current, total }) {
    const pct = Math.round((current / total) * 100);
    progressBarEl.style.width = pct + "%";
    progressTextEl.textContent = `أُجِيب على ${current} من ${total}`;
  }

  // تحديث المؤقت على الشاشة
  function updateTimer(formatted) {
    timerEl.textContent = formatted;
  }

  // انتهاء الوقت
  function onTimeExpire() {
    alert("انتهى الوقت! سيتم إرسال إجاباتك الآن.");
    submitQuiz();
  }

  // تحديث حالة أزرار التنقل
  function updateNavButtons() {
    prevBtn.disabled = currentQuestionIdx === 0;
    nextBtn.disabled = currentQuestionIdx === QuizEngine.getTotalQuestions() - 1;
  }

  // الانتقال للسؤال السابق
  prevBtn.addEventListener("click", () => {
    if (currentQuestionIdx > 0) {
      currentQuestionIdx--;
      renderQuestion();
    }
  });

  // الانتقال للسؤال التالي
  nextBtn.addEventListener("click", () => {
    if (currentQuestionIdx < QuizEngine.getTotalQuestions() - 1) {
      currentQuestionIdx++;
      renderQuestion();
    }
  });

  // تقديم الاختبار وعرض النتائج
  function submitQuiz() {
    TimerModule.stop();
    const results = QuizEngine.calculateResults();
    const elapsed = QuizEngine.getElapsedTime();
    // حفظ في localStorage
    const key = `results_unit_${QuizEngine.currentUnitId}`;
    localStorage.setItem(key, JSON.stringify({ ...results, elapsed }));

    // عرض
    scoreEl.textContent   = results.correctCount;
    totalEl.textContent   = results.total;
    correctEl.textContent = results.correctCount;
    wrongEl.textContent   = results.wrongCount;
    percentEl.textContent = results.percent;
    timeTakenEl.textContent= `${elapsed} ثانية`;
    show("results");
  }

  // زر العودة للوحدات
  backUnitsBtn.addEventListener("click", renderUnits);
  backTestsBtn.addEventListener("click", renderUnits);

  // تهيئة العرض عند بدء التطبيق
  function init() {
    renderUnits();
  }

  return { init };
})();

/* ────────────────────────────────────────────────────────────────────────── */
/* 5. التطبيق الرئيسي — انطلاقة عند تحميل DOM                                */
/* ────────────────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  UIController.init();
});