<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Wave</title>
    <link rel="icon" type="image/x-icon" href="assets/images/logo/fav-icon.webp">
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/fancybox.css">
    <link rel="stylesheet" href="assets/css/lenis.css">
    <link rel="stylesheet" href="assets/css/swiper-bundle.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <script>
        document.documentElement.classList.add('is-loading');
    </script>
    <link rel="stylesheet" href="assets/css/responsive.css">
</head>

<body class="<?php echo basename($_SERVER['PHP_SELF'], '.php'); ?>">

    <!-- LOADER START -->
    <div id="site-loader">
        <div class="loader-inner">
            <span class="loader-mark">CODE WAVE</span>
            <span class="loader-label">Technologies</span>
            <div class="loader-track">
                <div class="loader-fill"></div>
            </div>
        </div>
    </div>
    <!-- LOADER END -->

    <div class="wrapper">

        <!-- HEADER START -->
        <header class="header">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-3 col-md-6 col-6">
                        <div class="site-logo">
                            <a href="./">
                                <img src="assets/images/logo/logo.webp" alt="Just image">
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-7 d-lg-block d-none">
                        <div class="header-menu">
                            <ul>
                                <li><a href="./" class="ddl-nav-link"><span>Home</span></a></li>
                                <li><a href="about-us.php" class="ddl-nav-link"><span>About Us</span></a></li>
                                <li><a href="services.php" class="ddl-nav-link"><span>Services</span></a></li>
                                <li><a href="our-work.php" class="ddl-nav-link"><span>Portfolio</span></a></li>
                                <li><a href="contact-us.php" class="ddl-nav-link"><span>Contact Us</span></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-6 col-6">
                        <div class="header-btn text-end d-flex align-items-center justify-content-end gap-3">
                            <a href="contact-us.php" class="web-btn two ">
                                Contact us
                            </a>
                            <button type="button" class="menu-toggle" aria-label="Open menu" aria-expanded="false">
                                <span></span><span></span><span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <!-- HEADER END -->

        <!-- MOBILE MENU START -->
        <div class="mobile-menu">
            <div class="mobile-menu-backdrop"></div>
            <div class="mobile-menu-panel">
                <ul class="mobile-menu-links">
                    <li><a href="./">Home</a></li>
                    <li><a href="about-us.php">About Us</a></li>
                    <li><a href="services.php">Services</a></li>
                    <li><a href="our-work.php">Portfolio</a></li>
                    <li><a href="contact-us.php">Contact Us</a></li>
                </ul>
            </div>
        </div>
        <!-- MOBILE MENU END -->