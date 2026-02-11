// firebase_config.js

// 1. استبدل هذه القيم ببيانات مشروعك الخاصة من لوحة تحكم Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 2. تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// 3. تعريف متغيرات لخدمات Firebase التي سنستخدمها
const auth = firebase.auth();
const db = firebase.firestore(); // لاستخدام قاعدة بيانات Firestore لحفظ النقاط

// ملاحظة مهمة: تأكد من تضمين سكريبتات Firebase الأساسية في ملف login.html
// <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
// <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>
