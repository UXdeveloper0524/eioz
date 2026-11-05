import { z } from "zod";
import { FEATURED_PROJECTS, PROJECTS, type Project } from "@/lib/projects-data";

const sector = z.enum(["Residential", "Commercial", "Hospitality", "Infrastructure", "Industrial", "Government and Education"]);
const scope = z.enum(["Design", "Supply", "Installation"]);
const project = z.object({ title: z.string(), year: z.number().int(), sector, scope: z.array(scope).nullable().optional() });
const sitePage = z.object({
  slug: z.string(),
  eyebrow: z.string().nullish(),
  title: z.string().nullish(),
  highlight: z.string().nullish(),
  intro: z.string().nullish(),
  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
});
const job = z.object({
  title: z.string(),
  description: z.string(),
  responsibilities: z.array(z.string()).nullable().optional(),
  active: z.boolean().default(true),
});

export type SitePage = z.infer<typeof sitePage>;
export type Job = z.infer<typeof job>;

async function getCollection(path: string): Promise<unknown[] | null> {
  const base = process.env["STRAPI_URL"]?.replace(/\/$/, "");
  if (!base) return null;
  const response = await fetch(`${base}/api/${path}`, {
    headers: process.env["STRAPI_READ_TOKEN"] ? { Authorization: `Bearer ${process.env["STRAPI_READ_TOKEN"]}` } : {},
    next: { revalidate: 60 },
  }).catch((error: unknown) => {
    console.error("Strapi request failed:", error);
    return null;
  });
  if (!response) return null;
  if (!response.ok) {
    console.error(`Strapi returned ${response.status} for ${path}`);
    return null;
  }
  const body: unknown = await response.json();
  if (!body || typeof body !== "object" || !("data" in body) || !Array.isArray(body.data)) return null;
  return body.data;
}

export async function getProjects(): Promise<Project[]> {
  const data = await getCollection("projects?pagination[pageSize]=100&sort[0]=year:asc&sort[1]=position:asc");
  if (data === null) return PROJECTS;
  const parsed = z.array(project).safeParse(data);
  if (!parsed.success) {
    console.error("Invalid Strapi project data:", parsed.error);
    return PROJECTS;
  }
  return parsed.data.map(({ title, year, sector, scope }) => ({ title, year, sector, scope: scope ?? [] }));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const data = await getCollection("projects?filters[featured][$eq]=true&pagination[pageSize]=20&sort[0]=position:asc");
  if (data === null) return FEATURED_PROJECTS;
  const parsed = z.array(project).safeParse(data);
  if (!parsed.success) return FEATURED_PROJECTS;
  return parsed.data.map(({ title, year, sector, scope }) => ({ title, year, sector, scope: scope ?? [] }));
}

export async function getSitePage(slug: string): Promise<SitePage | null> {
  const data = await getCollection(`site-pages?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`);
  const parsed = sitePage.safeParse(data?.[0]);
  return parsed.success ? parsed.data : null;
}

export async function getJobs(): Promise<Job[] | null> {
  const data = await getCollection("jobs?filters[active][$eq]=true&pagination[pageSize]=100&sort[0]=position:asc");
  if (data === null) return null;
  const parsed = z.array(job).safeParse(data);
  if (!parsed.success) {
    console.error("Invalid Strapi job data:", parsed.error);
    return null;
  }
  return parsed.data;
}
