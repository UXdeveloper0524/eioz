import { describe, expect, it } from "vitest";
import { NAV, pageMetadata, SITE_URL } from "@/lib/site";

describe("App routes", () => {
  it("has a unique path for every navigation item", () => {
    expect(new Set(NAV.map((item) => item.to)).size).toBe(NAV.length);
  });

  it("builds canonical page metadata for a route", () => {
    const metadata = pageMetadata("Projects", "Recent lighting projects", "/projects");
    expect(metadata.title).toBe("Projects | EIOZ Energy");
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/projects`);
  });
});
