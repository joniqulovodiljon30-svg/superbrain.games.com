// Memory Master - Ma'lumotlar Bazasi

const appData = {
    // Til ma'lumotlari
    languages: {
        english: { name: "Inglizcha", flag: "🇺🇸", code: "en" },
        korean: { name: "Koreyscha", flag: "🇰🇷", code: "ko" },
        japanese: { name: "Yaponcha", flag: "🇯🇵", code: "ja" },
        chinese: { name: "Xitoycha", flag: "🇨🇳", code: "zh" },
        german: { name: "Nemischa", flag: "🇩🇪", code: "de" },
        french: { name: "Fransuzcha", flag: "🇫🇷", code: "fr" },
        uzbek: { name: "O'zbekcha", flag: "🇺🇿", code: "uz" }
    },

    // Flashcards uchun 6 ta til (Uzbekchasiz)
    flashcardsLanguages: ['english', 'korean', 'japanese', 'chinese', 'german', 'french'],

    // So'zlar o'yini uchun 7 ta til (Uzbekcha bilan)
    wordsLanguages: ['english', 'korean', 'japanese', 'chinese', 'german', 'french', 'uzbek'],

    // Mavzular ro'yxati (20 ta mavzu)
    topics: [
        "Oziq-ovqat",
        "Transport",
        "Uy-ro'zg'or",
        "Kasblar", 
        "Sport",
        "Ta'lim",
        "Texnologiya",
        "Sog'liq",
        "Tabiat",
        "San'at",
        "Kiyim-kechak",
        "Hayvonot",
        "Qurilish",
        "Savdo",
        "Sayohat",
        "Oilaviy",
        "Madaniyat",
        "Fan",
        "Hordiq",
        "Ish"
    ],

    // Har bir til va mavzu uchun so'zlar bazasi
    vocabulary: {
        english: {
            "Oziq-ovqat": [
                { word: "Apple", pronunciation: "[ˈæp.əl]", translation: "Olma" },
                { word: "Bread", pronunciation: "[bred]", translation: "Non" },
                { word: "Cheese", pronunciation: "[tʃiːz]", translation: "Pishloq" },
                { word: "Orange", pronunciation: "[ˈɒr.ɪndʒ]", translation: "Apelsin" },
                { word: "Tomato", pronunciation: "[təˈmɑː.təʊ]", translation: "Pomidor" },
                { word: "Potato", pronunciation: "[pəˈteɪ.təʊ]", translation: "Kartoshka" },
                { word: "Chicken", pronunciation: "[ˈtʃɪk.ɪn]", translation: "Tovuq" },
                { word: "Coffee", pronunciation: "[ˈkɒf.i]", translation: "Qahva" },
                { word: "Sugar", pronunciation: "[ˈʃʊɡ.ər]", translation: "Shakar" },
                { word: "Water", pronunciation: "[ˈwɔː.tər]", translation: "Suv" }
            ],
            "Transport": [
                { word: "Car", pronunciation: "[kɑːr]", translation: "Mashina" },
                { word: "Bus", pronunciation: "[bʌs]", translation: "Avtobus" },
                { word: "Train", pronunciation: "[treɪn]", translation: "Poyezd" },
                { word: "Bicycle", pronunciation: "[ˈbaɪ.sɪ.kəl]", translation: "Velosiped" },
                { word: "Airplane", pronunciation: "[ˈeə.pleɪn]", translation: "Samolyot" },
                { word: "Ship", pronunciation: "[ʃɪp]", translation: "Kema" },
                { word: "Motorcycle", pronunciation: "[ˈməʊ.təˌsaɪ.kəl]", translation: "Mototsikl" },
                { word: "Taxi", pronunciation: "[ˈtæk.si]", translation: "Taksi" },
                { word: "Subway", pronunciation: "[ˈsʌb.weɪ]", translation: "Metro" },
                { word: "Helicopter", pronunciation: "[ˈhel.ɪˌkɒp.tər]", translation: "Vertolyot" }
            ],
            "Uy-ro'zg'or": [
                { word: "Table", pronunciation: "[ˈteɪ.bəl]", translation: "Stol" },
                { word: "Chair", pronunciation: "[tʃeər]", translation: "Stul" },
                { word: "Bed", pronunciation: "[bed]", translation: "Krovat" },
                { word: "Window", pronunciation: "[ˈwɪn.dəʊ]", translation: "Deraza" },
                { word: "Door", pronunciation: "[dɔːr]", translation: "Eshik" },
                { word: "Kitchen", pronunciation: "[ˈkɪtʃ.ɪn]", translation: "Oshxona" },
                { word: "Bathroom", pronunciation: "[ˈbɑːθ.ruːm]", translation: "Hammom" },
                { word: "Television", pronunciation: "[ˈtel.ɪˌvɪʒ.ən]", translation: "Televizor" },
                { word: "Refrigerator", pronunciation: "[rɪˈfrɪdʒ.ər.eɪ.tər]", translation: "Muzlatgich" },
                { word: "Computer", pronunciation: "[kəmˈpjuː.tər]", translation: "Kompyuter" }
            ]
        },

        korean: {
            "Oziq-ovqat": [
                { word: "사과", pronunciation: "[sa-gwa]", translation: "Olma" },
                { word: "빵", pronunciation: "[ppang]", translation: "Non" },
                { word: "치즈", pronunciation: "[chi-jeu]", translation: "Pishloq" },
                { word: "오렌지", pronunciation: "[o-ren-ji]", translation: "Apelsin" },
                { word: "토마토", pronunciation: "[to-ma-to]", translation: "Pomidor" }
            ],
            "Transport": [
                { word: "자동차", pronunciation: "[ja-dong-cha]", translation: "Mashina" },
                { word: "버스", pronunciation: "[beo-seu]", translation: "Avtobus" },
                { word: "기차", pronunciation: "[gi-cha]", translation: "Poyezd" },
                { word: "자전거", pronunciation: "[ja-jeon-geo]", translation: "Velosiped" },
                { word: "비행기", pronunciation: "[bi-haeng-gi]", translation: "Samolyot" }
            ]
        },

        japanese: {
            "Oziq-ovqat": [
                { word: "りんご", pronunciation: "[ringo]", translation: "Olma" },
                { word: "パン", pronunciation: "[pan]", translation: "Non" },
                { word: "チーズ", pronunciation: "[chīzu]", translation: "Pishloq" },
                { word: "オレンジ", pronunciation: "[orenji]", translation: "Apelsin" },
                { word: "トマト", pronunciation: "[tomato]", translation: "Pomidor" }
            ],
            "Transport": [
                { word: "車", pronunciation: "[kuruma]", translation: "Mashina" },
                { word: "バス", pronunciation: "[basu]", translation: "Avtobus" },
                { word: "電車", pronunciation: "[densha]", translation: "Poyezd" },
                { word: "自転車", pronunciation: "[jitensha]", translation: "Velosiped" },
                { word: "飛行機", pronunciation: "[hikōki]", translation: "Samolyot" }
            ]
        },

        chinese: {
            "Oziq-ovqat": [
                { word: "苹果", pronunciation: "[píngguǒ]", translation: "Olma" },
                { word: "面包", pronunciation: "[miànbāo]", translation: "Non" },
                { word: "奶酪", pronunciation: "[nǎilào]", translation: "Pishloq" },
                { word: "橙子", pronunciation: "[chéngzi]", translation: "Apelsin" },
                { word: "番茄", pronunciation: "[fānqié]", translation: "Pomidor" }
            ],
            "Transport": [
                { word: "汽车", pronunciation: "[qìchē]", translation: "Mashina" },
                { word: "公交车", pronunciation: "[gōngjiāochē]", translation: "Avtobus" },
                { word: "火车", pronunciation: "[huǒchē]", translation: "Poyezd" },
                { word: "自行车", pronunciation: "[zìxíngchē]", translation: "Velosiped" },
                { word: "飞机", pronunciation: "[fēijī]", translation: "Samolyot" }
            ]
        },

        german: {
            "Oziq-ovqat": [
                { word: "Apfel", pronunciation: "[ˈapfl̩]", translation: "Olma" },
                { word: "Brot", pronunciation: "[bʁoːt]", translation: "Non" },
                { word: "Käse", pronunciation: "[ˈkɛːzə]", translation: "Pishloq" },
                { word: "Orange", pronunciation: "[oˈʁɑ̃ːʒə]", translation: "Apelsin" },
                { word: "Tomate", pronunciation: "[toˈmaːtə]", translation: "Pomidor" }
            ],
            "Transport": [
                { word: "Auto", pronunciation: "[ˈaʊto]", translation: "Mashina" },
                { word: "Bus", pronunciation: "[bʊs]", translation: "Avtobus" },
                { word: "Zug", pronunciation: "[t͡suːk]", translation: "Poyezd" },
                { word: "Fahrrad", pronunciation: "[ˈfaːɐ̯ʁaːt]", translation: "Velosiped" },
                { word: "Flugzeug", pronunciation: "[ˈfluːkt͡sɔɪ̯k]", translation: "Samolyot" }
            ]
        },

        french: {
            "Oziq-ovqat": [
                { word: "Pomme", pronunciation: "[pɔm]", translation: "Olma" },
                { word: "Pain", pronunciation: "[pɛ̃]", translation: "Non" },
                { word: "Fromage", pronunciation: "[fʁɔ.maʒ]", translation: "Pishloq" },
                { word: "Orange", pronunciation: "[ɔ.ʁɑ̃ʒ]", translation: "Apelsin" },
                { word: "Tomate", pronunciation: "[tɔ.mat]", translation: "Pomidor" }
            ],
            "Transport": [
                { word: "Voiture", pronunciation: "[vwa.tyʁ]", translation: "Mashina" },
                { word: "Bus", pronunciation: "[bys]", translation: "Avtobus" },
                { word: "Train", pronunciation: "[tʁɛ̃]", translation: "Poyezd" },
                { word: "Vélo", pronunciation: "[ve.lo]", translation: "Velosiped" },
                { word: "Avion", pronunciation: "[a.vjɔ̃]", translation: "Samolyot" }
            ]
        },

        uzbek: {
            "Oziq-ovqat": [
                { word: "Olma", pronunciation: "[ol-ma]", translation: "Apple" },
                { word: "Non", pronunciation: "[non]", translation: "Bread" },
                { word: "Pishloq", pronunciation: "[pish-loq]", translation: "Cheese" },
                { word: "Apelsin", pronunciation: "[a-pel-sin]", translation: "Orange" },
                { word: "Pomidor", pronunciation: "[po-mi-dor]", translation: "Tomato" }
            ],
            "Transport": [
                { word: "Mashina", pronunciation: "[ma-shi-na]", translation: "Car" },
                { word: "Avtobus", pronunciation: "[av-to-bus]", translation: "Bus" },
                { word: "Poyezd", pronunciation: "[po-yezd]", translation: "Train" },
                { word: "Velosiped", pronunciation: "[ve-lo-si-ped]", translation: "Bicycle" },
                { word: "Samolyot", pronunciation: "[sa-mo-lyot]", translation: "Airplane" }
            ]
        }
    },

    // Yuz va ismlar ma'lumotlari
    faces: [
        { id: 1, name: "Ali", image: "👨", description: "Qora soch, jigarrang ko'zlar" },
        { id: 2, name: "Malika", image: "👩", description: "Sariq soch, ko'k ko'zlar" },
        { id: 3, name: "Hasan", image: "👨", description: "Qisqa soch, yashil ko'zlar" },
        { id: 4, name: "Dilnoza", image: "👩", description: "Uzun qora soch, jigarrang ko'zlar" },
        { id: 5, name: "Javohir", image: "👨", description: "Jigarrang soch, kulrang ko'zlar" },
        { id: 6, name: "Sevara", image: "👩", description: "Jigarrang soch, yashil ko'zlar" },
        { id: 7, name: "Rashid", image: "👨", description: "Kal soch, ko'k ko'zlar" },
        { id: 8, name: "Gulnora", image: "👩", description: "Qora soch, qora ko'zlar" },
        { id: 9, name: "Sherzod", image: "👨", description: "Qora soch, jigarrang ko'zlar" },
        { id: 10, name: "Madina", image: "👩", description: "Sariq soch, ko'k ko'zlar" }
    ],

    // Rasmlar ma'lumotlari
    images: [
        { id: 1, name: "Tog'", image: "🏔️", description: "Qorli tog' cho'qqisi" },
        { id: 2, name: "Daryo", image: "🌊", description: "Oqimli daryo" },
        { id: 3, name: "O'rmon", image: "🌲", description: "Qalin o'rmon" },
        { id: 4, name: "Shahar", image: "🏙️", description: "Zamonaviy shahar" },
        { id: 5, name: "Qishloq", image: "🌅", description: "Tinch qishloq manzarasi" },
        { id: 6, name: "Dengiz", image: "🌊", description: "Ko'k dengiz" },
        { id: 7, name: "Bog'", image: "🌷", description: "Gullar bilan bog'" },
        { id: 8, name: "Muz", image: "🧊", description: "Muz parchalari" },
        { id: 9, name: "Quyosh", image: "☀️", description: "Chiroqli quyosh" },
        { id: 10, name: "Yulduz", image: "⭐", description: "Yorqin yulduz" }
    ],

    // Raqamlar mnemonikasi
    numberMnemonics: {
        0: { image: "⚫", word: "Tuxum" },
        1: { image: "🕯️", word: "Sham" },
        2: { image: "🦢", word: "O'rdak" },
        3: { image: "🔗", word: "Zanjir" },
        4: { image: "⛵", word: "Qayiq" },
        5: { image: "✋", word: "Qo'l" },
        6: { image: "🐘", word: "Fil" },
        7: { image: "🌈", word: "Kamalak" },
        8: { image: "⏳", word: "Soat" },
        9: { image: "🐍", word: "Ilon" }
    }
};

