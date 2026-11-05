import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const base = process.env["STRAPI_URL"]?.replace(/\/$/, "");
  const token = process.env["STRAPI_WRITE_TOKEN"];
  if (!base || !token) return NextResponse.json({ error: "Enquiries are not configured yet." }, { status: 503 });

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  if (form.get("company_website")) return NextResponse.json({ ok: true });

  const read = (key: string) => String(form.get(key) ?? "").trim();
  const name = read("name");
  const email = read("email");
  const phone = read("phone");
  const subject = read("subject");
  const message = read("message");
  const context = read("context");
  if (!name || !EMAIL.test(email) || (!phone && !message) || [name, email, phone, subject, message, context].some((value) => value.length > 5000)) {
    return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  }

  const file = form.get("cv");
  if (file instanceof File && file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "CV must be under 5 MB." }, { status: 400 });
  }
  if (file instanceof File && file.size && !/\.(pdf|doc|docx)$/i.test(file.name)) {
    return NextResponse.json({ error: "CV must be a PDF or Word file." }, { status: 400 });
  }

  const headers = { Authorization: `Bearer ${token}` };
  let cv: number | undefined;
  if (file instanceof File && file.size) {
    const upload = new FormData();
    upload.append("files", file);
    const response = await fetch(`${base}/api/upload`, { method: "POST", headers, body: upload }).catch(() => null);
    if (!response?.ok) return NextResponse.json({ error: "CV upload failed." }, { status: 502 });
    const media: unknown = await response.json();
    if (!Array.isArray(media) || typeof media[0]?.id !== "number") {
      return NextResponse.json({ error: "CV upload failed." }, { status: 502 });
    }
    cv = media[0].id;
  }

  const response = await fetch(`${base}/api/leads`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ data: { name, email, phone, subject, message, context, ...(cv ? { cv } : {}) } }),
  }).catch(() => null);
  if (!response?.ok) return NextResponse.json({ error: "Enquiry could not be saved." }, { status: 502 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
