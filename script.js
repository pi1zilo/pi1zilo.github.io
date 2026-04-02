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
    document.getElementById('ram-value').textContent = `${ram}GB / 16GB`;
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
    about: `> ERROR`,

    skills: `> ERROR`,

    projects: `> ERROR`
};

// ==================== ФУНКЦИИ КОНСОЛИ ====================
function showInfo(section, btn) {
    document.querySelectorAll('.info-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    const output = document.getElementById('console-output');
    output.textContent = infoData[section];
    output.style.color = 'rgba(255, 255, 255, 0.9)';
    output.style.textShadow = '';
    output.style.fontSize = '';
    output.style.fontWeight = '';
    
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

// Консоль пустая при загрузке - пользователь сам нажимает кнопки