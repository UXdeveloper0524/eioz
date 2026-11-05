import { factories } from "@strapi/strapi";
export default factories.createCoreRouter("api::job.job", {
  config: { find: { auth: false }, findOne: { auth: false } },
});
