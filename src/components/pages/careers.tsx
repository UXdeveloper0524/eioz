"use client";
import { BrainCircuit, Handshake, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LeadForm, type FieldDef } from "@/components/site/LeadForm";
import { Reveal } from "@/components/site/Reveal";
import { PageHero, SectionHeading } from "@/components/site/Section";
import type { Job, SitePage } from "@/lib/strapi";

const IMG = "https://eiozenergy.com/wp-content/uploads/2026/05/Occhio_Mito_Raggio_Lusso_Bogenleuchte_LED-f920a1f128a595c76d3e3bb07d5ec2a4-2.webp";


const GENERIC = "Responsible for planning, coordinating, and managing projects to ensure timely completion, quality standards, and smooth team communication. Strong leadership and problem-solving skills required.";
const GENERIC_RESP = [
  "Plan, manage, and monitor project activities",
  "Coordinate with clients, vendors, and internal teams",
  "Ensure projects are completed on time and within budget",
  "Prepare project reports and progress updates",
  "Handle problem-solving and team management effectively",
];
// NOTE: Project Manager, Site Supervisor and Sales Manager share PLACEHOLDER text
// from the live site — the client should tailor each role's description.
const JOBS = [
  { title: "Regional Manager", text: "Responsible for overseeing business operations, managing regional teams, achieving sales targets, and ensuring smooth coordination across assigned locations. Strong leadership and communication skills required.", resp: [] as string[] },
  { title: "Project Manager", text: GENERIC, resp: GENERIC_RESP },
  { title: "Site Supervisor", text: GENERIC, resp: GENERIC_RESP },
  { title: "Sales Manager", text: GENERIC, resp: GENERIC_RESP },
];

const FIELDS: FieldDef[] = [
  { name: "name", label: "Name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel" },
  { name: "message", label: "Message", type: "textarea" },
  { name: "cv", label: "CV (optional, PDF or Word, max 5 MB)", type: "file", accept: ".pdf,.doc,.docx" },
];

function CareersPage({ jobs, hero }: { jobs: Job[] | null; hero: SitePage | null }) {
  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Shape the Future with EIOZ Energy"}
        title={hero?.title ?? "Careers at"}
        highlight={hero?.highlight ?? "EIOZ Energy"}
        intro={hero?.intro ?? "At EIOZ Energy, we believe our people are the driving force behind our innovation and success. We are always looking for passionate and talented individuals who want to grow their careers in the lighting and energy solutions industry. Join our team and be part of a dynamic environment where creativity, collaboration, and continuous learning help shape the future of sustainable lighting."}
      />
      <section className="section-pad pt-0">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading tone="dark" eyebrow="Why join us" title="Why Join" highlight="EIOZ Energy" />
            <p className="mt-6 text-lg leading-relaxed text-dark-muted">
              At EIOZ Energy, we offer a dynamic and growth-driven work environment where innovation and teamwork are highly valued. Our team works on diverse lighting projects across residential, commercial, and infrastructure sectors, giving employees opportunities to learn, grow, and develop their skills. By joining EIOZ Energy, you become part of a forward-thinking company committed to sustainable lighting solutions and long-term career development.
            </p>
          </Reveal>
          <Reveal>
            <img src={IMG} alt="Warm architectural lighting by EIOZ Energy" width={720} height={720} loading="lazy" className="aspect-square w-full rounded-3xl border border-dark-border object-cover" />
          </Reveal>
        </div>
      </section>
      <section className="section-pad pt-0">
        <div className="container-site">
          <SectionHeading tone="dark" align="center" eyebrow="Our values" title="We believe in" highlight="three values" />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: Handshake, t: "Integrity", d: "Firm believers in actions that trigger mutual trust." },
              { icon: Lightbulb, t: "Innovation", d: "Powered with information." },
              { icon: BrainCircuit, t: "Intelligence", d: "To sail through the toughest of times." },
            ].map((v) => (
              <li key={v.t} className="glass-card rounded-3xl p-8">
                <v.icon className="h-9 w-9 text-primary" aria-hidden />
                <h3 className="mt-5 text-2xl font-bold text-dark-foreground">{v.t}</h3>
                <p className="mt-2 text-dark-muted">{v.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section-pad pt-0">
        <div className="container-site">
          <SectionHeading tone="dark" eyebrow="Join the team" title="Current Positions" highlight="Available" />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {(jobs ?? JOBS.map((j) => ({ title: j.title, description: j.text, responsibilities: j.resp, active: true }))).map((j) => (
              <li key={j.title} className="glass-card flex flex-col rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-dark-foreground">{j.title}</h3>
                <p className="mt-3 line-clamp-3 text-dark-muted">{j.description}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="hero" className="mt-6 self-start">
                      View Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto border-dark-border bg-dark-elevated text-dark-foreground sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-display text-2xl">{j.title}</DialogTitle>
                      <DialogDescription className="text-dark-muted">{j.description}</DialogDescription>
                    </DialogHeader>
                    {(j.responsibilities?.length ?? 0) > 0 && (
                      <div>
                        <p className="eyebrow">Key responsibilities</p>
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-dark-muted">
                          {j.responsibilities?.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-2 border-t border-dark-border pt-6">
                      <p className="mb-4 font-display text-lg font-semibold">Apply for this role</p>
                      <LeadForm fields={FIELDS} submitLabel="Send" context={`Application: ${j.title}`} />
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default CareersPage;
