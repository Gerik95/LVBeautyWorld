import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const cssFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(path);
    return entry.name.endsWith(".css") ? [path] : [];
  });

const properties = cssFiles(join(process.cwd(), "src")).flatMap((file) =>
  [...readFileSync(file, "utf8").matchAll(/@property\s+(--[\w-]+)\s*\{([^}]*)\}/g)].map(([, name, body]) => ({
    file,
    name,
    syntax: /syntax:\s*"([^"]+)"/.exec(body)?.[1],
    initial: /initial-value:\s*([^;]+);/.exec(body)?.[1].trim(),
  })),
);

describe("@property rules", () => {
  it("are found", () => {
    expect(properties.map((rule) => rule.name)).toContain("--svc-wave");
  });

  // The minifier writes 0% as 0. "<percentage>" rejects a bare 0, the browser
  // drops the rule and the property no longer animates.
  it("never pair <percentage> with a zero initial value", () => {
    const broken = properties.filter(
      (rule) => rule.syntax === "<percentage>" && /^[-+]?0*\.?0+%$/.test(rule.initial ?? ""),
    );
    expect(broken).toEqual([]);
  });
});
