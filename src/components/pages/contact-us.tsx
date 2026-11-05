"use client";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadForm, type FieldDef } from "@/components/site/LeadForm";
import type { SitePage } from "@/lib/strapi";
import { PageHero } from "@/components/site/Section";
import { OFFICES, telHref } from "@/lib/site";

const SUBJECTS = ["General Enquiry", "Project Enquiry", "Product Enquiry", "Careers", "Other"];


const mapQ = (a: string) => encodeURIComponent(a);

function ContactPage({ subject, hero }: { subject?: string | undefined; hero: SitePage | null }) {
  // Category names from /our-expertise map to "Product Enquiry" with the category in the message.
  const known = subject && SUBJECTS.includes(subject);
  const fields: FieldDef[] = [
    { name: "name", label: "Name", type: "text", required: true, autoComplete: "name" },
    { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
    { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { name: "subject", label: "Subject", type: "select", options: SUBJECTS, required: true },
    { name: "message", label: "Message", type: "textarea", required: true },
  ];
  const defaults = {
    subject: known ? subject : subject ? "Product Enquiry" : "General Enquiry",
    message: subject && !known ? `I'd like to enquire about ${subject}.` : "",
  };

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? 'Contact'}
        title={hero?.title ?? 'Start Your Project with'}
        highlight={hero?.highlight ?? 'EIOZ Energy'}
        intro={hero?.intro ?? 'Have a question or project in mind? Our team at EIOZ Energy is here to help with reliable lighting solutions and expert support.'}
      />
      <section data-scene="contact" className="section-pad pt-0">
        <div className="container-site grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <div className="glass-card rounded-3xl p-7">
              <h2 className="text-2xl font-bold text-dark-foreground">Contact Us</h2>
              <p className="mt-2 text-dark-muted">Get in touch with EIOZ Energy for inquiries, project discussions, or support. Our team is ready to assist you.</p>
            </div>
            {OFFICES.map((o, i) => (
              <address key={o.city} className="glass-card rounded-3xl p-7 not-italic">
                <p className="eyebrow">{i === 0 ? "UAE office" : "Qatar office"}</p>
                <ul className="mt-4 space-y-3 text-dark-muted">
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    {o.address}
                  </li>
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <a href={telHref(o.phone)} className="hover:text-primary">{o.phone}</a>
                  </li>
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <a href={`mailto:${o.email}`} className="hover:text-primary">{o.email}</a>
                  </li>
                </ul>
              </address>
            ))}
            <div className="glass-card rounded-3xl p-7">
              <p className="eyebrow">Follow Us</p>
              <ul className="mt-4 flex gap-3">
                {[
                  { l: "Facebook", I: Facebook },
                  { l: "Instagram", I: Instagram },
                  { l: "LinkedIn", I: Linkedin },
                ].map(({ l, I }) => (
                  <li key={l}>
                    {/* Placeholder social links */}
                    <a href="#" aria-label={l} className="flex h-11 w-11 items-center justify-center rounded-full border border-dark-border text-dark-foreground hover:border-primary hover:text-primary">
                      <I className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-5">
            <div className="glass-card rounded-3xl p-7 lg:p-10">
              <h2 className="mb-6 text-2xl font-bold text-dark-foreground">Send us a message</h2>
              {/* INTEGRATION POINT: pass action="https://your-endpoint" to send enquiries */}
              <LeadForm key={subject ?? ""} fields={fields} defaults={defaults} submitLabel="Send Message" context="Contact enquiry" />
            </div>
            <div className="glass-card rounded-3xl p-7">
              <p className="eyebrow">Need to know</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-dark-muted">
                <li>Please include clear details about your inquiry so we can assist you effectively.</li>
                <li>Our team will review your message and respond as soon as possible.</li>
                <li>Your information will remain confidential.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad pt-0">
        <div className="container-site">
          <Tabs defaultValue="abu-dhabi">
            <TabsList className="h-12 rounded-full bg-dark-elevated p-1">
              <TabsTrigger value="abu-dhabi" className="h-10 rounded-full px-5 text-dark-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Abu Dhabi</TabsTrigger>
              <TabsTrigger value="doha" className="h-10 rounded-full px-5 text-dark-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Doha</TabsTrigger>
            </TabsList>
            {OFFICES.map((o, i) => (
              <TabsContent key={o.city} value={i === 0 ? "abu-dhabi" : "doha"} className="mt-5">
                <div className="overflow-hidden rounded-3xl border border-dark-border">
                  <iframe
                    title={`Map of EIOZ Energy ${o.city} office`}
                    src={`https://maps.google.com/maps?q=${mapQ(o.address)}&z=15&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[380px] w-full grayscale invert-[0.9] hue-rotate-180"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${mapQ(o.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-full border border-primary/50 px-5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Navigation className="h-4 w-4" /> Get directions
                </a>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
