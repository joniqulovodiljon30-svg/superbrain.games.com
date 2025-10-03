// So'zlar bazasi
const wordDatabase = {
    uz: ["olma", "kitob", "uy", "mashina", "daraxt", "quyosh", "oy", "yulduz", "daryo", "tog'", "shahar", "maktab", "o'qituvchi", "talaba", "dunyo", "hayot", "sevgi", "do'st", "ona", "ota"],
    en: ["apple", "book", "house", "car", "tree", "sun", "moon", "star", "river", "mountain", "city", "school", "teacher", "student", "world", "life", "love", "friend", "mother", "father"],
    ru: ["яблоко", "книга", "дом", "машина", "дерево", "солнце", "луна", "звезда", "река", "гора", "город", "школа", "учитель", "студент", "мир", "жизнь", "любовь", "друг", "мать", "отец"],
    es: ["manzana", "libro", "casa", "coche", "árbol", "sol", "luna", "estrella", "río", "montaña", "ciudad", "escuela", "maestro", "estudiante", "mundo", "vida", "amor", "amigo", "madre", "padre"],
    ar: ["تفاحة", "كتاب", "بيت", "سيارة", "شجرة", "شمس", "قمر", "نجمة", "نهر", "جبل", "مدينة", "مدرسة", "معلم", "طالب", "عالم", "حياة", "حب", "صديق", "أم", "أب"],
    tr: ["elma", "kitap", "ev", "araba", "ağaç", "güneş", "ay", "yıldız", "nehir", "dağ", "şehir", "okul", "öğretmen", "öğrenci", "dünya", "hayat", "aşk", "arkadaş", "anne", "baba"]
};

