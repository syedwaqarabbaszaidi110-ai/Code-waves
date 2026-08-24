<footer class="footer relative py-80 pb-0">
    <div class="bg-image">
        <img src="assets/images/landing/footer-bg.webp" alt="Image">
    </div>
    <div class="container">
        <div class="row cust-gap">
            <div class="col-lg-4 col-md-6 col-sm-6 col-12">
                <div class="site-logo">
                    <p class="web-color"><span>Code Wave Technologies </span> is a brand development firm that works in thought and in action:</p>
                </div>
            </div>

            <div class="col-lg-2 col-md-6 col-sm-6 col-12">
                <div class="info-item">
                    <span class="semibold">Discover</span>
                    <ul>
                        <li><a href="./">Home</a></li>
                        <li><a href="about-us.php">About </a></li>
                        <li><a href="our-work.php">Our Work</a></li>
                        <li><a href="services.php">Services</a></li>
                        <!-- <li><a href="testimonial.php">Testimonial</a></li>
                        <li><a href="pricing.php">Pricing</a></li>
                        <li><a href="faqs.php">FAQs</a></li> -->
                        <li><a href="contact-us.php">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6  col-12">
                <div class="info-item">
                    <span class="semibold">Services</span>
                    <ul>
                        <li><a href="animation.php">Animation</a></li>
                        <li><a href="app-development.php">App Development</a></li>
                        <li><a href="branding.php">Branding</a></li>
                        <li><a href="content-writing.php">Content Writing</a></li>
                        <li><a href="cv-writing.php">Cv Writing</a></li>
                        <li><a href="ecommerce-website.php">Ecommerce-Website</a></li>
                        <li><a href="hosting.php">Hosting</a></li>
                        <li><a href="logo-design.php">Logo Design</a></li>
                        <li><a href="seo.php">Seo</a></li>
                        <li><a href="web-development.php">Web Development</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-3 col-md-4 col-sm-6 col-12">
                <div class="info-item contact-box">
                    <span class="semibold">Contact Info</span>

                    <ul>
                        <!-- <li><a href="tel:+123456789">+123 456 7890</a></li> -->
                        <li><a href="mailto:info@codewavetechnologies.net">info@codewavetechnologies.net</a></li>
                        <li><a href="javascript:;"> House B-122, Block 13, Gulistan e Johar, Karachi.</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="footer-logo">
                    <a href="./">
                        <img src="assets/images/logo/footer-logo.webp" alt="">
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="row align-items-center">
                <div class="col-lg-8 col-md-8 col-sm-6 col-12">
                    <div class="fot-bottom-content">
                        <p style="color: var(--c8);">© Copyright Code Wave Technologies. All rights reserved</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-6 col-12">
                    <div class="footer-bottom text-right">
                        <ul>
                            <li><a href="term.php" style="color: var(--c8);">Terms & Conditions</a></li>
                            <li><a href="privacy.php" style="color: var(--c8);">Privacy Policy</a></li>
                            <li><span>2026</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>
</div>
<!-- =========================jQuery========================= -->
<script src="assets/js/jquery-3.7.1.min.js"></script>
<!-- =========================Bootstrap JS========================= -->
<script src="assets/js/bootstrap.bundle.min.js"></script>
<!-- =========================Swiper========================= -->
<script src="assets/js/swiper-bundle.min.js"></script>
<!-- =========================GSAP Plugins========================= -->
<script src="assets/js/gsap.min.js"></script>
<script src="assets/js/scrolltrigger.min.js"></script>
<script src="assets/js/textplugin.min.js"></script>
<!-- Lenis (smooth scroll) -->
<script src="assets/js/lenis.min.js"></script>
<!-- =========================Theme JS========================= -->
<script src="assets/js/theme.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", () => {

        const filters = document.querySelectorAll(".work-filter");
        const items = document.querySelectorAll(".work-item");

        filters.forEach(filter => {

            filter.addEventListener("click", () => {

                const selected = filter.dataset.filter;

                /* Active button */
                filters.forEach(btn => {
                    btn.classList.remove("active");
                });

                filter.classList.add("active");


                /* Current visible items */
                const visibleItems = [];
                const hiddenItems = [];

                items.forEach(item => {

                    const categories = item.dataset.category.split(" ");

                    if (
                        selected === "all" ||
                        categories.includes(selected)
                    ) {
                        visibleItems.push(item);
                    } else {
                        hiddenItems.push(item);
                    }

                });


                /* Hide items */
                gsap.to(hiddenItems, {
                    opacity: 0,
                    scale: 0.85,
                    y: 30,
                    duration: 0.35,
                    stagger: 0.04,
                    ease: "power2.in",
                    onComplete: () => {

                        hiddenItems.forEach(item => {
                            item.style.display = "none";
                        });

                        /* Show selected */
                        visibleItems.forEach(item => {
                            item.style.display = "";
                        });

                        gsap.fromTo(
                            visibleItems, {
                                opacity: 0,
                                scale: 0.85,
                                y: 40
                            }, {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                duration: 0.6,
                                stagger: 0.08,
                                ease: "power3.out"
                            }
                        );

                    }
                });

            });

        });


        /* =====================================================
           CARD IMAGE PARALLAX / HOVER
        ===================================================== */

        const cards = document.querySelectorAll(".work-card");

        cards.forEach(card => {

            const image = card.querySelector("img");

            card.addEventListener("mousemove", (e) => {

                const rect = card.getBoundingClientRect();

                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const rotateX =
                    ((y / rect.height) - 0.5) * -4;

                const rotateY =
                    ((x / rect.width) - 0.5) * 4;

                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 900,
                    duration: 0.4,
                    ease: "power2.out"
                });

                gsap.to(image, {
                    x: (x / rect.width - 0.5) * 8,
                    y: (y / rect.height - 0.5) * 8,
                    duration: 0.5,
                    ease: "power2.out"
                });

            });


            card.addEventListener("mouseleave", () => {

                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.6,
                    ease: "power3.out"
                });

                gsap.to(image, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "power3.out"
                });

            });

        });


        /* =====================================================
           FILTER BUTTON MICRO ANIMATION
        ===================================================== */

        filters.forEach(filter => {

            filter.addEventListener("mouseenter", () => {

                gsap.to(filter, {
                    y: -2,
                    duration: 0.25,
                    ease: "power2.out"
                });

            });

            filter.addEventListener("mouseleave", () => {

                if (!filter.classList.contains("active")) {

                    gsap.to(filter, {
                        y: 0,
                        duration: 0.25,
                        ease: "power2.out"
                    });

                }

            });

        });

    });
</script>
</body>


</html>