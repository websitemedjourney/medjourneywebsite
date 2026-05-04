"use client";

import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Plane } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="theme-gradient text-white mt-10">
      <div className="container-px py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-3">
            <Plane className="w-6 h-6 -rotate-45" /> Med Journey
          </div>
          <p className="text-white/75 text-sm leading-relaxed">
            Crafting handpicked journeys across India and beyond — slow travel,
            real culture, unforgettable moments.
          </p>
        </div>
        <div>
          <h4 className="text-white text-base font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <Link href="/packages">Packages</Link>
            </li>
            <li>
              <Link href="/#reviews">Reviews</Link>
            </li>
            <li>
              <Link href="/#video">Latest Video</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-base font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>+91 98765 43210</li>
            <li>hello@medjourney.in</li>
            <li>Bengaluru, India</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-base font-semibold mb-3">
            Follow Us
          </h4>
          <div className="flex gap-3 text-white/80">
            <a href="#" aria-label="Instagram">
              <HugeiconsIcon icon={InstagramIcon} className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Facebook">
              <HugeiconsIcon icon={FacebookIcon} className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/@medjourneywebsite" aria-label="Youtube" >
              <HugeiconsIcon icon={YoutubeIcon} className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs text-white/70">
        © {new Date().getFullYear()} Med Journey. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
