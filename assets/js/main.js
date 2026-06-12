document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle Logic
    const initTheme = () => {
        const storedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', storedTheme);
        updateThemeToggleIcons(storedTheme);

        const themeBtns = document.querySelectorAll('.theme-toggle-btn');
        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeToggleIcons(newTheme);
            });
        });
    };

    const updateThemeToggleIcons = (theme) => {
        const themeBtns = document.querySelectorAll('.theme-toggle-btn');
        themeBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                if (theme === 'light') {
                    icon.className = 'las la-moon';
                } else {
                    icon.className = 'las la-sun';
                }
            }
        });
    };

    // 2. Sidebar & Hamburg Menu
    const initMenu = () => {
        const hamburgBtn = document.querySelector('.scroll-to-show-menu .hamburg-menu');
        const headerHamburgBtn = document.querySelector('.three-dots-btn');
        const sidebarWrap = document.querySelector('.header-sidebar-wrap');
        const closeSidebarBtn = document.querySelector('.close-header-sidebar');
        const sidebarLinks = document.querySelectorAll('.sidebar-menu a');

        const openMenu = () => {
            if (sidebarWrap) sidebarWrap.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            if (sidebarWrap) sidebarWrap.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        if (hamburgBtn) hamburgBtn.addEventListener('click', openMenu);
        if (headerHamburgBtn) headerHamburgBtn.addEventListener('click', openMenu);
        if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeMenu);
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Toggle Hamburg Visibility on Scroll
        window.addEventListener('scroll', () => {
            const hamburgMenu = document.querySelector('.scroll-to-show-menu .hamburg-menu');
            if (hamburgMenu) {
                if (window.scrollY >= 100) {
                    hamburgMenu.classList.add('active');
                } else {
                    hamburgMenu.classList.remove('active');
                }
            }
        });
    };

    // 3. Scroll to Top Progress Circle
    const initScrollToTop = () => {
        const scrollToTopBtn = document.querySelector('.to-top-progress');
        if (!scrollToTopBtn) return;

        const progressCircle = scrollToTopBtn.querySelector('circle:nth-child(2)');
        const pathLength = 144.513; // 2 * PI * r (r = 23)

        if (progressCircle) {
            progressCircle.style.strokeDasharray = pathLength;
            progressCircle.style.strokeDashoffset = pathLength;
        }

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY) / (document.documentElement.scrollHeight - window.innerHeight);
            
            if (window.scrollY > 150) {
                scrollToTopBtn.style.visibility = 'visible';
                scrollToTopBtn.style.opacity = '1';
            } else {
                scrollToTopBtn.style.visibility = 'hidden';
                scrollToTopBtn.style.opacity = '0';
            }

            if (progressCircle) {
                const drawLength = pathLength * (1 - scrollPercent);
                progressCircle.style.strokeDashoffset = drawLength;
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // 4. Magic Cursor (GSAP)
    const initMagicCursor = () => {
        const ball = document.getElementById('ball');
        if (!ball || typeof gsap === 'undefined') return;

        document.addEventListener('mousemove', (e) => {
            gsap.to(ball, {
                duration: 0.8,
                x: e.clientX,
                y: e.clientY,
                opacity: 1,
                ease: 'power2.out',
            });
        });

        const hoverElements = document.querySelectorAll('a, button, .theme-toggle-btn, .three-dots-btn, .close-header-sidebar');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                ball.classList.add('hovered');
                gsap.to(ball, {
                    duration: 0.3,
                    scale: 2,
                    opacity: 0,
                    ease: 'power2.inOut',
                });
            });
            element.addEventListener('mouseleave', () => {
                ball.classList.remove('hovered');
                gsap.to(ball, {
                    duration: 0.3,
                    scale: 1,
                    opacity: 1,
                    ease: 'power2.out',
                });
            });
        });

        const projectElements = document.querySelectorAll('.feature-project, .service-box, .funfact-box, .testimonial-lists-wrap');
        projectElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                ball.style.opacity = '0';
                ball.classList.add('hide-mouse');
            });
            element.addEventListener('mouseleave', () => {
                ball.style.opacity = '1';
                ball.classList.remove('hide-mouse');
            });
        });
    };

    // 5. GSAP Text Reveal (.reveal-type)
    const initTextReveal = () => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        const splitText = (element) => {
            const text = element.textContent.trim();
            element.innerHTML = '';
            const words = text.split(/\s+/);
            
            words.forEach((word, idx) => {
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.overflow = 'hidden';
                wordSpan.className = 'word';

                word.split('').forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = char;
                    charSpan.style.display = 'inline-block';
                    charSpan.className = 'char';
                    wordSpan.appendChild(charSpan);
                });

                element.appendChild(wordSpan);

                if (idx < words.length - 1) {
                    element.appendChild(document.createTextNode(' '));
                }
            });
        };

        const revealElements = document.querySelectorAll('.reveal-type');
        revealElements.forEach(el => {
            splitText(el);
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const startOpacity = isLight ? 0.45 : 0.2;

            const chars = el.querySelectorAll('.char');
            gsap.from(chars, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    end: 'top 20%',
                    scrub: true,
                },
                opacity: startOpacity,
                stagger: 0.05,
            });
        });
    };

    // 6. Fun Facts Counter Animation
    const initCounters = () => {
        const counters = document.querySelectorAll('.funfact-footer .number');
        if (!counters.length) return;

        const runCounter = (el) => {
            const rawText = el.innerHTML.trim();
            // extract number and symbols e.g. "12+" -> number=12, symbol="+"
            const match = rawText.match(/^(\d+)(.*)$/);
            if (!match) return;

            const targetVal = parseInt(match[1]);
            const suffix = match[2] || '';
            let currentVal = 0;
            const duration = 1500; // ms
            const stepTime = Math.max(Math.floor(duration / targetVal), 15);
            
            const timer = setInterval(() => {
                currentVal += Math.ceil(targetVal / 60);
                if (currentVal >= targetVal) {
                    currentVal = targetVal;
                    clearInterval(timer);
                }
                el.innerHTML = `${currentVal}${suffix}`;
            }, stepTime);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const numberEl = entry.target.querySelector('.number');
                    if (numberEl && !numberEl.classList.contains('counted')) {
                        numberEl.classList.add('counted');
                        runCounter(numberEl);
                    }
                }
            });
        }, { threshold: 0.1 });

        const funfactBoxes = document.querySelectorAll('.funfact-box');
        funfactBoxes.forEach(box => observer.observe(box));
    };

    // 7. Accordion / FAQ Toggle
    const initAccordions = () => {
        const accordionHeaders = document.querySelectorAll('.faq-accordion-header, .accordion-button');
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest('.faq-accordion-item, .accordion-item');
                if (!item) return;

                const body = item.querySelector('.faq-accordion-body, .accordion-collapse');
                const isCurrentlyActive = item.classList.contains('active');

                // Collapse all sibling items
                const parent = item.parentElement;
                const siblings = parent.querySelectorAll('.faq-accordion-item, .accordion-item');
                siblings.forEach(sibling => {
                    sibling.classList.remove('active');
                    const siblingBody = sibling.querySelector('.faq-accordion-body, .accordion-collapse');
                    if (siblingBody) siblingBody.style.maxHeight = null;
                });

                if (!isCurrentlyActive) {
                    item.classList.add('active');
                    if (body) {
                        body.style.maxHeight = body.scrollHeight + 'px';
                    }
                }
            });
        });
    };

    // 7b. Job Openings Accordion Toggle
    const initJobAccordions = () => {
        const jobHeaders = document.querySelectorAll('.job-header');
        jobHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest('.job-item');
                if (!item) return;

                const body = item.querySelector('.job-body');
                const isCurrentlyActive = item.classList.contains('expanded');

                // Collapse all sibling items
                const parent = item.parentElement;
                const siblings = parent.querySelectorAll('.job-item');
                siblings.forEach(sibling => {
                    sibling.classList.remove('expanded');
                    const siblingBody = sibling.querySelector('.job-body');
                    if (siblingBody) siblingBody.style.maxHeight = '0px';
                });

                if (!isCurrentlyActive) {
                    item.classList.add('expanded');
                    if (body) {
                        body.style.maxHeight = body.scrollHeight + 'px';
                    }
                }
            });
        });
    };

    // 8. Service Box Accordion Hover (Desktop) & Click (Mobile)
    const initServiceBoxes = () => {
        const boxes = document.querySelectorAll('.service-lists .service-box');
        boxes.forEach(box => {
            const makeActive = () => {
                boxes.forEach(b => b.classList.remove('active'));
                box.classList.add('active');
            };
            box.addEventListener('mouseenter', makeActive);
            box.addEventListener('click', makeActive);
        });
    };

    // 9. Preloader Fade Out
    const initPreloader = () => {
        const preloader = document.querySelector('.preloader-wrap');
        if (!preloader) return;

        const fadeOut = () => {
            preloader.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        };

        // Fade out on window load
        window.addEventListener('load', () => {
            setTimeout(fadeOut, 800);
        });

        // Fallback in case window load fired before script load
        if (document.readyState === 'complete') {
            setTimeout(fadeOut, 800);
        }
    };

    // 10. Hover Mouse (Follow Cursor on Cards)
    const initHoverMouse = () => {
        // Feature projects hover mouse
        const projects = document.querySelectorAll('.feature-project');
        projects.forEach(project => {
            const hoverMouse = project.querySelector('.hover_mouse');
            if (!hoverMouse) return;

            project.addEventListener('mousemove', (e) => {
                const rect = project.getBoundingClientRect();
                const x = e.clientX - rect.left - 60;
                const y = e.clientY - rect.top - 60;
                hoverMouse.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                hoverMouse.classList.add('active');
            });

            project.addEventListener('mouseleave', () => {
                hoverMouse.classList.remove('active');
            });
        });

        // Testimonials hover mouse
        const testimonials = document.querySelectorAll('.testimonial-lists-wrap');
        testimonials.forEach(wrap => {
            const hoverMouse = wrap.querySelector('.hover_mouse');
            if (!hoverMouse) return;

            wrap.addEventListener('mousemove', (e) => {
                const rect = wrap.getBoundingClientRect();
                const x = e.clientX - rect.left - 50;
                const y = e.clientY - rect.top - 50;
                hoverMouse.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                hoverMouse.classList.add('active');
            });

            wrap.addEventListener('mouseleave', () => {
                hoverMouse.classList.remove('active');
            });
        });
    };

    // Initialize all components
    initPreloader();
    initTheme();
    initMenu();
    initScrollToTop();
    initMagicCursor();
    initTextReveal();
    initCounters();
    initAccordions();
    initJobAccordions();
    initServiceBoxes();
    initHoverMouse();

    // 9. AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true
        });
    }

    
});