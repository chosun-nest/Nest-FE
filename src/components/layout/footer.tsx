import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-8 py-10 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Logo & Description */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">WantIT-NEST</h1>
          <p className="text-sm text-gray-400">
            흩어진 정보와 사람을 하나로, 함께 성장하는 IT 커뮤니티
          </p>
        </div>

        {/* Links */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>
              <a href="/" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-6">
        © 2025 MySite. All rights reserved.
      </div>
    </footer>
  );
}
