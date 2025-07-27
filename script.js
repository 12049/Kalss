/**
 * script.js — المنطق الكامل لمنصة English Mastery
 * يحتوي على:
 *  1. DataModule لتحميل الأسئلة ديناميكيًا من tests.json
 *  2. TimerModule لإدارة المؤقت والعد التنازلي
 *  3. QuizEngine لحساب الإجابات والنتائج
 *  4. UIController لربط البيانات بالصفحة والتفاعل مع DOM
 *  5. ResultsStorage وResultsUI للحفظ، العرض، والتصدير
 *  6. ThemeToggle وScrollToTop لتحسين تجربة المستخدم
 *
 * ⬇️ ملاحظة: كل سطر مشروح تحته حتى تتمكن من التعديل بسهولة.
 */

/* ==========================================================================
   0. DataModule — تحميل بيانات الوحدات والأسئلة من tests.json
   ========================================================================== */
const DataModule = (() => {

  // 1. قائمة الوحدات الثابتة (يمكنك تعديل العناوين والوصف والأيقونات هنا)
  const units = [
    { id: 1, title: "الوحدة الأولى",   description: "القواعد الأساسية والكلمات الشائعة", icon: "fas fa-book-open" },
    { id: 2, title: "الوحدة الثانية",  description: "الأزمنة البسيطة",                   icon: "fas fa-clock" },
    { id: 3, title: "الوحدة الثالثة",  description: "الأزمنة المستمرة",                   icon: "fas fa-hourglass-half" },
    { id: 4, title: "الوحدة الرابعة",  description: "المبني للمعلوم والمجهول",           icon: "fas fa-exchange-alt" },
    { id: 5, title: "الوحدة الخامسة",  description: "الأسماء والضمائر",                   icon: "fas fa-font" },
    { id: 6, title: "الوحدة السادسة",  description: "الصفات والظروف",                     icon: "fas fa-adjust" },
    { id: 7, title: "الوحدة السابعة",  description: "أدوات الربط",                        icon: "fas fa-link" },
    { id: 8, title: "الوحدة الثامنة",  description: "الجمل الشرطية",                      icon: "fas fa-code-branch" },
    { id: 9, title: "الوحدة التاسعة",  description: "المقارنات",                           icon: "fas fa-balance-scale" },
    { id: 10, title: "الوحدة العاشرة", description: "المصادر والأفعال الناقصة",           icon: "fas fa-infinity" },
    { id: 11, title: "الوحدة الحادية عشر", description: "الاختبارات المتقدمة",            icon: "fas fa-graduation-cap" },
    { id: 12, title: "الوحدة الثانية عشر", description: "المراجعة النهائية",              icon: "fas fa-star" }
  ];
  // انتهى تعريف الوحدات

  // 2. هيكل الأسئلة بعد التحميل: سيصبح كائنًا unitId → مصفوفة الأسئلة
  let quizData = {};

  /**
   * loadQuizData — دالة تحميل JSON الخاص بالأسئلة
   * تقوم بقراءة tests.json ووزع الأسئلة حسب unitId
   */
  async function loadQuizData() {
    // 2.1. استدعاء الملف عبر fetch
    const response = await fetch('tests.json');
    // 2.2. تحويل الاستجابة إلى مصفوفة JS
    const allQuestions = await response.json();
    // 2.3. تقسيم الأسئلة حسب الوحدة
    quizData = allQuestions.reduce((acc, question) => {
      const uid = question.unitId;               // عدد الوحدة
      if (!acc[uid]) acc[uid] = [];              // إذا لم توجد مصفوفة بعد
      acc[uid].push(question);                   // أضف السؤال للهذا المعرف
      return acc;                                 // ارجع الكائن للتجميع
    }, {});
    // بعد هنا، quizData[1] = مصفوفة أسئلة الوحدة الأولى، وهكذا
  }

  /**
   * getUnits — دالة لإرجاع قائمة الوحدات
   * تُستخدم عند بناء واجهة قائمة الوحدات
   */
  function getUnits() {
    return units;
  }

  /**
   * getQuestions — الإرجاع الأسئلة لوحدة معينة
   * @param {number} unitId — معرف الوحدات
   * @returns مصفوفة الأسئلة الخاصة بالوحدة
   */
  function getQuestions(unitId) {
    return quizData[unitId] || [];
  }

  // كشف واجهة الموديول: دوال التحميل والاستعلام
  return {
    loadQuizData,
    getUnits,
    getQuestions
  };
})(); // نهاية DataModule IIFE


