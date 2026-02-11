// =================================================================
// auth_handler.js
// هذا الملف يدير منطق تسجيل الدخول والتسجيل وحماية الصفحات باستخدام Firebase
// =================================================================

// تأكد أنك ضمنت ملف firebase_config.js قبله في الـ HTML
// وأن متغيرات (auth) و (db) معرفة هناك.

// -----------------------------------------------------------------
// 1. دالة تسجيل مستخدم جديد (Registration)
// -----------------------------------------------------------------

function registerUser(email, password) {
    // إنشاء المستخدم في Authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("تم تسجيل المستخدم بنجاح:", user.uid);

            // إنشاء سجل النقاط الأولي في Firestore (مهم لتأمين النقاط)
            return db.collection("users").doc(user.uid).set({
                email: user.email,
                points: 0, // يبدأ بصفر نقطة
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            alert("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
            // توجيه لصفحة الأسئلة بعد التسجيل مباشرة
            window.location.href = "quiz.html"; 
        })
        .catch((error) => {
            // التعامل مع الأخطاء (مثل: البريد الإلكتروني مستخدم، كلمة المرور قصيرة)
            alert("خطأ في التسجيل: " + error.message);
        });
}

// -----------------------------------------------------------------
// 2. دالة تسجيل الدخول (Login)
// -----------------------------------------------------------------

function loginUser(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("تم تسجيل الدخول بنجاح للمستخدم:", user.uid);
            
            alert("تم تسجيل الدخول بنجاح!");
            // التوجيه لصفحة الأسئلة (حيث ستبدأ اللعبة)
            window.location.href = "quiz.html"; 
        })
        .catch((error) => {
            alert("خطأ في تسجيل الدخول: " + error.message);
        });
}

// -----------------------------------------------------------------
// 3. دالة التحقق من حالة المستخدم (للحماية)
// -----------------------------------------------------------------

// تستخدم في صفحات مثل quiz.html للتأكد من أن المستخدم مسجل دخوله
function checkAuthState(redirectIfLoggedOut = true) {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // المستخدم مسجل دخوله
                console.log("المستخدم الحالي:", user.email);
                resolve(user);
            } else {
                // المستخدم غير مسجل دخوله
                console.log("لا يوجد مستخدم مسجل دخوله. يتم التوجيه.");
                if (redirectIfLoggedOut) {
                    window.location.href = "login.html"; 
                }
                reject(null);
            }
        });
    });
}

// -----------------------------------------------------------------
// 4. ربط الدوال بنماذج HTML في صفحة login.html
// -----------------------------------------------------------------

// يتم الانتظار حتى يتم تحميل محتوى الصفحة بالكامل قبل محاولة ربط العناصر
document.addEventListener('DOMContentLoaded', () => {
    
    // ربط نموذج التسجيل (بافتراض أن الـ id هو 'registrationForm')
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            
            registerUser(email, password); 
        });
    }

    // ربط نموذج تسجيل الدخول (بافتراض أن الـ id هو 'loginForm')
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            loginUser(email, password); 
        });
    }
});
