/* ==============
 ========= js documentation ==========================

 * template name: Archinex
 * version: 1.0
 * description: Modern Architecture & Interior Design HTML Template
 * author: theme_sonic
 * author-url: https://themeforest.net/user/theme_sonic

    ==================================================

     01. background image
     -------------------------------------------------
     02. custom cursor
     -------------------------------------------------
     03. scroll to top with progress
     -------------------------------------------------
     04. add active class to the current link
     -------------------------------------------------
     05. mobile menu
     -------------------------------------------------
     06. button text split animation
     -------------------------------------------------
     07. field image move with cursor
     -------------------------------------------------
     08. hero three slider
     -------------------------------------------------
     09. testimonial slider
     -------------------------------------------------
     10. testimonial two slider
     -------------------------------------------------
     11. project slider
     -------------------------------------------------
     12. project four slider
     -------------------------------------------------
     13. project tabs
     -------------------------------------------------
     14. new post filter
     -------------------------------------------------
     15. service details hover active
     -------------------------------------------------
     16. toggle comment section
     -------------------------------------------------
     17. video popup
     -------------------------------------------------
     18. odometer counter
     -------------------------------------------------
     19. vanilla tilt animations
     -------------------------------------------------
     20. nice select
     -------------------------------------------------
     21. footer copyright year
     -------------------------------------------------
     22. register gsap
     -------------------------------------------------
     23. gsap null config
     -------------------------------------------------
     24. target section with gsap
     -------------------------------------------------
     25. lenis smooth scroll
     -------------------------------------------------
     26. scale items gsap animation
     -------------------------------------------------
     27. parallax image with gsap
     -------------------------------------------------
     28. concept section animation
     -------------------------------------------------
     29. team section animation
     -------------------------------------------------
	   30. fade up, left, right, bottom animation
     -------------------------------------------------
     31. hero two section animation
     -------------------------------------------------
	   32. hero four section animation
     -------------------------------------------------
     33. about banner animation
     -------------------------------------------------
     34. about four section animation
     -------------------------------------------------
     35. about section animation
     -------------------------------------------------
     36. work section animation
     -------------------------------------------------
     37. service section animation
     -------------------------------------------------
     38. service two section animation
	   -------------------------------------------------
     39. process section animation
     -------------------------------------------------
     40. service three section animation
	   -------------------------------------------------
     41. service four section animation
	   -------------------------------------------------
     42. project section animation	 
	   -------------------------------------------------
     43. team two section animation
	   -------------------------------------------------
     44. creative section animation
	   -------------------------------------------------
     45. counter two section animation
	   -------------------------------------------------
     46. overview three tab 
	   -------------------------------------------------
     47. overview three section animation
	   -------------------------------------------------
     48. coming soon 
	   -------------------------------------------------
     49. hover image
	   -------------------------------------------------
     50. newsletter underline animation
	   -------------------------------------------------
     51. preloader and split text
     -------------------------------------------------
     52. template options

    ==================================================
============== */

