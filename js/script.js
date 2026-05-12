// BRS Serviços e Comércio - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Animação de contador para estatísticas
    const statNumbers = document.querySelectorAll('.stat-numero');
    let statsAnimated = false;

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/\D/g, ''));
            const suffix = stat.textContent.replace(/[0-9]/g, '');
            let current = 0;
            const increment = target / 50;
            const duration = 2000;
            const stepTime = duration / 50;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + suffix;
                }
            }, stepTime);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateStats();
                statsAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.estatisticas-brs');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Animação da Timeline
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const timelineItems = entry.target.querySelectorAll('.timeline-item');
            if (entry.isIntersecting) {
                // Adiciona classe animate um de cada vez com delay
                timelineItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * 400); // 400ms entre cada card
                });
            } else {
                // Remove classe animate quando sai da tela
                timelineItems.forEach(item => {
                    item.classList.remove('animate');
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });
    
    // Observar a seção da timeline
    const timelineSection = document.querySelector('.qs-timeline');
    if (timelineSection) {
        timelineObserver.observe(timelineSection);
    }
    
    // Timeline avançada (barra de progresso no scroll)
    const enhancedTimeline = document.querySelector('.qs-timeline.timeline-enhanced');
    if (enhancedTimeline) {
        const progressEl = enhancedTimeline.querySelector('.timeline-progress');
        const updateTimelineProgress = () => {
            const rect = enhancedTimeline.getBoundingClientRect();
            const start = window.scrollY + rect.top;
            const end = start + rect.height;
            // Ponto de medição ~50% da viewport, similar ao exemplo
            const current = window.scrollY + window.innerHeight * 0.5;
            const total = Math.max(1, end - start);
            let progress = (current - start) / total;
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
            const fillHeight = rect.height * progress;
            if (progressEl) {
                progressEl.style.height = `${fillHeight}px`;
            }
        };
        const onScroll = () => requestAnimationFrame(updateTimelineProgress);
        updateTimelineProgress();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        // Animar entrada dos itens e destacar ponto
        const enhancedRows = enhancedTimeline.querySelectorAll('.timeline-row');
        const rowObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
        enhancedRows.forEach(row => rowObserver.observe(row));
    }
    
    // Animações ao scroll para outros elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.servico-item, .valor-card, .diferencial-card, .contato-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Carrossel de Serviços - Loop Simples
    const carousel = document.querySelector('.servicos-carousel');
    const cards = document.querySelectorAll('.servico-card');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    let autoplayInterval = null;
    let isTransitioning = false;

    if (cards.length > 0 && carousel) {
        const totalCards = cards.length;
        
        // Limpar dots existentes
        dotsContainer.innerHTML = '';

        // Criar dots
        for (let i = 0; i < totalCards; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function updateCarousel(animate = true) {
            const wrapper = carousel.parentElement;
            const wrapperStyles = window.getComputedStyle(wrapper);
            const paddingLeft = parseFloat(wrapperStyles.paddingLeft) || 0;
            const paddingRight = parseFloat(wrapperStyles.paddingRight) || 0;
            const contentWidth = wrapper.clientWidth - paddingLeft - paddingRight;

            // Largura do card
            const cardWidth = cards[0].offsetWidth;

            // Gap real definido no CSS
            const carouselStyles = window.getComputedStyle(carousel);
            let gap = parseFloat(carouselStyles.columnGap);
            if (isNaN(gap)) {
                gap = parseFloat(carouselStyles.gap) || 30;
            }

            // Centralizar o card ativo
            const centerOffset = (contentWidth - cardWidth) / 2;
            const offset = currentIndex * (cardWidth + gap) - centerOffset;

            if (!animate) {
                carousel.style.transition = 'none';
                // Forçar reflow para aplicar sem animação
                carousel.offsetHeight;
            } else {
                carousel.style.transition = 'transform 0.6s ease-out';
            }

            carousel.style.transform = `translateX(-${Math.round(offset)}px)`;

            // Atualizar classes active
            cards.forEach((card, index) => {
                card.classList.remove('active');
                if (index === currentIndex) {
                    card.classList.add('active');
                }
            });

            // Atualizar dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex = index;
            updateCarousel();
            setTimeout(() => {
                isTransitioning = false;
            }, 600);
            resetAutoplay();
        }

        function nextSlide() {
            if (isTransitioning) return;
            isTransitioning = true;
            
            if (currentIndex >= totalCards - 1) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            
            updateCarousel();
            setTimeout(() => {
                isTransitioning = false;
            }, 600);
        }

        function prevSlide() {
            if (isTransitioning) return;
            isTransitioning = true;
            
            if (currentIndex <= 0) {
                currentIndex = totalCards - 1;
            } else {
                currentIndex--;
            }
            
            updateCarousel();
            setTimeout(() => {
                isTransitioning = false;
            }, 600);
        }

        function startAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
            autoplayInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });

        // Pausar autoplay ao passar o mouse
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);

        // Suporte a gestos de toque (swipe) para mobile
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            stopAutoplay();
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
            startAutoplay();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diffX = touchStartX - touchEndX;
            const diffY = Math.abs(touchStartY - touchEndY);
            
            if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > diffY) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        // Atualizar ao redimensionar
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCarousel(false);
            }, 100);
        });

        // Iniciar carousel - pequeno delay para garantir que o DOM está pronto
        currentIndex = 0;
        setTimeout(() => {
            updateCarousel(false);
            startAutoplay();
        }, 100);
    }

    // Modais dos Serviços
    const servicosItems = document.querySelectorAll('.servico-card[data-modal]');
    const modais = document.querySelectorAll('.modal-servico');
    const botoesFechar = document.querySelectorAll('.modal-fechar');
    const overlays = document.querySelectorAll('.modal-overlay-servico');

    // Abrir modal
    servicosItems.forEach(item => {
        item.addEventListener('click', function() {
            const modalId = 'modal-' + this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Fechar modal ao clicar no X
    botoesFechar.forEach(botao => {
        botao.addEventListener('click', function() {
            this.closest('.modal-servico').classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Fechar modal ao clicar no overlay
    overlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            this.closest('.modal-servico').classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modais.forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = 'auto';
        }
    });

    // Typewriter Effect
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
        const words = JSON.parse(typewriterElement.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 70;
        let deleteSpeed = 40;
        let waitTime = 1500;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = deleteSpeed;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 70;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                // Palavra completa, aguardar antes de deletar
                isDeleting = true;
                typeSpeed = waitTime;
            } else if (isDeleting && charIndex === 0) {
                // Palavra deletada, próxima palavra
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pausa antes de começar a próxima palavra
            }

            setTimeout(type, typeSpeed);
        }

        // Iniciar typewriter
        type();
    }
});
