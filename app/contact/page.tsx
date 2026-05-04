"use client";
import { useState, FormEvent, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { applyTheme, DEFAULT_THEME } from "@/lib/theme";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    // Apply default theme to ensure styling is consistent
    applyTheme(DEFAULT_THEME);
    document.title = "Contact Us - Med Journey";
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
          to_email: "websitemedjourney@gmail.com",
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      );

      setSubmitStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("EmailJS Error:", error);
      setSubmitStatus("error");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--primary-color))/10] to-[rgb(var(--accent-color))/5] pointer-events-none" />
        <div className="container-px relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold theme-text-primary mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600">
            We’d love to hear from you. Reach out to us for any queries, custom
            packages, or just to say hello.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-px pb-24 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-3 bg-white/60 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-sm border border-[rgb(var(--primary-color))/10]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium theme-text-primary"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-color))/50] transition ${
                      errors.name
                        ? "border-red-500"
                        : "border-gray-200 focus:border-[rgb(var(--accent-color))]"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium theme-text-primary"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-color))/50] transition ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-200 focus:border-[rgb(var(--accent-color))]"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone Number */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium theme-text-primary"
                  >
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-color))/50] focus:border-[rgb(var(--accent-color))] transition"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium theme-text-primary"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-color))/50] transition ${
                      errors.subject
                        ? "border-red-500"
                        : "border-gray-200 focus:border-[rgb(var(--accent-color))]"
                    }`}
                    placeholder="How can we help?"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs">{errors.subject}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium theme-text-primary"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-color))/50] transition resize-none ${
                    errors.message
                      ? "border-red-500"
                      : "border-gray-200 focus:border-[rgb(var(--accent-color))]"
                  }`}
                  placeholder="Your message here..."
                />
                {errors.message && (
                  <p className="text-red-500 text-xs">{errors.message}</p>
                )}
              </div>

              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm">
                  Message sent successfully! We will get back to you soon.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
                  Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-accent !py-3.5 !rounded-xl font-semibold text-white shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[rgb(var(--primary-color))] text-white rounded-3xl p-8 sm:p-10 shadow-xl h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white/80 mb-1 text-sm">
                      Email Address
                    </h4>
                    <a
                      href="mailto:websitemedjourney@gmail.com"
                      className="text-lg hover:text-[rgb(var(--accent-color))] transition-colors break-all"
                    >
                      websitemedjourney@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white/80 mb-1 text-sm">
                      Phone Number
                    </h4>
                    <a
                      href="tel:+911234567890"
                      className="text-lg hover:text-[rgb(var(--accent-color))] transition-colors"
                    >
                      +91 123 456 7890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white/80 mb-1 text-sm">
                      Office Address
                    </h4>
                    <p className="text-lg leading-relaxed">
                      123 Journey Lane,
                      <br />
                      Travel District,
                      <br />
                      New Delhi, 110001
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-white/10">
                <p className="text-sm text-white/60">
                  Our support team is available 24/7 to assist you with any
                  questions or concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
};

export default ContactPage;
