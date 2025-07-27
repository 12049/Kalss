/**
 * results.js — إدارة النتائج (حفظ، استرجاع، عرض وتصدير)
 * 1. ResultsStorage: حفظ النتائج في localStorage وإدارتها.
 * 2. ResultsUI: رسم سجل النتائج وربط الأزرار (مسح وتصدير).
 * 
 * كل سطر مشروح لسهولة التعديل.
 */

/* ==========================================================================
   ResultsStorage — حفظ واسترجاع وتصدير النتائج من/إلى localStorage
   ========================================================================== */
const ResultsStorage = (() => {
  const STORAGE_KEY = 'quizResults'; // المفتاح في localStorage

  /**
   * save — حفظ نتيجة جديدة في الـ localStorage
   * @param {object} result — كائن يحوي unitId, unitTitle, correct, total, percent, duration, timestamp
   */
  function save(result) {
    const all = getAll();                                   // جلب السجل الحالي
    all.push(result);                                       // إضافة النتيجة الجديدة
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); // حفظها في الـ localStorage
  }

  /**
   * getAll — جلب كل النتائج المخزنة
   * @returns {Array} — مصفوفة النتائج
   */
  function getAll() {
    const stored = localStorage.getItem(STORAGE_KEY); // قراءة المفتاح
    return stored ? JSON.parse(stored) : [];          // إذا موجود تعيده كمصفوفة، وإلا مصفوفة فارغة
  }

  /**
   * clearAll — حذف كل النتائج من الـ localStorage
   */
  function clearAll() {
    localStorage.removeItem(STORAGE_KEY); // إزالة المفتاح كاملاً
  }

  /**
   * exportJSON — تصدير كل النتائج كملف JSON قابل للتحميل
   */
  function exportJSON() {
    const data = getAll();                                  // جلب البيانات
    const jsonStr = JSON.stringify(data, null, 2);          // تحويل لنص JSON منسق
    const blob = new Blob([jsonStr], { type: 'application/json' }); // إنشاء Blob
    const url = URL.createObjectURL(blob);                  // رابط مؤقت
    const a = document.createElement('a');                  // إنشاء عنصر anchor
    a.href = url;                                           // ربط الرابط
    a.download = 'quiz-results.json';                       // اسم الملف المحفوظ
    document.body.appendChild(a);                           // إضافة العنصر للوثيقة
    a.click();                                              // محاكاة النقر للتنزيل
    document.body.removeChild(a);                           // إزالة العنصر
    URL.revokeObjectURL(url);                               // تحرير الموارد
  }

  // كشف الدوال للاستخدام الخارجي
  return {
    save,
    getAll,
    clearAll,
    exportJSON
  };
})(); // نهاية ResultsStorage


/* ==========================================================================
   ResultsUI — عرض سجل النتائج داخل الجدول والتعامل مع الأزرار
   ========================================================================== */
const ResultsUI = (() => {
  // 1. جلب عناصر DOM
  const tbody     = document.getElementById('results-log');    // جسم جدول النتائج
  const clearBtn  = document.getElementById('clear-results'); // زر مسح السجل
  const exportBtn = document.getElementById('export-results');// زر تصدير السجل

  /**
   * render — رسم جدول النتائج بناءً على مدخلات
   * @param {Array} entries — مصفوفة من كائنات النتائج
   */
  function render(entries) {
    if (entries.length === 0) {
      // إذا لا يوجد نتائج
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center">لا توجد نتائج بعد</td>
        </tr>
      `;
      return;
    }

    // بناء صفوف الجدول
    const rows = entries.map(entry => {
      const dateStr = new Date(entry.timestamp).toLocaleString(); // تنسيق الطابع الزمني
      return `
        <tr>
          <td>${dateStr}</td>
          <td>${entry.unitTitle}</td>
          <td>${entry.correct}/${entry.total}</td>
          <td>${entry.percent}%</td>
          <td>${entry.duration}s</td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rows; // إدراج الصفوف
  }

  /**
   * bindEvents — ربط أزرار المسح والتصدير
   */
  function bindEvents() {
    clearBtn.onclick = () => {
      // تأكيد من المستخدم قبل المسح
      if (confirm('هل تريد مسح جميع النتائج؟')) {
        ResultsStorage.clearAll(); // حذف السجل
        render([]);                // تحديث العرض
      }
    };

    exportBtn.onclick = () => {
      ResultsStorage.exportJSON(); // تنفيذ التصدير
    };
  }

  /**
   * init — تهيئة UI عند التحميل
   */
  function init() {
    const entries = ResultsStorage.getAll(); // جلب السجل
    render(entries);                         // رسم الجدول
    bindEvents();                            // ربط الأزرار
  }

  // كشف دالة init للاستخدام الخارجي
  return {
    init
  };
})(); // نهاية ResultsUI


// تهيئة عرض النتائج بعد تحميل DOM
document.addEventListener('DOMContentLoaded', () => {
  ResultsUI.init(); // عرض السجل وربط الأزرار
});