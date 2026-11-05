import type { Metadata } from "next";
import PageContent from "@/components/pages/contact-us";
import { pageMetadata } from "@/lib/site";
import { getSitePage } from "@/lib/strapi";

const description = 'Contact EIOZ Energy in Abu Dhabi and Doha for lighting design, supply and installation enquiries. Call +971 54 339 2233 or +974 4001 3333.';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage('contact-us');
  const metadata = pageMetadata(page?.seoTitle ?? 'Contact Us', page?.seoDescription ?? description, '/contact-us');
  return metadata;
}

export default async function Page({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const [{ subject }, hero] = await Promise.all([searchParams, getSitePage("contact-us")]);
  return <PageContent subject={subject} hero={hero} />;
}
