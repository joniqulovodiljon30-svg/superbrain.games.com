// fix.js - Muammolarni tuzatish
document.addEventListener('DOMContentLoaded', function() {
    console.log('Memory Master - Fix script loaded');
    
    // Loading screen ni tekshirish
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    // App ni ishga tushirish
    if (typeof GameApp !== 'undefined') {
        setTimeout(() => {
            window.gameApp = new GameApp();
        }, 100);
    } else {
        console.error('GameApp not found!');
        // Emergency fallback
        showEmergencyMenu();
    }
});

// Emergency fallback menu
function showEmergencyMenu() {
    const emergencyHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; z-index: 10000;">
            <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 20px; text-align: center; backdrop-filter: blur(10px); color: white;">
                <h1 style="margin-bottom: 1rem;">🧠 Memory Master</h1>
                <p style="margin-bottom: 2rem;">Saytda texnik muammo yuz berdi. Iltimos, qayta yuklang.</p>
                <button onclick="location.reload()" style="background: white; color: #667eea; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer; font-weight: bold;">
                    🔄 Qayta Yuklash
                </button>
            </div>
        </div>
    `;
    
    document.body.innerHTML = emergencyHTML;
}

// Console da ma'lumot berish
console.log(`
🧠 Memory Master Debug Info:
📍 URL: ${window.location.href}
📁 Path: ${window.location.pathname}
🔧 User Agent: ${navigator.userAgent}
💾 Storage: ${typeof localStorage !== 'undefined' ? 'Available' : 'Not Available'}
`);