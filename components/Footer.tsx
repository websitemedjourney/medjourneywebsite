"use client";

import {
  InstagramIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { FooterSocialLink } from "@/components/FooterSocialLink";

const Footer = () => {
  return (
    <footer className=" text-white bg-main bg-[url('/assets/vectors/trekking.svg')] bg-cover bg-[center_10%] flex flex-col mt-10">
      <div className="container-px w-full h-[65vh] transform -translate-y-10 max-md:translate-y-16">
        <h1 className="text-4xl font-bold text-primary">Stay Connected</h1>
        <div className=" flex justify-between items-center gap-3 mt-6 text-primary max-md:flex-col max-md:items-end">
          <FooterSocialLink
            href="#"
            ariaLabel="WhatsApp"
            lead="Message us on "
            title="WhatsApp"
            icon={WhatsappIcon}
          />
          <FooterSocialLink
            href="#"
            ariaLabel="Instagram"
            lead="Follow us on "
            title="Instagram"
            icon={InstagramIcon}
          />
          <FooterSocialLink
            href="#"
            ariaLabel="Youtube"
            lead="Follow us on "
            title="Youtube"
            icon={YoutubeIcon}
          />
        </div>
      </div>
      <div className="container-px w-full">
        {/* <div>
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
        </div> */}
        {/* <div>
          <h4 className="text-white text-base font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li>+91 98765 43210</li>
            <li>hello@medjourney.in</li>
            <li>Bengaluru, India</li>
          </ul>
        </div> */}
        <div className="flex justify-start items-center w-full text-white">
          <div>
            <img
              src="/assets/vectors/logo.svg"
              alt="Med Journey"
              className="brightness-0 invert max-h-[100px] -translate-x-8"
            />
            <p className="mt-4">Moonlight Building, Mukkom Road</p>
            <p>Areekode, Malappuram, Pin 673639</p>
          </div>
        </div>
      </div>
      <div className=" py-5 text-center text-xs text-white/70">
        © {new Date().getFullYear()} Med Journey. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
