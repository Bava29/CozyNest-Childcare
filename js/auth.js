/*=========================================
        AUTH PAGE TOGGLES
=========================================*/

const authPage = document.querySelector(".auth-page");
const themeToggle = document.querySelector("[data-theme-toggle]");
const rtlToggle = document.querySelector("[data-rtl-toggle]");
const passwordToggles = document.querySelectorAll("[data-password-toggle]");

function safeStorageGet(key) {

    try {
        return window.localStorage.getItem(key);
    } catch (error) {
        return null;
    }

}

function safeStorageSet(key, value) {

    try {
        window.localStorage.setItem(key, value);
    } catch (error) {
        /* Ignore storage failures on restricted or file-based contexts. */
    }

}

function setTheme(isDark) {

    if (!authPage) {
        return;
    }

    authPage.classList.toggle("auth-dark-mode", isDark);
    if (themeToggle) {
        themeToggle.classList.toggle("active", isDark);
        const icon = themeToggle.querySelector("i");
        if (icon) {
            icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }
    }

    safeStorageSet("cozynest-auth-theme", isDark ? "dark" : "light");

}

function setDirection(isRtl) {

    if (!authPage) {
        return;
    }

    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    authPage.classList.toggle("auth-rtl-mode", isRtl);

    if (rtlToggle) {
        rtlToggle.classList.toggle("active", isRtl);
    }

    safeStorageSet("cozynest-auth-dir", isRtl ? "rtl" : "ltr");

}

if (authPage) {

    const savedTheme = safeStorageGet("cozynest-auth-theme");
    const savedDir = safeStorageGet("cozynest-auth-dir");

    setTheme(savedTheme === "dark");
    setDirection(savedDir === "rtl");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            setTheme(!authPage.classList.contains("auth-dark-mode"));
        });
    }

    if (rtlToggle) {
        rtlToggle.addEventListener("click", () => {
            setDirection(document.documentElement.dir !== "rtl");
        });
    }

    passwordToggles.forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const targetId = toggle.getAttribute("data-password-toggle");
            const input = targetId ? document.getElementById(targetId) : null;

            if (!input) {
                return;
            }

            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            toggle.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");

            const icon = toggle.querySelector("i");
            if (icon) {
                icon.className = isPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
            }
        });
    });

}