// Flashcards ma'lumotlar bazasi
const flashcardDatabase = {
    en: {
        language: "English",
        flag: "🇺🇸",
        topics: {
            "asosiy-sozlar": {
                title: "Asosiy So'zlar",
                description: "Kundalik hayotda eng ko'p ishlatiladigan so'zlar",
                words: [
                    { word: "hello", pronunciation: "/həˈloʊ/", translation: "salom", definition: "Xush kelibsiz degan ma'noni anglatadi", example: "Hello, how are you?" },
                    { word: "goodbye", pronunciation: "/ˌɡʊdˈbaɪ/", translation: "xayr", definition: "Xayrlashish uchun ishlatiladi", example: "Goodbye, see you tomorrow!" },
                    { word: "thank you", pronunciation: "/ˈθæŋk juː/", translation: "rahmat", definition: "Minnatdorchilik bildiradi", example: "Thank you for your help." },
                    { word: "please", pronunciation: "/pliːz/", translation: "iltimos", definition: "Iltimos qilish", example: "Please help me." },
                    { word: "yes", pronunciation: "/jes/", translation: "ha", definition: "Ijobiy javob", example: "Yes, I understand." },
                    { word: "no", pronunciation: "/noʊ/", translation: "yo'q", definition: "Salbiy javob", example: "No, thank you." },
                    { word: "water", pronunciation: "/ˈwɔːtər/", translation: "suv", definition: "Suv", example: "I need water." },
                    { word: "food", pronunciation: "/fuːd/", translation: "ovqat", definition: "Ovqat", example: "I like Chinese food." },
                    { word: "time", pronunciation: "/taɪm/", translation: "vaqt", definition: "Vaqt", example: "What time is it?" },
                    { word: "day", pronunciation: "/deɪ/", translation: "kun", definition: "Kun", example: "Have a nice day!" },
                    { word: "night", pronunciation: "/naɪt/", translation: "tun", definition: "Tun", example: "Good night!" },
                    { word: "man", pronunciation: "/mæn/", translation: "erkak", definition: "Erkak kishi", example: "He is a tall man." },
                    { word: "woman", pronunciation: "/ˈwʊmən/", translation: "ayol", definition: "Ayol kishi", example: "She is a strong woman." },
                    { word: "child", pronunciation: "/tʃaɪld/", translation: "bola", definition: "Bola", example: "The child is playing." },
                    { word: "family", pronunciation: "/ˈfæm.ə.li/", translation: "oila", definition: "Oila", example: "I love my family." },
                    { word: "friend", pronunciation: "/frend/", translation: "do'st", definition: "Do'st", example: "She is my best friend." },
                    { word: "home", pronunciation: "/hoʊm/", translation: "uy", definition: "Uy", example: "I'm going home." },
                    { word: "school", pronunciation: "/skuːl/", translation: "maktab", definition: "Maktab", example: "I go to school every day." },
                    { word: "work", pronunciation: "/wɜːrk/", translation: "ish", definition: "Ish", example: "I have to work today." },
                    { word: "love", pronunciation: "/lʌv/", translation: "sevgi", definition: "Sevgi", example: "I love my family." }
                ]
            },
            "oila-va-odamlar": {
                title: "Oila va Odamlar",
                description: "Oila a'zolari va insonlar haqidagi so'zlar",
                words: [
                    { word: "mother", pronunciation: "/ˈmʌð.ər/", translation: "ona", definition: "Ayol ota-ona", example: "My mother is a teacher." },
                    { word: "father", pronunciation: "/ˈfɑː.ðər/", translation: "ota", definition: "Erkak ota-ona", example: "My father works in an office." },
                    { word: "brother", pronunciation: "/ˈbrʌð.ər/", translation: "aka", definition: "Erkak aka-uka", example: "I have two brothers." },
                    { word: "sister", pronunciation: "/ˈsɪs.tər/", translation: "opa", definition: "Ayol opa-singil", example: "My sister is a doctor." },
                    { word: "son", pronunciation: "/sʌn/", translation: "o'g'il", definition: "O'g'il farzand", example: "Their son is very smart." },
                    { word: "daughter", pronunciation: "/ˈdɔː.tər/", translation: "qiz", definition: "Qiz farzand", example: "My daughter loves to read." },
                    { word: "grandmother", pronunciation: "/ˈɡræn.mʌð.ər/", translation: "buvi", definition: "Onaning yoki otaning onasi", example: "My grandmother bakes cookies." },
                    { word: "grandfather", pronunciation: "/ˈɡræn.fɑː.ðər/", translation: "bobo", definition: "Onaning yoki otaning otasi", example: "My grandfather tells great stories." },
                    { word: "uncle", pronunciation: "/ˈʌŋ.kəl/", translation: "amaki", definition: "Ota yoki onaning akasi", example: "My uncle lives in Canada." },
                    { word: "aunt", pronunciation: "/ænt/", translation: "amma", definition: "Ota yoki onaning opasi", example: "My aunt is a painter." }
                ]
            },
            "raqamlar-va-ranglar": {
                title: "Raqamlar va Ranglar",
                description: "Raqamlar va asosiy ranglar",
                words: [
                    { word: "one", pronunciation: "/wʌn/", translation: "bir", definition: "1 raqami", example: "I have one brother." },
                    { word: "two", pronunciation: "/tuː/", translation: "ikki", definition: "2 raqami", example: "Two apples, please." },
                    { word: "three", pronunciation: "/θriː/", translation: "uch", definition: "3 raqami", example: "I have three cats." },
                    { word: "four", pronunciation: "/fɔːr/", translation: "to'rt", definition: "4 raqami", example: "There are four seasons." },
                    { word: "five", pronunciation: "/faɪv/", translation: "besh", definition: "5 raqami", example: "I work five days a week." },
                    { word: "red", pronunciation: "/red/", translation: "qizil", definition: "Qizil rang", example: "I have a red car." },
                    { word: "blue", pronunciation: "/bluː/", translation: "ko'k", definition: "Ko'k rang", example: "The sky is blue." },
                    { word: "green", pronunciation: "/ɡriːn/", translation: "yashil", definition: "Yashil rang", example: "Grass is green." },
                    { word: "yellow", pronunciation: "/ˈjel.oʊ/", translation: "sariq", definition: "Sariq rang", example: "Sunflowers are yellow." },
                    { word: "black", pronunciation: "/blæk/", translation: "qora", definition: "Qora rang", example: "I like black coffee." }
                ]
            },
            "ovqat-va-ichimliklar": {
                title: "Ovqat va Ichimliklar",
                description: "Turli xil ovqatlar va ichimliklar",
                words: [
                    { word: "apple", pronunciation: "/ˈæp.əl/", translation: "olma", definition: "Olma mevasi", example: "I eat an apple every day." },
                    { word: "bread", pronunciation: "/bred/", translation: "non", definition: "Non", example: "I buy bread from the bakery." },
                    { word: "rice", pronunciation: "/raɪs/", translation: "guruch", definition: "Guruch", example: "We eat rice with curry." },
                    { word: "meat", pronunciation: "/miːt/", translation: "go'sht", definition: "Go'sht", example: "I don't eat meat." },
                    { word: "fish", pronunciation: "/fɪʃ/", translation: "baliq", definition: "Baliq", example: "We had fish for dinner." },
                    { word: "water", pronunciation: "/ˈwɔː.tər/", translation: "suv", definition: "Suv", example: "Drink more water." },
                    { word: "coffee", pronunciation: "/ˈkɒf.i/", translation: "qahva", definition: "Qahva", example: "I drink coffee in the morning." },
                    { word: "tea", pronunciation: "/tiː/", translation: "choy", definition: "Choy", example: "Would you like some tea?" },
                    { word: "milk", pronunciation: "/mɪlk/", translation: "sut", definition: "Sut", example: "Children need milk." },
                    { word: "juice", pronunciation: "/dʒuːs/", translation: "sharbat", definition: "Sharbat", example: "Orange juice is my favorite." }
                ]
            },
            "sifatlar": {
                title: "Sifatlar",
                description: "Narsalarni tavsiflovchi so'zlar",
                words: [
                    { word: "big", pronunciation: "/bɪɡ/", translation: "katta", definition: "Katta", example: "They live in a big house." },
                    { word: "small", pronunciation: "/smɔːl/", translation: "kichik", definition: "Kichik", example: "I have a small car." },
                    { word: "hot", pronunciation: "/hɒt/", translation: "issiq", definition: "Issiq", example: "The weather is hot today." },
                    { word: "cold", pronunciation: "/kəʊld/", translation: "sovuq", definition: "Sovuq", example: "The water is cold." },
                    { word: "beautiful", pronunciation: "/ˈbjuː.tɪ.fəl/", translation: "chiroyli", definition: "Chiroyli", example: "She is a beautiful woman." },
                    { word: "ugly", pronunciation: "/ˈʌɡ.li/", translation: "xunuk", definition: "Xunuk", example: "That's an ugly building." },
                    { word: "rich", pronunciation: "/rɪtʃ/", translation: "boy", definition: "Boy", example: "He is a rich man." },
                    { word: "poor", pronunciation: "/pɔːr/", translation: "kambag'al", definition: "Kambag'al", example: "We should help poor people." },
                    { word: "happy", pronunciation: "/ˈhæp.i/", translation: "baxtli", definition: "Baxtli", example: "I'm happy to see you." },
                    { word: "sad", pronunciation: "/sæd/", translation: "qayg'uli", definition: "Qayg'uli", example: "Why are you sad?" }
                ]
            }
        }
    },
    ru: {
        language: "Русский",
        flag: "🇷🇺",
        topics: {
            "основные-слова": {
                title: "Основные Слова",
                description: "Самые используемые слова в повседневной жизни",
                words: [
                    { word: "привет", pronunciation: "/prɪˈvʲet/", translation: "salom", definition: "Приветствие", example: "Привет, как дела?" },
                    { word: "спасибо", pronunciation: "/spɐˈsʲibə/", translation: "rahmat", definition: "Благодарность", example: "Спасибо за помощь." },
                    { word: "да", pronunciation: "/da/", translation: "ha", definition: "Утвердительный ответ", example: "Да, я понимаю." },
                    { word: "нет", pronunciation: "/nʲet/", translation: "yo'q", definition: "Отрицательный ответ", example: "Нет, спасибо." },
                    { word: "вода", pronunciation: "/vɐˈda/", translation: "suv", definition: "Вода", example: "Мне нужна вода." },
                    { word: "еда", pronunciation: "/jɪˈda/", translation: "ovqat", definition: "Еда", example: "Я люблю китайскую еду." },
                    { word: "время", pronunciation: "/ˈvrʲemʲə/", translation: "vaqt", definition: "Время", example: "Который час?" },
                    { word: "день", pronunciation: "/dʲenʲ/", translation: "kun", definition: "День", example: "Хорошего дня!" },
                    { word: "ночь", pronunciation: "/not͡ɕ/", translation: "tun", definition: "Ночь", example: "Спокойной ночи!" },
                    { word: "человек", pronunciation: "/t͡ɕɪɫɐˈvʲek/", translation: "odam", definition: "Человек", example: "Он высокий человек." }
                ]
            },
            "семья": {
                title: "Семья",
                description: "Члены семьи и родственники",
                words: [
                    { word: "мать", pronunciation: "/matʲ/", translation: "ona", definition: "Мать", example: "Моя мать - учительница." },
                    { word: "отец", pronunciation: "/ɐˈtʲet͡s/", translation: "ota", definition: "Отец", example: "Мой отец работает в офисе." },
                    { word: "брат", pronunciation: "/brat/", translation: "aka", definition: "Брат", example: "У меня два брата." },
                    { word: "сестра", pronunciation: "/sʲɪˈstra/", translation: "opa", definition: "Сестра", example: "Моя сестра - врач." },
                    { word: "сын", pronunciation: "/sɨn/", translation: "o'g'il", definition: "Сын", example: "Их сын очень умный." }
                ]
            }
        }
    },
    es: {
        language: "Español",
        flag: "🇪🇸",
        topics: {
            "palabras-basicas": {
                title: "Palabras Básicas",
                description: "Palabras más usadas en la vida diaria",
                words: [
                    { word: "hola", pronunciation: "/ˈola/", translation: "salom", definition: "Saludo", example: "¡Hola! ¿Cómo estás?" },
                    { word: "gracias", pronunciation: "/ˈɡɾaθjas/", translation: "rahmat", definition: "Agradecimiento", example: "Gracias por tu ayuda." },
                    { word: "sí", pronunciation: "/ˈsi/", translation: "ha", definition: "Respuesta afirmativa", example: "Sí, entiendo." },
                    { word: "no", pronunciation: "/ˈno/", translation: "yo'q", definition: "Respuesta negativa", example: "No, gracias." },
                    { word: "agua", pronunciation: "/ˈaɡwa/", translation: "suv", definition: "Agua", example: "Necesito agua." },
                    { word: "comida", pronunciation: "/koˈmiða/", translation: "ovqat", definition: "Comida", example: "Me gusta la comida china." },
                    { word: "tiempo", pronunciation: "/ˈtjempo/", translation: "vaqt", definition: "Tiempo", example: "¿Qué hora es?" },
                    { word: "día", pronunciation: "/ˈdia/", translation: "kun", definition: "Día", example: "¡Ten un buen día!" },
                    { word: "noche", pronunciation: "/ˈnot͡ʃe/", translation: "tun", definition: "Noche", example: "¡Buenas noches!" },
                    { word: "persona", pronunciation: "/peɾˈsona/", translation: "odam", definition: "Persona", example: "Él es una persona alta." }
                ]
            }
        }
    },
    ar: {
        language: "العربية",
        flag: "🇸🇦", 
        topics: {
            "الكلمات-الأساسية": {
                title: "الكلمات الأساسية",
                description: "الكلمات الأكثر استخداماً في الحياة اليومية",
                words: [
                    { word: "مرحبا", pronunciation: "/marħaban/", translation: "salom", definition: "تحية", example: "مرحبا، كيف حالك؟" },
                    { word: "شكرا", pronunciation: "/ʃukran/", translation: "rahmat", definition: "شكر", example: "شكرا لمساعدتك." },
                    { word: "نعم", pronunciation: "/naʕam/", translation: "ha", definition: "رد بالإيجاب", example: "نعم، أفهم." },
                    { word: "لا", pronunciation: "/laː/", translation: "yo'q", definition: "رد بالنفي", example: "لا، شكرا." }
                ]
            }
        }
    },
    tr: {
        language: "Türkçe",
        flag: "🇹🇷",
        topics: {
            "temel-kelimeler": {
                title: "Temel Kelimeler",
                description: "Günlük hayatta en çok kullanılan kelimeler",
                words: [
                    { word: "merhaba", pronunciation: "/merˈhaba/", translation: "salom", definition: "Selamlama", example: "Merhaba, nasılsın?" },
                    { word: "teşekkürler", pronunciation: "/teʃekˈkyɾleɾ/", translation: "rahmat", definition: "Teşekkür", example: "Yardımın için teşekkürler." },
                    { word: "evet", pronunciation: "/eˈvet/", translation: "ha", definition: "Olumlu cevap", example: "Evet, anlıyorum." },
                    { word: "hayır", pronunciation: "/haˈjɯɾ/", translation: "yo'q", definition: "Olumsuz cevap", example: "Hayır, teşekkürler." }
                ]
            }
        }
    },
    uz: {
        language: "O'zbek",
        flag: "🇺🇿",
        topics: {
            "asosiy-sozlar": {
                title: "Asosiy So'zlar",
                description: "Kundalik hayotda eng ko'p ishlatiladigan so'zlar",
                words: [
                    { word: "salom", pronunciation: "/sa'lom/", translation: "hello", definition: "Xush kelibsiz degan ma'noni anglatadi", example: "Salom, yaxshimisiz?" },
                    { word: "rahmat", pronunciation: "/rah'mat/", translation: "thank you", definition: "Minnatdorchilik bildiradi", example: "Yordamingiz uchun rahmat." },
                    { word: "ha", pronunciation: "/ha/", translation: "yes", definition: "Ijobiy javob", example: "Ha, tushundim." },
                    { word: "yo'q", pronunciation: "/joq/", translation: "no", definition: "Salbiy javob", example: "Yo'q, rahmat." }
                ]
            }
        }
    }
};

