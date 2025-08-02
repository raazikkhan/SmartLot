const Footer = () => {
  return (
    <>
      <footer className="bg-[#015ea1] text-gray-300 py-10 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img
              src="/src/assets/logo.png"
              alt="SmartLot Logo"
              className="h-30 rounded-lg"
            />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white">
                  Home
                </a>
              </li>

              <li>
                <a href="/dashboard" className="hover:text-white">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-white">
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>

          {/* Support 
          <div>
            <h3 className="text-lg font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/faq" className="hover:text-white">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/help" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/bug-report" className="hover:text-white">
                  Report a Bug
                </a>
              </li>
            </ul>
          </div> */}

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <p className="text-sm">📞 +91-9876543210</p>
            <p className="text-sm">✉️ support@smartlot.in</p>
            <p className="text-sm">📍 Mumbai, India</p>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-4 text-sm text-center flex justify-center">
          <p>© 2025 SmartLot. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};
export default Footer;
