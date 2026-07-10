/*=========================================
        HERO SLIDER
=========================================*/

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".hero-dot");
const nextBtn = document.querySelector(".hero-next");
const prevBtn = document.querySelector(".hero-prev");
const hero = document.querySelector(".hero");

let currentSlide = 0;
let autoSlide;

function showSlide(index) {

    if (!slides.length || !dots.length) {
        return;
    }

    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");

}

function nextSlide() {

    if (!slides.length) {
        return;
    }

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);

}

function prevSlide() {

    if (!slides.length) {
        return;
    }

    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);

}

function startSlider() {

    if (!slides.length) {
        return;
    }

    autoSlide = setInterval(nextSlide, 5000);

}

function stopSlider() {

    clearInterval(autoSlide);

}

if (nextBtn && prevBtn && hero && slides.length && dots.length) {

    nextBtn.addEventListener("click", () => {
        nextSlide();
        stopSlider();
        startSlider();
    });

    prevBtn.addEventListener("click", () => {
        prevSlide();
        stopSlider();
        startSlider();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentSlide = index;
            showSlide(currentSlide);
            stopSlider();
            startSlider();
        });
    });

    hero.addEventListener("mouseenter", stopSlider);
    hero.addEventListener("mouseleave", startSlider);

    showSlide(currentSlide);
    startSlider();

}

/*=========================================
        DARK MODE
=========================================*/

const themeButtons = document.querySelectorAll(".theme-toggle, [data-theme-toggle]");

themeButtons.forEach(button => {

    const icon = button.querySelector("i");

    button.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const dark = document.body.classList.contains("dark-mode");

        if (icon) {
            icon.className = dark
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
        }

        localStorage.setItem("theme", dark ? "dark" : "light");

    });

});

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark-mode");

    document.querySelectorAll(".theme-toggle i, [data-theme-toggle] i")
        .forEach(icon => {
            icon.className = "fa-solid fa-sun";
        });

}

const menuBtn = document.getElementById("dashboardMenuToggle");
const sidebar = document.querySelector(".dashboard-sidebar");
const body = document.body;
let sidebarOverlay = document.querySelector(".dashboard-sidebar-overlay");

if (!sidebarOverlay) {
    sidebarOverlay = document.createElement("div");
    sidebarOverlay.className = "dashboard-sidebar-overlay";
    document.body.appendChild(sidebarOverlay);
}

function toggleSidebar(forceState) {

    if (!sidebar) {
        return;
    }

    if (window.innerWidth > 1199) {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
        body.classList.remove("dashboard-sidebar-open");
        return;
    }

    const shouldOpen = typeof forceState === "boolean" ? forceState : !sidebar.classList.contains("active");

    sidebar.classList.toggle("active", shouldOpen);
    sidebarOverlay.classList.toggle("active", shouldOpen);
    body.classList.toggle("dashboard-sidebar-open", shouldOpen);

}

if (menuBtn && sidebar) {

    menuBtn.addEventListener("click", () => toggleSidebar());

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "dashboard-sidebar-close";
    closeBtn.setAttribute("aria-label", "Close sidebar");
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.addEventListener("click", () => toggleSidebar(false));
    sidebar.insertBefore(closeBtn, sidebar.firstChild);

    sidebarOverlay.addEventListener("click", () => toggleSidebar(false));

    sidebar.querySelectorAll(".dashboard-menu a").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 991) {
                toggleSidebar(false);
            }
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1199) {
            toggleSidebar(false);
        }
    });

}

/*=========================================
        COUNTER ANIMATION
=========================================*/

function initCounterAnimation() {

    const counters = document.querySelectorAll(".hero-stat h3, .trusted-card .counter");

    if (!counters.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function parseCounterTarget(element) {

        const text = element.textContent.trim();
        const match = text.match(/-?\d+/);

        if (!match) {
            return { target: 0, suffix: "" };
        }

        const target = parseInt(match[0], 10);
        const suffix = text.slice(match.index + match[0].length).trim();

        return { target, suffix };

    }

    function updateCounterValue(element, value, suffix) {

        if (element.tagName.toLowerCase() === "h3") {
            element.textContent = `${value}${suffix}`;
            return;
        }

        element.textContent = `${value}`;

    }

    function animateCounter(element) {

        if (element.dataset.counterAnimated === "true") {
            return;
        }

        const { target, suffix } = parseCounterTarget(element);

        element.dataset.counterAnimated = "true";

        if (prefersReducedMotion) {
            updateCounterValue(element, target, suffix);
            return;
        }

        const duration = 2000;
        const startTime = performance.now();

        function runFrame(currentTime) {

            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(easedProgress * target);

            updateCounterValue(element, currentValue, suffix);

            if (progress < 1) {
                requestAnimationFrame(runFrame);
            } else {
                updateCounterValue(element, target, suffix);
            }

        }

        requestAnimationFrame(runFrame);

    }

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries, obs) => {

            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                animateCounter(entry.target);
                obs.unobserve(entry.target);
            });

        }, {
            threshold: 0.3
        });

        counters.forEach((counter) => observer.observe(counter));
        return;

    }

    counters.forEach((counter) => animateCounter(counter));

}

