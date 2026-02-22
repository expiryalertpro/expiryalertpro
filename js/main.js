/* ===================================
   ENHANCED JAVASCRIPT - EXPIRY ALERT PRO
   Pure Vanilla JS - No Frameworks
   =================================== */

// ===================================
// THEME MANAGEMENT (LocalStorage)
// ===================================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Toggle theme
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        
        // Update icon
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Save to localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// ===================================
// GLASSMORPHISM NAVBAR SCROLL EFFECT
// ===================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===================================
// BACK TO TOP BUTTON
// ===================================
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// INTERSECTION OBSERVER (Scroll Reveal)
// ===================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// ===================================
// INTERACTIVE PRODUCT SIMULATOR
// ===================================
const productNameInput = document.getElementById('product-name');
const expiryDateInput = document.getElementById('expiry-date');
const addProductBtn = document.getElementById('add-product-btn');
const removeProductBtn = document.getElementById('remove-product-btn');
const productCard = document.getElementById('product-card');
const emptyState = document.getElementById('empty-state');
const displayProductName = document.getElementById('display-product-name');
const displayExpiryDate = document.getElementById('display-expiry-date');
const daysLeftSpan = document.getElementById('days-left');
const statusIndicator = document.getElementById('status-indicator');

// Set default date (7 days from now)
if (expiryDateInput) {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    expiryDateInput.value = defaultDate.toISOString().split('T')[0];
}

// Calculate days left
function calculateDaysLeft(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Update product display
function updateProductDisplay(name, expiryDate) {
    const daysLeft = calculateDaysLeft(expiryDate);
    
    displayProductName.textContent = name;
    displayExpiryDate.textContent = new Date(expiryDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    daysLeftSpan.textContent = daysLeft;
    
    // Update status (1-level: SAFE only for this demo)
    statusIndicator.textContent = 'SAFE';
    statusIndicator.className = 'status-safe';
    
    // Show product card
    productCard.classList.remove('hidden');
    emptyState.style.display = 'none';
}

// Add product
if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
        const name = productNameInput.value.trim();
        const expiry = expiryDateInput.value;
        
        if (name && expiry) {
            updateProductDisplay(name, expiry);
            
            // Add micro-interaction
            productCard.style.animation = 'none';
            setTimeout(() => {
                productCard.style.animation = 'slideIn 0.5s ease';
            }, 10);
        } else {
            alert('Please enter product name and expiry date');
        }
    });
}

// Remove product
if (removeProductBtn) {
    removeProductBtn.addEventListener('click', () => {
        productCard.classList.add('hidden');
        emptyState.style.display = 'block';
        
        // Reset inputs
        productNameInput.value = 'Milk';
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        expiryDateInput.value = defaultDate.toISOString().split('T')[0];
    });
}

// ===================================
// PRIVACY POLICY - TABLE OF CONTENTS
// ===================================
const tocLinks = document.querySelectorAll('.toc-link');
const policySections = document.querySelectorAll('.policy-section');

// Highlight active section on scroll
if (tocLinks.length > 0) {
    const tocObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                
                // Remove active class from all links
                tocLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current link
                const activeLink = document.querySelector(`.toc-link[data-section="${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-120px 0px -40% 0px'
    });
    
    policySections.forEach(section => {
        tocObserver.observe(section);
    });
    
    // Smooth scroll on TOC click
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const yOffset = -120;
                const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// PRIVACY POLICY - SEARCH FUNCTIONALITY
// ===================================
const policySearch = document.getElementById('policy-search');
const searchResultsCount = document.getElementById('search-results-count');

if (policySearch) {
    let searchTimeout;
    
    policySearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            // Remove previous highlights
            const previousHighlights = document.querySelectorAll('mark');
            previousHighlights.forEach(mark => {
                const parent = mark.parentNode;
                parent.replaceChild(document.createTextNode(mark.textContent), mark);
                parent.normalize();
            });
            
            if (searchTerm.length < 2) {
                searchResultsCount.textContent = '';
                return;
            }
            
            // Search and highlight
            let matchCount = 0;
            const sections = document.querySelectorAll('.policy-section p, .policy-section li');
            
            sections.forEach(element => {
                const text = element.textContent;
                const lowerText = text.toLowerCase();
                
                if (lowerText.includes(searchTerm)) {
                    // Highlight matches
                    const regex = new RegExp(`(${searchTerm})`, 'gi');
                    const highlightedHTML = element.innerHTML.replace(regex, '<mark>$1</mark>');
                    element.innerHTML = highlightedHTML;
                    
                    matchCount += (text.match(new RegExp(searchTerm, 'gi')) || []).length;
                }
            });
            
            // Update count
            if (matchCount > 0) {
                searchResultsCount.textContent = `${matchCount} match${matchCount !== 1 ? 'es' : ''}`;
                
                // Scroll to first match
                const firstMatch = document.querySelector('mark');
                if (firstMatch) {
                    firstMatch.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            } else {
                searchResultsCount.textContent = 'No matches';
            }
        }, 300);
    });
}

// ===================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===================================
// MICRO-INTERACTIONS & ANIMATIONS
// ===================================

// Add slide-in animation for product card
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// CONSOLE INFO
// ===================================
console.log('%c🔔 Expiry Alert Pro', 'font-size: 20px; font-weight: bold; color: #0061a4;');
console.log('%cEnhanced with Pro-Level Features', 'font-size: 14px; color: #666;');
console.log('%c✓ Glassmorphism Navigation', 'color: #2e7d32;');
console.log('%c✓ Interactive Product Simulator', 'color: #2e7d32;');
console.log('%c✓ Dark/Light Theme (LocalStorage)', 'color: #2e7d32;');
console.log('%c✓ Scroll Reveal Animations', 'color: #2e7d32;');
console.log('%c✓ Privacy Policy Search & TOC', 'color: #2e7d32;');
console.log('%c✓ Inventory Dashboard Mockup', 'color: #2e7d32;');
