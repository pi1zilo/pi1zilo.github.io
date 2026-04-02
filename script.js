// ==================== ПРОВЕРКА НА МОБИЛЬНОЕ УСТРОЙСТВО ====================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// ==================== MATRIX RAIN (только для десктопа) ====================
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

if (!isMobile) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = 'アィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    for (let i = 0; i < columns; i++) { drops[i] = Math.random() * -100; }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < drops.length; i++) {
            ctx.fillStyle = '#ffffff';
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            ctx.fillStyle = `rgba(0, ${150 + Math.random() * 105}, 0, ${0.5 + Math.random() * 0.5})`;
            for (let j = 1; j < 3; j++) {
                if (drops[i] - j > 0) {
                    const prevChar = charArray[Math.floor(Math.random() * charArray.length)];
                    ctx.fillText(prevChar, i * fontSize, (drops[i] - j) * fontSize);
                }
            }
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) { drops[i] = 0; }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 35);
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
} else {
    canvas.style.display = 'none';
}


// ==================== ЗВУКИ ====================
let soundEnabled = true;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playClick() {
    if (!soundEnabled) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
}

let serverHumNode = null;

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundBtn');
    if (soundEnabled) {
        btn.innerHTML = '<i class="fas fa-volume-up"></i> ON';
        startServerHum();
    } else {
        btn.innerHTML = '<i class="fas fa-volume-mute"></i> OFF';
        stopServerHum();
    }
    playClick();
}

function startServerHum() {
    if (serverHumNode || isMobile) return;
    const bufferSize = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 0.02 - 0.01; }
    serverHumNode = audioContext.createBufferSource();
    serverHumNode.buffer = buffer;
    serverHumNode.loop = true;
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5;
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    serverHumNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    serverHumNode.start();
}

function stopServerHum() {
    if (serverHumNode) { serverHumNode.stop(); serverHumNode = null; }
}

// ==================== UPTIME ====================
let startTime = Date.now();
function updateUptime() {
    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    document.getElementById('uptime-value').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
setInterval(updateUptime, 1000);

// ==================== ПИНГ ====================
async function measurePing() {
    const start = performance.now();
    try {
        await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
        const end = performance.now();
        const ping = Math.round(end - start);
        document.getElementById('ping-value').textContent = ping;
    } catch (e) { document.getElementById('ping-value').textContent = 'ERR'; }
}
if (!isMobile) {
    measurePing();
    setInterval(measurePing, 5000);
}

// ==================== CPU/RAM СИМУЛЯЦИЯ ====================
function updateSystemStats() {
    const cpu = Math.floor(Math.random() * 30) + 5;
    const ram = (Math.random() * 2 + 3).toFixed(1);
    document.getElementById('cpu-value').textContent = `${cpu}%`;
    document.getElementById('ram-value').textContent = `${ram}GB / 404GB`;
}
setInterval(updateSystemStats, 2000);

// ==================== IP ADDRESS ====================
if (!isMobile) {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => { document.getElementById('ip-value').textContent = data.ip; })
        .catch(() => { document.getElementById('ip-value').textContent = '192.168.1.100'; });
} else {
    document.getElementById('ip-value').textContent = '192.168.1.100';
}

// ==================== ДАННЫЕ (заполни сам) ====================
const infoData = {
about: `> <b style="color:#4CAF50;"> Имя:</b> Тимур Левандовский
> <b style="color:#4CAF50;">Ник:</b> BilioniD, P1zilo
> <b style="color:#4CAF50;">Возраст:</b> 19 лет
> <b style="color:#4CAF50;">Локация:</b> Москва, Россия<br>

> <b style="color:#2196F3;">Обо мне:</b>
Занимаюсь системным администрированием и немного разработкой.

Работаю с <b>Windows</b> и <b>Linux</b>: настраиваю серверы и сервисы,
автоматизирую задачи с помощью <b>Python</b> и <b>Bash</b>.

Учусь в <b>Московском городском открытом колледже</b>.
Работаю в <b>Московском институте психоанализа</b> (техподдержка).

Интересуюсь мониторингом и автоматизацией.`,
  
skills: `> <b style="color:#2196F3;">Языки программирования:</b>
• Python
• Bash / Shell

> <b style="color:#2196F3;">Технологии и стек:</b>
• Linux (Kali, Ubuntu, Arch)
• Windows Server
• Docker / Docker Compose
• Git / GitHub
• Nginx / Apache

> <b style="color:#2196F3;">Мониторинг:</b>
• Prometheus
• Grafana
• Node Exporter
• Zabbix

> <b style="color:#2196F3;">Инструменты:</b>
• VS Code
• Vim`,
  
projects: `> <b style="color:#2196F3;">Проекты:</b><br>
• Персональный сайт-портфолио<br>
• Telegram-бот на Python (автоматизация и уведомления)<br>
• Стек мониторинга через Docker (Prometheus + Grafana + Node Exporter)`
};

// ==================== ФУНКЦИИ КОНСОЛИ ====================
function typeText(element, text, speed = 10) {
    // отключаем эффект на телефонах
    if (isMobile) {
        element.innerHTML = text;
        return;
    }

    element.innerHTML = '';
    let i = 0;

    function typing() {
        if (i < text.length) {
            element.innerHTML = text.slice(0, i + 1);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}

function showInfo(section, btn) {
    document.querySelectorAll('.info-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const output = document.getElementById('console-output');
    output.innerHTML = '';

    typeText(output, infoData[section], 5);
    playClick();
}

function clearConsole() {
    const output = document.getElementById('console-output');
    output.textContent = '';
    document.querySelectorAll('.info-btn').forEach(b => b.classList.remove('active'));
    playClick();
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.body.addEventListener('click', () => {
    if (audioContext.state === 'suspended') { audioContext.resume(); }
}, { once: true });

if (!isMobile) {
    startServerHum();
}

function createLeshyBackground() {
    const container = document.getElementById('leshyBg');
    if (!container) return;

    const word = 'Леший ';
    const lineText = word.repeat(50);

    for (let i = 0; i < 8; i++) {
        const line = document.createElement('div');
        line.className = 'leshy-line' + (i % 2 ? ' reverse' : '');
        line.style.top = (i * 12) + '%';
        line.textContent = lineText;
        container.appendChild(line);
    }
}

let secretSequence = [];
const correctSequence = ['green','red','yellow','yellow','red'];
let secretActive = false;

function triggerSecret() {
    if (secretActive) return;
    secretActive = true;

    const avatar = document.querySelector('.avatar-container');
    const original = avatar.innerHTML;

    avatar.innerHTML = `
        <div style="
            color:rgb(255, 251, 0);;
            font-size:18px;
            display:flex;
            align-items:center;
            justify-content:center;
            height:100%;
            text-align:center;
        ">
            🍺🍻🍺Красава возми с полки ПИВО🍺🍻🍺
        </div>
    `;

    setTimeout(() => {
        avatar.innerHTML = original;
        createLeshyBackground();
        secretActive = false;
    }, 10000);
}

function handleSecret(color) {
    secretSequence.push(color);
    if (secretSequence.length > 5) secretSequence.shift();

    if (JSON.stringify(secretSequence) === JSON.stringify(correctSequence)) {
        triggerSecret();
        secretSequence = [];
    }
}

document.querySelector('.btn-red').onclick = () => { playClick(); handleSecret('red'); };
document.querySelector('.btn-yellow').onclick = () => { playClick(); handleSecret('yellow'); };
document.querySelector('.btn-green').onclick = () => { playClick(); handleSecret('green'); };

createLeshyBackground();

// Консоль пустая при загрузке - пользователь сам нажимает кнопки
