// useAppEffects.js
import AOS from 'aos';
import GLightbox from 'glightbox';
import { useEffect } from 'react';

const useAppEffects = () => {

    useEffect(() => {
        const toggleScrolled = () => {
            const selectBody = document.querySelector('body');
            const selectHeader = document.querySelector('#header');
            if (selectHeader === null) return;
            if (!selectHeader.classList.contains('scroll-up-sticky') &&
                !selectHeader.classList.contains('sticky-top') &&
                !selectHeader.classList.contains('fixed-top')) return;

            window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
        };

        const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
        const mobileNavToggle = () => {
            document.querySelector('body').classList.toggle('mobile-nav-active');
            mobileNavToggleBtn.classList.toggle('bi-list');
            mobileNavToggleBtn.classList.toggle('bi-x');
        };

        mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
        document.querySelectorAll('#navmenu a').forEach(navmenu => {
            navmenu.addEventListener('click', () => {
                if (document.querySelector('.mobile-nav-active')) {
                    mobileNavToggle();
                }
            });
        });

        const preloader = document.querySelector('#preloader');
        if (preloader) {
            window.addEventListener('load', () => {
                preloader.remove();
            });
        }

        const scrollTop = document.querySelector('.scroll-top');
        const toggleScrollTop = () => {
            if (scrollTop) {
                window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
            }
        };

        scrollTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', () => {
            toggleScrolled();
            toggleScrollTop();
        });

        // Inicializa AOS
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });

        // Inicializa GLightbox
        const glightbox = GLightbox({
            selector: '.glightbox'
        });

        // Scrollspy
        const navmenulinks = document.querySelectorAll('.navmenu a');
        const navmenuScrollspy = () => {
            navmenulinks.forEach(navmenulink => {
                if (!navmenulink.hash) return;
                const section = document.querySelector(navmenulink.hash);
                if (!section) return;
                const position = window.scrollY + 200;
                if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                    document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
                    navmenulink.classList.add('active');
                } else {
                    navmenulink.classList.remove('active');
                }
            });
        };

        window.addEventListener('load', navmenuScrollspy);
        document.addEventListener('scroll', navmenuScrollspy);

        return () => {
            // Limpieza de eventos
            window.removeEventListener('scroll', toggleScrolled);
            window.removeEventListener('scroll', toggleScrollTop);
            window.removeEventListener('load', navmenuScrollspy);
        };
    }, []);
};

export default useAppEffects;
