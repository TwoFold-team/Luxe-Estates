/* Luxe Estates - Main Script (English only) */
document.documentElement.classList.add('js');

/* SAFETY WATCHDOG: if typing never starts for any reason, show the full static page */
setTimeout(function () {
    if (!window.__typingStarted) document.documentElement.classList.remove('js');
}, 9000);

/* Elements */
var navbar = document.getElementById('navbar');
var hamburger = document.getElementById('hamburger');
var navMenu = document.getElementById('navMenu');
var navLinks = document.querySelectorAll('.nav-link');
var heroVideo = document.getElementById('heroVideo');
var line1El = document.getElementById('typeLine1');
var line2El = document.getElementById('typeLine2');
var heroSub = document.getElementById('heroSub');
var heroBtns = document.getElementById('heroBtns');
var scrollHint = document.getElementById('scrollHint');
var backToTop = document.getElementById('backToTop');
var contactForm = document.getElementById('contactForm');
var statNumbers = document.querySelectorAll('.stat-number');

/* 1) Video plays instantly */
function playVideo() {
    if (!heroVideo) return;
    var p = heroVideo.play();
    if (p && p.catch) p.catch(function () {});
}
window.addEventListener('load', playVideo);
document.addEventListener('DOMContentLoaded', playVideo);
if (heroVideo) {
    heroVideo.addEventListener('canplay', playVideo);
    heroVideo.addEventListener('error', function () {
        heroVideo.style.display = 'none';
        document.querySelector('.hero').style.background = "url('images/villa-1.png') center/cover no-repeat";
    }, true);
}

/* 2) Typing effect - starts after 6 seconds, no cursor bar */
var rotatingWords = ['Your Dream Home', 'Luxury Living', 'Timeless Elegance', 'Smart Investments'];
var wordIndex = 0, charIndex = 0, isDeleting = false;

function typeRotating() {
    var word = rotatingWords[wordIndex];
    charIndex += isDeleting ? -1 : 1;
    line2El.textContent = word.substring(0, charIndex);
    var speed = isDeleting ? 45 : 95;
    if (!isDeleting && charIndex === word.length) { speed = 2400; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % rotatingWords.length; speed = 500; }
    setTimeout(typeRotating, speed);
}

function typeDiscover() {
    window.__typingStarted = true;
    line1El.style.visibility = 'visible';
    line1El.textContent = '';
    var text = 'Discover', i = 0;
    var t = setInterval(function () {
        i++;
        line1El.textContent = text.substring(0, i);
        if (i === text.length) {
            clearInterval(t);
            setTimeout(function () {
                line2El.style.visibility = 'visible';
                line2El.textContent = '';
                typeRotating();
            }, 350);
        }
    }, 110);
}
setTimeout(typeDiscover, 6000);

/* Subtitle + buttons + scroll hint fade in */
setTimeout(function () { heroSub.classList.add('show'); heroBtns.classList.add('show'); }, 7000);
setTimeout(function () { scrollHint.classList.add('show'); }, 7800);

/* 3) Scroll behaviours */
var statsAnimated = false;
function revealOnScroll() {
    document.querySelectorAll('[data-aos]').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight - 90) el.classList.add('aos-animate');
    });
}
function animateStats() {
    var stats = document.querySelector('.stats');
    if (!stats || statsAnimated) return;
    if (stats.getBoundingClientRect().top > window.innerHeight - 120) return;
    statsAnimated = true;
    statNumbers.forEach(function (el) {
        var target = +el.dataset.target, step = target / 120, cur = 0;
        var tick = function () {
            cur += step;
            if (cur < target) { el.textContent = Math.ceil(cur); requestAnimationFrame(tick); }
            else el.textContent = target + '+';
        };
        tick();
    });
}
var sections = document.querySelectorAll('section[id]');
function highlightNav() {
    var y = window.scrollY + 140;
    sections.forEach(function (sec) {
        var link = document.querySelector('.nav-link[href="#' + sec.id + '"]');
        if (!link) return;
        if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
            navLinks.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');
        }
    });
}
window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
    backToTop.classList.toggle('visible', window.scrollY > 500);
    revealOnScroll(); animateStats(); highlightNav();
}, { passive: true });

/* 4) Mobile menu */
hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});
navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

/* 5) Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 78, behavior: 'smooth' });
    });
});

/* 6) Back to top */
backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

/* 7) Contact form */
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    notify('Thank you! Your message has been sent successfully.');
    contactForm.reset();
});
function notify(msg) {
    var n = document.createElement('div');
    n.style.cssText = 'position:fixed;top:96px;left:50%;transform:translateX(-50%);background:#0a1220;color:#e6c15c;padding:16px 34px;border-radius:60px;z-index:10000;font-family:Montserrat,sans-serif;font-weight:600;letter-spacing:.5px;box-shadow:0 16px 40px rgba(0,0,0,.3);border:1px solid rgba(201,162,39,.5);display:flex;gap:10px;align-items:center;';
    n.innerHTML = '<i class="fas fa-check-circle"></i><span>' + msg + '</span>';
    document.body.appendChild(n);
    setTimeout(function () { n.style.transition = 'all .5s ease'; n.style.opacity = '0'; n.style.transform = 'translateX(-50%) translateY(-16px)'; setTimeout(function () { n.remove(); }, 500); }, 3200);
}

/* 8) Favorite / share buttons */
document.querySelectorAll('.action-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var icon = this.querySelector('i');
        if (icon.classList.contains('fa-heart')) {
            var active = icon.classList.toggle('fas');
            icon.classList.toggle('far', !active);
            this.style.background = active ? '#c9a227' : '';
            this.style.color = active ? '#fff' : '';
            notify(active ? 'Added to favorites' : 'Removed from favorites');
        } else { notify('Property link copied to clipboard'); }
    });
});

/* 9) IMAGE FIXER - auto tries png/jpg/jpeg/webp + double extensions */
var EXT = ['png', 'jpg', 'jpeg', 'webp', 'PNG', 'JPG', 'JPEG'];
document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
        var src = this.getAttribute('src');
        if (!src) return;
        var queue = (this.dataset.q || '').split('|').filter(Boolean);
        if (!queue.length) {
            var base = src.replace(/\.[^./]+$/, '');
            queue = EXT.map(function (e) { return base + '.' + e; })
                .concat([base + '.png.png', base + '.jpg.jpg'])
                .filter(function (u) { return u !== src; });
        }
        var next = queue.shift();
        this.dataset.q = queue.join('|');
        if (next) this.src = next;
        else console.warn('Missing image file:', src);
    });
});

/* 10) Prevent double-tap zoom on mobile */
var lastTouch = 0;
document.addEventListener('touchend', function (e) {
    var now = Date.now();
    if (now - lastTouch <= 300) e.preventDefault();
    lastTouch = now;
}, false);

/* Init */
document.addEventListener('DOMContentLoaded', revealOnScroll);