import React from 'react';

const PublicFooter = () => {
  return (
    <footer className="mt-0 w-full ">
      {/* Main Footer Content */}
      <div className="w-full bg-violet-900 dark:bg-black py-10 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6 lg:gap-8">
            {/* Product Column */}
            <div className="flex flex-col items-start justify-start gap-4">
              <div className="justify-start font-['Inter'] text-lg leading-7 font-medium text-white md:text-xl md:leading-8">
                Product
              </div>
              <div className="flex flex-col items-start justify-start gap-2">
                <a
                  href="#features"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Pricing
                </a>
                <a
                  href="#how-it-works"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  How It Works
                </a>
                <a
                  href="#roadmap"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Roadmap
                </a>
                <a
                  href="/early-access"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Early Access
                </a>
              </div>
            </div>

            {/* Company Column */}
            <div className="flex flex-col items-start justify-start gap-4">
              <div className="justify-start font-['Inter'] text-lg leading-7 font-medium text-white md:text-xl md:leading-8">
                Company
              </div>
              <div className="flex flex-col items-start justify-start gap-2">
                <a
                  href="#about"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  About Us
                </a>
                <a
                  href="#contact"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Contact Us
                </a>
                <a
                  href="#blog"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Blog
                </a>
                <a
                  href="#careers"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Careers
                </a>
              </div>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col items-start justify-start gap-4">
              <div className="justify-start font-['Inter'] text-lg leading-7 font-medium text-white md:text-xl md:leading-8">
                Legal
              </div>
              <div className="flex flex-col items-start justify-start gap-2">
                <a
                  href="#terms"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Terms of Service
                </a>
                <a
                  href="#privacy"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Privacy Policy
                </a>
                <a
                  href="#refund"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Refund Policy
                </a>
                <a
                  href="#security"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Security
                </a>
              </div>
            </div>

            {/* Support Column */}
            <div className="flex flex-col items-start justify-start gap-4">
              <div className="justify-start font-['Inter'] text-lg leading-7 font-medium text-white md:text-xl md:leading-8">
                Support
              </div>
              <div className="flex flex-col items-start justify-start gap-2">
                <a
                  href="#help"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Help Center
                </a>
                <a
                  href="#faq"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  FAQ
                </a>
                <a
                  href="#support"
                  className="cursor-pointer justify-start font-['Inter'] text-sm leading-6 font-normal text-white transition-colors hover:text-violet-200 md:text-base md:leading-7 lg:text-lg"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="w-full border-t border-stone-300  bg-gray-200 dark:bg-zinc-900 py-4 md:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-6">
            <div className="justify-start text-center font-['Inter'] text-xs leading-5 font-normal text-black dark:text-white md:text-left md:text-sm md:leading-6 lg:text-base">
              © 2026 Elyxa AI  LLC. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-10">
              <div className="cursor-pointer justify-start font-['Inter'] text-xs leading-5 font-normal text-black dark:text-white transition-colors hover:text-violet-600 md:text-sm md:leading-6 lg:text-base">
                Stripe
              </div>
              {/* <div className="cursor-pointer justify-start font-['Inter'] text-xs leading-5 font-normal text-black dark:text-white transition-colors hover:text-violet-600 md:text-sm md:leading-6 lg:text-base">
                PayPal
              </div> */}
              <div className="cursor-pointer justify-start font-['Inter'] text-xs leading-5 font-normal text-black dark:text-white transition-colors hover:text-violet-600 md:text-sm md:leading-6 lg:text-base">
                Apple Pay
              </div>
              {/* <div className="cursor-pointer justify-start font-['Inter'] text-xs leading-5 font-normal text-black dark:text-white transition-colors hover:text-violet-600 md:text-sm md:leading-6 lg:text-base">
                Google Pay
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
