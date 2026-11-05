import { factories } from "@strapi/strapi";
export default factories.createCoreRouter("api::site-page.site-page", {
  config: { find: { auth: false }, findOne: { auth: false } },
});
