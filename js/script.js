"use strict";

/* Official business details */
const whatsappNumber = "917200251560";
const phoneNumber = "917200251560";
const phoneDisplay = "+91 72002 51560";
const instagramUrl = "#";
const googleMapsUrl = "#";
const googleReviewUrl = "#";

const phonePattern = /^\d{10,15}$/;
const urlPattern = /^https?:\/\/\S+$/i;
const toast = document.querySelector("[data-toast]");
let toastTimer;

function normalizePhoneNumber(phone) {
    return phone.replace(/\D/g, "");
}

function isPhoneConfigured(phone) {
    return !/[xX]/.test(phone) && phonePattern.test(normalizePhoneNumber(phone));
}

function isUrlConfigured(url) {
    return typeof url === "string" && url !== "#" && urlPattern.test(url.trim());
}

function showToast(message) {
    if (!toast) {
        return;
    }

    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
        toast.classList.remove("is-visible");
    }, 3600);
}

/* Contact Actions */
function openWhatsApp(service = "Beauty Services") {
    const phone = normalizePhoneNumber(whatsappNumber);

    if (!isPhoneConfigured(phone)) {
        showToast("The official WhatsApp number is still a placeholder. Please add it in js/script.js.");
        return;
    }

    const message = `Hi DigiMaraa Beauty Parlour, I would like to enquire about ${service}. Please share the details.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
}

function callDigiMaraa() {
    const phone = normalizePhoneNumber(phoneNumber);

    if (!isPhoneConfigured(phone)) {
        showToast("The official phone number is still a placeholder. Please add it in js/script.js.");
        return;
    }

    window.location.href = `tel:+${phone}`;
}

window.openWhatsApp = openWhatsApp;

document.querySelectorAll("[data-whatsapp]").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const service = button.dataset.whatsappService || "Beauty Services";
        openWhatsApp(service);
    });
});

document.querySelectorAll("[data-call]").forEach((button) => {
    button.addEventListener("click", callDigiMaraa);
});

const contactUrls = {
    instagram: instagramUrl,
    maps: googleMapsUrl,
    google: googleReviewUrl
};

document.querySelectorAll("[data-dynamic-url]").forEach((link) => {
    const key = link.dataset.dynamicUrl;
    const url = contactUrls[key];

    if (isUrlConfigured(url)) {
        link.href = url.trim();
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        return;
    }

    link.addEventListener("click", (event) => {
        event.preventDefault();
        const label = key === "maps" ? "Google Maps" : key === "google" ? "Google Reviews" : "Instagram";
        showToast(`The official ${label} link is still a placeholder.`);
    });
});

if (isPhoneConfigured(phoneNumber)) {
    document.querySelectorAll("[data-phone-label]").forEach((label) => {
        label.textContent = phoneDisplay;
    });
}

document.querySelectorAll("[data-url-label]").forEach((label) => {
    const link = label.closest("a");
    const key = link?.dataset.dynamicUrl;
    const url = contactUrls[key];

    if (isUrlConfigured(url)) {
        label.textContent = "Open official profile";
    }
});

/* Header and Mobile Navigation */
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuClose = document.querySelector("[data-menu-close]");
const navigation = document.querySelector("[data-navigation]");
const navigationLinks = navigation?.querySelectorAll(".nav-link") || [];
let scrollTicking = false;

function updateHeader() {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
    scrollTicking = false;
}

function setMenuState(isOpen, restoreFocus = false) {
    if (!header || !menuToggle || !navigation) {
        return;
    }

    header.classList.toggle("menu-is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");

    if (window.innerWidth <= 1080) {
        navigation.setAttribute("aria-hidden", String(!isOpen));
    } else {
        navigation.removeAttribute("aria-hidden");
    }

    if (isOpen) {
        window.setTimeout(() => menuClose?.focus(), 80);
    } else if (restoreFocus) {
        menuToggle.focus();
    }
}

menuToggle?.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    setMenuState(willOpen);
});

menuClose?.addEventListener("click", () => setMenuState(false, true));

navigationLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("keydown", (event) => {
    if (!header?.classList.contains("menu-is-open")) {
        return;
    }

    if (event.key === "Escape") {
        setMenuState(false, true);
        return;
    }

    if (event.key !== "Tab" || !navigation) {
        return;
    }

    const focusableElements = [...navigation.querySelectorAll("a[href], button:not([disabled])")].filter((element) => !element.hasAttribute("hidden"));
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1080 && header?.classList.contains("menu-is-open")) {
        setMenuState(false);
    }
});

window.addEventListener("scroll", () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(updateHeader);
        scrollTicking = true;
    }
}, { passive: true });

updateHeader();

if (window.innerWidth <= 1080 && navigation) {
    navigation.setAttribute("aria-hidden", "true");
}

/* FAQ Accordion */
const faqButtons = document.querySelectorAll(".faq-item button");

function closeFaqItem(button) {
    const item = button.closest(".faq-item");
    const answerId = button.getAttribute("aria-controls");
    const answer = answerId ? document.getElementById(answerId) : null;

    button.setAttribute("aria-expanded", "false");
    item?.classList.remove("is-open");
    answer?.setAttribute("aria-hidden", "true");
}

function openFaqItem(button) {
    const item = button.closest(".faq-item");
    const answerId = button.getAttribute("aria-controls");
    const answer = answerId ? document.getElementById(answerId) : null;

    button.setAttribute("aria-expanded", "true");
    item?.classList.add("is-open");
    answer?.setAttribute("aria-hidden", "false");
}

faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const willOpen = button.getAttribute("aria-expanded") !== "true";

        faqButtons.forEach((otherButton) => {
            if (otherButton !== button) {
                closeFaqItem(otherButton);
            }
        });

        if (willOpen) {
            openFaqItem(button);
        } else {
            closeFaqItem(button);
        }
    });
});

/* Scroll Animations */
function initializeScrollAnimations() {
    const revealElements = document.querySelectorAll(".reveal");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    document.documentElement.classList.add("js");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px"
    });

    revealElements.forEach((element) => revealObserver.observe(element));
}

initializeScrollAnimations();

/* Active Navigation State */
const pageSections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        const visibleEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (!visibleEntry) {
            return;
        }

        navigationLinks.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${visibleEntry.target.id}`;
            link.classList.toggle("is-active", isCurrent);

            if (isCurrent) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }, {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.1, 0.25]
    });

    pageSections.forEach((section) => sectionObserver.observe(section));
}
