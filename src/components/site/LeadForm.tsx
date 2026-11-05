"use client";
import { CheckCircle2 } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FieldDef =
  | { name: string; label: string; type: "text" | "email" | "tel"; required?: boolean; autoComplete?: string }
  | { name: string; label: string; type: "textarea"; required?: boolean }
  | { name: string; label: string; type: "select"; options: string[]; required?: boolean }
  | { name: string; label: string; type: "file"; accept?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;

/** Validated lead form, submitted to the server-side Strapi proxy. */
export function LeadForm({
  fields,
  submitLabel = "Send",
  action = "/api/leads",
  defaults = {},
  context,
}: {
  fields: FieldDef[];
  submitLabel?: string;
  action?: string;
  defaults?: Record<string, string>;
  context?: string;
}) {
  const uid = useId();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const validate = (fd: FormData) => {
    const e: Record<string, string> = {};
    for (const f of fields) {
      if (f.type === "file") {
        const file = fd.get(f.name);
        if (file instanceof File && file.size > 5 * 1024 * 1024) e[f.name] = "File must be under 5 MB.";
        continue;
      }
      const v = String(fd.get(f.name) ?? "").trim();
      if (f.required && !v) e[f.name] = `Please enter your ${f.label.toLowerCase()}.`;
      else if (v && f.type === "email" && !EMAIL.test(v)) e[f.name] = "Please enter a valid email address.";
      else if (v && f.type === "tel" && !PHONE.test(v)) e[f.name] = "Please enter a valid phone number.";
    }
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    if (context) fd.set("context", context);
    if (String(fd.get("company_website") ?? "")) return setStatus("done"); // honeypot: silently drop bots
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = ev.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`);
      first?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(action, { method: "POST", body: fd });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done")
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <p className="font-display text-xl font-bold text-dark-foreground">Thank you. Your message is on its way.</p>
        <p className="text-sm text-dark-muted">Our team will review your message and respond as soon as possible.</p>
      </div>
    );

  return (
    <form noValidate onSubmit={onSubmit} action={action} method="post" className="grid gap-4" encType="multipart/form-data">
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Leave empty <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {fields.map((f) => {
        const id = `${uid}-${f.name}`;
        const err = errors[f.name];
        const cls = cn(
          "w-full rounded-xl border bg-dark/60 px-4 py-3 text-dark-foreground placeholder:text-dark-muted focus:border-primary focus:outline-none",
          err ? "border-destructive" : "border-dark-border",
        );
        const common = {
          id,
          name: f.name,
          "aria-invalid": !!err,
          "aria-describedby": err ? `${id}-err` : undefined,
          defaultValue: defaults[f.name],
        };
        return (
          <div key={f.name}>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-dark-foreground">
              {f.label}
              {"required" in f && f.required && <span className="text-primary"> *</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea {...common} rows={5} className={cls} />
            ) : f.type === "select" ? (
              <select {...common} className={cls}>
                {f.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : f.type === "file" ? (
              <input {...common} defaultValue={undefined} type="file" accept={f.accept} className={cn(cls, "file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-1.5 file:text-primary-foreground")} />
            ) : (
              <input {...common} type={f.type} autoComplete={f.autoComplete} className={cls} />
            )}
            {err && (
              <p id={`${id}-err`} className="mt-1 text-sm text-destructive">
                {err}
              </p>
            )}
          </div>
        );
      })}
      {status === "error" && <p className="text-sm text-destructive">Something went wrong. Please try again or email info@eiozenergy.com.</p>}
      <Button type="submit" variant="hero" size="lg" disabled={status === "sending"} className="justify-self-start">
        {status === "sending" ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}
