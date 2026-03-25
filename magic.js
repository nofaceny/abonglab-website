// ===== MAGICAL CURSOR TRAIL =====
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouseX = 0;
let mouseY = 0;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 60 + 250}, 100%, ${Math.random() * 30 + 60}%)`;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.98;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Mouse move handler
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Create particles at cursor position
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(mouseX, mouseY));
    }
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].life <= 0 || particles[i].size <= 0.1) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== FLOATING BACKGROUND PARTICLES =====
const particlesContainer = document.getElementById('particles');

function createFloatingParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = Math.random() * 5 + 5 + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';

    const size = Math.random() * 4 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';

    particlesContainer.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, (parseFloat(particle.style.animationDuration) + parseFloat(particle.style.animationDelay)) * 1000);
}

// Create particles periodically
setInterval(createFloatingParticle, 300);

// Initial batch
for (let i = 0; i < 20; i++) {
    setTimeout(createFloatingParticle, i * 100);
}

// ===== MAGIC WAND EFFECT ON BUTTONS =====
document.querySelectorAll('.magic-wand').forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        createSparkles(e.target);
    });
});

function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 10;

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-pop';
        sparkle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
        sparkle.style.position = 'fixed';
        sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
        sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
        sparkle.style.fontSize = Math.random() * 20 + 10 + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '10000';

        document.body.appendChild(sparkle);

        // Animate sparkle
        sparkle.animate([
            {
                transform: 'translate(0, 0) scale(0) rotate(0deg)',
                opacity: 0
            },
            {
                transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1) rotate(${Math.random() * 360}deg)`,
                opacity: 1,
                offset: 0.5
            },
            {
                transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0) rotate(${Math.random() * 720}deg)`,
                opacity: 0
            }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => sparkle.remove();
    }
}

// ===== CARD TILT EFFECT (3D) =====
document.querySelectorAll('[data-tilt]').forEach(card => {
    const isAppCard = card.classList.contains('app-card');
    const maxTilt = isAppCard ? 3 : 8;
    const depth = isAppCard ? 1200 : 800;

    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * maxTilt;
        const rotateY = ((centerX - x) / centerX) * maxTilt;

        this.style.transform = `perspective(${depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        this.style.transition = 'transform 0.1s ease';

        // Move glow highlight with mouse
        const glow = this.querySelector('.card-glow, .app-card__glow');
        if (glow) {
            const pctX = (x / rect.width) * 100;
            const pctY = (y / rect.height) * 100;
            glow.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(139,92,246,0.2) 0%, transparent 60%)`;
        }
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = `perspective(${depth}px) rotateX(0) rotateY(0) translateY(0)`;
        this.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
});

// ===== SCROLL REVEAL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(element => {
    observer.observe(element);
});

// Add scroll-reveal class to cards
document.querySelectorAll('.card').forEach((card, index) => {
    card.classList.add('scroll-reveal');
    card.style.transitionDelay = `${index * 0.1}s`;
});

// ===== MAGIC LINK HOVER EFFECT =====
document.querySelectorAll('.magic-link').forEach(link => {
    link.addEventListener('mouseenter', function(e) {
        createMagicBurst(e);
    });
});

function createMagicBurst(e) {
    const burst = document.createElement('div');
    burst.textContent = '🪄';
    burst.style.position = 'fixed';
    burst.style.left = e.clientX + 'px';
    burst.style.top = e.clientY + 'px';
    burst.style.fontSize = '24px';
    burst.style.pointerEvents = 'none';
    burst.style.zIndex = '10000';

    document.body.appendChild(burst);

    burst.animate([
        {
            transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
            opacity: 0
        },
        {
            transform: 'translate(-50%, -50%) scale(1.5) rotate(180deg)',
            opacity: 1,
            offset: 0.5
        },
        {
            transform: 'translate(-50%, -50%) scale(0) rotate(360deg)',
            opacity: 0
        }
    ], {
        duration: 800,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => burst.remove();
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== NAVBAR BACKGROUND ON SCROLL =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===== TYPING EFFECT FOR HERO SUBTITLE (Optional) =====
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    let charIndex = 0;

    function typeWriter() {
        if (charIndex < originalText.length) {
            subtitle.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    }

    // Start typing after page load
    setTimeout(typeWriter, 500);
}

// ===== CONSTELLATION EFFECT (Background) =====
class Constellation {
    constructor() {
        this.points = [];
        this.createPoints();
        this.animate();
    }

    createPoints() {
        for (let i = 0; i < 50; i++) {
            this.points.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        // Update points
        this.points.forEach(point => {
            point.x += point.vx;
            point.y += point.vy;

            if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
            if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
        });

        // Draw connections
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.lineWidth = 1;

        for (let i = 0; i < this.points.length; i++) {
            for (let j = i + 1; j < this.points.length; j++) {
                const dx = this.points[i].x - this.points[j].x;
                const dy = this.points[i].y - this.points[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(this.points[i].x, this.points[i].y);
                    ctx.lineTo(this.points[j].x, this.points[j].y);
                    ctx.globalAlpha = 1 - distance / 150;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize constellation effect
const constellation = new Constellation();

// ===== RANDOM MAGIC SPARKLES =====
function randomSparkle() {
    const sparkle = document.createElement('div');
    sparkle.textContent = ['✨', '⭐', '💫'][Math.floor(Math.random() * 3)];
    sparkle.style.position = 'fixed';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    sparkle.style.fontSize = Math.random() * 30 + 15 + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1';

    document.body.appendChild(sparkle);

    sparkle.animate([
        {
            opacity: 0,
            transform: 'scale(0) rotate(0deg)'
        },
        {
            opacity: 1,
            transform: 'scale(1) rotate(180deg)',
            offset: 0.5
        },
        {
            opacity: 0,
            transform: 'scale(0) rotate(360deg)'
        }
    ], {
        duration: 2000,
        easing: 'ease-in-out'
    }).onfinish = () => sparkle.remove();
}

// Create random sparkles periodically
setInterval(randomSparkle, 3000);

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('✨ Magic initialized! 🪄');
