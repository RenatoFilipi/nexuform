import {
  blockName,
  calculateAverageCompletionTime,
  formatDateRelativeToNow,
  formatDecimal,
  formatTime,
  getDateRange,
  getDaysDifference,
  isValidEmail,
  nanoid,
  uuid,
} from "@/utils/functions";
import { describe, expect, it } from "vitest";

describe("uuid", () => {
  it("should generate a valid UUID", () => {
    const id = uuid();
    expect(id).toMatch(/[0-9a-fA-F-]{36}/);
  });
});

describe("nanoid", () => {
  it("should generate a string of the correct length", () => {
    const id = nanoid(16);
    expect(id).toHaveLength(16);
  });
});

describe("blockName", () => {
  it("should return the correct name for block types", () => {
    expect(blockName("short_text")).toBe("Short Text");
  });
});

describe("formatDateRelativeToNow", () => {
  it("should return a formatted relative date", () => {
    const date = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    expect(formatDateRelativeToNow(date)).toContain("hour ago");
  });
});

describe("isValidEmail", () => {
  it("should validate email correctly", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
  });
});

describe("formatTime", () => {
  it("should format time correctly", () => {
    expect(formatTime(65000)).toBe("1m 5.000s");
  });
});

describe("formatDecimal", () => {
  it("should format decimals correctly", () => {
    expect(formatDecimal(1.2345, 2)).toBe("1.23");
  });
});

describe("calculateAverageCompletionTime", () => {
  it("should calculate the correct average", () => {
    expect(calculateAverageCompletionTime([10, 20, 30])).toBe(20);
  });
});

describe("getDateRange", () => {
  it("should return the correct date range", () => {
    const range = getDateRange(7);
    expect(range).toHaveProperty("from");
    expect(range).toHaveProperty("to");
  });
});

describe("getDaysDifference", () => {
  it("should return the correct difference in days", () => {
    const start = new Date("2023-01-01");
    const end = new Date("2023-01-10");
    expect(getDaysDifference(start, end)).toBe(9);
  });
});
