<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mnemonic World: Vocabulary Builder</title>
    <!-- Load Tailwind CSS for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom styles for a cleaner, mnemonic-focused look */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        
        :root {
            --primary-color: #4f46e5; /* Indigo */
            --secondary-color: #10b981; /* Emerald */
            --background-dark: #111827; /* Gray 900 - Darker background */
            --card-background: #1f2937; /* Gray 800 */
            --text-primary: #f9fafb; /* White */
            --text-secondary: #d1d5db; /* Gray 300 */
            --error-color: #ef4444;
            --border-color: #374151;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background-dark);
            color: var(--text-primary);
        }

        .card {
            background-color: var(--card-background);
            border: 1px solid var(--border-color);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
            transition: all 0.3s ease;
        }

        .btn-primary {
            background-color: var(--primary-color);
            transition: background-color 0.2s, transform 0.1s;
        }

        .btn-primary:hover {
            background-color: #4338ca;
            transform: translateY(-1px);
        }
        
        .btn-secondary {
            background-color: var(--secondary-color);
            transition: background-color 0.2s, transform 0.1s;
        }

        .btn-secondary:hover {
            background-color: #059669;
            transform: translateY(-1px);
        }


        /* Input styling */
        input[type="number"],
        input[type="text"],
        select,
        .mnemonic-input-field {
            background-color: #374151;
            border-color: #4b5563;
            color: var(--text-primary);
            transition: border-color 0.2s;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 1px var(--primary-color);
        }

        /* Word Item for Display Screen */
        .word-item {
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
            animation: fadeIn 0.5s ease-out;
        }

        .word-item:last-child {
            border-bottom: none;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Mnemonic Text Area */
        .mnemonic-input-field {
            width: 100%;
            padding: 0.75rem;
            margin-top: 0.5rem;
            border-radius: 8px;
            resize: vertical;
            font-size: 0.9em;
            min-height: 80px; 
        }

        /* Timer Pulse Animation */
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        /* Result Item Colors */
        .result-item.correct {
            border-left: 4px solid var(--secondary-color);
            background-color: #1f2937;
        }
        .result-item.incorrect {
            border-left: 4px solid var(--error-color);
            background-color: #374151;
        }

        /* Hint/Mnemonic Display */
        .mnemonic-hint {
            font-size: 0.85rem;
            font-style: italic;
            color: #93c5fd !important; /* Blue tint for hint */
            margin-top: 0.5rem;
            padding-left: 10px;
            border-left: 3px solid #60a5fa;
            background-color: #374151;
            padding: 5px;
            border-radius: 4px;
        }
        
        /* Spinner styles */
        .loader {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid #3498db;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .tts-button.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

    </style>
</head>
<body class="min-h-screen p-4 sm:p-8 flex justify-center items-start">

    <div id="words-section" class="w-full max-w-2xl">
        <header class="text-center mb-8">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">🧠 Mnemonic Builder</h1>
            <p class="text-indigo-400 mt-2">Shaxsiy tasvirlar va hikoyalar orqali samarali o'rganish.</p>
        </header>

        <!-- Back Button for all sections -->
        <button id="global-back-btn" class="back-btn mb-4 px-4 py-2 text-sm font-medium rounded-full bg-gray-600 text-white hover:bg-gray-500 hidden" onclick="WordsGame.goBack()">
            &larr; Orqaga
        </button>

        <!-- 1. SOZLAMALAR EKRANI (Settings Screen) -->
        <div id="words-settings" class="card p-6 sm:p-8 rounded-xl">
            <h2 class="text-2xl font-bold mb-6 text-center text-primary-color">O'yinni Sozlash</h2>

            <div class="space-y-4">
                <div class="flex flex-col">
                    <label for="words-language" class="mb-2 font-medium text-indigo-300">Tilni tanlang:</label>
                    <!-- Til tanlash joyi: ID `words-language` -->
                    <select id="words-language" class="p-3 rounded-lg border"></select>
                </div>

                <div class="flex flex-col">
                    <label for="words-count" class="mb-2 font-medium text-indigo-300">So'zlar soni (5-500):</label>
                    <input type="number" id="words-count" class="p-3 rounded-lg border" value="20" min="5" max="500">
                </div>

                <div class="flex flex-col">
                    <label for="words-time" class="mb-2 font-medium text-indigo-300">O'rganish vaqti (sekundda):</label>
                    <input type="number" id="words-time" class="p-3 rounded-lg border" value="90" min="10" max="600">
                </div>
            </div>

            <button id="start-words" class="btn-primary w-full mt-8 p-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300">
                O'yinni Boshlash
            </button>
        </div>

        <!-- 2. SO'ZLANI KO'RSATISH EKRANI (Display/Study Screen) -->
        <div id="words-display" class="hidden">
            <div class="sticky top-0 z-20 flex justify-between items-center mb-4 p-4 card rounded-xl">
                <h2 class="text-xl font-bold text-indigo-300">📚 Mnemoniya Yaratish (O'rganish)</h2>
                <div id="words-timer" class="text-2xl font-extrabold px-4 py-1 rounded-full bg-gray-600 text-white shadow-inner">0:00</div>
            </div>
            
            <div id="words-list" class="card rounded-xl overflow-hidden p-0 max-h-[70vh] overflow-y-auto mb-6">
                <!-- So'zlar va mnemonic input maydonlari shu yerda paydo bo'ladi -->
            </div>
        </div>

        <!-- 3. KIRITISH EKRANI (Input/Recall Screen) -->
        <div id="words-input" class="hidden card p-6 sm:p-8 rounded-xl">
            <h2 class="text-2xl font-bold mb-6 text-center text-secondary-color">📝 Tarjimalarni Kiriting (Esga tushirish)</h2>
            
            <div id="words-input-list" class="space-y-6 mb-8">
                <!-- Tarjima input maydonlari va mnemoniya hintlari shu yerda paydo bo'ladi -->
            </div>

            <button id="check-words" class="btn-secondary w-full p-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300">
                Javoblarni Tekshirish
            </button>
        </div>

        <!-- 4. NATIJALAR EKRANI (Results Screen) -->
        <div id="words-results" class="hidden">
            <div class="card p-6 sm:p-8 rounded-xl text-center mb-6">
                <h2 class="text-3xl font-extrabold mb-4 text-green-400">✅ Yakuniy Natijalar</h2>
                <div class="flex justify-around items-center mb-6 border-b border-gray-700 pb-4">
                    <div>
                        <p class="text-lg text-gray-400">To'g'ri Javoblar (Ball)</p>
                        <p id="words-score" class="text-5xl font-extrabold text-secondary-color mt-2">0</p>
                    </div>
                    <div>
                        <p class="text-lg text-gray-400">Jami So'zlar</p>
                        <p id="words-total" class="text-5xl font-extrabold text-white mt-2">0</p>
                    </div>
                </div>
                
                <h3 class="text-xl font-bold mb-4 text-gray-200">Javoblarni Solishtirish</h3>
            </div>
            
            <div id="words-comparison" class="space-y-4">
                <!-- Solishtirish natijalari shu yerda paydo bo'ladi -->
            </div>
            
            <div class="card p-6 rounded-xl mt-6 flex flex-col sm:flex-row gap-4">
                <button class="home-btn flex-1 p-3 rounded-lg text-white bg-gray-600 hover:bg-gray-500 font-medium transition duration-200">Bosh Sahifaga</button>
                <button class="retry-btn flex-1 p-3 rounded-lg text-white btn-primary font-medium transition duration-200">Qayta O'ynash</button>
            </div>
        </div>

        <!-- Error/Notification Message -->
        <div id="error-message" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-error-color text-white p-3 rounded-lg shadow-2xl z-50 hidden" style="min-width: 300px;">
            <p id="error-text"></p>
        </div>
    </div>

    <script>
        // API Configuration and Utility Functions
        const API_KEY = ""; // Canvas provides this dynamically
        const TEXT_MODEL = "gemini-2.5-flash-preview-09-2025";
        const TTS_MODEL = "gemini-2.5-flash-preview-tts";

        // --- GEMINI API HELPERS ---

        /**
         * Generic fetch function with exponential backoff for retries.
         * @param {string} url - API endpoint URL.
         * @param {object} options - Fetch options (method, headers, body).
         * @param {number} retries - Max number of retries.
         */
        async function exponentialBackoffFetch(url, options, retries = 3) {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url, options);
                    if (response.status === 429 && i < retries - 1) {
                        // Rate limit exceeded, wait and retry
                        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    if (!response.ok) {
                        const errorBody = await response.text();
                        throw new Error(`API call failed: ${response.status} ${response.statusText}. Response: ${errorBody}`);
                    }
                    return response.json();
                } catch (error) {
                    if (i === retries - 1) throw error;
                    const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        /**
         * Converts base64 PCM audio data to an ArrayBuffer.
         */
        const base64ToArrayBuffer = (base64) => {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        };

        /**
         * Converts raw signed 16-bit PCM audio data into a WAV Blob.
         * The API returns L16 audio which is 16-bit linear PCM.
         */
        const pcmToWav = (pcm16, sampleRate) => {
            const numChannels = 1;
            const bitsPerSample = 16;
            const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
            const blockAlign = numChannels * (bitsPerSample / 8);

            const buffer = new ArrayBuffer(44 + pcm16.length * 2);
            const view = new DataView(buffer);
            let offset = 0;

            const writeString = (s) => {
                for (let i = 0; i < s.length; i++) {
                    view.setUint8(offset + i, s.charCodeAt(i));
                }
                offset += s.length;
            };
            const writeUint32 = (i) => {
                view.setUint32(offset, i, true);
                offset += 4;
            };
            const writeUint16 = (i) => {
                view.setUint16(offset, i, true);
                offset += 2;
            };

            // RIFF chunk
            writeString('RIFF'); // ChunkID
            writeUint32(36 + pcm16.length * 2); // ChunkSize (total size - 8)
            writeString('WAVE'); // Format

            // fmt chunk
            writeString('fmt '); // Subchunk1ID
            writeUint32(16); // Subchunk1Size (16 for PCM)
            writeUint16(1); // AudioFormat (1 for PCM)
            writeUint16(numChannels); // NumChannels
            writeUint32(sampleRate); // SampleRate
            writeUint32(byteRate); // ByteRate
            writeUint16(blockAlign); // BlockAlign
            writeUint16(bitsPerSample); // BitsPerSample

            // data chunk
            writeString('data'); // Subchunk2ID
            writeUint32(pcm16.length * 2); // Subchunk2Size (data size)

            // Write PCM data
            for (let i = 0; i < pcm16.length; i++) {
                view.setInt16(offset, pcm16[i], true);
                offset += 2;
            }

            return new Blob([view], { type: 'audio/wav' });
        };

        /**
         * Calls the Gemini TTS API to get and play audio for a word.
         */
        async function callTtsAPI(word, langCode, buttonId) {
            const button = document.getElementById(buttonId);
            const originalText = button.innerHTML;
            button.disabled = true;
            button.classList.add('tts-button', 'disabled');
            button.innerHTML = '<span class="loader"></span> Yuklanmoqda...';
            
            try {
                // Determine voice based on language for better quality, default to Kore
                let voiceName = 'Kore';
                if (langCode === 'en') voiceName = 'Zephyr';
                if (langCode === 'es') voiceName = 'Puck';
                if (langCode === 'de') voiceName = 'Charon';
                if (langCode === 'fr') voiceName = 'Leda';
                if (langCode === 'jp') voiceName = 'Orus';
                
                const prompt = `Say: ${word}`;

                const payload = {
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        responseModalities: ["AUDIO"],
                        speechConfig: {
                            voiceConfig: {
                                prebuiltVoiceConfig: { voiceName: voiceName }
                            }
                        }
                    },
                    model: TTS_MODEL
                };

                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${API_KEY}`;
                
                const result = await exponentialBackoffFetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                const part = result?.candidates?.[0]?.content?.parts?.[0];
                const audioData = part?.inlineData?.data;
                const mimeType = part?.inlineData?.mimeType;

                if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
                    const sampleRate = 24000; // L16 is typically 24000hz
                    const pcmData = base64ToArrayBuffer(audioData);
                    // API returns signed PCM16 audio data.
                    const pcm16 = new Int16Array(pcmData);
                    const wavBlob = pcmToWav(pcm16, sampleRate);
                    const audioUrl = URL.createObjectURL(wavBlob);
                    
                    const audio = new Audio(audioUrl);
                    audio.play();

                    audio.onended = () => {
                        URL.revokeObjectURL(audioUrl); // Cleanup
                    };
                } else {
                    Helpers.showError("Talaffuz audio ma'lumotlari topilmadi.");
                }

            } catch (error) {
                console.error("TTS API Error:", error);
                Helpers.showError("Nutq xizmatida xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
            } finally {
                button.innerHTML = '<span class="text-sm font-semibold flex items-center">🔊 Nutq</span>';
                button.disabled = false;
                button.classList.remove('tts-button', 'disabled');
            }
        }


        // Helper funksiyalar
        const Helpers = {
            formatTime: (totalSeconds) => {
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            },
            showError: (message) => {
                const errorDiv = document.getElementById('error-message');
                document.getElementById('error-text').textContent = message;
                errorDiv.style.display = 'block';
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                }, 4000);
            },
            isEnterKey: (e) => e.key === 'Enter',
            calculatePercentage: (part, total) => total === 0 ? 0 : Math.round((part / total) * 100)
        };

        // Storage Manager (Mock)
        const StorageManager = {
            saveGameResult: (result) => {
                // Real ilovada bu yerda Firestore yoki localStorage ishlatiladi
                console.log("Game result saved (Mock). Score:", result.score);
            }
        };

        // Data Manager (Ko'p tilli va 500 so'z generatori bilan)
        const DataManager = {
            languages: {
                en: { name: "Ingliz tili", flag: "🇬🇧", code: "en", translation: "English" },
                uz: { name: "O'zbek tili", flag: "🇺🇿", code: "uz", translation: "Uzbek" },
                es: { name: "Ispan tili", flag: "🇪🇸", code: "es", translation: "Spanish" },
                de: { name: "Nemis tili", flag: "🇩🇪", code: "de", translation: "German" },
                fr: { name: "Fransuz tili", flag: "🇫🇷", code: "fr", translation: "French" },
                jp: { name: "Yapon tili", flag: "🇯🇵", code: "jp", translation: "Japanese" }
            },
            topics: ['Vocabulary', 'Verbs', 'Adjectives'],

            // 500 so'z talabini qondirish uchun mock data generator
            getMockWords: (langCode, count) => {
                const words = [];
                // Yuqoridagi limitga amal qilish
                const maxCount = 500; 
                const actualCount = Math.min(count, maxCount);
                
                // Har bir til uchun noyob so'zlar bazasini simulyatsiya qilish
                const getWord = (i) => {
                    switch (langCode) {
                        case 'en': 
                            const enWords = ['Conundrum', 'Ephemeral', 'Serendipity', 'Mellifluous', 'Ineffable', 'Wanderlust', 'Petrichor', 'Quixotic', 'Supine', 'Alacrity'];
                            return `${enWords[i % 10]}`;
                        case 'es': 
                            const esWords = ['Efervescente', 'Inmarcesible', 'Resiliencia', 'Melancolía', 'Aurora', 'Eternidad', 'Quimera', 'Ojalá', 'Libélula', 'Susurro'];
                            return `${esWords[i % 10]}`;
                        case 'de': 
                            const deWords = ['Fernweh', 'Kummerspeck', 'Fingerspitzengefühl', 'Eichhörnchen', 'Schadenfreude', 'Zugzwang', 'Weltschmerz', 'Torschlusspanik', 'Geborgenheit', 'Gemuetlichkeit'];
                            return `${deWords[i % 10]}`;
                        case 'fr': 
                            const frWords = ['Éphémère', 'Flâneur', 'Élan', 'Rendez-vous', 'Dépaysement', 'Chouette', 'Clair de lune', 'Coup de foudre', 'Joie de vivre', 'Esprit de corps'];
                            return `${frWords[i % 10]}`;
                        case 'jp': 
                            const jpWords = ['木漏れ日 (Komorebi)', '侘寂 (Wabi-sabi)', '幽玄 (Yūgen)', '居場所 (Ibasho)', '懐かしい (Natsukashii)', '元気 (Genki)', 'お疲れ様 (Otsukaresama)', '頑張って (Ganbatte)', '平和 (Heiwa)', '夢 (Yume)'];
                            return `${jpWords[i % 10]}`;
                        case 'uz': 
                            const uzWords = ['Ilhom', 'Tafakkur', 'Munosabat', 'Barqaror', 'Fidoiy', 'Samara', 'Qiyinchilik', 'Mustahkam', 'Hayrat', 'Ixtiro'];
                            return `${uzWords[i % 10]}`;
                        default: return `Word${i}`;
                    }
                };

                // Tarjima har doim O'zbek tilida bo'ladi (ilova tili)
                const getTranslation = (i) => {
                    // Simple mock translation for the sake of functionality
                    const word = getWord(i);
                    // Qaysi tildan tarjima qilinayotganini ko'rsatish uchun
                    const langName = DataManager.languages[langCode].translation;
                    return `O'zbekcha tarjimasi: ${langName} so'zi - ${word}`;
                };

                const getPronunciation = (i) => {
                    // Simulyatsiya qilingan talaffuz
                    return `[pronunciation ${i}]`;
                };
                
                // MOCK SO'ZLARNI GENERATSIYA QILISH
                for (let i = 1; i <= actualCount; i++) {
                    words.push({
                        word: getWord(i) + (i > 10 ? ` (${i})` : ''),
                        translation: getTranslation(i),
                        pronunciation: getPronunciation(i),
                        mnemonic: '', 
                        level: i <= 100 ? 'A1' : (i <= 300 ? 'B2' : 'C1')
                    });
                }
                
                // So'zlarni tasodifiy tartibda aralashtirish
                return words.sort(() => 0.5 - Math.random());
            },

            getRandomWords: (langCode, count) => {
                return DataManager.getMockWords(langCode, count);
            }
            // wordsLanguages xususiyati ReferenceError ni keltirib chiqardi, shuning uchun olib tashlandi.
            // Uning o'rniga Object.keys(DataManager.languages) ishlatiladi.
        };

        // So'zlar moduli
        const WordsGame = {
            // O'yin holatlari
            currentGame: null,
            timer: null,
            
            // O'yinni boshlash
            init() {
                // Til tanlash maydonini yuklash
                this.populateLanguageSelect();
                
                this.setupEventListeners();
                this.showSettingsScreen();
            },

            // Event listenerlarni o'rnatish
            setupEventListeners() {
                document.getElementById('start-words').addEventListener('click', () => {
                    this.startGame();
                });

                document.getElementById('check-words').addEventListener('click', () => {
                    this.checkAnswers();
                });

                document.querySelector('#words-results .home-btn').addEventListener('click', () => {
                    this.goToHome();
                });

                document.querySelector('#words-results .retry-btn').addEventListener('click', () => {
                    this.retryGame();
                });
            },

            // Sozlamalar ekranini ko'rsatish
            showSettingsScreen() {
                this.hideAllScreens();
                document.getElementById('words-settings').style.display = 'block';
                document.getElementById('global-back-btn').classList.add('hidden');
                
                // init() da allaqachon chaqirilgan, lekin ishonch uchun:
                // this.populateLanguageSelect(); 
            },

            // Mnemonic ni saqlash
            saveMnemonic(index, mnemonicText) {
                if (this.currentGame && this.currentGame.words[index]) {
                    this.currentGame.words[index].mnemonic = mnemonicText.trim();
                }
            },

            // TTS Funksiyasi
            async speakWord(index) {
                if (!this.currentGame) return;

                const wordObj = this.currentGame.words[index];
                const langCode = this.currentGame.language;
                const buttonId = `speak-btn-${index}`;
                
                await callTtsAPI(wordObj.word.split('(')[0].trim(), langCode, buttonId);
            },

            // Mnemonic Yaratish Funksiyasi (Gemini API)
            async generateMnemonic(index) {
                if (!this.currentGame) return;

                const wordObj = this.currentGame.words[index];
                const langCode = this.currentGame.language;
                const language = DataManager.languages[langCode];
                const button = document.getElementById(`generate-btn-${index}`);
                const spinner = document.getElementById(`loading-spinner-${index}`);
                const textarea = document.getElementById(`mnemonic-input-${index}`);

                // Loading holatini o'rnatish
                button.style.display = 'none';
                spinner.style.display = 'flex';
                textarea.placeholder = "Mnemoniya yaratilmoqda...";

                const foreignWord = wordObj.word.split('(')[0].trim();
                const uzbekTranslation = wordObj.translation;
                const systemPrompt = "Siz ijodiy til o'qituvchisiz. Foydalanuvchiga murakkab so'zni eslab qolishga yordam beradigan, o'zbek tilida qiziqarli, qisqa (maksimal 30 so'z), tasvirga boy mnemoniya (eslab qolish hikoyasi) yarating. Faqat mnemoniya matnini qaytaring. Matnni xotiraga olish oson bo'lsin. 'Mnemoniya:' yoki 'Hikoya:' kabi kiritishlardan foydalanmang.";
                const userQuery = `Til: ${language.name}. So'z: "${foreignWord}". O'zbekcha ma'nosi: "${uzbekTranslation}". Shu so'z uchun mnemoniya yaratib bering.`;
                
                try {
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${API_KEY}`;
                    
                    const payload = {
                        contents: [{ parts: [{ text: userQuery }] }],
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        // Tezkor ma'lumot qidirish uchun Google Search ishlatilmaydi
                        // tools: [{ "google_search": {} }], 
                    };

                    const result = await exponentialBackoffFetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
                    
                    if (generatedText) {
                        textarea.value = generatedText.trim();
                        this.saveMnemonic(index, generatedText.trim()); // Saqlash
                    } else {
                        Helpers.showError("LLM mnemoniya yaratishda xatolik yuz berdi. Javob bo'sh.");
                        textarea.placeholder = "💡 Esda qolishi uchun ajoyib hikoya, tasvir yoki assotsiatsiyani yozing...";
                    }

                } catch (error) {
                    console.error("Gemini API Error:", error);
                    Helpers.showError("Gemini xizmati bilan bog'lanishda xato: " + error.message);
                    textarea.placeholder = "💡 Esda qolishi uchun ajoyib hikoya, tasvir yoki assotsiatsiyani yozing...";
                } finally {
                    // Loading holatini yakunlash
                    button.style.display = 'block';
                    spinner.style.display = 'none';
                }
            },


            // Tillar selectini to'ldirish
            populateLanguageSelect() {
                const select = document.getElementById('words-language');
                if (!select) {
                    // Agar element topilmasa, konsolga xato chiqarish
                    console.error("Error: The 'words-language' select element was not found in the DOM.");
                    return;
                }
                select.innerHTML = '';
                
                // MUAMMO HAL QILINDI: DataManager to'liq ishga tushirilganidan keyin Object.keys() orqali kirish
                Object.keys(DataManager.languages).forEach(langCode => {
                    const language = DataManager.languages[langCode];
                    const option = document.createElement('option');
                    option.value = langCode;
                    option.textContent = `${language.flag} ${language.name}`;
                    // Ingliz tilini standart qilib belgilash
                    if (langCode === 'en') {
                         option.selected = true;
                    }
                    select.appendChild(option);
                });
                console.log("Language select populated with:", Object.keys(DataManager.languages).length, "languages.");
            },

            // O'yinni boshlash
            startGame() {
                const languageCode = document.getElementById('words-language').value;
                const wordsCount = parseInt(document.getElementById('words-count').value);
                const studyTime = parseInt(document.getElementById('words-time').value);

                // Sozlamalarni tekshirish
                if (wordsCount < 5 || wordsCount > 500) {
                    Helpers.showError('So\'zlar soni 5 dan 500 gacha bo\'lishi kerak');
                    return;
                }

                if (studyTime < 10 || studyTime > 600) {
                    Helpers.showError('Vaqt 10 soniyadan 600 soniyagacha bo\'lishi kerak');
                    return;
                }
                
                // So'zlarni olish (til va hisobga asoslangan)
                const words = DataManager.getRandomWords(languageCode, wordsCount);
                
                if (words.length === 0) {
                    Helpers.showError('Tanlangan til uchun so\'zlar topilmadi');
                    return;
                }

                // O'yin ma'lumotlarini yaratish
                this.currentGame = {
                    language: languageCode,
                    words: words.map(wordObj => ({ ...wordObj, mnemonic: wordObj.mnemonic || '' })),
                    studyTime: studyTime,
                    userAnswers: [],
                    startTime: new Date(),
                    settings: {
                        language: languageCode,
                        wordsCount: wordsCount,
                        studyTime: studyTime
                    }
                };

                this.showDisplayScreen();
            },

            // Ko'rsatish ekranini ko'rsatish
            showDisplayScreen() {
                this.hideAllScreens();
                document.getElementById('words-display').style.display = 'block';
                document.getElementById('global-back-btn').classList.remove('hidden');

                this.displayWords();

                this.startTimer();
            },

            // So'zlarni ekranga chiqarish (Mnemonic Input bilan)
            displayWords() {
                const wordsList = document.getElementById('words-list');
                wordsList.innerHTML = '';

                const language = DataManager.languages[this.currentGame.language];
                
                wordsList.innerHTML = `
                    <div class="p-4 bg-indigo-900/20 border-b border-indigo-700/50 text-center sticky top-0 z-10">
                        <strong class="text-indigo-300">${language.flag} ${language.name}</strong>
                        <p class="mt-1 text-sm text-indigo-400 font-medium">Shaxsiy Mnemoniya/Tasvirni yozing yoki LLM dan so'rang!</p>
                    </div>
                `;

                this.currentGame.words.forEach((wordObj, index) => {
                    const wordElement = document.createElement('div');
                    wordElement.className = 'word-item mnemonic-study-item'; 
                    
                    // YANGI UI KOMPONENTLARI (TTS va Mnemonic Generator)
                    wordElement.innerHTML = `
                        <div class="flex flex-col sm:flex-row justify-between sm:items-center">
                            <div class="flex items-center gap-3">
                                <span class="font-extrabold text-white text-lg">${index + 1}. ${wordObj.word}</span>
                                <button id="speak-btn-${index}" class="text-indigo-400 hover:text-indigo-300 transition" onclick="WordsGame.speakWord(${index})">
                                    <span class="text-sm font-semibold flex items-center">🔊 Nutq</span>
                                </button>
                            </div>
                            <small class="text-gray-400 mt-1 sm:mt-0">${wordObj.pronunciation}</small>
                        </div>
                        <div class="mt-2 text-secondary-color font-medium mb-3">
                            Tarjimasi: <span class="text-emerald-400">${wordObj.translation}</span>
                        </div>
                        
                        <div class="flex items-center gap-2 mt-2">
                            <button id="generate-btn-${index}" class="btn-secondary px-3 py-1 text-sm rounded-lg font-medium shadow-md transition duration-200" 
                                    onclick="WordsGame.generateMnemonic(${index})">
                                ✨ Mnemoniya Yaratish
                            </button>
                            <span id="loading-spinner-${index}" class="hidden flex items-center text-indigo-400 text-sm">
                                <div class="loader"></div> Yaratilmoqda...
                            </span>
                        </div>
                        
                        <!-- MNEMONIC INPUT FIELD -->
                        <textarea id="mnemonic-input-${index}"
                            class="mnemonic-input-field"
                            placeholder="💡 Esda qolishi uchun ajoyib hikoya, tasvir yoki assotsiatsiyani yozing..."
                            data-index="${index}"
                            oninput="WordsGame.saveMnemonic(${index}, this.value)"
                        >${wordObj.mnemonic}</textarea>
                        <!-- /MNEMONIC INPUT FIELD -->
                    `;
                    wordsList.appendChild(wordElement);
                });
            },

            // Timer ni boshlash
            startTimer() {
                let timeLeft = this.currentGame.studyTime;
                const timerElement = document.getElementById('words-timer');
                timerElement.style.color = 'white';
                timerElement.style.animation = 'none';

                const updateTimer = () => {
                    timerElement.textContent = Helpers.formatTime(timeLeft);
                    
                    if (timeLeft <= 10) {
                        timerElement.style.backgroundColor = '#ef4444'; /* Error color for danger */
                        timerElement.style.animation = 'pulse 0.5s infinite';
                    } else if (timeLeft <= 30) {
                        timerElement.style.backgroundColor = '#fbbf24'; /* Amber for warning */
                    } else {
                        timerElement.style.backgroundColor = '#4b5563'; /* Gray for normal */
                        timerElement.style.animation = 'none';
                    }

                    timeLeft--;

                    if (timeLeft < 0) {
                        clearInterval(this.timer);
                        this.showInputScreen();
                    }
                };

                updateTimer();
                this.timer = setInterval(updateTimer, 1000);
            },

            // Kiritish ekranini ko'rsatish
            showInputScreen() {
                this.hideAllScreens();
                document.getElementById('words-input').style.display = 'block';
                document.getElementById('global-back-btn').classList.remove('hidden');

                this.createInputFields();
            },

            // Input kataklarini yaratish (Mnemonic Hint bilan)
            createInputFields() {
                const inputList = document.getElementById('words-input-list');
                inputList.innerHTML = '';

                const language = DataManager.languages[this.currentGame.language];

                this.currentGame.words.forEach((wordObj, index) => {
                    const inputItem = document.createElement('div');
                    inputItem.className = 'word-input-item';
                    
                    const mnemonicHint = wordObj.mnemonic ? 
                        `<div class="mnemonic-hint">💡 O'zingizning eslatmangiz: ${wordObj.mnemonic}</div>` : 
                        `<div class="text-sm text-gray-500 mt-2">Mnemoniya yaratmadingiz.</div>`;
                    
                    inputItem.innerHTML = `
                        <div class="word-input-label mb-2">
                            <strong class="text-xl">${index + 1}.</strong> 
                            <span class="text-lg font-semibold">${wordObj.word}</span> 
                            <small class="text-gray-400">(${wordObj.pronunciation})</small>
                            ${mnemonicHint} 
                        </div>
                        <input type="text" 
                               class="word-input-field w-full p-3 rounded-lg border text-lg" 
                               placeholder="${language.translation} da tarjimasini yozing..." 
                               data-index="${index}">
                    `;

                    inputList.appendChild(inputItem);
                });

                const firstInput = inputList.querySelector('.word-input-field');
                if (firstInput) firstInput.focus();

                const inputs = inputList.querySelectorAll('.word-input-field');
                inputs.forEach((input, index) => {
                    input.addEventListener('keydown', (e) => {
                        if (Helpers.isEnterKey(e)) {
                            e.preventDefault();
                            if (index < inputs.length - 1) {
                                inputs[index + 1].focus();
                            } else {
                                document.getElementById('check-words').focus();
                            }
                        }
                    });
                });
            },

            // Javoblarni tekshirish
            checkAnswers() {
                const inputFields = document.querySelectorAll('#words-input-list .word-input-field');
                const userAnswers = [];

                inputFields.forEach((input, index) => {
                    userAnswers[index] = input.value.trim();
                });

                this.currentGame.userAnswers = userAnswers;

                this.calculateResults();
            },

            // Natijalarni hisoblash (1 ball = 1 to'g'ri javob)
            calculateResults() {
                const correctWords = this.currentGame.words;
                const userAnswers = this.currentGame.userAnswers;

                let correctCount = 0;
                const results = [];

                correctWords.forEach((wordObj, index) => {
                    const userAnswer = userAnswers[index];
                    // Tarjimalar Mock generatorida oddiy string bo'lgani uchun to'g'ri javobni ham shunday solishtiramiz
                    const correctTranslation = wordObj.translation.toLowerCase().trim();
                    const isCorrect = userAnswer.toLowerCase().trim() === correctTranslation;

                    if (isCorrect) {
                        correctCount++;
                    }

                    results.push({
                        index: index,
                        word: wordObj.word,
                        pronunciation: wordObj.pronunciation,
                        correct: wordObj.translation, 
                        userAnswer: userAnswer,
                        isCorrect: isCorrect,
                        mnemonic: wordObj.mnemonic
                    });
                });

                // 1 to'g'ri javob = 1 ball
                const score = correctCount; 
                const percentage = Helpers.calculatePercentage(correctCount, correctWords.length);

                const gameResult = {
                    gameType: 'words',
                    score: score,
                    total: correctWords.length,
                    percentage: percentage,
                    correctCount: correctCount,
                    details: {
                        results: results
                    },
                    settings: this.currentGame.settings
                };

                // Natijalarni ko'rsatish funksiyasiga o'tish
                this.showResultsScreen(gameResult, results);

                StorageManager.saveGameResult(gameResult);
            },

            // Natijalar ekranini ko'rsatish
            showResultsScreen(gameResult, results) {
                this.hideAllScreens();
                document.getElementById('words-results').style.display = 'block';
                document.getElementById('global-back-btn').classList.add('hidden'); 

                // Natijalarni ko'rsatish
                document.getElementById('words-score').textContent = gameResult.score;
                document.getElementById('words-total').textContent = gameResult.total;

                this.displayComparison(results);

                if (gameResult.percentage >= 80) {
                    console.log("Confetti time!");
                }
            },

            // Solishtirish natijalarini ko'rsatish
            displayComparison(results) {
                const comparisonElement = document.getElementById('words-comparison');
                comparisonElement.innerHTML = '';

                results.forEach((result, index) => {
                    const resultItem = document.createElement('div');
                    resultItem.className = `result-item p-4 rounded-xl flex items-start gap-4 ${result.isCorrect ? 'correct' : 'incorrect'}`;

                    let icon;
                    let content;
                    
                    if (result.isCorrect) {
                        icon = `<span class="text-2xl text-secondary-color">✅</span>`;
                        content = `
                            <div class="flex-1">
                                <div class="font-bold text-lg text-white">${index + 1}. ${result.word}</div>
                                <div class="text-sm text-gray-400 mb-1">${result.pronunciation}</div>
                                <div class="text-sm text-secondary-color mt-1">Sizning javobingiz: <strong>${result.userAnswer}</strong></div>
                                ${result.mnemonic ? `<div class="text-xs text-indigo-300 mt-2">Mnemoniya: ${result.mnemonic}</div>` : ''}
                            </div>
                        `;
                    } else {
                        icon = `<span class="text-2xl text-error-color">❌</span>`;
                        content = `
                            <div class="flex-1">
                                <div class="font-bold text-lg text-white">${index + 1}. ${result.word}</div>
                                <div class="text-sm text-gray-400 mb-1">${result.pronunciation}</div>
                                <div class="text-sm text-error-color line-through">Sizning javobingiz: ${result.userAnswer || 'Javob berilmagan'}</div>
                                <div class="text-sm text-secondary-color mt-1">To'g'ri javob: <strong>${result.correct}</strong></div>
                                ${result.mnemonic ? `<div class="text-xs text-indigo-300 mt-2">Mnemoniya: ${result.mnemonic}</div>` : ''}
                            </div>
                        `;
                    }

                    resultItem.innerHTML = icon + content;
                    comparisonElement.appendChild(resultItem);
                });
            },

            // Barcha ekranlarni yashirish
            hideAllScreens() {
                const screens = [
                    'words-settings',
                    'words-display',
                    'words-input',
                    'words-results'
                ];

                screens.forEach(screenId => {
                    const screen = document.getElementById(screenId);
                    if (screen) screen.style.display = 'none';
                });

                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            },

            // Orqaga qaytish
            goBack() {
                const input = document.getElementById('words-input').style.display;
                const display = document.getElementById('words-display').style.display;
                
                if (input === 'block') {
                    // Kiritishdan o'rganishga qaytish
                    this.showDisplayScreen();
                } else if (display === 'block') {
                    // O'rganishdan sozlamalarga qaytish
                    this.stopGame(); // Timerni to'xtatish
                    this.showSettingsScreen();
                } else {
                    this.goToHome();
                }
            },

            // Bosh sahifaga qaytish (Sozlamalar ekraniga)
            goToHome() {
                this.showSettingsScreen();
            },

            // Qayta o'ynash
            retryGame() {
                this.currentGame = null;
                this.showSettingsScreen();
            },

            // O'yinni to'xtatish
            stopGame() {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                this.currentGame = null;
            }
        };

        // Global qilish va ishga tushirish
        window.WordsGame = WordsGame;
        
        // DOM to'liq yuklangandan keyin init() ni chaqirishni ta'minlash
        document.addEventListener('DOMContentLoaded', () => {
            WordsGame.init();
        });
    </script>
</body>
</html>