/* ==========================================================================
   1. TimerModule — إدارة المؤقت (Countdown) وعرض الوقت
   ========================================================================== */
const TimerModule = (() => {
  let intervalId = null; // معرّف setInterval لإمكانية الإيقاف لاحقًا

  /**
   * start — بدء العد التنازلي
   * @param {number} seconds — الزمن الابتدائي (بالثواني)
   * @param {function} onTick — يُستدعى كل ثانية مع الوقت المُنسّق
   * @param {function} onExpire — يُستدعى عند انتهاء الوقت
   */
  function start(seconds, onTick, onExpire) {
    // 1. أوقف أي مؤقت سابق
    clear();
    // 2. عرض الوقت الأصلي فورًا
    onTick(formatTime(seconds));

    // 3. الحددي الزمني الثانوي
    intervalId = setInterval(() => {
      seconds--;                  // إنقاص ثانية
      if (seconds < 0) {
        clear();                  // أوقف المؤقت
        onExpire();               // نفذ دالة انتهاء الوقت
      } else {
        onTick(formatTime(seconds)); // حدّث العرض
      }
    }, 1000);
  }

  /**
   * clear — إيقاف المؤقت إذا كان يعمل
   */
  function clear() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  /**
   * formatTime — تحويل ثواني إلى "MM:SS"
   * @param {number} sec — عدد الثواني
   * @returns {string} — مثال: "04:59"
   */
  function formatTime(sec) {
    const minutes = Math.floor(sec / 60).toString().padStart(2, '0');
    const seconds = (sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  // إظهار الدوال من الموديول
  return {
    start,
    clear
  };
})(); // نهاية TimerModule


/* ==========================================================================
   2. QuizEngine — منطق الاختبار، الإجابات، والنتائج
   ========================================================================== */
const QuizEngine = (() => {
  let unitId = null;        // المعرف الحالي للوحدة
  let questions = [];       // مصفوفة الأسئلة الحالية
  let answers = [];         // مصفوفة إجابات المستخدم [null,1,2,...]
  let startTime = null;     // لاحتساب الوقت المستغرق

  /**
   * init — تهيئة المحرك عند اختيار وحدة
   * @param {number} uid — معرّف الوحدة
   */
  function init(uid) {
    unitId = uid;                              // خزن المعرف
    questions = DataModule.getQuestions(uid);  // احصل على الأسئلة
    answers = Array(questions.length).fill(null); // أنشئ مصفوفة إجابات فارغة
    startTime = Date.now();                    // سجّل وقت البدء
  }

  /**
   * answerQuestion — تسجيل إجابة المستخدم
   * @param {number} qIndex — رقم السؤال (0-based)
   * @param {number} optionIndex — رقم الخيار المختار
   */
  function answerQuestion(qIndex, optionIndex) {
    answers[qIndex] = optionIndex;             // خزّن الاختيار
  }

  /**
   * getQuestion — جلب السؤال الحالي
   * @param {number} qIndex — رقم السؤال
   * @returns الكائن السؤال (question, options, correctAnswer)
   */
  function getQuestion(qIndex) {
    return questions[qIndex];
  }

  /**
   * getTotalQuestions — عدد الأسئلة في هذا الاختبار
   * @returns {number}
   */
  function getTotalQuestions() {
    return questions.length;
  }

  /**
   * getAnswers — جلب مصفوفة إجابات المستخدم
   */
  function getAnswers() {
    return answers;
  }

  /**
   * getElapsedSeconds — احتساب عدد الثواني المنقضية
   * @returns {number}
   */
  function getElapsedSeconds() {
    return Math.floor((Date.now() - startTime) / 1000);
  }

  /**
   * calculateResults — احتساب عدد الصحيح والخاطئ والنسبة
   * @returns {object}
   */
  function calculateResults() {
    let correctCount = 0;                      // عدّاد الإجابات الصحيحة
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) { // إذا تطابقت الإجابة
        correctCount++;
      }
    });
    const total = questions.length;            // إجمالي الأسئلة
    const wrongCount = total - correctCount;   // الإجمالي ناقص الصحيح
    const percent = total
      ? Math.round((correctCount / total) * 100)
      : 0;                                     // النسبة المئوية
    return { correctCount, wrongCount, total, percent };
  }

  // كشف دوال QuizEngine
  return {
    init,
    answerQuestion,
    getQuestion,
    getTotalQuestions,
    getAnswers,
    getElapsedSeconds,
    calculateResults
  };
})(); // نهاية QuizEngine


