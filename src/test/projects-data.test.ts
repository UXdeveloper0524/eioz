import { describe, expect, it } from "vitest";
import { PROJECTS, YEARS } from "@/lib/projects-data";

describe("projects data", () => {
  it("covers every year from 2015 to 2024", () => {
    expect(YEARS).toEqual([2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]);
  });
  it("keeps the per-year counts from the brief", () => {
    const count = (y: number) => PROJECTS.filter((p) => p.year === y).length;
    expect([2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].map(count)).toEqual([5, 6, 7, 6, 9, 5, 5, 6, 6, 5]);
  });
});