initCounterAnimation();

/*=========================================
        GLOBAL REVEAL ANIMATION
=========================================*/

const revealElements = document.querySelectorAll(`

.hero-content,
.section-title,
.choose-card,
.about-image-wrapper,
.about-feature-card,
.journey-item,
.dashboard-content,
.dashboard-image,
.space-item,
.space-large,
.space-small,
.testimonial-card,
.gallery-item,
.service-card,
.program-card,
.team-card,
.pricing-card,
.blog-card,
.contact-info-card,
.contact-form-wrapper,
.contact-map-wrapper,
.about-hero-content,
.our-story-image,
.our-story-content,
.story-feature,
.gallery-grid,
.purpose-card,
.day-image,
.timeline-item,
.about-cta-box,
.approach-content,
.approach-image,
.approach-item,
.schedule-item,
.highlight-card,
.process-card,
.eligibility-image,
.eligibility-content,
.age-item,
.document-card,
.contact-info-card,
.enroll-step,
.enroll-form-box,
.requirement-card,
.teacher-contact-card,
.chat-window,
.announcement-card,
.settings-card,
.summary-card,
.dashboard-card,
.attendance-card,
.meal-card,
.payment-card,
.invoice-card,
.report-card,
.skills-card,
.nutrition-card,
.hydration-card,
.diet-card

`);

const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }

    });

}, {
    threshold: 0.15
});

revealElements.forEach(el => revealObserver.observe(el));


/*=========================================
        RTL TOGGLE
=========================================*/

const rtlButtons = document.querySelectorAll(".rtl-toggle, [data-rtl-toggle]");

rtlButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const html = document.documentElement;

        if (html.dir === "rtl") {
            html.dir = "ltr";
            localStorage.setItem("dir", "ltr");
        } else {
            html.dir = "rtl";
            localStorage.setItem("dir", "rtl");
        }
    });
});

document.documentElement.dir = localStorage.getItem("dir") || "ltr";

/*=========================================
        STICKY HEADER
=========================================*/

const header = document.querySelector(".main-header");

if (header) {

    if (document.body.classList.contains("home-two-page")) {

        header.classList.add("scrolled");

    } else {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 50) {

                header.classList.add("scrolled");

            } else {

                header.classList.remove("scrolled");

            }

        });

    }

}

/*=========================================
        NAVBAR LAYOUT SWITCHER
=========================================*/

const navbar = document.querySelector(".navbar");
const navbarCollapse = document.querySelector("#mainNavbar");
const headerActions = document.querySelector(".header-actions");
const headerActionsHome = headerActions ? headerActions.parentElement : null;
const headerActionsNext = headerActions ? headerActions.nextElementSibling : null;
const tabletMenuQuery = window.matchMedia("(max-width: 1199px)");

function syncNavbarActions() {

    if (!navbar || !navbarCollapse || !headerActions || !headerActionsHome) {
        return;
    }

    if (tabletMenuQuery.matches) {

        if (headerActions.parentElement !== navbarCollapse) {
            navbarCollapse.appendChild(headerActions);
        }

    } else if (headerActions.parentElement !== headerActionsHome) {

        if (headerActionsNext && headerActionsNext.parentElement === headerActionsHome) {
            headerActionsHome.insertBefore(headerActions, headerActionsNext);
        } else {
            headerActionsHome.appendChild(headerActions);
        }

    }

}

syncNavbarActions();

if (tabletMenuQuery.addEventListener) {
    tabletMenuQuery.addEventListener("change", syncNavbarActions);
} else if (tabletMenuQuery.addListener) {
    tabletMenuQuery.addListener(syncNavbarActions);
}




/*=========================================
        LOGOUT MODAL
=========================================*/

const logoutBtn = document.getElementById("logoutBtn");
const logoutModal = document.getElementById("logoutModal");
const cancelLogout = document.getElementById("cancelLogout");
const confirmLogout = document.getElementById("confirmLogout");

if (logoutBtn && logoutModal && cancelLogout && confirmLogout) {

    logoutBtn.addEventListener("click", () => {
        logoutModal.classList.add("show");
    });

    cancelLogout.addEventListener("click", () => {
        logoutModal.classList.remove("show");
    });

    logoutModal.addEventListener("click", (e) => {
        if (e.target === logoutModal) {
            logoutModal.classList.remove("show");
        }
    });

    confirmLogout.addEventListener("click", () => {
        window.location.href = "login.html";
    });

}

/*=========================================
    NOTIFICATION DROPDOWN
=========================================*/

const notificationBtn = document.querySelector(".notification-btn");
const notificationMenu = document.querySelector(".notification-menu");

if (notificationBtn && notificationMenu) {

    notificationBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        notificationMenu.classList.toggle("show");

    });

    document.addEventListener("click", function () {

        notificationMenu.classList.remove("show");

    });

}