// Global o'zgaruvchilar
let currentUser = null;
let currentSection = 'login-section';

// DOM yuklanganda
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Memory Master ishga tushdi!");
    checkUserLogin();
    setupEventListeners();
});

// Foydalanuvchi login holatini tekshirish
function checkUserLogin() {
    const savedUser = localStorage.getItem('memoryMasterUser');
    console.log("📊 Saqlangan foydalanuvchi:", savedUser);
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        console.log("👤 Foydalanuvchi topildi:", currentUser);
        showSection('dashboard');
        updateProfileDisplay();
    } else {
        console.log("❌ Foydalanuvchi topilmadi, login sahifasida");
        showSection('login-section');
    }
}

// Event listenerlarni o'rnatish
function setupEventListeners() {
    console.log("🎯 Event listenerlar o'rnatilmoqda...");
    
    // Avatar yuklash
    const avatarInput = document.getElementById('avatar-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
        console.log("✅ Avatar input listener o'rnatildi");
    }
    
    // Profil yaratish tugmasi
    const createProfileBtn = document.querySelector('.btn-primary');
    if (createProfileBtn) {
        createProfileBtn.addEventListener('click', createProfile);
        console.log("✅ Profil yaratish tugmasi listener o'rnatildi");
    }
}

// Avatar yuklash
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
        console.log("🖼️ Rasm yuklanmoqda:", file.name);
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatar-preview').innerHTML = 
                `<img src="${e.target.result}" alt="Profil rasmi" style="width:100%;height:100%;border-radius:50%;">`;
            console.log("✅ Rasm yuklandi");
        };
        reader.readAsDataURL(file);
    }
}

// Profil yaratish - ASOSIY FUNKSIYA
function createProfile() {
    console.log("🚀 Profil yaratish boshlandi...");
    
    const name = document.getElementById('user-name').value.trim();
    const surname = document.getElementById('user-surname').value.trim();
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarImg = avatarPreview.querySelector('img');
    
    console.log("📝 Ism:", name);
    console.log("📝 Familiya:", surname);
    console.log("🖼️ Avatar:", avatarImg ? "Mavjud" : "Yo'q");

    // Validatsiya
    if (!name || !surname) {
        alert('⚠️ Iltimos, ism va familiyangizni kiriting!');
        console.log("❌ Ism yoki familiya kiritilmagan");
        return;
    }

    // Foydalanuvchi yaratish
    currentUser = {
        id: Date.now(),
        name: name,
        surname: surname,
        avatar: avatarImg ? avatarImg.src : null,
        joinDate: new Date().toLocaleDateString('uz-UZ'),
        stats: {
            totalTests: 0,
            totalWords: 0,
            successRate: 0,
            numbersBest: 0,
            wordsBest: 0,
            flashcardsLearned: 0,
            facesMemorized: 0,
            imagesRemembered: 0
        }
    };
    
    console.log("👤 Yangi foydalanuvchi:", currentUser);
    
    // LocalStorage ga saqlash
    try {
        localStorage.setItem('memoryMasterUser', JSON.stringify(currentUser));
        console.log("💾 Foydalanuvchi saqlandi");
    } catch (error) {
        console.error("❌ Saqlash xatosi:", error);
        alert('Xatolik yuz berdi!');
        return;
    }
    
    // Dashboardga o'tish
    showSection('dashboard');
    updateProfileDisplay();
    console.log("✅ Profil muvaffaqiyatli yaratildi!");
}

// Sahifalarni ko'rsatish
function showSection(sectionId) {
    console.log("🔄 Sahifaga o'tish:", sectionId);
    
    // Barcha sahifalarni yashirish
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Tanlangan sahifani ko'rsatish
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        console.log("✅ Sahifa ko'rsatildi:", sectionId);
    } else {
        console.error("❌ Sahifa topilmadi:", sectionId);
    }
}

// Profilni yangilash
function updateProfileDisplay() {
    if (!currentUser) {
        console.log("❌ Foydalanuvchi yo'q");
        return;
    }
    
    console.log("🔄 Profil yangilanmoqda...");
    
    // Ism-familiya
    const fullnameElement = document.getElementById('user-fullname');
    if (fullnameElement) {
        fullnameElement.textContent = `${currentUser.name} ${currentUser.surname}`;
        console.log("✅ Ism yangilandi:", fullnameElement.textContent);
    }
    
    // Avatar
    const userAvatar = document.getElementById('user-avatar');
    if (userAvatar) {
        if (currentUser.avatar) {
            userAvatar.innerHTML = `<img src="${currentUser.avatar}" alt="Profil rasmi" style="width:100%;height:100%;border-radius:50%;">`;
            console.log("✅ Avatar yangilandi (rasm)");
        } else {
            userAvatar.innerHTML = '<i class="fas fa-user-circle"></i>';
            console.log("✅ Avatar yangilandi (default)");
        }
    }
    
    // Statistika
    const totalTestsElement = document.getElementById('total-tests');
    const totalWordsElement = document.getElementById('total-words');
    const successRateElement = document.getElementById('success-rate');
    
    if (totalTestsElement) totalTestsElement.textContent = `${currentUser.stats.totalTests} test`;
    if (totalWordsElement) totalWordsElement.textContent = `${currentUser.stats.totalWords} so'z`;
    if (successRateElement) successRateElement.textContent = `${currentUser.stats.successRate}% muvaffaqiyat`;
    
    console.log("✅ Statistika yangilandi");
}

