import type { Metadata } from "next";
import PageContent from "@/components/pages/index";
import { pageMetadata } from "@/lib/site";
import { getFeaturedProjects, getSitePage } from "@/lib/strapi";

const description = 'EIOZ Energy delivers innovative, energy-efficient lighting design, supply, installation and testing for residential, commercial, industrial and infrastructure projects across the Middle East.';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage("home");
  return pageMetadata(page?.seoTitle ?? "Lighting Solutions in Qatar, UAE & Oman", page?.seoDescription ?? description, "/");
}

export default async function Page() {
  const [featuredProjects, hero] = await Promise.all([getFeaturedProjects(), getSitePage("home")]);
  return <PageContent featuredProjects={featuredProjects} hero={hero} />;
}
