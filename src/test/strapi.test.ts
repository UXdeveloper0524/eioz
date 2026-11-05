import { afterEach, describe, expect, it, vi } from "vitest";
import { getProjects } from "@/lib/strapi";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Strapi project data", () => {
  it("uses published CMS projects when available", async () => {
    vi.stubEnv("STRAPI_URL", "https://cms.example.com/");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ title: "Demo lighting", year: 2026, sector: "Commercial", scope: ["Design"] }] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    expect(await getProjects()).toEqual([{ title: "Demo lighting", year: 2026, sector: "Commercial", scope: ["Design"] }]);
    expect(fetchMock.mock.calls[0]?.[0]).toContain("https://cms.example.com/api/projects?");
  });

  it("keeps an intentionally empty CMS collection empty", async () => {
    vi.stubEnv("STRAPI_URL", "https://cms.example.com");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) }));
    expect(await getProjects()).toEqual([]);
  });
});