// Ma'lumotlar bilan ishlash uchun funksiyalar
const DataManager = {
    // Tasodifiy so'zlar olish
    getRandomWords(language, topic, count) {
        const words = appData.vocabulary[language]?.[topic] || [];
        if (words.length === 0) return [];
        
        // Takrorlanmas so'zlarni tanlash
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, words.length));
    },

    // Barcha mavzular uchun so'zlar sonini hisoblash
    getTotalWordsCount(language) {
        let total = 0;
        const topics = appData.vocabulary[language];
        if (!topics) return 0;
        
        for (const topic in topics) {
            total += topics[topic].length;
        }
        return total;
    },

    // Tasodifiy yuzlar olish
    getRandomFaces(count) {
        const shuffled = [...appData.faces].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, appData.faces.length));
    },

    // Tasodifiy rasmlar olish
    getRandomImages(count) {
        const shuffled = [...appData.images].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, appData.images.length));
    },

    // Tasodifiy raqamlar ketma-ketligi yaratish
    generateRandomNumbers(count) {
        const numbers = [];
        for (let i = 0; i < count; i++) {
            numbers.push(Math.floor(Math.random() * 10)); // 0-9 gacha raqamlar
        }
        return numbers;
    },

    // Mnemonika tasvirlarini olish
    getNumberMnemonics(numbers) {
        return numbers.map(num => appData.numberMnemonics[num] || { image: "❓", word: "Noma'lum" });
    },

    // Til nomini olish
    getLanguageName(languageCode) {
        return appData.languages[languageCode]?.name || languageCode;
    },

    // Mavzu nomini olish
    getTopicName(topicIndex) {
        return appData.topics[topicIndex] || "Noma'lum mavzu";
    }
};