(function($) {
    "use strict";

    jQuery(function() {
        let device_width = window.innerWidth;
        let initialScroll = $(window).scrollTop();
        /**
         * ======================================
         * 01. background image
         * ======================================
         */
        $("[data-background]").each(function() {
            $(this).css(
                "background-image",
                "url(" + $(this).attr("data-background") + ")",
            );
        });

        /**
         * ======================================
         * 02. custom cursor
         * ======================================
         */
        if ($(".mouseCursor").length > 0) {
            function itCursor() {
                var myCursor = $(".mouseCursor");
                if (!myCursor.length || !$("body").length) return;

                const inner = document.querySelector(".cursor-inner");
                const outer = document.querySelector(".cursor-outer");

                let lastX = 0;
                let lastY = 0;
                let stuck = false;

                window.onmousemove = function(e) {
                    if (!stuck) {
                        outer.style.transform =
                            "translate(" + e.clientX + "px," + e.clientY + "px)";
                    }
                    inner.style.transform =
                        "translate(" + e.clientX + "px," + e.clientY + "px)";
                    lastX = e.clientX;
                    lastY = e.clientY;
                };

                $("body").on("mouseenter", ".drag-cursor", function() {
                    $(".mouseCursor")
                        .addClass("cursor-big drag-cursor")
                        .removeClass("view-cursor play-cursor");
                });

                $("body").on("mouseleave", ".drag-cursor", function() {
                    $(".mouseCursor").removeClass("cursor-big drag-cursor");
                });

                $("body").on("mouseenter", ".view-cursor", function() {
                    $(".mouseCursor")
                        .addClass("cursor-big view-cursor")
                        .removeClass("drag-cursor play-cursor");
                });

                $("body").on("mouseleave", ".view-cursor", function() {
                    $(".mouseCursor").removeClass("cursor-big view-cursor");
                });

                $("body").on("mouseenter", ".play-cursor", function() {
                    $(".mouseCursor")
                        .addClass("cursor-big play-cursor")
                        .removeClass("drag-cursor view-cursor");
                });

                $("body").on("mouseleave", ".play-cursor", function() {
                    $(".mouseCursor").removeClass("cursor-big play-cursor");
                });

                $(".not-cursor").on("mouseenter", function() {
                    $(".mouseCursor").addClass("not-cursor-outer");
                });

                $(".not-cursor").on("mouseleave", function() {
                    $(".mouseCursor").removeClass("not-cursor-outer");
                });

                inner.style.visibility = "visible";
                outer.style.visibility = "visible";
            }

            itCursor();
        }

        /**
         * ======================================
         * 03. scroll to top with progress
         * ======================================
         */
        if ($(".progress-wrap").length > 0) {
            var progressPath = document.querySelector(".progress-wrap path");
            var pathLength = progressPath.getTotalLength();

            progressPath.style.transition = progressPath.style.WebkitTransition =
                "none";
            progressPath.style.strokeDasharray = pathLength + " " + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition =
                "stroke-dashoffset 10ms linear";

            var updateProgress = function() {
                var scroll = $(window).scrollTop();
                var height = $(document).height() - $(window).height();
                var progress = pathLength - (scroll * pathLength) / height;
                progressPath.style.strokeDashoffset = progress;
            };

            updateProgress();
            $(window).on("scroll", updateProgress);

            var offset = 50;
            var duration = 1500;
            var isMobile = window.matchMedia("(max-width: 991px)").matches;
            var lastScrollTop = 0;

            $(window).on("scroll", function() {
                var currentScroll = $(this).scrollTop();

                if (!isMobile) {
                    if (currentScroll > offset) {
                        $(".progress-wrap").addClass("active-progress");
                    } else {
                        $(".progress-wrap").removeClass("active-progress");
                    }
                } else {
                    if (currentScroll < lastScrollTop && currentScroll > offset) {
                        $(".progress-wrap").addClass("active-progress");
                    } else {
                        $(".progress-wrap").removeClass("active-progress");
                    }
                }

                lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            });

            $(".progress-wrap, .back-to-top").on("click", function(event) {
                event.preventDefault();
                $("html, body")
                    .stop()
                    .css("scroll-behavior", "auto")
                    .animate({
                        scrollTop: 0
                    }, {
                        duration: duration,
                        easing: "swing",
                        complete: function() {
                            $("html, body").css("scroll-behavior", "smooth");
                        },
                    }, );
                return false;
            });

            if (
                typeof initialScroll !== "undefined" &&
                initialScroll >= offset &&
                !isMobile
            ) {
                $(".progress-wrap").addClass("active-progress");
            }
        }

        /**
         * ======================================
         * 04. add active class to the current link
         * ======================================
         */
        function dynamicCurrentMenuClass(selector) {
            const currentPath = window.location.pathname.replace(/^\//, "");

            selector.find("li").removeClass("active");
            selector
                .find(".navbar__dropdown-label")
                .removeClass("navbar__item-active");

            let matchFound = false;

            selector.find("li").each(function() {
                if (matchFound) return;

                const anchor = $(this).find("a").first();
                let href = anchor.attr("href");

                if (!href || href === "#") return;

                href = href.replace(/^\//, "");

                if (
                    href === currentPath ||
                    (currentPath === "" && href === "index.html")
                ) {
                    $(this).addClass("active");
                    matchFound = true;
                }
            });

            selector
                .find(".navbar__sub-menu .active")
                .parents("li")
                .addClass("active");
        }

        if ($("header").length) {
            dynamicCurrentMenuClass($("header"));
        }

        /**
         * ======================================
         * 05. mobile menu
         * ======================================
         */
        if ($(".mobile-menu").length > 0) {
            var mobileMenuContent = $(".navbar__menu").html();
            $(".mobile-menu__list").append(mobileMenuContent);

            $(".mobile-menu .navbar__dropdown-label").on("click", function() {
                $(this).parent().siblings().find(".navbar__sub-menu").slideUp(500);
                $(this)
                    .parent()
                    .siblings()
                    .find(".navbar__dropdown-label")
                    .removeClass("navbar__item-active");
                $(this).siblings(".navbar__sub-menu").slideToggle(500);
                $(this).toggleClass("navbar__item-active");
            });
        }

        $(".open-offcanvas-nav").on("click", function() {
            $(this).addClass("open-offcanvas-nav-active");
            $(".mobile-menu__backdrop").addClass("mobile-menu__backdrop-active");
            $(".nav-fade").each(function(i) {
                $(this).css("animation-delay", 0.28 * 1 * i + "s");
            });
            $(".mobile-menu").addClass("show-menu");
            $(".mobile-menu__wrapper").removeClass("nav-fade-active");
        });

        $(
            ".close-mobile-menu, .mobile-menu__backdrop, .mobile-menu .navbar__item:not(.navbar__item--has-children) > a, .mobile-menu__social",
        ).on("click", function() {
            $(".open-offcanvas-nav").removeClass("open-offcanvas-nav-active");
            $(".mobile-menu").removeClass("show-menu");
            $(".mobile-menu__backdrop").removeClass("mobile-menu__backdrop-active");
            $(".mobile-menu__wrapper").addClass("nav-fade-active");
            $(".mobile-menu .navbar__dropdown-label").removeClass(
                "navbar__item-active",
            );
            $(".mobile-menu .navbar__sub-menu").slideUp(0);
        });

        $(".navbar__item.navbar__item--has-children > a").on("click", function(e) {
            e.preventDefault();
        });

        $(window).on("resize", function() {
            // sidebar info
            $(".off-canvas").removeClass("off-canvas-active");
            $(".off-canvas-backdrop").removeClass("off-canvas-backdrop-active");

            // mobile menu
            $(".mobile-menu").removeClass("show-menu");
            $(".mobile-menu__backdrop").removeClass("mobile-menu__backdrop-active");
            $(".mobile-menu__wrapper").addClass("nav-fade-active");
            $(".mobile-menu .navbar__dropdown-label").removeClass(
                "navbar__item-active",
            );
            $(".mobile-menu .navbar__sub-menu").slideUp(0);
            $(".open-offcanvas-nav").removeClass("open-offcanvas-nav-active");
        });

        /**
         * ======================================
         * 06. button text split animation
         * ======================================
         */
        if ($(".btn-animated-text").length) {
            $(".btn-animated-text").each(function() {
                var $btn = $(this);
                var text = $btn.attr("data-text") || $.trim($btn.text());

                if (!text) return;
                if ($btn.data("text-split") && $btn.children("span").length) return;

                $btn.attr("data-text", text);
                $btn.empty();

                for (var i = 0; i < text.length; i++) {
                    var char = text[i] === " " ? "\u00A0" : text[i];
                    var $span = $("<span></span>").attr("data-text", char).text(char);
                    $btn.append($span);
                }

                $btn.data("text-split", true);
            });
        }

        /**
         * ======================================
         * 07. field image move with cursor
         * ======================================
         */

        if ($(".field").length > 0 && device_width > 576) {
            const fieldItems = document.querySelectorAll(".field__single");

            fieldItems.forEach((item) => {
                const thumb = item.querySelector(".field-thumb");

                let targetX = 0;
                let targetY = 0;
                let currentX = 0;
                let currentY = 0;

                function animate() {
                    currentX += (targetX - currentX) * 0.1;
                    currentY += (targetY - currentY) * 0.1;

                    thumb.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;

                    requestAnimationFrame(animate);
                }

                animate();

                item.addEventListener("mousemove", (event) => {
                    const rect = item.getBoundingClientRect();
                    targetX = event.clientX - rect.left;
                    targetY = event.clientY - rect.top;
                });
            });
        }
        /**
         * ======================================
         * 08. hero three slider
         * ======================================
         */
        function toRoman(num) {
            const roman = [{
                    value: 1000,
                    symbol: "M"
                },
                {
                    value: 900,
                    symbol: "CM"
                },
                {
                    value: 500,
                    symbol: "D"
                },
                {
                    value: 400,
                    symbol: "CD"
                },
                {
                    value: 100,
                    symbol: "C"
                },
                {
                    value: 90,
                    symbol: "XC"
                },
                {
                    value: 50,
                    symbol: "L"
                },
                {
                    value: 40,
                    symbol: "XL"
                },
                {
                    value: 10,
                    symbol: "X"
                },
                {
                    value: 9,
                    symbol: "IX"
                },
                {
                    value: 5,
                    symbol: "V"
                },
                {
                    value: 4,
                    symbol: "IV"
                },
                {
                    value: 1,
                    symbol: "I"
                },
            ];

            let result = "";
            for (let i = 0; i < roman.length; i++) {
                while (num >= roman[i].value) {
                    result += roman[i].symbol;
                    num -= roman[i].value;
                }
            }
            return result;
        }

        const bgImages = document.querySelectorAll(".hero-three-bg img");

        var heroThreeSlider = new Swiper(".hero-three-slider", {
            loop: true,
            speed: 1000,
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 0,
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".hero-three-pagination",
                clickable: true,
                renderBullet: function(index, className) {
                    return `<span class="${className}">(${toRoman(index + 1)})</span>`;
                },
            },
            navigation: {
                nextEl: ".next-hero",
                prevEl: ".prev-hero",
            },
            on: {
                init: function() {
                    updateSlideNumbers(this);
                    updateBgImages(this.realIndex);
                },
                slideChange: function() {
                    updateSlideNumbers(this);
                    updateBgImages(this.realIndex);
                },
            },
        });

        function updateBgImages(index) {
            bgImages.forEach((img, i) => {
                if (i === index) {
                    img.classList.add("active-bg");
                    gsap.fromTo(
                        img, {
                            scale: 1
                        }, {
                            scale: 1.05,
                            duration: 6,
                            ease: "power1.out"
                        },
                    );
                } else {
                    img.classList.remove("active-bg");
                    gsap.set(img, {
                        scale: 1
                    });
                }
            });
        }

        /**
         * ======================================
         * 09. testimonial slider
         * ======================================
         */

        var testimonialSlider = new Swiper(".testimonial-slider", {
            loop: true,
            speed: 1000,
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 0,
            effect: "fade",
            fadeEffect: {
                crossFade: true,
            },
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: ".next-testimonial",
                prevEl: ".prev-testimonial",
            },

            on: {
                init: function() {
                    updateSlideNumbers(this);
                },
                slideChange: function() {
                    updateSlideNumbers(this);
                },
            },
        });

        function updateSlideNumbers(swiper) {
            var wrapper = swiper.el.querySelector(".swiper-wrapper");

            if (!wrapper) return;

            var realSlides = wrapper.querySelectorAll(
                ".swiper-slide:not(.swiper-slide-duplicate)",
            ).length;

            var currentIndex = swiper.realIndex + 1;

            $(".current-slide-number").text(currentIndex);
            $(".full-slides-number").text(realSlides);
        }

        /**
         * ======================================
         * 10. testimonial two slider
         * ======================================
         */
        if ($(".testimonial-two__slider").length > 0) {
            const totalSlides = $(".testimonial-two__slider .swiper-slide").length;

            var testimonialTwoSlider = new Swiper(".testimonial-two__slider", {
                loop: true,
                speed: 2000,
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 0,
                effect: "fade",
                fadeEffect: {
                    crossFade: true,
                },

                autoplay: {
                    delay: 6000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },

                on: {
                    init: function() {
                        updateTestimonialTwoNumbers(this);
                        startProgressLine();
                    },
                    slideChange: function() {
                        updateTestimonialTwoNumbers(this);
                        resetProgressLine();
                    },
                },
            });

            function updateTestimonialTwoNumbers(swiper) {
                let currentIndex = swiper.realIndex + 1;

                $(".testimonial-two .current-slide-c-number").text(currentIndex);
                $(".testimonial-two .full-slides-c-number").text(totalSlides);
            }

            function startProgressLine() {
                gsap.to(".testimonial-two .divide-cs", {
                    "--progress": "100%",
                    duration: 6,
                    ease: "linear",
                });
            }

            function resetProgressLine() {
                gsap.killTweensOf(".testimonial-two .divide-cs");

                gsap.set(".testimonial-two .divide-cs", {
                    "--progress": "0%",
                });

                startProgressLine();
            }
        }

        /**
         * ======================================
         * 11. project slider
         * ======================================
         */
        var projectSlider = new Swiper(".project-main-slider", {
            loop: true,
            speed: 2000,
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 0,
            effect: "fade",
            fadeEffect: {
                crossFade: true,
            },
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            pagination: {
                el: ".project-slider-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".next-project",
                prevEl: ".prev-project",
            },
        });

        /**
         * ======================================
         * 11.01 journal slider
         * ======================================
         */
        if ($(".journal-section__slider").length > 0) {
            var journalSlider = new Swiper(".journal-section__slider", {
                loop: true,
                speed: 900,
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 20,
                grabCursor: true,
                navigation: {
                    nextEl: ".journal-next",
                    prevEl: ".journal-prev",
                },
                breakpoints: {
                    576: {
                        slidesPerView: 2,
                        spaceBetween: 22,
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                },
            });
        }

        /**
         * ======================================
         * 12. project four slider
         * ======================================
         */
        if ($(".project-four-slider").length > 0) {
            var autoplayDelay = 5000;

            var projectFourSlider = new Swiper(".project-four-slider", {
                loop: true,
                speed: 1200,
                slidesPerView: "auto",
                centeredSlides: true,
                spaceBetween: 24,
                grabCursor: true,

                autoplay: {
                    delay: autoplayDelay,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                breakpoints: {
                    992: {
                        spaceBetween: 40,
                    },
                    1400: {
                        spaceBetween: 80,
                    },
                },

                on: {
                    autoplayStart: function() {
                        startProgress();
                    },

                    slideChangeTransitionStart: function() {
                        resetProgress();
                    },

                    slideChangeTransitionEnd: function() {
                        startProgress();
                    },
                },
            });

            function startProgress() {
                $(".slider-progress-fill")
                    .stop(true, true)
                    .css("width", "0%")
                    .animate({
                        width: "100%"
                    }, autoplayDelay, "linear");
            }

            function resetProgress() {
                $(".slider-progress-fill").stop(true, true).css("width", "0%");
            }
        }

        /**
         * ======================================
         * 13. project tabs
         * ======================================
         */

        if ($(".project-tabs__inner").length > 0) {
            $(".project-tabs__single, .project-tabs__single-equal").hide();
            $(
                ".project-tabs__single:first, .project-tabs__single-equal:first",
            ).show();

            $(".project-tab-btn").on("click", function() {
                $(".project-tab-btn").removeClass("active");
                $(this).addClass("active");

                $(".project-tabs__single, .project-tabs__single-equal").hide();

                var target = $(this).data("target");

                $("." + target).show();
            });
        }

        if ($(".project-tabs__single-equal-inner-work").length > 0) {
            $(".project-tabs__single-equal-inner-work").hide();
            $(".project-tabs__single-equal-inner-work:first").show();

            $(".project-tab-work-btn").on("click", function() {
                $(".project-tab-work-btn").removeClass("active");
                $(this).addClass("active");
                $(".project-tabs__single-equal-inner-work").hide();
                var target = $(this).data("target");
                $(target).show();
                return false;
            });
        }

        if ($(".project-tabs__single-equal-inner-architecture").length > 0) {
            $(".project-tabs__single-equal-inner-architecture").hide();
            $(".project-tabs__single-equal-inner-architecture:first").show();

            $(".project-tab-architecture-btn").on("click", function() {
                $(".project-tab-architecture-btn").removeClass("active");
                $(this).addClass("active");
                $(".project-tabs__single-equal-inner-architecture").hide();
                var target = $(this).data("target");
                $(target).show();
                return false;
            });
        }

        if ($(".project-tabs__single-equal-inner-residential").length > 0) {
            $(".project-tabs__single-equal-inner-residential").hide();
            $(".project-tabs__single-equal-inner-residential:first").show();

            $(".project-tab-design-btn").on("click", function() {
                $(".project-tab-design-btn").removeClass("active");
                $(this).addClass("active");
                $(".project-tabs__single-equal-inner-residential").hide();
                var target = $(this).data("target");
                $(target).show();
                return false;
            });
        }

        /**
         * ======================================
         * 14. news post filter
         * ======================================
         */
        function masonryFilter() {
            if ($(".grid").length) {
                var $gridt = $(".grid").isotope({
                    itemSelector: ".grid-item",
                    layoutMode: "fitRows",
                });

                var filterFnst = {
                    all: function() {
                        return true;
                    },
                };

                $(".news-three__filter").on("click", "button", function() {
                    var filterValuet = $(this).attr("data-filter");
                    filterValuet = filterFnst[filterValuet] || filterValuet;
                    $gridt.isotope({
                        filter: filterValuet
                    });
                });

                $(".news-three__filter").each(function(i, buttonGroupt) {
                    var $buttonGroupt = $(buttonGroupt);
                    $buttonGroupt.on("click", "button", function() {
                        $buttonGroupt.find(".active").removeClass("active");
                        $(this).addClass("active");
                    });
                });

                $gridt.isotope({
                    transitionDuration: "700ms",
                });
            }
        }

        masonryFilter();

        /**
         * ======================================
         * 15. service details hover active
         * ======================================
         */
        if ($(".service-details").length > 0) {
            $(".work-process__single").on("mouseenter", function() {
                $(".work-process__single").removeClass("active");
                $(this).addClass("active");
            });
        }

        /**
         * ======================================
         * 16. toggle comment section
         * ======================================
         */
        $(".comment-single").each(function() {
            $(this)
                .find(".reply-button button")
                .on("click", function() {
                    var $currentComment = $(this).closest(".comment-single");
                    $(".comment-single .reply-comment")
                        .not($currentComment.find(".reply-comment"))
                        .slideUp();
                    $currentComment.find(".reply-comment").slideToggle();
                    $(".comment-single .reply-button button")
                        .not(this)
                        .removeClass("active");
                    $(this).toggleClass("active");
                });
        });

        /**
         * ======================================
         * 17. video popup
         * ======================================
         */
        if (document.querySelector(".open-video-popup") !== null) {
            $(".open-video-popup").magnificPopup({
                disableOn: 768,
                type: "iframe",
                mainClass: "mfp-fade",
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false,
            });
        }

        /**
         * ======================================
         * 18. odometer counter
         * ======================================
         */

        function isInViewport($el) {
            var rect = $el[0].getBoundingClientRect();
            var windowHeight = $(window).height();
            var windowWidth = $(window).width();

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= windowHeight &&
                rect.right <= windowWidth
            );
        }

        function triggerOdometer($el) {
            $el.html($el.data("odometer-final"));
            $el.addClass("odometer-done");
        }

        function checkAndTriggerOdometer() {
            $(".odometer").each(function() {
                var $this = $(this);
                if (!$this.hasClass("odometer-done") && isInViewport($this)) {
                    triggerOdometer($this);
                }
            });
        }

        $(window).on("load scroll resize", function() {
            checkAndTriggerOdometer();
        });

        /**
         * ======================================
         * 19. vanilla tilt animations
         * ======================================
         */

        let btnTilt = document.querySelectorAll(".btn-anim");

        if (btnTilt) {
            VanillaTilt.init(document.querySelectorAll(".btn-anim"), {
                max: 25,
                speed: 3000,
                perspective: 200,
            });
        }

        let Vantilt = document.querySelectorAll(".van-tilt");

        if (Vantilt) {
            VanillaTilt.init(document.querySelectorAll(".van-tilt"), {
                max: 10,
                speed: 3000,
            });
        }

        /**
         * ======================================
         * 20. nice select
         * ======================================
         */
        if ($.fn.niceSelect && $("select").length > 0) {
            $("select").niceSelect();
        }

        /**
         * ======================================
         * 21. footer copyright year
         * ======================================
         */
        if ($("#copyrightYear").length > 0) {
            $("#copyrightYear").text(new Date().getFullYear());
        }

        /**
         * ======================================
         * 22. register gsap
         * ======================================
         */
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

        /**
         * ======================================
         * 23. gsap null config
         * ======================================
         */
        gsap.config({
            nullTargetWarn: false,
        });

        /**
         * ======================================
         * 24. lenis smooth scroll
         * ======================================
         */
        if (typeof Lenis !== "undefined") {
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const lenis = new Lenis({
                duration: 1.18,
                smoothWheel: !reduceMotion,
                smoothTouch: false,
                wheelMultiplier: 0.85,
                touchMultiplier: 1.15,
                easing: (t) => 1 - Math.pow(1 - t, 3),
            });

            window.PioneerLenis = lenis;
            lenis.on("scroll", ScrollTrigger.update);

            gsap.ticker.add(function(time) {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }

        /**
         * ======================================
         * 25. target section with smooth scroll
         * ======================================
         */
        function getSamePageHash(href) {
            if (!href || href === "#") return "";

            try {
                const url = new URL(href, window.location.href);
                const samePage =
                    url.origin === window.location.origin &&
                    url.pathname.replace(/\/$/, "") === window.location.pathname.replace(/\/$/, "");

                return samePage ? url.hash : "";
            } catch (error) {
                return href.charAt(0) === "#" ? href : "";
            }
        }

        function scrollToSection(hash, updateHistory) {
            if (!hash) return false;

            let targetEl;
            try {
                targetEl = document.querySelector(hash);
            } catch (error) {
                return false;
            }

            if (!targetEl) return false;

            if (window.PioneerLenis) {
                window.PioneerLenis.scrollTo(targetEl, {
                    offset: -112,
                    duration: 1.15,
                    easing: (t) => 1 - Math.pow(1 - t, 3),
                });
            } else if (typeof gsap !== "undefined" && typeof ScrollToPlugin !== "undefined") {
                gsap.to(window, {
                    scrollTo: {
                        y: targetEl,
                        offsetY: 112,
                    },
                    duration: 1,
                    ease: "sine.inOut",
                });
            } else {
                targetEl.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            if (updateHistory && history.pushState) {
                history.pushState(null, "", hash);
            }

            return true;
        }

        $('a[href*="#"]:not([href="#"])').on("click", function(event) {
            const targetHash = getSamePageHash($(this).attr("href"));

            if (!scrollToSection(targetHash, true)) return;

            event.preventDefault();
            $("header").find("li").removeClass("active");
            const parentLi = $(this).closest("li");
            if (parentLi.length) {
                parentLi.addClass("active");
            }
        });

        if (window.location.hash) {
            setTimeout(function() {
                scrollToSection(window.location.hash, false);
            }, 300);
        }

        ScrollTrigger.update();

        /**
         * ======================================
         * 27. parallax image with gsap
         * ======================================
         */

        var imageParallax = document.querySelectorAll(".parallax-image");

        if (imageParallax.length > 0) {
            $(".parallax-image").each(function() {
                $(this).wrap(
                    '<div class="parallax-image-wrap"><div class="parallax-image-inner"></div></div>',
                );

                $(".parallax-image-wrap").css({
                    overflow: "hidden",
                });

                var $animImageParallax = $(this);
                var $aipWrap = $animImageParallax.parents(".parallax-image-wrap");
                var $aipInner = $aipWrap.find(".parallax-image-inner");

                // ensure image has extra height for parallax movement
                $animImageParallax.css({
                    width: "100%",
                    height: "120%",
                    objectFit: "cover",
                });

                let tl_ImageParallax = gsap.timeline({
                    scrollTrigger: {
                        trigger: $aipWrap,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                        onEnter: () => animImgParallaxRefresh(),
                    },
                });

                // improved parallax movement
                tl_ImageParallax.fromTo(
                    $animImageParallax, {
                        yPercent: -20
                    }, {
                        yPercent: 20,
                        ease: "none"
                    },
                );

                function animImgParallaxRefresh() {
                    tl_ImageParallax.scrollTrigger.refresh();
                }

                let tl_aipZoomIn = gsap.timeline({
                    scrollTrigger: {
                        trigger: $aipWrap,
                        start: "top 99%",
                    },
                });

                tl_aipZoomIn.from($aipInner, {
                    duration: 1.5,
                    autoAlpha: 0,
                    scale: 1.2,
                    ease: Power2.easeOut,
                    clearProps: "all",
                });
            });
        }

        if ($(".parallax-cta__bg").length > 0) {
            gsap.utils.toArray(".parallax-cta__bg").forEach(function(bg) {
                gsap.fromTo(
                    bg, {
                        yPercent: -10,
                        scale: 1.03,
                    }, {
                        yPercent: 10,
                        scale: 1.03,
                        ease: "none",
                        scrollTrigger: {
                            trigger: bg.closest(".parallax-cta"),
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1,
                        },
                    },
                );
            });
        }

        /**
         * ======================================
         * 28. concept section animation
         * ======================================
         */

        if ($(".concept").length > 0) {
            let items = gsap.utils.toArray(".concept__thumb-single");
            let footerItems = gsap.utils.toArray(".concept__right-footer");
            let listItems = gsap.utils.toArray(".concept__right-list li");
            let footerWrapper = document.querySelector(".concept__footer-wrapper");

            let footerHeight = footerItems[0].offsetHeight;
            footerWrapper.style.height = footerHeight + "px";

            gsap.set(footerItems, {
                y: footerHeight
            });
            gsap.set(footerItems[0], {
                y: 0
            });

            gsap.set(listItems, {
                x: 0,
                color: "#B8B3AE"
            });
            gsap.set(listItems[0], {
                x: 20,
                color: "#000"
            });

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".concept",
                    start: "top -100px",
                    end: `+=${items.length * 100}%`,
                    scrub: 1,
                    pin: true,
                    invalidateOnRefresh: true,
                },
            });

            items.forEach((item, i) => {
                if (i === 0) return;

                tl.to(".concept__thumb-wrapper", {
                        xPercent: -100 * i,
                        ease: "none",
                        duration: 1,
                    })

                    .to(
                        footerItems[i - 1], {
                            y: -footerHeight,
                            duration: 0.6,
                        },
                        "<",
                    )

                    .to(
                        footerItems[i], {
                            y: 0,
                            duration: 0.6,
                        },
                        "<",
                    )

                    .to(
                        listItems[i - 1], {
                            x: 0,
                            color: "#B8B3AE",
                            duration: 1,
                        },
                        "<",
                    )

                    .to(
                        listItems[i], {
                            x: 20,
                            color: "#000",
                            duration: 1,
                        },
                        "<",
                    );
            });
        }

        /**
         * ======================================
         * 29. team section animation
         * ======================================
         */
        if ($(".team").length > 0) {
            let items = gsap.utils.toArray(".team__single");
            let wrapper = document.querySelector(".team__wrapper");
            let container = document.querySelector(".team-container");

            items[0].classList.add("active");

            function getScrollAmount() {
                return wrapper.scrollWidth - container.offsetWidth;
            }

            gsap.to(wrapper, {
                x: () => -getScrollAmount(),
                ease: "none",
                scrollTrigger: {
                    trigger: ".team",
                    start: "top -200px",
                    end: () => "+=" + getScrollAmount(),
                    scrub: 1,
                    pin: true,
                    invalidateOnRefresh: true,

                    onUpdate: (self) => {
                        let progress = self.progress;
                        let index = Math.round(progress * (items.length - 1));

                        items.forEach((item, i) => {
                            item.classList.toggle("active", i === index);
                        });
                    },
                },
            });
        }

        /**
         * ======================================
         * 30. fade up, left, right, bottom animation
         * ======================================
         */

        function initScrollAnimations() {
            const minimalGroups = [
                ".featured-interiors__single",
                ".main-category-section__item",
                ".work-two__lists li",
                ".ideas-inspiration__item",
                ".why-choose__single",
                ".quote-maker__field",
                ".journal-card",
                ".footer-three__address li",
                ".footer-three__list li",
            ];

            $.each(minimalGroups, function(_, selector) {
                $(selector).each(function(index) {
                    const $el = $(this);
                    if (
                        !$el.hasClass("fade-up") &&
                        !$el.hasClass("fade-down") &&
                        !$el.hasClass("fade-left") &&
                        !$el.hasClass("fade-right") &&
                        !$el.hasClass("wow-reveal")
                    ) {
                        $el.addClass("wow-reveal");
                        $el.attr("data-delay", Math.min(index * 70, 280));
                    }
                });
            });

            const animations = {
                "fade-up": {
                    y: 22
                },
                "fade-down": {
                    y: -22
                },
                "fade-left": {
                    x: 22
                },
                "fade-right": {
                    x: -22
                },
                "wow-reveal": {
                    y: 18
                },
            };

            let hasAnyTargets = false;

            $.each(animations, function(className) {
                if ($(`.${className}`).length > 0) {
                    hasAnyTargets = true;
                    return false;
                }
            });

            if (hasAnyTargets) {
                $.each(animations, function(className, animationProps) {
                    const $allItems = $(`.${className}`);

                    $allItems.each(function() {
                        const $el = $(this);
                        const customDelay = parseFloat($el.attr("data-delay"));
                        const delay = !isNaN(customDelay) ? customDelay / 1000 : 0;

                        gsap.from(this, {
                            scrollTrigger: {
                                trigger: this,
                                start: "top 92%",
                                once: true,
                            },
                            opacity: 0,
                            duration: 0.78,
                            ease: "power3.out",
                            delay: delay,
                            ...animationProps,
                        });
                    });
                });
            }
        }

        initScrollAnimations();

        /**
         * ======================================
         * 31. hero two section animation
         * ======================================
         */
        let heroTl;
        let heroST;

        function initHeroAnimation() {
            const isRTL = $(".page-wrapper").hasClass("rtl");

            if (heroTl) {
                heroTl.kill();
                heroTl = null;
            }

            if (heroST) {
                heroST.kill();
                heroST = null;
            }

            heroTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".hero-two",
                    start: "top top",
                    end: "+=160%",
                    scrub: true,
                    id: "heroTrigger",
                },
            });

            heroST = heroTl.scrollTrigger;

            heroTl.to(".hero__heading h2", {
                y: "240%",
                duration: 1.5,
            });

            heroTl.to(
                ".hero-two__thumb", {
                    scale: 1.6,
                    opacity: 1,
                    y: "-20%",
                    x: isRTL ? "9.5%" : "-9.5%",
                    duration: 1.5,
                },
                "<",
            );
        }

        initHeroAnimation();

        /**
         * ======================================
         * 34. about four section animation
         * ======================================
         */

        if ($(".about-four").length > 0 && device_width >= 1200) {
            gsap.set(".about-four__thumb img", {
                borderRadius: "400px",
            });

            gsap.set(".about-four__thumb", {
                scale: 0.11,
                y: "-610px",
                x: "22.4%",
                overflow: "hidden",
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".hero-four",
                    start: "center-=200 center",
                    end: "+=100%",
                    scrub: true,
                    pin: false,
                    markers: false,
                },
            });

            tl.to(
                ".about-four__thumb img", {
                    borderRadius: "0px",
                    duration: 3,
                    ease: "power1.inOut",
                },
                "<",
            );

            tl.to(".about-four__thumb", {
                scale: 1,
                y: "0%",
                x: "0%",
                ease: "power1.inOut",
                duration: 3,
            });
        }

        /**
         * ======================================
         * 35. about section animation
         * ======================================
         */

        if ($(".about").length > 0) {
            if (device_width >= 1200) {
                gsap.set(".about-overview__thumb", {
                    scale: 0.16,
                    y: "-87%",
                    x: "-3.2%",
                });

                var tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".about",
                        start: "center+=100 center",
                        end: "+=100%",
                        scrub: true,
                        pin: false,
                        markers: false,
                    },
                });

                tl.to(".about-overview__thumb", {
                    scale: 1,
                    y: "0%",
                    x: "0%",
                    duration: 3,
                });
            }
        }

        if ($(".about-overview").length > 0) {
            if (device_width >= 1200) {
                const items = gsap.utils.toArray(".about-counter__single");
                const button = document.querySelector(".about-counter__cta");

                let offset = -60;
                if (device_width >= 1600) {
                    offset = -100;
                }

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".about-overview",
                        start: "top top",
                        end: "+=200%",
                        scrub: true,
                        pin: true,
                        markers: false,
                    },
                });

                items.forEach((item, index) => {
                    const yValue = index === 0 ? 0 : offset * index;

                    tl.to(
                        item, {
                            y: yValue,
                            opacity: 1,
                            duration: 1,
                            ease: "power3.out",
                        },
                        index * 0.5,
                    );
                });

                if (button) {
                    tl.fromTo(
                        button, {
                            opacity: 0,
                            y: 50,
                        }, {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            ease: "power3.out",
                        },
                        items.length * 0.5,
                    );
                }
            }
        }

        /**
         * ======================================
         * 36. work section animation
         * ======================================
         */
        if ($(".work").length > 0) {
            if (device_width >= 576) {
                const section = document.querySelector(".work");

                gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: true,
                        pin: ".work-bg",
                        markers: false,
                    },
                });
            }
        }

        /**
         * ======================================
         * 26. scale items gsap animation
         * ======================================
         */

        if ($(".scale-wrapper").length > 0) {
            if (device_width > 576) {
                $(".scale-wrapper").each(function() {
                    var section = $(this);
                    var fadeItems = section.find(".scale-up");

                    fadeItems.each(function(index, element) {
                        var delay = index * 0;

                        gsap.set(element, {
                            opacity: 0,
                            y: 100,
                            scale: 0.8,
                        });

                        ScrollTrigger.create({
                            trigger: element,
                            start: "top 100%",
                            end: "bottom 20%",
                            onEnter: function() {
                                gsap.to(element, {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    duration: 1,
                                    delay: delay,
                                });
                            },
                            once: true,
                        });
                    });
                });
            }
        }

        /**
         * ======================================
         * 37. service section animation
         * ======================================
         */

        if ($(".service__wrapper").length > 0) {
            const services = $(".service__list-single");
            const thumbs = $(".service__thumb-single");

            let current = 0;
            const duration = 10000;
            let timer;

            gsap.set(thumbs, {
                opacity: 0,
                y: 30,
                scale: 0.8
            });
            gsap.set(thumbs.eq(0), {
                opacity: 1,
                y: 0,
                scale: 1,
                zIndex: 2
            });

            function activateService(index) {
                services.removeClass("active");
                services.eq(index).addClass("active");

                thumbs.each(function(i) {
                    if (i === index) {
                        gsap.to(this, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 1,
                            ease: "power3.out",
                            zIndex: 2,
                        });
                    } else {
                        gsap.to(this, {
                            opacity: 0,
                            y: 30,
                            scale: 0.8,
                            duration: 1,
                            ease: "power3.out",
                            zIndex: 1,
                        });
                    }
                });

                const line = services.eq(index).find(".line");
                line.css("animation", "none");
                line[0].offsetHeight;
                line.css("animation", "");
            }

            function nextService() {
                current = (current + 1) % services.length;
                activateService(current);
            }

            function startTimer() {
                timer = setInterval(nextService, duration);
            }

            function resetTimer() {
                clearInterval(timer);
                startTimer();
            }

            activateService(current);
            startTimer();

            services.on("mouseenter", function() {
                const index = $(this).index();
                current = index;
                activateService(current);
                resetTimer();
            });

            if (typeof device_width !== "undefined" && device_width >= 1200) {
                ScrollTrigger.create({
                    trigger: ".service__inner",
                    start: "top+=200 center",
                    end: "bottom+=300 bottom",
                    pin: ".service__thumb",
                    pinSpacing: false,
                    scrub: true,

                    onEnter: () => clearInterval(timer),
                    onLeave: () => startTimer(),
                    onEnterBack: () => clearInterval(timer),
                    onLeaveBack: () => startTimer(),
                });
            }
        }

        /**
         * ======================================
         * 38. service two section animation
         * ======================================
         */
        if ($(".service-two").length > 0) {
            const contents = $(".service-two__content-single");
            const thumbs = $(".service-two__thumb-single");

            let current = 0;

            gsap.set(thumbs, {
                opacity: 0,
                y: 30,
                scale: 0.8
            });
            gsap.set(thumbs.eq(0), {
                opacity: 1,
                y: 0,
                scale: 1,
                zIndex: 2
            });

            function activateService(index) {
                contents.removeClass("active");
                contents.eq(index).addClass("active");

                thumbs.each(function(i) {
                    if (i === index) {
                        gsap.to(this, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 1,
                            ease: "power3.out",
                            zIndex: 2,
                        });
                    } else {
                        gsap.to(this, {
                            opacity: 0,
                            y: 30,
                            scale: 0.8,
                            duration: 1,
                            ease: "power3.out",
                            zIndex: 1,
                        });
                    }
                });

                const line = contents.eq(index).find(".line");
                if (line.length) {
                    line.css("animation", "none");
                    line[0].offsetHeight;
                    line.css("animation", "");
                }
            }

            activateService(current);

            contents.on("click", function() {
                const index = $(this).index();
                current = index;
                activateService(current);
            });

            if (typeof device_width !== "undefined" && device_width >= 1200) {
                ScrollTrigger.create({
                    trigger: ".service-two",
                    start: "top+=200 center",
                    end: "bottom+=300 bottom",
                    pin: ".service-two__thumb",
                    pinSpacing: false,
                    scrub: true,
                });
            }
        }

        /**
         * ======================================
         * 39. process section animation
         * ======================================
         */
        if ($(".process").length > 0) {
            const tabs = $(".process-tab-btn");
            const contents = $(".proces__inner-left-tab");
            const thumbs = $(".process__inner-right-thumb-single");

            let currentIndex = 0;
            let progressTimer;
            const duration = 10000;

            gsap.set(contents, {
                opacity: 0,
                y: 50,
                scale: 0.95
            });
            gsap.set(thumbs, {
                opacity: 0,
                y: 50,
                scale: 0.9
            });

            gsap.set(contents.eq(0), {
                opacity: 1,
                y: 0,
                scale: 1
            });
            gsap.set(thumbs.eq(0), {
                opacity: 1,
                y: 0,
                scale: 1
            });

            function activateTab(index) {
                currentIndex = index;

                tabs.removeClass("active");
                contents.removeClass("active");
                thumbs.removeClass("active");

                const activeTab = tabs.eq(index);
                const activeContent = contents.eq(index);
                const activeThumb = thumbs.eq(index);

                activeTab.addClass("active");

                contents.each(function(i) {
                    if (i === index) {
                        gsap.to(this, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.6,
                            ease: "power3.out",
                        });
                    } else {
                        gsap.to(this, {
                            opacity: 0,
                            y: 80,
                            scale: 0.95,
                            duration: 0.6,
                            ease: "power3.out",
                        });
                    }
                });

                thumbs.each(function(i) {
                    if (i === index) {
                        gsap.to(this, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.8,
                            ease: "power3.out",
                            zIndex: 2,
                        });
                    } else {
                        gsap.to(this, {
                            opacity: 0,
                            y: 150,
                            scale: 0.85,
                            duration: 0.8,
                            ease: "power3.out",
                            zIndex: 1,
                        });
                    }
                });

                startProgress();
            }

            function startProgress() {
                clearTimeout(progressTimer);

                const activeTab = tabs.eq(currentIndex);

                const line = activeTab.find(".line");

                line.css("animation", "none");
                line[0].offsetHeight;
                line.css("animation", "");

                progressTimer = setTimeout(() => {
                    let next = (currentIndex + 1) % tabs.length;
                    activateTab(next);
                }, duration);
            }

            tabs.on("mouseenter", function() {
                const index = $(this).index();
                activateTab(index);
            });

            activateTab(0);
        }

        /**
         * ======================================
         * 40. service three section animation
         * ======================================
         */

        if ($(".service-three").length > 0) {
            $(".service-three__single").on("mouseenter", function() {
                $(".service-three__single").removeClass("active");
                $(this).addClass("active");
            });
        }

        /**
         * ======================================
         * 41. service four section animation
         * ======================================
         */
        if ($(".service-four").length > 0) {
            var items = $(".service-four__single-wrapper");

            items.on("mouseenter", function() {
                items.removeClass("active");
                $(this).addClass("active");
            });

            items.on("mousemove", function(e) {
                const item = this;
                const box = item.getBoundingClientRect();

                const dx = box.right - e.clientX;
                const dy = e.clientY - box.top;

                const thumb = item.querySelector(".service-four-thumb");

                if (thumb) {
                    thumb.style.transform = `translate(-${dx}px, ${dy}px) translate(50%, -50%) rotate(10deg)`;
                }
            });
        }

        /**
         * ======================================
         * 42. project section animation
         * ======================================
         */

        if ($(".project-title").length) {
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".project",
                    start: "top 70%",
                    end: "top 10%",
                    scrub: true,
                },
            });

            tl.to(
                ".project-title .o, .project-title .u", {
                    x: 0,
                    y: 0,
                    ease: "power3.out",
                },
                0,
            );

            tl.to(
                ".project-title .our-wrapper", {
                    right: 0,
                    ease: "power3.out",
                },
                0,
            );

            tl.to(
                ".project-title .r", {
                    scale: 1,
                    y: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    ease: "power3.out",
                },
                0,
            );

            tl.to(
                ".project-title sup", {
                    top: "-1.3em",
                    left: "0px",
                    ease: "power3.out",
                },
                0,
            );
        }

        if ($(".project").length) {
            if (device_width >= 992) {
                $(".project__single .title-xl").each(function() {
                    const text = $(this).text().trim();
                    const chars = text.split("");
                    $(this).html("");
                    chars.forEach((char, i) => {
                        $(this).append(
                            `<span class="char ${i % 2 === 0 ? "even" : "odd"}">${char}</span>`,
                        );
                    });
                });

                $(".project__single").each(function() {
                    const section = this;
                    const $thumbImg = $(section).find(".project__single-thumb img");
                    const $thumbWrapper = $(section).find(".project__single-thumb");
                    const $intro = $(section).find(".project__single-intro");
                    const charsOdd = $(section).find(".char.odd");
                    const charsEven = $(section).find(".char.even");

                    const thumbHeight = window.innerHeight - ($intro.outerHeight() + 20);
                    $thumbWrapper.height(thumbHeight);

                    gsap.set(charsEven, {
                        y: 0
                    });
                    gsap.set(charsOdd, {
                        y: thumbHeight / 2
                    });
                    gsap.set($thumbImg, {
                        scaleX: 1,
                        scaleY: 1
                    });

                    let tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: "top top",
                            end: "+=90%",
                            scrub: true,
                            pin: section,
                            pinSpacing: true,
                        },
                    });

                    tl.to(charsOdd, {
                        y: 0,
                        ease: "power3.out"
                    }, 0).to(
                        $thumbImg, {
                            scaleX: 1.05,
                            scaleY: 1.02,
                            ease: "power1.out"
                        },
                        0,
                    );
                });

                $(window).on("resize", function() {
                    $(".project__single").each(function() {
                        const section = this;
                        const $thumbWrapper = $(section).find(".project__single-thumb");
                        const $intro = $(section).find(".project__single-intro");
                        const thumbHeight =
                            window.innerHeight - ($intro.outerHeight() + 20);
                        $thumbWrapper.height(thumbHeight);
                        const charsOdd = $(section).find(".char.odd");
                        gsap.set(charsOdd, {
                            y: thumbHeight / 2
                        });
                    });
                });
            }
        }

        if ($(".work-two").length > 0) {
            const tabs = $(".work-two__lists li");
            const thumbs = $(".work-two__thumb-single");
            const texts = $(".work-two__text-single");

            let current = 0;
            const duration = 10000;
            let timer;

            gsap.set(thumbs, {
                opacity: 0,
                y: 30,
                scale: 0.8
            });
            gsap.set(texts, {
                opacity: 0,
                y: 20
            });

            gsap.set(thumbs.eq(0), {
                opacity: 1,
                y: 0,
                scale: 1,
                zIndex: 2
            });
            gsap.set(texts.eq(0), {
                opacity: 1,
                y: 0
            });

            function activateTab(index) {
                tabs.removeClass("active");
                tabs.eq(index).addClass("active");

                thumbs.each(function(i) {
                    if (i === index) {
                        gsap.to(this, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 1,
                            ease: "power3.out",
                            zIndex: 2,
                        });
                    } else {
                        gsap.to(this, {
                            opacity: 0,
                            y: 30,
                            scale: 0.8,
                            duration: 1,
                            ease: "power3.out",
                            zIndex: 1,
                        });
                    }
                });

                texts.each(function(i) {
                    if (i === index) {
                        gsap.to(this, {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            ease: "power3.out",
                        });
                    } else {
                        gsap.to(this, {
                            opacity: 0,
                            y: 20,
                            duration: 1,
                            ease: "power3.out",
                        });
                    }
                });
            }

            function nextTab() {
                current = (current + 1) % tabs.length;
                activateTab(current);
            }

            function startTimer() {
                timer = setInterval(nextTab, duration);
            }

            function resetTimer() {
                clearInterval(timer);
                startTimer();
            }

            activateTab(current);
            startTimer();

            tabs.on("mouseenter", function() {
                const index = $(this).index();
                current = index;
                activateTab(current);
                resetTimer();
            });

            if (typeof device_width !== "undefined" && device_width >= 1200) {
                ScrollTrigger.create({
                    trigger: ".work-two",
                    start: "top+=200 center",
                    end: "bottom+=300 bottom",
                    scrub: true,

                    onEnter: () => clearInterval(timer),
                    onLeave: () => startTimer(),
                    onEnterBack: () => clearInterval(timer),
                    onLeaveBack: () => startTimer(),
                });
            }
        }

        /**
         * ======================================
         * 43. team two section animation
         * ======================================
         */

        if ($(".team-two").length > 0) {
            const tabs = $(".team-two__lists li");
            const thumbs = $(".team-two-thumb");

            let current = 0;
            const duration = 10000;
            let timer;

            gsap.set(thumbs, {
                opacity: 0,
                y: 30,
                scale: 0.8
            });
            gsap.set(thumbs.eq(0), {
                opacity: 1,
                y: 0,
                scale: 1,
                zIndex: 2
            });

            function activateTab(index) {
                tabs.removeClass("active");
                tabs.eq(index).addClass("active");

                thumbs.each(function(i) {
                    if (i === index) {
                        gsap.to(this, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 1,
                            ease: "power3.out",
                            zIndex: 2,
                        });
                    } else {
                        gsap.to(this, {
                            opacity: 0,
                            y: 30,
                            scale: 0.8,
                            duration: 1,
                            ease: "power3.out",
                            zIndex: 1,
                        });
                    }
                });
            }

            function nextTab() {
                current = (current + 1) % tabs.length;
                activateTab(current);
            }

            function startTimer() {
                timer = setInterval(nextTab, duration);
            }

            function resetTimer() {
                clearInterval(timer);
                startTimer();
            }

            activateTab(current);
            startTimer();

            tabs.on("mouseenter", function() {
                const index = $(this).index();
                current = index;
                activateTab(current);
                resetTimer();
            });

            if (typeof device_width !== "undefined" && device_width >= 1200) {
                ScrollTrigger.create({
                    trigger: ".team-two",
                    start: "top+=200 center",
                    end: "bottom+=300 bottom",
                    scrub: true,

                    onEnter: () => clearInterval(timer),
                    onLeave: () => startTimer(),
                    onEnterBack: () => clearInterval(timer),
                    onLeaveBack: () => startTimer(),
                });
            }
        }

        /**
         * ======================================
         * 46. overview three tab
         * ======================================
         */

        $(".overview-three__single-tab").hide();
        $(".overview-three__single-tab:last").show();

        $(".overview-three-tab-btn").on("click", function() {
            $(".overview-three-tab-btn").removeClass("active");
            $(this).addClass("active");
            $(".overview-three__single-tab").hide();
            var target = $(this).data("target");
            $(target).fadeIn(300);
            return false;
        });

        /**
         * ======================================
         * 47. overview three section animation
         * ======================================
         */
        if ($(".overview-three").length > 0) {
            const overview = document.querySelector(".overview-three");

            const compStyle = getComputedStyle(overview);
            const w = overview.offsetWidth;
            const h = overview.offsetHeight;

            const topLeftX = w * 0.7;
            const topLeftY = h * 0.3;
            const topRightX = w * 0.7;
            const topRightY = h * 0.3;

            overview.style.borderTopLeftRadius = `${topLeftX}px ${topLeftY}px`;
            overview.style.borderTopRightRadius = `${topRightX}px ${topRightY}px`;

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".overview-three",
                    start: "top bottom-=100",
                    end: "+=100%",
                    scrub: true,
                    markers: false,
                },
            });

            tl.to(overview, {
                borderTopLeftRadius: "0px 0px",
                borderTopRightRadius: "0px 0px",
                ease: "power3.out",
            });

            tl.to(
                ".overview-three__thumb-header", {
                    left: "50%",
                    xPercent: -50,
                    ease: "power3.out",
                },
                "<",
            );
        }

        /**
         * ======================================
         * 48. coming soon
         * ======================================
         */
        if ($(".clock").length > 0) {
            const hourMarkersContainer = document.querySelector(".hour-markers");
            for (let i = 0; i < 12; i++) {
                const marker = document.createElement("div");
                marker.classList.add("hour-marker");
                const rotation = i * 30;
                marker.style.transform = `rotate(${rotation}deg) translateY(-216.25px)`;

                const hourText = document.createElement("span");
                hourText.textContent = i === 0 ? "12" : i;
                hourText.style.transform = `rotate(-${rotation}deg)`;
                marker.appendChild(hourText);

                hourMarkersContainer.appendChild(marker);
            }

            const hourHand = document.querySelector(".hour-hand");
            const minuteHand = document.querySelector(".minute-hand");
            const secondHand = document.querySelector(".second-hand");

            function setClock() {
                const now = new Date();
                const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
                const minutes = now.getMinutes() + seconds / 60;
                const hours = (now.getHours() % 12) + minutes / 60;

                const secondsDeg = (seconds / 60) * 360;
                const minutesDeg = (minutes / 60) * 360;
                const hoursDeg = (hours / 12) * 360;

                hourHand.style.transform = `rotate(${hoursDeg}deg)`;
                minuteHand.style.transform = `rotate(${minutesDeg}deg)`;
                secondHand.style.transform = `rotate(${secondsDeg}deg)`;
            }

            setInterval(setClock, 50);
            setClock();

            const countdownElement = document.querySelector(".time-countdown");
            const dayElement = countdownElement.querySelector(".day");
            const hourElement = countdownElement.querySelector(".hour");
            const minuteElement = countdownElement.querySelector(".minute");
            const secondElement = countdownElement.querySelector(".second");

            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 100);

            function updateCountdown() {
                const now = new Date();
                const timeRemaining = endDate - now;

                if (timeRemaining <= 0) {
                    endDate.setDate(endDate.getDate() + 100);
                }

                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                );
                const minutes = Math.floor(
                    (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
                );
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

                dayElement.textContent = days;
                hourElement.textContent = hours < 10 ? `0${hours}` : hours;
                minuteElement.textContent = minutes < 10 ? `0${minutes}` : minutes;
                secondElement.textContent = seconds < 10 ? `0${seconds}` : seconds;
            }

            setInterval(updateCountdown, 1000);
            updateCountdown();
        }

        /**
         * ======================================
         * 49. hover image
         * ======================================
         */

        if ($(".hover-image").length > 0) {
            const observerOptions = {
                root: null,
                rootMargin: "100px",
                threshold: 0.1,
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const container = $(entry.target);
                    let item = container.closest(".hover-item");
                    if (item.length === 0) {
                        item = container;
                    }

                    if (entry.isIntersecting) {
                        if (!container.data("initialized")) {
                            initHoverEffect(container, item);
                        }
                    }
                });
            }, observerOptions);

            $(".hover-image").each(function() {
                observer.observe(this);
            });

            function initHoverEffect(container, item) {
                const img = container.find("img").not(".arrow img")[0];
                if (!img) return;

                const setup = () => {
                    const ratio = img.naturalHeight / img.naturalWidth;

                    const instance = new hoverEffect({
                        parent: container.get(0),
                        intensity: container.data("intensity") || 0.2,
                        speedIn: container.data("speedin") || 1,
                        speedOut: container.data("speedout") || 1,
                        easing: container.data("easing") || "Expo.easeOut",
                        image1: img.src,
                        image2: img.src,
                        displacementImage: container.data("displacement"),
                        imagesRatio: ratio,
                        hover: false,
                    });

                    container.data("instance", instance);
                    container.data("initialized", true);

                    item.on("mouseenter", function() {
                        container.find("img").not(".arrow img").css("opacity", "0");
                        instance.next();
                    });

                    item.on("mouseleave", function() {
                        instance.previous();
                        setTimeout(() => {
                            container.find("img").not(".arrow img").css("opacity", "1");
                        }, 600);
                    });
                };

                if (img.complete) {
                    setup();
                } else {
                    img.onload = setup;
                }
            }
        }

        /**
         * ======================================
         * 50. newsletter underline animation
         * ======================================
         */
        if ($(".footer, .footer-two").length > 0) {
            gsap.to(".input-single .underline", {
                scaleX: 1,
                duration: 1.3,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".input-single",
                    start: "top 95%",
                    toggleActions: "play none none none",
                },
            });
        }

        /**
         * ======================================
         * 51. preloader and split text
         * ======================================
         */

        function initPreloaderAnimations() {
            const progressBar = document.querySelector(".preloader-progress");
            const count = document.querySelector(".preloader-count");
            let obj = {
                val: 0
            };

            function runSplitAnimations() {
                document.fonts.ready.then(() => {
                    document.querySelectorAll(".title-animation").forEach((el) => {
                        const childSplit = new SplitText(el, {
                            type: "lines, chars",
                            linesClass: "split-parent",
                            charsClass: "split-child",
                        });
                        gsap.set(el, {
                            opacity: 1
                        });
                        const tl = gsap.timeline({
                            scrollTrigger: {
                                trigger: el,
                                start: "top 90%",
                                end: "bottom 60%",
                                scrub: false,
                                toggleActions: "play none none none",
                            },
                        });
                        tl.from(childSplit.lines, {
                            duration: 0.8,
                            yPercent: 100,
                            stagger: 0.1,
                        });
                        tl.from(
                            childSplit.chars, {
                                duration: 0.8,
                                y: 100,
                                autoAlpha: 0,
                                stagger: 0
                            },
                            "-=0.8",
                        );
                    });

                    document.querySelectorAll(".title-animation-lg").forEach((el) => {
                        const split = new SplitText(el, {
                            type: "words, chars",
                            wordsClass: "split-parent-lg",
                            charsClass: "split-child-lg",
                        });
                        gsap.set(el, {
                            opacity: 1
                        });
                        const tl = gsap.timeline({
                            scrollTrigger: {
                                trigger: el,
                                start: "top 90%",
                                end: "bottom 60%",
                            },
                        });
                        tl.from(split.chars, {
                            duration: 0.7,
                            yPercent: 60,
                            autoAlpha: 0,
                            ease: "power3.out",
                            stagger: {
                                each: 0.065,
                                from: "center"
                            },
                        });
                    });

                    document.querySelectorAll(".title-animation-sd").forEach((el) => {
                        const split = new SplitText(el, {
                            type: "lines, chars",
                            linesClass: "split-parent-sd",
                            charsClass: "split-child-sd",
                        });
                        gsap.set(el, {
                            opacity: 1
                        });
                        const tl = gsap.timeline({
                            scrollTrigger: {
                                trigger: el,
                                start: "top 90%",
                                end: "bottom 60%",
                            },
                        });
                        split.lines.forEach((line) => {
                            tl.from(line.querySelectorAll(".split-child-sd"), {
                                duration: 0.7,
                                autoAlpha: 0,
                                x: -10,
                                ease: "power3.out",
                                stagger: 0.05,
                            });
                        });
                    });

                    document.querySelectorAll(".title-animation-color").forEach((el) => {
                        const split = new SplitText(el, {
                            type: "words",
                            wordsClass: "split-word",
                        });
                        const wordSpans = el.querySelectorAll(".split-word");
                        gsap.set(el, {
                            opacity: 1
                        });
                        gsap
                            .timeline({
                                scrollTrigger: {
                                    trigger: el,
                                    start: "top 70%",
                                    end: "bottom 50%",
                                    scrub: true,
                                },
                            })
                            .to(wordSpans, {
                                color: getComputedStyle(el).getPropertyValue("--char-active"),
                                stagger: 0.2,
                                ease: "none",
                            });
                    });
                });
            }

            if (!progressBar || !count) {
                runSplitAnimations();
                return;
            }

            gsap.to(obj, {
                val: 100,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                    const number = Math.floor(obj.val);
                    progressBar.style.width = number + "%";
                    count.innerText = number + "%";
                },
                onComplete: () => {
                    gsap.to(".preloader", {
                        yPercent: -100,
                        duration: 1,
                        ease: "power4.inOut",
                        onComplete: runSplitAnimations,
                    });
                },
            });
        }

        initPreloaderAnimations();

        /**
         * ======================================
         * 52. template options
         * ======================================
         */
        $(".open-color").on("click", function() {
            $(this).hide();
            $(".close-color").show();
            $(".color-icon").css("right", "250px");
            $(".color-palate-inner").css({
                right: "0"
            });
        });

        $(".close-color").on("click", function() {
            $(this).hide();
            $(".open-color").show();
            $(".color-icon").css("right", "0px");
            $(".color-palate-inner").css({
                right: "-252px"
            });
        });

        $(".color-version li").on("click", function() {
            $(this).closest(".color-version").find("li").removeClass("active");
            $(this).addClass("active");
        });

        $(".rtl-version li").on("click", function() {
            $(this).closest(".rtl-version").find("li").removeClass("active");
            $(this).addClass("active");
        });

        $(".light-mode").on("click", function() {
            $("body").removeClass("dark-mode");
            $(".logo-ch").attr("src", "assets/images/logo.svg");
            $(".logo-ch-sm").attr("src", "assets/images/logo-sm.svg");
        });

        $(".dark-mode").on("click", function() {
            $("body").addClass("dark-mode");
            $(".logo-ch").attr("src", "assets/images/logo-light.svg");
            $(".logo-ch-sm").attr("src", "assets/images/logo-sm-light.svg");
        });

        $(".ltr-yes").on("click", function() {
            $(".page-wrapper").removeClass("rtl");
            initHeroAnimation();
        });

        $(".ltr-no").on("click", function() {
            $(".page-wrapper").addClass("rtl");
            initHeroAnimation();
        });
    });
})(jQuery);