/* ==========================================================================
   3. ResultsStorage — حفظ واسترجاع وتصدير النتائج من/إلى localStorage
   ========================================================================== */
const ResultsStorage = (() => {
  const STORAGE_KEY = 'quizResults'; // المفتاح في localStorage

  /**
   * save — حفظ نتيجة جديدة
   * @param {object} result — كائن يحوي unit, score, time, timestamp
   */
  function save(result) {
    const all = getAll();           // جلب جميع النتائج المخزنة
    all.push(result);               // أضف النتيجة الجديدة
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  /**
   * getAll — استرجاع كل النتائج
   * @returns {array}
   */
  function getAll() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * clearAll — حذف جميع النتائج
   */
  function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * exportJSON — تصدير النتائج كملف JSON قابل للتحميل
   */
  function exportJSON() {
    const data = getAll();           // جلب البيانات
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); // رابط مؤقت
    a.href = url;                      
    a.download = 'quiz-results.json'; // اسم الملف
    document.body.appendChild(a);     
    a.click();                        
    document.body.removeChild(a);     // حذف الرابط
    URL.revokeObjectURL(url);         // تحرير الموارد
  }

  // كشف الواجهة
  return { save, getAll, clearAll, exportJSON };
})(); // نهاية ResultsStorage


/* ==========================================================================
   4. ResultsUI — عرض سجل النتائج داخل الجدول والتعامل مع الأزرار
   ========================================================================== */
