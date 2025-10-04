<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <title>Memory Master - Fixed Version</title>
    <style>
        /* Asosiy stillar */
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        
        .game-btn {
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.3);
            color: white;
            padding: 20px;
            margin: 10px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.3s;
        }
        
        .game-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 Memory Master</h1>
        <p>Xotira va aql o'yinlari platformasi</p>
        
        <div style="margin: 40px 0;">
            <button class="game-btn" onclick="startGame('numbers')">
                🔢 Raqamlar
            </button>
            <button class="game-btn" onclick="startGame('words')">
                📝 So'zlar
            </button>
            <button class="game-btn" onclick="startGame('flashcards')">
                🎴 Flash Kartalar
            </button>
        </div>
        
        <div id="game-area"></div>
    </div>

    <script>
        function startGame(type) {
            const area = document.getElementById('game-area');
            
            if (type === 'numbers') {
                area.innerHTML = `
                    <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 16px; margin-top: 20px;">
                        <h3>🔢 Raqamlar O'yini</h3>
                        <p>3 ta raqamni eslab qoling:</p>
                        <div style="font-size: 2rem; margin: 20px 0;">7 2 9</div>
                        <button onclick="checkAnswer()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                            Ko'rsatishni tugatish
                        </button>
                    </div>
                `;
            }
            // ... boshqa o'yinlar
        }
        
        function checkAnswer() {
            const answer = prompt('Raqamlarni ketma-ketlikda kiriting (masalan: 7 2 9):');
            if (answer === '7 2 9') {
                alert('🎉 Toʻgʻri! Ajoyib xotira!');
            } else {
                alert('❌ Notoʻgʻri! Toʻgʻri javob: 7 2 9');
            }
        }
    </script>
</body>
</html>
