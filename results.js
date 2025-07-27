/**
 * results.js — حفظ واسترجاع وعرض نتائج الاختبارات
 * يعرض سجل النتائج، إحصاءات، ومحركات تصدير البيانات
 */

/* ────────────────────────────────────────────────────────────────────────── */
/* 1. ResultsStorage — واجهة التخزين في الـ localStorage                   */
/* ────────────────────────────────────────────────────────────────────────── */
const ResultsStorage = (() => {
  const STORAGE_KEY = 'quizResults';

  function save(result) {
    const all = getAll();
    all.push(result);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function getAll() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function getByUnit(unitId) {
    return getAll().filter(r => r.unit === unitId);
  }

  function getByTest(unitId, testId) {
    return getAll().filter(r => r.unit === unitId && r.test === testId);
  }

  function exportJSON() {
    const data = getAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-results.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return { save, getAll, clearAll, getByUnit, getByTest, exportJSON };
})();

/* ────────────────────────────────────────────────────────────────────────── */
/* 2. ResultsUI — عرض واجهة سجل النتائج وتفاعلات المستخدم                 */
/* ────────────────────────────────────────────────────────────────────────── */
const ResultsUI = (() => {
  const container = document.getElementById('results-log');
  const clearBtn  = document.getElementById('clear-results');
  const exportBtn = document.getElementById('export-results');

  // توليد صفوف الجدول
  function renderTableRows(entries) {
    if (!entries.length) {
      container.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد نتائج بعد</td></tr>';
      return;
    }
    container.innerHTML = entries.map(e => `
      <tr>
        <td>${new Date(e.timestamp).toLocaleString()}</td>
        <td>${DataModule.units.find(u=>u.id===e.unit).title}</td>
        <td>${e.testTitle}</td>
        <td>${e.correct}/${e.total}</td>
        <td>${e.percent}%</td>
        <td>${e.duration}s</td>
      </tr>
    `).join('');
  }

  // تحميل وعرض النتائج كاملة
  function showAll() {
    const data = ResultsStorage.getAll();
    renderTableRows(data);
  }

  // ربط الأزرار
  function setupListeners() {
    clearBtn.addEventListener('click', () => {
      if (confirm('هل تريد مسح كل النتائج نهائياً؟')) {
        ResultsStorage.clearAll();
        showAll();
      }
    });
    exportBtn.addEventListener('click', ResultsStorage.exportJSON);
  }

  function init() {
    setupListeners();
    showAll();
  }

  return { init, showAll };
})();

/* ────────────────────────────────────────────────────────────────────────── */
/* 3. ربط حفظ النتائج الجديدة مع ResultsStorage عند الإرسال                 */
/* ────────────────────────────────────────────────────────────────────────── */
(function hookSaveOnSubmit() {
  const originalSubmit = UIController.submitQuiz; // assuming we refactored submitQuiz as method
  UIController.submitQuiz = function() {
    const results = QuizEngine.calculateResults();
    const duration = QuizEngine.getElapsedTime();
    const unitId = QuizEngine.currentUnitId;
    const testTitle = document.getElementById('current-test').textContent;
    const entry = {
      unit: unitId,
      testTitle,
      correct: results.correctCount,
      total: results.total,
      percent: results.percent,
      duration,
      timestamp: Date.now()
    };
    ResultsStorage.save(entry);
    originalSubmit.call(UIController);
  };
})();

/* ────────────────────────────────────────────────────────────────────────── */
/* 4. تهيئة عرض سجل النتائج عند تحميل DOM                                   */
/* ────────────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ResultsUI.init();
});