// debug.js - Muammolarni aniqlash
console.log('🔧 Memory Master Debug Mode Activated');

// Barcha scriptlar yuklanganligini tekshirish
window.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded');
    checkScripts();
});

function checkScripts() {
    const requiredScripts = [
        'data.js', 'storage.js', 'helpers.js', 
        'numbers.js', 'words.js', 'flashcards.js',
        'faces.js', 'images.js', 'user.js', 'stats.js', 'app.js'
    ];
    
    console.log('📋 Checking scripts...');
    
    // Scriptlarni tekshirish
    requiredScripts.forEach(script => {
        try {
            // Script mavjudligini tekshirish
            console.log(`🔍 ${script}:`, typeof eval(script.split('.')[0]) !== 'undefined' ? '✅ Loaded' : '❌ Missing');
        } catch (e) {
            console.log(`🔍 ${script}: ❌ Error - ${e.message}`);
        }
    });
    
    // GameApp ni tekshirish
    setTimeout(() => {
        if (typeof GameApp !== 'undefined') {
            console.log('✅ GameApp: Loaded');
            initializeApp();
        } else {
            console.log('❌ GameApp: Not found - using emergency mode');
            emergencyMode();
        }
    }, 1000);
}

function initializeApp() {
    try {
        window.gameApp = new GameApp();
        console.log('🎮 GameApp: Initialized successfully');
        
        // Loading screen ni yopish
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
    } catch (error) {
        console.error('❌ GameApp initialization failed:', error);
        emergencyMode();
    }
}

function emergencyMode() {
    console.log('🚨 Emergency mode activated');
    
    // Emergency HTML yaratish
    const emergencyHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; z-index: 10000; color: white;">
            <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 20px; text-align: center; backdrop-filter: blur(10px); max-width: 500px;">
                <h1 style="margin-bottom: 1rem; font-size: 2.5rem;">🧠 Memory Master</h1>
                <p style="margin-bottom: 1rem; opacity: 0.9;">Xush kelibsiz! O'yinlarni boshlash uchun quyidagi tugmalardan foydalaning:</p>
                
                <div style="display: grid; gap: 1rem; margin: 2rem 0;">
                    <button onclick="startEmergencyGame('numbers')" style="background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); color: white; padding: 1rem; border-radius: 12px; cursor: pointer; font-size: 1.1rem; transition: all 0.3s;">
                        🔢 Raqamlar O'yini
                    </button>
                    <button onclick="startEmergencyGame('words')" style="background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); color: white; padding: 1rem; border-radius: 12px; cursor: pointer; font-size: 1.1rem; transition: all 0.3s;">
                        📝 So'zlar O'yini
                    </button>
                    <button onclick="startEmergencyGame('flashcards')" style="background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); color: white; padding: 1rem; border-radius: 12px; cursor: pointer; font-size: 1.1rem; transition: all 0.3s;">
                        🎴 Flash Kartalar
                    </button>
                </div>
                
                <p style="font-size: 0.9rem; opacity: 0.7; margin-top: 1rem;">
                    Agar muammo davom etsa, brauzeringizni yangilang yoki boshqa brauzerdan urinib ko'ring.
                </p>
            </div>
        </div>
    `;
    
    // Emergency HTML ni qo'shish
    const existingContent = document.querySelector('.main-container');
    if (existingContent) {
        existingContent.style.display = 'none';
    }
    document.body.insertAdjacentHTML('beforeend', emergencyHTML);
}

// Emergency game functions
window.startEmergencyGame = function(gameType) {
    console.log('🎮 Starting emergency game:', gameType);
    
    // Simple game implementations
    switch(gameType) {
        case 'numbers':
            startEmergencyNumbersGame();
            break;
        case 'words':
            startEmergencyWordsGame();
            break;
        case 'flashcards':
            startEmergencyFlashcards();
            break;
    }
};

function startEmergencyNumbersGame() {
    const gameHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); z-index: 10001; color: white; padding: 2rem;">
            <div style="max-width: 600px; margin: 0 auto;">
                <button onclick="location.reload()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; margin-bottom: 2rem;">
                    ⬅️ Orqaga
                </button>
                
                <h2 style="text-align: center; margin-bottom: 2rem;">🔢 Raqamlar O'yini</h2>
                
                <div id="emergency-numbers-game" style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 16px; text-align: center;">
                    <p>Bu oddiy raqamlar o'yini. Tez orada to'liq versiya ishga tushadi.</p>
                    <button onclick="alert('Yaqinda ishga tushadi! 🚀')" style="background: #6366f1; color: white; border: none; padding: 1rem 2rem; border-radius: 12px; cursor: pointer; margin-top: 1rem; font-size: 1.1rem;">
                        Boshlash
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', gameHTML);
}

function startEmergencyWordsGame() {
    // Similar implementation for words game
    alert('Soʻzlar oʻyini - Yaqinda ishga tushadi! 📚');
}

function startEmergencyFlashcards() {
    // Similar implementation for flashcards
    alert('Flash kartalar - Yaqinda ishga tushadi! 🌍');
}

// Storage fallback
if (typeof localStorage === 'undefined') {
    console.warn('⚠️ localStorage not available - using fallback');
    window.fallbackStorage = {};
    
    window.localStorage = {
        setItem: function(key, value) {
            if (window.fallbackStorage) {
                window.fallbackStorage[key] = value;
            }
        },
        getItem: function(key) {
            return window.fallbackStorage ? window.fallbackStorage[key] : null;
        },
        removeItem: function(key) {
            if (window.fallbackStorage) {
                delete window.fallbackStorage[key];
            }
        }
    };
}