// Yuz va ismlar ma'lumotlari
const facesDatabase = [
    { name: "Ali", country: "O'zbekiston", avatar: "👨‍💼", age: "28 yosh" },
    { name: "Maria", country: "Ispaniya", avatar: "👩‍⚕️", age: "32 yosh" },
    { name: "John", country: "AQSH", avatar: "👨‍🔬", age: "45 yosh" },
    { name: "Fatima", country: "Arabiston", avatar: "👩‍🎓", age: "24 yosh" },
    { name: "Mehmet", country: "Turkiya", avatar: "👨‍🍳", age: "38 yosh" },
    { name: "Elena", country: "Rossiya", avatar: "👩‍🎨", age: "29 yosh" },
    { name: "Carlos", country: "Meksika", avatar: "👨‍🌾", age: "41 yosh" },
    { name: "Yuki", country: "Yaponiya", avatar: "👩‍💻", age: "26 yosh" },
    { name: "David", country: "Angliya", avatar: "👨‍🎤", age: "33 yosh" },
    { name: "Sophie", country: "Fransiya", avatar: "👩‍🍳", age: "30 yosh" },
    { name: "Ahmed", country: "Misr", avatar: "👨‍🏫", age: "50 yosh" },
    { name: "Isabella", country: "Italiya", avatar: "👩‍🎭", age: "27 yosh" },
    { name: "Chen", country: "Xitoy", avatar: "👨‍💼", age: "35 yosh" },
    { name: "Anna", country: "Germaniya", avatar: "👩‍🏫", age: "42 yosh" },
    { name: "Raj", country: "Hindiston", avatar: "👨‍🎓", age: "31 yosh" }
];

// Rasmlar ma'lumotlari
const imagesDatabase = [
    { description: "Qizil mashina", category: "Transport", emoji: "🚗" },
    { description: "Yashil daraxt", category: "Tabiat", emoji: "🌳" },
    { description: "Ko'k osmon", category: "Tabiat", emoji: "🌌" },
    { description: "Sariq quyosh", category: "Tabiat", emoji: "☀️" },

    { description: "Oq uy", category: "Binol":, emoji " " },
    
