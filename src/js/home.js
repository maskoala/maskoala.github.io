const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
let particlesArray = [];
let time = 0;

// ===== 雜訊背景（只生成一次）=====
const noiseCanvas = document.createElement('canvas');
const noiseCtx = noiseCanvas.getContext('2d');
function generateNoise() {
    noiseCanvas.width = canvas.width;
    noiseCanvas.height = canvas.height;
    noiseCtx.fillStyle = '#ffffff';
    noiseCtx.fillRect(0, 0, canvas.width, canvas.height);
    const imageData = noiseCtx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
        if (Math.random() < 0.20) {
            const v = 180 + Math.random() * 60;
            d[i] = v;
            d[i + 1] = v;
            d[i + 2] = v;
        }
    }
    noiseCtx.putImageData(imageData, 0, 0);
}
generateNoise();

// ===== 無尾熊粒子 =====
class Particle {
    constructor(x, y, char, baseSize, color) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = x;
        this.baseY = y;
        this.size = baseSize;
        this.char = char;
        this.color = color;
        this.phase = Math.random() * Math.PI * 2;
        this.amplitude = 0.5 + Math.random() * 1.5;
        this.speed = 0.3 + Math.random() * 0.7;
        this.arrived = false;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px Arial`;
        ctx.fillText(this.char, this.x, this.y);
    }
    update() {
        if (!this.arrived) {
            let diffX = this.x - this.baseX;
            let diffY = this.y - this.baseY;
            this.x -= diffX / 20;
            this.y -= diffY / 20;
            if (Math.abs(diffX) < 1 && Math.abs(diffY) < 1) {
                this.arrived = true;
            }
        } else {
            this.x = this.baseX + Math.sin(time * this.speed + this.phase) * this.amplitude;
            this.y = this.baseY + Math.cos(time * this.speed * 0.8 + this.phase) * this.amplitude * 0.6;
        }
    }
}

// ===== 飛行生物（蝴蝶/鳥）=====
const butterflyWing = [
    [-3,-4],[-4,-3],[-5,-3],[-6,-2],[-7,-2],[-7,-1],[-6,0],[-5,0],[-4,-1],[-3,-2],[-2,-1],
    [-3,-3],[-5,-2],[-6,-1],[-4,-2],[-2,-2],[-1,-1],[-2,-3],[-4,-4],[-5,-1],
    [-2,1],[-3,1],[-4,2],[-4,3],[-3,3],[-2,2],[-1,1],[-3,2],[-5,2],[-5,1],
];
const birdShape = [
    [0,0],[1,0],[-1,0],[2,-1],[3,-2],[4,-3],[-2,-1],[-3,-2],[-4,-3],
    [1,-1],[-1,-1],[5,-4],[-5,-4],[3,-1],[-3,-1],
];

class FlyingCreature {
    constructor() {
        this.reset();
    }
    reset() {
        this.type = Math.random() > 0.5 ? 'butterfly' : 'bird';
        const sizeRoll = Math.random();
        if (sizeRoll < 0.4) {
            this.scale = 1.5 + Math.random() * 1.5;
            this.opacity = 0.3 + Math.random() * 0.2;
        } else if (sizeRoll < 0.8) {
            this.scale = 3 + Math.random() * 2;
            this.opacity = 0.5 + Math.random() * 0.3;
        } else {
            this.scale = 8 + Math.random() * 8;
            this.opacity = 0.7 + Math.random() * 0.3;
        }
        const baseSpeed = 0.3 + this.scale * 0.25 + Math.random() * 0.5;
        const side = Math.floor(Math.random() * 4);
        if (side === 0) {
            this.x = -60 - Math.random() * 200;
            this.y = 30 + Math.random() * (canvas.height * 0.7);
            this.dirX = baseSpeed;
            this.dirY = (Math.random() - 0.5) * 0.6;
        } else if (side === 1) {
            this.x = canvas.width + 60 + Math.random() * 200;
            this.y = 30 + Math.random() * (canvas.height * 0.7);
            this.dirX = -baseSpeed;
            this.dirY = (Math.random() - 0.5) * 0.6;
        } else if (side === 2) {
            this.x = Math.random() * canvas.width;
            this.y = -60 - Math.random() * 150;
            this.dirX = (Math.random() - 0.5) * baseSpeed;
            this.dirY = baseSpeed * 0.6;
        } else {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 60 + Math.random() * 150;
            this.dirX = (Math.random() - 0.5) * baseSpeed;
            this.dirY = -baseSpeed * 0.6;
        }
        this.phase = Math.random() * Math.PI * 2;
        this.wingSpeed = 2 + Math.random() * 4;
        this.alive = true;

        this.chars = [];
        const shape = this.type === 'butterfly' ? this.getButterflyPoints() : birdShape;
        const charSize = Math.max(3, this.scale * 0.8);
        for (const [dx, dy] of shape) {
            this.chars.push({
                dx: dx, dy: dy,
                char: chars[Math.floor(Math.random() * chars.length)],
                size: charSize + Math.random() * charSize * 0.5,
            });
        }
    }
    getButterflyPoints() {
        const pts = [];
        for (const [dx, dy] of butterflyWing) {
            pts.push([dx, dy]);
            pts.push([-dx, dy]);
        }
        pts.push([0,0],[0,-1],[0,-2],[0,-3],[0,1],[0,2],[0,3]);
        return pts;
    }
    update() {
        this.x += this.dirX;
        this.y += this.dirY + Math.sin(time * 1.5 + this.phase) * 0.5;
        if (this.x > canvas.width + 150 || this.x < -150 ||
            this.y > canvas.height + 150 || this.y < -150) this.reset();
    }
    draw() {
        const wingFlap = Math.sin(time * this.wingSpeed + this.phase);
        const flapScale = this.type === 'butterfly' ? wingFlap * 0.6 : wingFlap * 0.3;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        for (const p of this.chars) {
            let px = p.dx * this.scale;
            let py = p.dy * this.scale;
            if (p.dx !== 0) {
                const dist = Math.abs(p.dx);
                py += flapScale * dist * this.scale * 0.8;
            }

            ctx.fillStyle = `rgba(20, 20, 20, ${this.opacity})`;
            ctx.font = `${p.size}px Arial`;
            ctx.fillText(p.char, this.x + px, this.y + py);
        }
        ctx.restore();
    }
}

// ===== 初始化 =====
const creatures = [];
const NUM_CREATURES = 15;
for (let i = 0; i < NUM_CREATURES; i++) {
    creatures.push(new FlyingCreature());
}

const offCanvas = document.createElement('canvas');
const offCtx = offCanvas.getContext('2d');
offCanvas.width = canvas.width;
offCanvas.height = canvas.height;
let useStaticCache = false;
let allArrived = false;

function buildStaticCache() {
    offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
    for (const p of particlesArray) {
        offCtx.fillStyle = p.color;
        offCtx.font = `${p.size}px Arial`;
        offCtx.fillText(p.char, p.baseX, p.baseY);
    }
}

function init(imgUrl) {
    particlesArray = [];
    allArrived = false;
    useStaticCache = false;
    const img = new Image();
    img.src = imgUrl;

    img.onload = function() {
        let tempWidth = img.width;
        let tempHeight = img.height;
        const maxDim = 1200;
        if (tempWidth > maxDim || tempHeight > maxDim) {
            const ratio = Math.min(maxDim / tempWidth, maxDim / tempHeight);
            tempWidth = Math.floor(tempWidth * ratio);
            tempHeight = Math.floor(tempHeight * ratio);
        }
        const startX = Math.floor((canvas.width - tempWidth) / 2);
        const startY = Math.floor(canvas.height - tempHeight);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, startX, startY, tempWidth, tempHeight);

        const imgData = ctx.getImageData(startX, startY, tempWidth, tempHeight);
        const data = imgData.data;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const sampleStep = 5;

        for (let y = 0; y < tempHeight; y += sampleStep) {
            for (let x = 0; x < tempWidth; x += sampleStep) {
                const index = (y * tempWidth + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const a = data[index + 3];
                const avg = (r + g + b) / 3;

                if (a > 128 && avg < 220) {
                    const char = chars[Math.floor(Math.random() * chars.length)];
                    const darkness = (255 - avg) / 255;
                    const fontSize = Math.max(4, Math.min(8, 4 + darkness * 6));
                    const opacity = Math.max(0.35, Math.min(1, darkness * 2.0));
                    const color = `rgba(0, 0, 0, ${opacity})`;
                    particlesArray.push(new Particle(startX + x, startY + y, char, fontSize, color));
                }
            }
        }
    };
}

// ===== 動畫 =====
function animate() {
    time += 0.016;
    ctx.drawImage(noiseCanvas, 0, 0);

    if (!allArrived) {
        let countArrived = 0;
        for (const p of particlesArray) {
            p.update();
            p.draw();
            if (p.arrived) countArrived++;
        }
        if (countArrived === particlesArray.length && particlesArray.length > 0) {
            allArrived = true;
            buildStaticCache();
            useStaticCache = true;
        }
    } else {
        if (Math.floor(time * 60) % 10 === 0) {
            offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
            for (const p of particlesArray) {
                p.update();
                offCtx.fillStyle = p.color;
                offCtx.font = `${p.size}px Arial`;
                offCtx.fillText(p.char, p.x, p.y);
            }
        }
        ctx.drawImage(offCanvas, 0, 0);
    }

    for (const c of creatures) {
        c.update();
        c.draw();
    }

    requestAnimationFrame(animate);
}

init('/images/koala.jpg');
animate();

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;
    generateNoise();
    init('/images/bw.png');
});

// ===== 隨機浮現 UIUX 術語 =====
const uiuxTerms = [
    'From 0 to 1',
    'Design as Spec',
    'Twin-Layer Architecture',
    'Persona-Driven Scoping',
    'Cross-Functional Alignment',
    'Design Token Pipeline',
    'Single Source of Truth',
    'Async UX',
    'Sprint Methodology',
    'Edge Case Decision Trees',
    'Visual Communication',
    'Brand Voice & Tone',
    'B2B SaaS Mindset',
    'Batch Operations First',
    '8-Point Grid System',
    'Foundation + Creative Layer',
    'Logic Flowchart in FigJam',
    'User Story Driven',
    'Figma Online Collaboration',
    'Product-Market Fit',
    'Modular System Design',
    'Three Personas, Two Platforms',
    'Reducing Cognitive Load',
    'First B2B Contract Secured',
    'Design Lead',
    'Stakeholder Alignment',
    'Information Architecture',
    'Prototype-Driven Demo',
    'Zero-Setup for New Projects',
    'Liquidity Buffer Mechanism',
];

function spawnOne() {
    const term = uiuxTerms[Math.floor(Math.random() * uiuxTerms.length)];
    const el = document.createElement('div');
    el.className = 'term-popup';
    el.innerHTML = `<div class="term-bg"></div><span class="term-text">${term}</span>`;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const spreadX = window.innerWidth * 0.25;
    const spreadY = window.innerHeight * 0.2;
    el.style.left = (cx - spreadX + Math.random() * spreadX * 2) + 'px';
    el.style.top = (cy - spreadY + Math.random() * spreadY * 2) + 'px';

    document.body.appendChild(el);

    const stayTime = 1500 + Math.random() * 1000;
    setTimeout(() => {
        el.classList.add('leaving');
        setTimeout(() => el.remove(), 350);
    }, stayTime);
}

function spawnTerm() {
    const count = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
        setTimeout(spawnOne, i * 120);
    }
    setTimeout(spawnTerm, 3000 + Math.random() * 4000);
}

setTimeout(spawnTerm, 2000);
