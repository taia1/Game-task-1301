// offerwall_handler.js

// **ملاحظة هامة:** تم تعديل هذا الملف لاستخدام المتغيرات العامة (Global Variables)
// لضمان التوافق مع طريقة تحميل مكتبات Firebase عبر CDN في ملف offerwall.html.

// 1. الدخول إلى خدمات Firebase
// نفترض أن auth و db متاحان عالمياً بعد تحميل مكتبات Firebase و firebase_config.js
if (typeof firebase === 'undefined' || !firebase.auth) {
    console.error("Firebase is not properly initialized or 'firebase-auth.js' is missing.");
}
const auth = firebase.auth();


// 2. العناصر من DOM
// نستخدم العناصر التي نعرفها في offerwall.html
const offerwallContainer = document.getElementById('cpa-offers-container');
const userInitialElement = document.getElementById('user-initial');
const userBalanceElement = document.getElementById('user-balance');


// =======================================================
// وظيفة تحديث واجهة المستخدم (تُستدعى عند الدخول)
// =======================================================

function updateUI(user) {
    if (user) {
        // تحديث الحرف الأول للمستخدم
        userInitialElement.textContent = user.email ? user.email.charAt(0).toUpperCase() : 'U';
        // الرصيد (قيمة مؤقتة، سيتم ربطها بقاعدة البيانات لاحقاً)
        userBalanceElement.textContent = '0.00';
    }
}

// =======================================================
// دالة لتضمين كود الـ Offerwall بعد إضافة الـ UID
// =======================================================

function injectOfferwallCode(uid) {
    const container = document.getElementById('locker-placeholder');
    if (!container) {
        console.error("Locker placeholder not found. Cannot load CPA offers.");
        return;
    }

    const trackingId = uid; // استخدام UID كمعرف تتبع (Sub ID)

    // مسح رسالة "جارٍ التحميل..."
    container.innerHTML = ''; 

    // 1. الكود الأساسي لجلب العروض (var lck = false;)
    const scriptLck = document.createElement('script');
    scriptLck.type = 'text/javascript';
    scriptLck.innerHTML = `var lck = false;`;
    container.appendChild(scriptLck);

    // 2. سكريبت تحميل العروض مع إضافة UID كمعرف تتبع (tracking_id)
    const mainScript = document.createElement('script');
    mainScript.type = 'text/javascript';
    mainScript.src = `https://installyourfiles.com/script_include.php?id=1850937&tracking_id=${trackingId}`;
    container.appendChild(mainScript);

    // 3. كود الحماية والتحويل (كما جاء من مزود CPA)
    const fallbackScript = document.createElement('script');
    fallbackScript.type = 'text/javascript';
    fallbackScript.innerHTML = `
        if (!lck) {
            top.location = 'https://installyourfiles.com/help/ablk.php?lkt=4'; 
        }
    `;
    container.appendChild(fallbackScript);

    console.log("CPA Locker loaded successfully with tracking_id:", uid);
}


// =======================================================
// 3. دالة التحقق من حالة الدخول (تُستدعى من auth_handler.js)
// =======================================================

/**
 * هذه الدالة تُستدعى من auth_handler.js بمجرد أن يتم التحقق من حالة المستخدم
 * لتقوم بتحميل العروض وتحديث واجهة المستخدم.
 * @param {object} user - كائن المستخدم من Firebase
 */
function checkAuthStatusAndLoadCPA(user) {
    if (user) {
        // 1. تحديث واجهة offerwall.html (مثل عرض الحرف الأول والرصيد)
        updateUI(user);
        
        // 2. تحميل كود CPA Locker باستخدام UID المستخدم
        injectOfferwallCode(user.uid);
    } 
    // إذا لم يكن user موجوداً، فإن auth_handler.js سيتولى عملية التحويل إلى login.html
}

// =======================================================
// 4. ربط زر تسجيل الخروج
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // نعتمد على دالة signOutUser() الموجودة في auth_handler.js
            if (typeof signOutUser === 'function') {
                signOutUser(); 
            } else {
                console.error("signOutUser function not found. Check auth_handler.js.");
            }
        });
    }
});
