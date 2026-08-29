import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              Helperz
            </h2>

            <p className="mt-3 text-sm leading-6">
              Reliable home services at your doorstep.
              Find trusted professionals and book services
              with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Quick Links
            </h3>

            <div className="flex flex-col gap-2 text-sm">
              <a href="/" className="hover:text-white transition">
                Home
              </a>

              <a href="/services" className="hover:text-white transition">
                Services
              </a>

              <a href="/login" className="hover:text-white transition">
                Login
              </a>

              <a href="/register" className="hover:text-white transition">
                Register
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Contact
            </h3>

            <p className="text-sm">
              Email: support@helperz.com
            </p>

            <p className="text-sm mt-2">
              Available 24/7
            </p>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-5 text-center text-sm">
          © 2026 Helperz. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;