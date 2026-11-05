import type { Core } from "@strapi/strapi";
import seed from "../seed/content.json";

async function seedCollection<T extends Record<string, unknown>>(
  strapi: Core.Strapi,
  uid: "api::project.project" | "api::site-page.site-page" | "api::job.job",
  entries: T[],
) {
  const existing = await strapi.documents(uid).findMany({ limit: 1, status: "published" });
  if (existing.length) return;
  for (const entry of entries) {
    await strapi.documents(uid).create({ data: entry, status: "published" });
  }
  strapi.log.info(`Seeded ${entries.length} ${uid} entries`);
}

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await seedCollection(strapi, "api::project.project", seed.projects);
    await seedCollection(strapi, "api::site-page.site-page", seed.pages);
    await seedCollection(strapi, "api::job.job", seed.jobs);
  },
};
