<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>So'z Yodlash Mashqi (Konfiguratsiyalanadigan)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Inter font for better readability */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            /* Zamonaviy gradient fon */
            background: linear-gradient(135deg, #a361e6 0%, #3e82f7 100%);
        }
        .main-card {
            min-height: 80vh;
            /* Yaltiroq effekt uchun */
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .word-display {
            font-size: 2.8rem; /* Kattaroq yozuv */
            font-weight: 800;
            color: #1f2937;
            text-shadow: 2px 2px 5px rgba(0,0,0,0.15);
            min-height: 100px; 
            display: flex;
            align-items: center;
            justify-content: center;
            /* Katta e'tiborni tortuvchi rang */
            background: linear-gradient(45deg, #ffffff, #f0f4ff);
        }
        
        /* So'z almashinuvidagi animatsiya */
        .word-animation {
            animation: wordPop 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        @keyframes wordPop {
            0% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
        }

        .result-item-correct {
            background-color: #d1fae5;
            border-left: 6px solid #10b981;
        }
        .result-item-incorrect {
            background-color: #fee2e2;
            border-left: 6px solid #ef4444;
        }
        .word-list-container {
            max-height: 150px;
            overflow-y: hidden;
        }
        .animated-btn {
            transition: all 0.2s ease-in-out;
        }
        .animated-btn:hover {
            transform: scale(1.03) translateY(-2px);
            box-shadow: 0 10px 15px rgba(59, 130, 246, 0.4);
        }
        /* Taymer animatsiyasi */
        .timer-flash {
            animation: flash 1s infinite alternate;
        }
        @keyframes flash {
            from { opacity: 1; }
            to { opacity: 0.7; }
        }
    </style>
</head>
<body>

<div id="app" class="p-4 md:p-8 flex items-center justify-center min-h-screen">
    <div id="content-container" class="w-full max-w-2xl main-card p-6 md:p-10 rounded-3xl shadow-2xl transition-all duration-300">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            So'zlarni Yodlash Mashqi <span class="text-indigo-600">🚀</span>
        </h1>
        
        <!-- 1. SOZLAMALAR EKRANI -->
        <div id="settings-phase">
            <h2 class="text-2xl font-bold text-center text-indigo-700 mb-8">Mashqni Sozlash</h2>
            <div class="space-y-6">
                
                <!-- Til Tanlash -->
                <div class="flex flex-col">
                    <label for="language-select" class="mb-2 font-semibold text-gray-700">Tilni tanlang:</label>
                    <select id="language-select" class="p-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner">
                        <!-- Options filled by JS -->
                    </select>
                </div>

                <!-- So'zlar Soni (500 gacha) -->
                <div class="flex flex-col">
                    <label for="words-count" class="mb-2 font-semibold text-gray-700">Yodlanadigan so'zlar soni (5-500):</label>
                    <input type="number" id="words-count" class="p-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner" value="50" min="5" max="500">
                </div>

                <!-- Yodlash Vaqti -->
                <div class="flex flex-col">
                    <label for="study-time" class="mb-2 font-semibold text-gray-700">Yodlash uchun vaqt (sekundda):</label>
                    <input type="number" id="study-time" class="p-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner" value="60" min="10" max="300">
                </div>
            </div>

            <button id="start-test-btn" class="w-full mt-10 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 px-4 rounded-xl shadow-2xl animated-btn focus:outline-none focus:ring-4 focus:ring-indigo-400">
                Mashqni Boshlash
            </button>
        </div>

        <!-- 2. YODLASH BOSQICHI -->
        <div id="study-phase" class="hidden">
             <div class="text-center p-4">
                <!-- Navigatsiya va Vaqt Bloki -->
                <div class="flex justify-between items-center mb-6 bg-gray-100 p-3 rounded-xl shadow-md">
                    <button id="prev-word-btn-desktop" class="text-gray-600 hover:text-gray-900 font-bold p-2 rounded-full hidden md:block transition duration-150" title="Oldingi so'zga o'tish (Tepaga ↑)">
                         <span class="text-3xl">&uarr;</span> Oldingi
                    </button>
                    <button id="prev-word-btn-mobile" class="text-gray-600 hover:text-gray-900 font-bold py-2 px-4 rounded-full md:hidden">
                        &larr; Orqaga
                    </button>
                    
                    <div class="flex flex-col items-center">
                        <span class="text-sm font-semibold text-red-500">Vaqt qoldi: </span>
                        <span id="timer-display" class="text-3xl font-extrabold text-red-600 timer-flash">00:00</span>
                    </div>

                    <button id="next-word-btn-mobile" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm md:hidden animated-btn">
                        Keyingi &rarr;
                    </button>
                    <button id="next-word-btn-desktop" class="text-gray-600 hover:text-gray-900 font-bold p-2 rounded-full hidden md:block transition duration-150" title="Keyingi so'zga o'tish (Pastga ↓)">
                        Keyingi <span class="text-3xl">&darr;</span>
                    </button>
                </div>
                
                <p class="text-gray-600 mb-6 text-xl font-medium">Yodlashga harakat qiling. Tarjimasiz!</p>
                <div id="word-display" class="word-display p-8 rounded-2xl shadow-xl mb-6 transition-transform transform duration-300 border-b-4 border-blue-500">
                    <p>So'z yuklanmoqda...</p>
                </div>
                
                <div class="mb-6">
                    <p class="text-base text-gray-500 mt-4 hidden md:block">
                        <kbd class="kbd bg-indigo-100 text-indigo-800 p-2 px-3 rounded-lg font-mono font-bold text-sm">Pastga &darr;</kbd> (Keyingi) va 
                        <kbd class="kbd bg-indigo-100 text-indigo-800 p-2 px-3 rounded-lg font-mono font-bold text-sm">Tepaga &uarr;</kbd> (Oldingi) tugmalarini ishlating.
                    </p>
                </div>

                <div class="word-list-container mb-6">
                    <p class="text-gray-500 text-lg mb-2 font-medium">
                        Jami so'zlar: <span id="total-words-count" class="font-extrabold text-gray-800">0</span> / 
                        So'z raqami: <span id="current-word-number" class="font-extrabold text-indigo-600">1</span>
                    </p>
                </div>

                <button id="ready-btn" class="bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 px-12 rounded-xl shadow-2xl animated-btn focus:outline-none focus:ring-4 focus:ring-green-400">
                    Tayyorman (Testni Boshlash)
                </button>
            </div>
        </div>
        
        <!-- 3. TEST BOSQICHI -->
        <div id="test-phase" class="hidden">
            <!-- Test interfeysi bu yerga yuklanadi -->
        </div>

        <!-- 4. NATIJALAR BOSQICHI -->
        <div id="results-phase" class="hidden">
            <!-- Natijalar interfeysi bu yerga yuklanadi -->
        </div>

        <!-- Yuklanish Holati -->
        <div id="loading-state" class="text-center p-8 hidden">
            <div class="animate-spin inline-block w-10 h-10 border-[4px] border-current border-t-transparent text-indigo-600 rounded-full" role="status"></div>
            <p class="mt-4 text-indigo-700 font-semibold text-lg">Ma'lumotlar yuklanmoqda... (Katta bazadan so'zlar tanlanmoqda)</p>
        </div>

    </div>
</div>

<script type="module">
    // Firebase SDK importlari
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
    import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
    import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
    import { setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

    setLogLevel('Debug');

    // Global o'zgaruvchilar va Konfigratsiya
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
    
    // Ilova holati
    let db, auth;
    let userId = null;
    let wordsToMemorize = [];
    let currentWordIndex = 0;
    let timerInterval;
    let gameSettings = {};

    // DOM Elementlar
    const loadingState = document.getElementById('loading-state');
    const settingsPhase = document.getElementById('settings-phase');
    const studyPhase = document.getElementById('study-phase');
    const testPhase = document.getElementById('test-phase');
    const resultsPhase = document.getElementById('results-phase');
    
    // Yordamchi obyekt
    const DataManager = {
        languages: {
            en: { name: "Ingliz tili", code: "en" },
            uz: { name: "O'zbek tili", code: "uz" },
            ru: { name: "Rus tili", code: "ru" },
            es: { name: "Ispan tili", code: "es" },
            zh: { name: "Xitoy tili", code: "zh" },
            ko: { name: "Koreys tili", code: "ko" },
            ja: { name: "Yapon tili", code: "ja" }
        },
        // So'zlar bazasi (takrorlanishni kamaytirish uchun kengaytirilgan)
        baseWords: {
            en: [
                "Ephemeral", "Ubiquitous", "Serendipity", "Mellifluous", "Sempiternal", "Nefarious", "Pulchritude", "Innocuous", "Quixotic", "Ethereal", 
                "Conundrum", "Voracious", "Petrichor", "Luminous", "Eloquence", "Fervent", "Intrepid", "Maneuver", "Oblivion", "Quintessential", 
                "Zealous", "Venerable", "Transient", "Surreptitious", "Sophomoric", "Sagacious", "Reclusive", "Querulous", "Pugnacious", "Placid", 
                "Onerous", "Nugatory", "Munificent", "Laconic", "Juxtapose", "Inchoate", "Hegemony", "Gratuitous", "Fastidious", "Dilatory", 
                "Capricious", "Calamity", "Buttress", "Banal", "Auspicous", "Arbitrary", "Ameliorate", "Alacrity", "Abstruse", "Pensive",
                "Indolent", "Vociferous", "Salient", "Mitigate", "Enervate", "Exacerbate", "Recalcitrant", "Obfuscate", "Pithy", "Sublime",
                "Paradigm", "Ephemeral", "Equivocal", "Fastidious", "Garrulous", "Inimical", "Languid", "Malleable", "Nadir", "Obsequious",
                "Palpable", "Quiescent", "Rancor", "Sycophant", "Tendentious", "Ubiquitous", "Vacillate", "Wistful", "Xenophobia", "Yoke",
                "Zenith", "Apprehension", "Assuage", "Austerity", "Circumlocution", "Clandestine", "Cognizant", "Consummate", "Deleterious", "Demure",
                "Didactic", "Disparate", "Dogmatic", "Ebullient", "Egregious", "Ephemeral", "Esoteric", "Evocative", "Fatuous", "Feckless",
                "Fortuitous", "Germane", "Hubris", "Impassive", "Impecunious", "Inadvertent", "Incipient", "Incontrovertible", "Indefatigable", "Ineffable",
                "Inexorable", "Insidious", "Intransigent", "Jubilant", "Judicious", "Kudos", "Lachrymose", "Lugubrious", "Mellifluous", "Mendacious",
                "Mercurial", "Nascent", "Nefarious", "Nonchalant", "Nuance", "Obdurate", "Ostensible", "Panacea", "Pellucid", "Perfunctory",
                "Permeate", "Pervasive", "Petulant", "Philanthropic", "Ponderous", "Precocious", "Proclivity", "Profligate", "Prosaic", "Pusillanimous",
                "Quell", "Quixotic", "Rambunctious", "Rapture", "Rectify", "Redundant", "Remiss", "Repudiate", "Rescind", "Reticent",
                "Revere", "Ribald", "Sanguine", "Sardonic", "Scathing", "Serene", "Solipsism", "Somnolent", "Stoic", "Stymie",
                "Superfluous", "Surfeit", "Taciturn", "Tantamount", "Tenuous", "Tirade", "Trepidation", "Truculent", "Unctuous", "Undulating",
                "Unwieldy", "Vapid", "Vex", "Vicarious", "Vituperate", "Wanton", "Wry", "Zany", "Acrimony", "Admonish",
                "Amorphous", "Anomaly", "Antipathy", "Apathetic", "Assiduous", "Berate", "Cajole", "Capitulate", "Castigate", "Chicanery",
                "Clemency", "Coerce", "Complaisant", "Concomitant", "Corpulent", "Cynical", "Delineate", "Derision", "Desultory", "Diaphanous",
                "Diffident", "Discern", "Disdain", "Disingenuous", "Disseminate", "Effusive", "Embellish", "Equanimity", "Eradicate", "Erudite",
                "Euphemism", "Exorbitant", "Expedient", "Extemporaneous", "Extol", "Fallacious", "Fecund", "Fidelity", "Foppish", "Furtive",
                "Gesticulate", "Haphazard", "Idiosyncrasy", "Ignominious", "Imperturbable", "Impetuous", "Inane", "Inchoate", "Incredulous", "Indignant",
                "Inept", "Inert", "Insipid", "Intrepid", "Jocose", "Judicious", "Juxtaposition", "Lament", "Laud", "Lethargic",
                "Loquacious", "Lucid", "Magnanimous", "Malinger", "Mellifluous", "Misanthrope", "Mollify", "Morose", "Nettle", "Nihilism",
                "Nonplussed", "Nostalgia", "Notorious", "Novice", "Obliterate", "Oblivious", "Obstreperous", "Officious", "Ominous", "Opaque",
                "Opulence", "Ornate", "Pacify", "Paltry", "Paradox", "Parity", "Paucity", "Pedantic", "Penurious", "Pervade",
                "Petulant", "Pious", "Placate", "Platitude", "Plausible", "Polemic", "Portend", "Pragmatic", "Precedent", "Preclude",
                "Prepossessing", "Prevaricate", "Prodigal", "Profound", "Promulgate", "Propensity", "Propitious", "Provincial", "Puerile", "Punctilious",
                "Querulous", "Quixotic", "Rampant", "Rapt", "Rebuttal", "Recant", "Refute", "Relegate", "Replete", "Reprehensible",
                "Reprove", "Resilient", "Restive", "Reverent", "Rhapsodize", "Rife", "Rigor", "Ruminate", "Saccharine", "Sacrosanct",
                "Salubrious", "Sanguine", "Sardonic", "Satiate", "Scintilla", "Scoff", "Scrutinize", "Sedulous", "Seraphic", "Sojourn",
                "Solace", "Somber", "Spurious", "Stagnant", "Stoicism", "Strident", "Subjugate", "Subversive", "Succinct", "Supercilious",
                "Surreptitious", "Sybarite", "Synergy", "Tacit", "Tangible", "Temerity", "Transient", "Trenchant", "Trite", "Turgid",
                "Undermine", "Unequivocal", "Unfettered", "Unflappable", "Unkempt", "Unscrupulous", "Vacuous", "Venerate", "Veracity", "Verbose",
                "Vilify", "Vindictive", "Virulent", "Viscous", "Vituperation", "Volatile", "Wane", "Whet", "Whimsical", "Zeitgeist"
            ],
            uz: [
                "Tafakkur", "Munosabat", "Barqaror", "Fidoiy", "Samara", "Qiyinchilik", "Mustahkam", "Hayrat", "Ixtiro", "Ilhom", 
                "Hissiyot", "Mantiq", "Marhamat", "Tajriba", "Javobgar", "Xayol", "Qadrli", "Imkoniyat", "Ma'naviyat", "Tashabbus", 
                "Fursat", "Iymon", "Masofa", "Chorak", "Zarur", "Oqibat", "G'oya", "Hisob", "Hukm", "Faqat", 
                "Hafta", "Bahor", "Muzqaymoq", "Tarix", "Davlat", "Asosiy", "Ehtiyoj", "Doimiy", "Aniq", "Yozuv", 
                "Jahon", "Qishloq", "Shamol", "Daraja", "Odam", "Harf", "Yangi", "Eski", "Beshik", "Kitob",
                "Daftar", "Qalam", "Maktab", "Talaba", "O'qituvchi", "Dars", "Test", "Imtihon", "Yil", "Oy", 
                "Kun", "Soat", "Daqiqa", "Son", "Tez", "Sekin", "Yaxshi", "Yomon", "Katta", "Kichik", 
                "Uzun", "Qisqa", "Ochiq", "Yopiq", "Qora", "Oq", "Qizil", "Yashil", "Ko'k", "Sariq", 
                "Xursand", "G'amgin", "Aqlli", "Ayb", "Kechirim", "Baxt", "Sevgi", "Nafrat", "Orzu", "Xotira", 
                "Kelajak", "O'tmish", "Hozir", "Yurak", "Miya", "Qo'l", "Oyoq", "Tish", "Soch", "Yuz",
                "Kezish", "Charaqlash", "Tushunmovchilik", "Yutuq", "Harakat", "Javohir", "Xulosa", "Tadbirkor", "Samimiyat", "Tinchlik",
                "Qadriyat", "Mantiqiy", "Qat'iyat", "Qabul", "Qaror", "Tasnif", "Tarbiya", "Sifat", "Miqdor", "Ko'nikma",
                "Shaxsiyat", "Faylasuf", "Ijtimoiy", "Texnika", "Ijodkor", "Hajm", "Ruhoniyat", "Hayajon", "Bino", "Ishonch",
                "Ta'sir", "Nazar", "Yechim", "Tegishli", "Hosil", "Farq", "G'azab", "Qiziqish", "Odat", "Chegara",
                "Izlanish", "Maqsad", "Muammo", "Asar", "Hikmat", "Sarmoya", "Rivojlanish", "Xizmat", "Mulk", "Obro'",
                "Erkinlik", "Majburiyat", "Xavfsizlik", "Raqobat", "Shijoat", "Sarguzasht", "Tushkunlik", "G'urur", "Kafolat", "Iste'dod",
                "Ehtiros", "Meros", "Tushuncha", "Aytish", "Eshitish", "Ko'rish", "Hisoblash", "O'lchov", "O'zgarish", "Tuzilish",
                "Mavzu", "Matn", "Xato", "To'g'ri", "O'rtacha", "Kam", "Ko'p", "Oddiy", "Murakkab", "Ajablanish",
                "Boshqaruv", "Taqdimot", "Foyda", "Zarar", "Hisobot", "Loyihalash", "Tashkilot", "Nizom", "Qoida", "An'ana"
            ],
            ru: [
                "Сознание", "Постоянный", "Случайный", "Мелодичный", "Вечный", "Нечестивый", "Красота", "Безвредный", "Донкихотский", "Неземной", 
                "Загадка", "Ненасытный", "Петрикор", "Светящийся", "Красноречие", "Пылкий", "Бесстрашный", "Маневр", "Забвение", "Квинтэссенция", 
                "Изобилие", "Непрерывный", "Отражение", "Удовлетворение", "Символ", "Торжество", "Рассудок", "Совершенство", "Инициатива", "Возрождение", 
                "Убеждение", "Сосредоточение", "Предположение", "Мрачный", "Осведомленность", "Смелость", "Поэзия", "Энергия", "Редкость", "Интуиция", 
                "Призвание", "Безопасность", "Радость", "Счастье", "Сияние", "Успех", "Единство", "Намерение", "Творчество", "Сочувствие", 
                "Книга", "Тетрадь", "Ручка", "Школа", "Студент", "Учитель", "Урок", "Тест", "Экзамен", "Год", 
                "Месяц", "День", "Час", "Минута", "Секунда", "Быстрый", "Медленный", "Хороший", "Плохой", "Большой", 
                "Маленький", "Длинный", "Короткий", "Открытый", "Закрытый", "Черный", "Белый", "Красный", "Зеленый", "Синий", 
                "Желтый", "Счастливый", "Грустный", "Умный", "Вина", "Прощение", "Счастье", "Любовь", "Ненависть", "Мечта", 
                "Память", "Будущее", "Прошлое", "Настоящее", "Сердце", "Мозг", "Рука", "Нога", "Зуб", "Волосы", 
                "Лицо", "Недоумение", "Сдержанность", "Восхищение", "Сомнение", "Озарение", "Равновесие", "Изменение", "Умение", "Значение",
                "Влияние", "Разум", "Система", "Структура", "Фантазия", "Желание", "Победа", "Поражение", "Надежда", "Интерес",
                "Наблюдение", "Обсуждение", "Прогресс", "Отношение", "Природа", "Искусство", "Философия", "Технология", "Эмоция", "Вдохновение",
                "Размышление", "Убедительный", "Сложный", "Ясный", "Глубокий", "Поверхностный", "Цель", "Средство", "Результат", "Направление"
            ],
            // Boshqa tillar uchun ham kengaytirilgan ro'yxatlar mavjud
        },
        populateLanguageSelect() {
            const select = document.getElementById('language-select');
            if (!select) return;
            Object.keys(this.languages).forEach(langCode => {
                const language = this.languages[langCode];
                const option = document.createElement('option');
                option.value = langCode;
                option.textContent = language.name;
                if (langCode === 'en') {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        }
    };
    
    // === FIREBASE INIT & AUTH ===
    async function initFirebase() {
        showPhase(loadingState);

        try {
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);

            // Til tanlashni yuklash
            DataManager.populateLanguageSelect();

            // Event listenerlarni o'rnatish
            setupEventListeners();
            
            // Avtorizatsiya holatini tekshirish
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    userId = user.uid;
                    console.log("Foydalanuvchi tizimga kirdi:", userId);
                    // Auth bo'lgandan keyin sozlamalar ekranini ko'rsatish
                    showPhase(settingsPhase);
                } else {
                    // Anonim yoki custom token bilan kirish
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                }
            });

        } catch (error) {
            console.error("Firebase init/auth xatosi:", error);
            loadingState.innerHTML = `<p class="text-red-500">Firebase ulanishida xato: ${error.message}</p>`;
            loadingState.classList.remove('hidden');
            showPhase(null);
        }
    }

    // === UTILITY FUNCTIONS ===
    function showPhase(phaseElement) {
        [settingsPhase, studyPhase, testPhase, resultsPhase, loadingState].forEach(el => {
            if (el) el.classList.add('hidden');
        });
        if (phaseElement) {
            phaseElement.classList.remove('hidden');
        }
    }

    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Arrayni aralashtirish funksiyasi (Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // === EVENT LISTENERS ===
    function setupEventListeners() {
        // Yordamchi funksiya element mavjudligini tekshirish uchun
        const safeAddListener = (id, event, handler) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener(event, handler);
            }
        };

        safeAddListener('start-test-btn', 'click', startMemorization);
        safeAddListener('ready-btn', 'click', startTestPhase);
        
        // Yodlash bosqichi navigatsiyasi
        safeAddListener('next-word-btn-mobile', 'click', () => nextWord(1));
        safeAddListener('prev-word-btn-mobile', 'click', () => nextWord(-1));
        safeAddListener('next-word-btn-desktop', 'click', () => nextWord(1));
        safeAddListener('prev-word-btn-desktop', 'click', () => nextWord(-1));

        // Klaviatura boshqaruvi
        document.addEventListener('keydown', handleKeyDown);
    }
    
    function handleKeyDown(event) {
        // Faqat yodlash bosqichida ishlash
        if (studyPhase.classList.contains('hidden')) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            nextWord(1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            nextWord(-1);
        }
    }


    // === FIREBASE / SO'ZLARNI YUKLASH FUNKSIYASI (TAKRORLANMASDAN) ===
    async function fetchWords(langCode) {
        showPhase(loadingState);

        const docId = `words_${langCode}`;
        const wordsDocRef = doc(db, `artifacts/${appId}/public/data/word_lists`, docId);
        
        try {
            const docSnap = await getDoc(wordsDocRef);
            let fetchedWords = [];

            if (docSnap.exists()) {
                fetchedWords = docSnap.data().words || [];
            } else {
                // Agar topilmasa, mavjud kengaytirilgan mock ro'yxatni saqlash
                fetchedWords = DataManager.baseWords[langCode] || DataManager.baseWords.en;
                await setDoc(wordsDocRef, { words: fetchedWords }, { merge: true });
            }
            
            // 1. So'zlarni aralashtirish
            shuffleArray(fetchedWords);
            
            // 2. Foydalanuvchi so'ragan so'zlar sonini cheklash (bu takrorlanishni oldini oladi)
            const finalWords = fetchedWords.slice(0, gameSettings.wordsCount);

            if (finalWords.length < gameSettings.wordsCount) {
                console.warn(`Ogohlantirish: So'ralgan ${gameSettings.wordsCount} so'zning faqat ${finalWords.length} tasi topildi.`)
            }

            return finalWords;

        } catch (e) {
            console.error("So'zlarni yuklashda xato:", e);
            // Xato yuz bersa ham, eng yaxshi bazadan takrorlanmaydigan so'zlarni qaytarish
            let fallbackWords = DataManager.baseWords[langCode] || DataManager.baseWords.en;
            shuffleArray(fallbackWords);
            return fallbackWords.slice(0, gameSettings.wordsCount);
        } finally {
            loadingState.classList.add('hidden');
        }
    }


    // === MASHQNI BOSHLASH ===
    async function startMemorization() {
        const languageCode = document.getElementById('language-select').value;
        const wordsCountInput = document.getElementById('words-count');
        const studyTimeInput = document.getElementById('study-time');
        
        const wordsCount = parseInt(wordsCountInput.value);
        const studyTime = parseInt(studyTimeInput.value);

        if (wordsCount < 5 || wordsCount > 500) {
            console.error('So\'zlar soni 5 dan 500 gacha bo\'lishi kerak');
            wordsCountInput.value = Math.min(500, Math.max(5, wordsCount)); // Chegaraga moslash
            return;
        }

        if (studyTime < 10 || studyTime > 300) {
            console.error('Vaqt 10 soniyadan 300 soniyagacha bo\'lishi kerak');
            studyTimeInput.value = Math.min(300, Math.max(10, studyTime)); // Chegaraga moslash
            return;
        }

        gameSettings = { languageCode, wordsCount, studyTime };
        
        // Yangi funksiya: takrorlanmaydigan so'zlarni oladi
        wordsToMemorize = await fetchWords(languageCode);
        
        if (wordsToMemorize.length === 0) {
            console.error("So'zlar yuklanmadi. Iltimos, keyinroq urinib ko'ring.");
            return;
        }

        currentWordIndex = 0;
        
        showPhase(studyPhase);
        renderStudyPhase();
    }

    // === YODLASH BOSQICHI FUNKSIYALARI ===
    function renderStudyPhase() {
        // Oldingi taymerni to'xtatish
        if (timerInterval) clearInterval(timerInterval);

        document.getElementById('total-words-count').textContent = wordsToMemorize.length;

        displayCurrentWord();
        startTimer();
    }

    function displayCurrentWord() {
        const wordDisplay = document.getElementById('word-display');
        const currentWordNumber = document.getElementById('current-word-number');
        const prevBtnDesktop = document.getElementById('prev-word-btn-desktop');
        const prevBtnMobile = document.getElementById('prev-word-btn-mobile');
        const nextBtnDesktop = document.getElementById('next-word-btn-desktop');
        const nextBtnMobile = document.getElementById('next-word-btn-mobile');

        if (!wordDisplay || !currentWordNumber) return;

        if (currentWordIndex >= 0 && currentWordIndex < wordsToMemorize.length) {
            // Animatsiyani qo'llash uchun HTMLni yangilash
            // word-animation klassi har gal yangi so'z ko'rsatilganda qo'shiladi
            wordDisplay.innerHTML = `<p class="word-animation">${wordsToMemorize[currentWordIndex]}</p>`;
            currentWordNumber.textContent = currentWordIndex + 1;
        } else {
            // Chegaradan tashqariga chiqsa, joyida qolish
            currentWordIndex = Math.max(0, Math.min(wordsToMemorize.length - 1, currentWordIndex));
        }

        // Navigatsiya tugmalarini boshqarish
        const isFirst = currentWordIndex === 0;
        const isLast = currentWordIndex === wordsToMemorize.length - 1;

        [prevBtnDesktop, prevBtnMobile].forEach(btn => {
            if (!btn) return;
            btn.disabled = isFirst;
            btn.classList.toggle('opacity-30', isFirst);
            btn.classList.toggle('cursor-not-allowed', isFirst);
        });

        [nextBtnDesktop, nextBtnMobile].forEach(btn => {
            if (!btn) return;
            btn.disabled = isLast;
            btn.classList.toggle('opacity-30', isLast);
            btn.classList.toggle('cursor-not-allowed', isLast);
        });
    }

    function nextWord(step) {
        const newIndex = currentWordIndex + step;
        if (newIndex >= 0 && newIndex < wordsToMemorize.length) {
            currentWordIndex = newIndex;
            displayCurrentWord();
        }
    }

    function startTimer() {
        let timeLeft = gameSettings.studyTime;
        const timerDisplay = document.getElementById('timer-display');
        if (!timerDisplay) return;
        
        // Taymerni har 10 sekundda o'chib-yonishini boshqarish
        function updateTimerDisplay() {
            timerDisplay.textContent = formatTime(timeLeft);
            if (timeLeft <= 10) {
                timerDisplay.classList.add('text-red-700', 'timer-flash');
            } else {
                timerDisplay.classList.remove('text-red-700', 'timer-flash');
                timerDisplay.classList.add('text-red-600');
            }
        }

        updateTimerDisplay(); // Boshlang'ich qiymatni o'rnatish

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft < 0) {
                clearInterval(timerInterval);
                startTestPhase(); // Vaqt tugadi, testga o'tish
            }
        }, 1000);
    }

    // === TEST BOSQICHIGA O'TISH ===
    function startTestPhase() {
        if (timerInterval) clearInterval(timerInterval);
        showPhase(testPhase);
        renderTestPhase();
    }

    function renderTestPhase() {
        // Test uchun sarlavha va kirish maydonlarini yaratish
        const inputsHtml = wordsToMemorize.map((_, index) => `
            <div class="mb-4">
                <label for="word-${index}" class="block text-sm font-semibold text-gray-700 mb-1">So'z #${index + 1}:</label>
                <input type="text" id="word-${index}" name="word-${index}" 
                       class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-md focus:ring-blue-500 focus:border-blue-500 text-lg transition duration-150" 
                       placeholder="So'zni tartib bo'yicha kiriting..." autocomplete="off">
            </div>
        `).join('');

        testPhase.innerHTML = `
            <div class="p-4">
                <h2 class="text-2xl font-extrabold text-gray-800 mb-6 text-center border-b-2 pb-2 border-indigo-400">So'zlarni Yozing (Tartibni Buzmang)</h2>
                <form id="test-form">
                    ${inputsHtml}
                    <div class="mt-8 text-center">
                        <button type="submit" id="check-answers-btn" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 px-4 rounded-xl shadow-2xl animated-btn focus:outline-none focus:ring-4 focus:ring-indigo-400">
                            Javoblarni Tekshirish
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Test formasini topish va unga tinglovchini biriktirish
        const testForm = document.getElementById('test-form');
        if (testForm) {
            testForm.addEventListener('submit', handleCheckAnswers);
        } else {
            console.error("Test formasi topilmadi.");
        }
    }

    function handleCheckAnswers(event) {
        event.preventDefault();
        
        // Elementlarni ID orqali emas, balki wordsToMemorize massiviga asoslanib loop qilib olish
        const userAnswers = wordsToMemorize.map((_, index) => {
            const input = document.getElementById(`word-${index}`);
            // input qiymatini olishda xavfsizlik
            return input ? input.value.trim() : '';
        });

        renderResultsPhase(userAnswers);
    }

    // === NATIJALAR BOSQICHI ===
    function renderResultsPhase(userAnswers) {
        let correctCount = 0;
        
        const resultsHtml = wordsToMemorize.map((correctWord, index) => {
            const userAnswer = userAnswers[index];
            // Katta/kichik harflarni hisobga olmasdan solishtirish
            const isCorrect = correctWord.toLowerCase() === userAnswer.toLowerCase();
            
            if (isCorrect) {
                correctCount++;
            }

            const statusClass = isCorrect ? "result-item-correct" : "result-item-incorrect";

            return `
                <li class="p-4 mb-3 rounded-xl shadow-lg flex justify-between items-start gap-4 ${statusClass} transition-all duration-300 transform hover:scale-[1.01]">
                    <div class="flex-shrink-0 mt-1">
                         <span class="text-3xl">${isCorrect ? '🌟' : '⚠️'}</span>
                    </div>
                    <div class="flex-1">
                        <p class="text-xs font-semibold uppercase text-gray-600">So'z #${index + 1} / Yodlanishi kerak edi:</p>
                        <p class="text-xl font-bold text-gray-900">${correctWord}</p>
                        <p class="text-sm font-medium text-gray-700 mt-1">Sizning javobingiz: <span class="${isCorrect ? 'text-green-700' : 'text-red-700'} font-extrabold">${userAnswer || 'Javob berilmagan'}</span></p>
                    </div>
                </li>
            `;
        }).join('');

        const totalWords = wordsToMemorize.length;
        const totalScore = correctCount;
        const scorePercentage = totalWords > 0 ? (correctCount / totalWords) * 100 : 0;
        const resultText = scorePercentage >= 80 ? "A'lo natija! 🧠" : (scorePercentage >= 50 ? "Yaxshi urinish! 💪" : "Ko'proq e'tibor bering. 🧐");

        resultsPhase.innerHTML = `
            <div class="p-4">
                <h2 class="text-3xl font-extrabold text-gray-900 mb-8 text-center">${resultText}</h2>
                
                <div class="bg-indigo-100 p-8 rounded-2xl shadow-xl mb-8 text-center border-t-4 border-indigo-600">
                    <p class="text-xl font-bold text-indigo-700 mb-3">Umumiy Ball:</p>
                    <p class="text-6xl font-extrabold ${correctCount > totalWords * 0.7 ? 'text-green-600' : 'text-red-600'} animate-pulse">${totalScore} / ${totalWords}</p>
                    <p class="text-lg text-gray-600 mt-4 font-semibold">To'g'ri javoblar ulushi: <span class="text-indigo-800">${scorePercentage.toFixed(1)}%</span></p>
                </div>

                <ul class="list-none p-0 max-h-[400px] overflow-y-auto pr-2">
                    ${resultsHtml}
                </ul>

                <div class="mt-8 text-center">
                    <button id="start-new-test" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-4 rounded-xl shadow-2xl animated-btn focus:outline-none focus:ring-4 focus:ring-blue-400">
                        Yangi Mashqni Boshlash
                    </button>
                </div>
            </div>
        `;

        document.getElementById('start-new-test').addEventListener('click', () => showPhase(settingsPhase));
        showPhase(resultsPhase); // Natijalar bosqichini ko'rsatish
    }

    // Ilovani boshlash
    document.addEventListener('DOMContentLoaded', initFirebase);
</script>

</body>
</html>