const ResultsUI = (() => {
  // 4.1. عناصر DOM الخاصة بالجدول وزر المسح والتصدير
  const tbody       = document.getElementById('results-log');  
  const clearBtn    = document.getElementById('clear-results');
  const exportBtn   = document.getElementById('export-results');

  /**
   * render — رسم جميع صفوف الجدول بناءً على السجل
   * @param {array} entries — مصفوفة من كائنات النتائج
   */
  function render(entries) {
    // إذا لم توجد نتائج
    if (entries.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center">لا توجد نتائج بعد</td>
        </tr>
      `;
      return;
    }
    // بناء HTML للصفوف
    tbody.innerHTML = entries
      .map(entry => `
        <tr>
          <td>${new Date(entry.timestamp).toLocaleString()}</td>
          <td>${entry.unitTitle}</td>
          <td>${entry.correct}/${entry.total}</td>
          <td>${entry.percent}%</td>
          <td>${entry.duration}</td>
        </tr>
      `)
      .join('');
  }

  /**
   * init — ربط الأزرار وعرض البيانات عند بداية الصفحة
   */  
  function init() {
    // جلب وعرض السجل
    const all = ResultsStorage.getAll();
    render(all);

    // ربط زر المسح
    clearBtn.onclick = () => {
      if (confirm('هل تريد مسح جميع النتائج؟')) {
        ResultsStorage.clearAll();
        render([]);
      }
    };

    // ربط زر التصدير
    exportBtn.onclick = () => {
      ResultsStorage.exportJSON();
    };
  }

  // كشف واجهة ResultsUI
  return { init };
})(); // نهاية ResultsUI


/* ==========================================================================
   5. UIController — ربط كل شيء بالـ DOM وإدارة الأقسام والتفاعل
   ========================================================================== */
const UIController = (() => {
  // 5.1. تحديد أقسام الصفحة بالمعرفات
  const sections = {
    units:   document.getElementById('units-section'),
    quiz:    document.getElementById('quiz-section'),
    results: document.getElementById('results-section'),
    log:     document.getElementById('results-log-section')
  };

  // 5.2. عناصر DOM المشترك في جميع الأقسام
  const dom = {
    // قائمة الوحدات
    unitsContainer:   document.querySelector('.units-container'),
    // اختبار
    currentUnitTitle: document.getElementById('current-unit'),
    timerDisplay:     document.getElementById('time'),
    progressBar:      document.querySelector('.progress-bar'),
    progressText:     document.querySelector('.progress-text'),
    quizContainer:    document.querySelector('.quiz-container'),
    prevBtn:          document.getElementById('prev-question'),
    nextBtn:          document.getElementById('next-question'),
    submitBtn:        document.getElementById('submit-quiz'),
    // عرض النتائج الفردية
    scoreEl:          document.getElementById('score'),
    totalEl:          document.getElementById('total'),
    correctEl:        document.getElementById('correct-count'),
    wrongEl:          document.getElementById('wrong-count'),
    percentEl:        document.getElementById('percentage'),
    timeTakenEl:      document.getElementById('time-taken'),
    restartBtn:       document.getElementById('restart-quiz'),
    backToUnitsBtn:   document.getElementById('back-to-tests-from-results')
  };

  // 5.3. حالة التطبيق المتغيرة
  let currentUnitId       = null; // معرف الوحدة الحالية
  let currentQuestionIdx  = 0;    // مؤشر السؤال الحالي

  /**
   * showSection — إظهار قسم واحد وإخفاء الباقي
   * @param {string} name — مفتاح section (units, quiz, results, log)
   */
  function showSection(name) {
    // اخفاء جميع الأقسام
    Object.values(sections).forEach(sec => sec.classList.remove('active'));
    // اظهار المطلوب فقط
    sections[name].classList.add('active');
  }

  /**
   * renderUnits — رسم بطاقات الوحدات في القسم الأول
   */
  function renderUnits() {
    // مسح المحتوى
    dom.unitsContainer.innerHTML = '';
    // جلب الوحدات من DataModule
    const units = DataModule.getUnits();
    // لكل وحدة، اصنع عنصر HTML وأضفه
    units.forEach(unit => {
      const card = document.createElement('div');     // انشاء عنصر Div
      card.className = 'unit-card';                    // اضف كلاس
      card.innerHTML = `
        <i class="${unit.icon}"></i>
        <h3>${unit.title}</h3>
        <p>${unit.description}</p>
      `;                                               // HTML داخلي
      card.onclick = () => selectUnit(unit.id, unit.title); // ربط حدث النقر
      dom.unitsContainer.appendChild(card);            // إضافته للصفحة
    });
    // اظهار القسم
    showSection('units');
  }

  /**
   * selectUnit — حدث عند اختيار وحدة
   * @param {number} uid — معرف الوحدة
   * @param {string} title — عنوان الوحدة لعرضه
   */  
  function selectUnit(uid, title) {
    currentUnitId = uid;                            // حفظ المعرف
    currentQuestionIdx = 0;                         // العمرمؤشر السؤال للصفر
    QuizEngine.init(uid);                           // تهيئة محرك الاختبار
    dom.currentUnitTitle.textContent = title;       // عرض عنوان الوحدة
    renderQuestion();                               // رسم السؤال الأول
    bindQuizNav();                                  // ربط أزرار التنقل
    // بدء المؤقت (مثلاً 5 دقائق)
    TimerModule.start(300, time => dom.timerDisplay.textContent = time, submitQuiz);
    showSection('quiz');                            // إظهار قسم الاختبار
  }

  /**
   * renderQuestion — بناء واجهة السؤال الحالي
   */
  function renderQuestion() {
    const q = QuizEngine.getQuestion(currentQuestionIdx); // جلب كائن السؤال
    const total = QuizEngine.getTotalQuestions();         // عدد الأسئلة
    // بناء HTML الخاص بالسؤال
    dom.quizContainer.innerHTML = `
      <div class="question-number">
        السؤال ${currentQuestionIdx + 1} من ${total}
      </div>
      <div class="question-text">
        ${q.question}
      </div>
      <div class="options">
        ${q.options.map((opt, idx) => `
          <label class="option">
            <input type="radio" name="answer" value="${idx}"
              ${QuizEngine.getAnswers()[currentQuestionIdx] === idx ? 'checked' : ''}>
            <span class="checkmark"></span>
            <span class="option-text">${opt}</span>
          </label>`).join('')}
      </div>
    `;
    bindOptionEvents();        // ربط حدث اختيار الخيار
    updateProgress();          // تحديث شريط التقدم
    updateNavButtons();        // تمكين/تعطيل Prev & Next
  }

  /**
   * bindOptionEvents — عند اختيار خيار يتم تسجيل الإجابة
   */
  function bindOptionEvents() {
    // جلب جميع inputs من النوع radio
    const radios = dom.quizContainer.querySelectorAll('input[name="answer"]');
    radios.forEach(radio => {
      radio.onchange = e => {
        QuizEngine.answerQuestion(currentQuestionIdx, +e.target.value);
        updateProgress();      // حدّث شريط التقدم فورًا
      };
    });
  }

  /**
   * updateProgress — حساب عدد الإجابات المُدخلة وتحديث الواجهة
   */
  function updateProgress() {
    const answers = QuizEngine.getAnswers();                    // مصفوفة الإجابات
    const answered = answers.filter(a => a !== null).length;    // عدد غير null
    const total = QuizEngine.getTotalQuestions();               // العدد الكلي
    const pct = total ? Math.round((answered / total) * 100) : 0; // النسبة
    // تحديث شريط التقدم
    dom.progressBar.style.width = `${pct}%`;
    dom.progressText.textContent = `أُجيب على ${answered} من ${total}`;
  }

  /**
   * updateNavButtons — تمكين/تعطيل Prev و Next حسب الموضع
   */
  function updateNavButtons() {
    dom.prevBtn.disabled = currentQuestionIdx === 0;                                 // أول سؤال
    dom.nextBtn.disabled = currentQuestionIdx === QuizEngine.getTotalQuestions() - 1; // آخر سؤال
  }

  /**
   * bindQuizNav — ربط أحداث Prev, Next, Submit
   */
  function bindQuizNav() {
    dom.prevBtn.onclick = () => {
      if (currentQuestionIdx > 0) {
        currentQuestionIdx--;
        renderQuestion();
      }
    };
    dom.nextBtn.onclick = () => {
      if (currentQuestionIdx < QuizEngine.getTotalQuestions() - 1) {
        currentQuestionIdx++;
        renderQuestion();
      }
    };
    dom.submitBtn.onclick = submitQuiz; // إنهاء الاختبار
  }

  /**
   * submitQuiz — إنهاء الاختبار وحساب النتائج وعرضها
   */
  function submitQuiz() {
    TimerModule.clear();             // أوقف المؤقت
    const results = QuizEngine.calculateResults(); // احسب النتائج
    const duration = QuizEngine.getElapsedSeconds(); // احسب الوقت
    // عرض النتائج في القسم
    dom.scoreEl.textContent     = results.correctCount;
    dom.totalEl.textContent     = results.total;
    dom.correctEl.textContent   = results.correctCount;
    dom.wrongEl.textContent     = results.wrongCount;
    dom.percentEl.textContent   = results.percent;
    dom.timeTakenEl.textContent = duration;
    // حفظ النتيجة في التخزين
    ResultsStorage.save({
      unitId: currentUnitId,
      unitTitle: dom.currentUnitTitle.textContent,
      correct: results.correctCount,
      total: results.total,
      percent: results.percent,
      duration,
      timestamp: Date.now()
    });
    // بعد الحفظ، أعرض سجل النتائج أو قسم النتائج الفردية
    showSection('results');
  }

  /**
   * init — تهيئة الواجهة عند بداية الصفحة
   */
  function init() {
    renderUnits();                    // رسم بطاقات الوحدات
  }

  // كشف واجهة UIController
  return { init };
})(); // نهاية UIController


/* ==========================================================================
   6. Theme Toggle & Scroll To Top (تحسين تجربة المستخدم)
   ========================================================================== */
(() => {
  // 1. زر تبديل الثيم
  const btn = document.getElementById('theme-toggle'); // احصل على الزر
  const icon = btn.querySelector('i');                // أيقونته

  // 2. دالة تبديل الوضع
  function toggleTheme() {
    document.body.classList.toggle('dark-mode');      // أضف/أزل كلاس
    // تغيير الأيقونة حسب الوضع
    if (document.body.classList.contains('dark-mode')) {
      icon.className = 'fas fa-sun';                  // وضع ليلي
    } else {
      icon.className = 'fas fa-moon';                 // وضع نهاري
    }
  }

  // 3. حدث النقر على الزر
  btn.onclick = toggleTheme;

  // 4. زر scroll to top
  const scrollBtn = document.getElementById('scroll-to-top');
  // إظهار الزر عند النزول 100px
  window.onscroll = () => {
    if (window.scrollY > 100) scrollBtn.classList.add('show');
    else scrollBtn.classList.remove('show');
  };
  // عند النقر، عد للأعلى بسلاسة
  scrollBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
})(); // نهاية Theme & ScrollToTop IIFE


/* ==========================================================================
   7. Initialization — بدء التطبيق بعد تحميل DOM
   ========================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  // 1. تحميل الأسئلة من JSON
  await DataModule.loadQuizData();  // انتظر حتى يكتمل التحميل
  // 2. تهيئة الواجهة
  UIController.init();             // عرض بطاقات الوحدات
  // 3. تهيئة عرض سجل النتائج
  ResultsUI.init();                // ربط أزرار المسح والتصدير
  // 4. إخفاء الـ preloader
  const pre = document.getElementById('preloader');
  if (pre) pre.style.display = 'none';
});