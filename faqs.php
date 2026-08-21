<?php include 'header.php'; ?>

<!-- PAGE BANNER START -->
 <section class="page-banner sec-bg relative">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="breadcrumb-trail">
                    <a href="./">Home</a> <span>/</span> <span>FAQs</span>
                </div>
                <h1 class="web-title white">Questions we get asked a lot.</h1>
                <p class="white">Can't find what you're looking for? <a href="contact.php" style="color: var(--c5); text-decoration: underline;">Reach out</a> and we'll answer directly.</p>
            </div>
        </div>
    </div>
</section>
<!-- PAGE BANNER END -->

<!-- FAQ ACCORDION START -->
<section class="faqs py-140">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="accordion faq-accordion reveal-up" id="faqAccordion">

                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                How long does a typical project take?
                            </button>
                        </h2>
                        <div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                Most websites take 4&ndash;6 weeks from kickoff to launch, and mobile apps typically take 8&ndash;12 weeks depending on scope. We'll give you a firm timeline after the discovery call, not a rough guess.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                Do you work with startups or only established companies?
                            </button>
                        </h2>
                        <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                Both. Roughly half of our clients are early-stage startups building their first product, and the other half are established companies redesigning or scaling an existing one.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                What's included after launch?
                            </button>
                        </h2>
                        <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                Every project includes a support window (30&ndash;90 days depending on plan) covering bug fixes and small adjustments. After that, you can move to a monthly retainer or handle updates in-house — we hand over clean, documented code either way.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                                Can you work with our existing brand guidelines?
                            </button>
                        </h2>
                        <div id="faq4" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                Yes. If you already have a brand system we'll build within it. If it needs refreshing along the way, we'll flag that early rather than quietly working around gaps.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                                How do payments work?
                            </button>
                        </h2>
                        <div id="faq5" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                Typically a 50% deposit to begin, with the balance split across milestones or due at delivery for smaller projects. Enterprise engagements are billed monthly against an agreed scope.
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq6">
                                Do you offer ongoing maintenance and hosting?
                            </button>
                        </h2>
                        <div id="faq6" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                Yes — see our <a href="hosting.php">Hosting</a> service. We can manage infrastructure, monitoring, and updates so you're never the one paged at 2am.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</section>
<!-- FAQ ACCORDION END -->

<?php include 'footer.php'; ?>