// Chiqish
function logout() {
    console.log("🚪 Chiqish...");
    
    currentUser = null;
    localStorage.removeItem('memoryMasterUser');
    
    // Formani tozalash
    document.getElementById('user-name').value = '';
    document.getElementById('user-surname').value = '';
    document.getElementById('avatar-preview').innerHTML = '<i class="fas fa-user-circle"></i>';
    
    showSection('login-section');
    console.log("✅ Muvaffaqiyatli chiqildi");
}

// Global funksiyalar
window.showSection = showSection;
window.createProfile = createProfile;
window.logout = logout;
window.handleAvatarUpload = handleAvatarUpload;

// Avatar yuklash uchun
window.uploadAvatar = function() {
    document.getElementById('avatar-input').click();
};
// ==================== RAQAMLAR FUNCTIONS ====================

function startNumbersGame() {
    console.log("🔢 Raqamlar o'yini boshlandi");
    
    const numbersCount = parseInt(document.getElementById('numbers-count').value);
    const timeLimit = parseInt(document.getElementById('numbers-time').value);
    
    console.log("📊 Sozlamalar:", { numbersCount, timeLimit });
    
    // Tasodifiy raqamlarni yaratish
    numbersToMemorize = [];
    for (let i = 0; i < numbersCount; i++) {
        numbersToMemorize.push(Math.floor(Math.random() * 10));
    }
    
    console.log("🎲 Yaratilgan raqamlar:", numbersToMemorize);
    
    // Raqamlarni ko'rsatish
    document.getElementById('numbers-display').textContent = numbersToMemorize.join(' ');
    
    // Vaqtni sozlash
    timeLeft = timeLimit;
    document.getElementById('numbers-timer').textContent = timeLeft;
    
    // Eslab qolish sahifasiga o'tish
    showSection('numbers-memorization');
    console.log("✅ Eslab qolish sahifasiga o'tildi");
    
    // Taymerni ishga tushirish
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('numbers-timer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            showNumbersInputSection();
        }
    }, 1000);
}

function showNumbersInputSection() {
    console.log("⌨️ Kirish sahifasiga o'tish");
    showSection('numbers-input');
    
    // Kirish maydonlarini yaratish
    const inputGrid = document.getElementById('numbers-input-grid');
    inputGrid.innerHTML = '';
    
    for (let i = 0; i < numbersToMemorize.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'number-input';
        input.maxLength = 1;
        input.dataset.index = i;
        
        // Enter bosganda keyingi katakka o'tish
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' || this.value.length === 1) {
                const nextIndex = parseInt(this.dataset.index) + 1;
                const nextInput = document.querySelector(`.number-input[data-index="${nextIndex}"]`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
        
        inputGrid.appendChild(input);
    }
    
    // Birinchi katakni fokus qilish
    const firstInput = document.querySelector('.number-input');
    if (firstInput) firstInput.focus();
}

function checkNumbersAnswers() {
    console.log("✅ Javoblarni tekshirish");
    
    const inputs = document.querySelectorAll('.number-input');
    const resultsList = document.getElementById('numbers-results-list');
    resultsList.innerHTML = '';
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    for (let i = 0; i < inputs.length; i++) {
        const userAnswer = inputs[i].value.trim();
        const correctAnswer = numbersToMemorize[i].toString();
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        if (userAnswer === correctAnswer) {
            resultItem.innerHTML = `<span class="correct">${i + 1}. ${userAnswer}</span>`;
            correctCount++;
        } else {
            resultItem.innerHTML = `
                <span class="incorrect">${i + 1}. ${userAnswer}</span>
                <span class="correct-answer">${correctAnswer}</span>
            `;
            incorrectCount++;
        }
        
        resultsList.appendChild(resultItem);
    }
    
    // Statistika
    document.getElementById('numbers-correct-count').textContent = correctCount;
    document.getElementById('numbers-incorrect-count').textContent = incorrectCount;
    document.getElementById('numbers-accuracy').textContent = `${Math.round((correctCount / numbersToMemorize.length) * 100)}%`;
    
    // Natijalar bo'limini ko'rsatish
    showSection('numbers-results');
    console.log("🎯 Natijalar ko'rsatildi");
}

// Global funksiyalarni qo'shamiz
window.startNumbersGame = startNumbersGame;
window.checkNumbersAnswers = checkNumbersAnswers;
