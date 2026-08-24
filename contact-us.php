<?php include 'header.php'; ?>

<!-- PAGE BANNER START -->
<section class="page-banner sec-bg relative">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="breadcrumb-trail">
                    <a href="./">Home</a> <span>/</span> <span>Contact</span>
                </div>
                <h4 class="web-title white">Let's start the conversation.</h4>
                <p class="white">Tell us a bit about your project and we'll get back to you within one business day.</p>
            </div>
        </div>
    </div>
</section>
<!-- PAGE BANNER END -->

<!-- CONTACT FORM START -->
<section class="contact py-140">
    <div class="container">
        <div class="row cust-gap">
            <div class="col-lg-7">
                <div class="contact-form reveal-up">
                    <form action="#" method="post">
                        <div class="row cust-gap">
                            <div class="col-md-6">
                                <input type="text" class="form-control" placeholder="Your name" name="name" required>
                            </div>
                            <div class="col-md-6">
                                <input type="email" class="form-control" placeholder="Email address" name="email" required>
                            </div>
                            <div class="col-md-6">
                                <input type="tel" class="form-control" placeholder="Phone number" name="phone">
                            </div>
                            <div class="col-md-6">
                                <select class="form-control" name="service">
                                    <option value="">What do you need?</option>
                                    <option>Web Development</option>
                                    <option>App Development</option>
                                    <option>Branding</option>
                                    <option>SEO</option>
                                    <option>Something else</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <textarea class="form-control" rows="6" placeholder="Tell us about your project" name="message" required></textarea>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="web-btn">Send message</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="contact-info-card reveal-up">
                    <div class="info-row">
                        <span class="label">Email</span>
                        <a href="mailto:Contact@dexterdesignlab.com">Contact@dexterdesignlab.com</a>
                    </div>
                    <div class="info-row">
                        <span class="label">Phone</span>
                        <a href="tel:+123456789">+123 456 7890</a>
                    </div>
                    <div class="info-row">
                        <span class="label">Studio</span>
                        <span class="value">Lorem Ipsum, LI &middot; London, UK</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Hours</span>
                        <span class="value">Mon &ndash; Fri, 9am &ndash; 6pm GMT</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- CONTACT FORM END -->

<?php include 'footer.php'; ?>
