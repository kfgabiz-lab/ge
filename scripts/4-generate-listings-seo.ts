/**
 * SEO listing generator — neighborhood keywords from DB (SearchKeyword.keyword),
 * one Listing per slug, en/tr translation + SEO (same as keyword pipeline /api/generate).
 *
 * When content already exists for a slug, skips unless --force.
 * Pass --force to regenerate and update existing SEO/listing rows (failed AI runs still skipped).
 * Skips slugs that start with digits.
 *
 * Usage:
 *   npx tsx scripts/4-generate-listings-seo.ts [limit] [--locales=en,tr] [--force]
 *   npx tsx scripts/4-generate-listings-seo.ts 50 --force
 *   npx tsx scripts/4-generate-listings-seo.ts        # first 10 keywords, en+tr
 *   npx tsx scripts/4-generate-listings-seo.ts 0 --locales=en
 *
 * Requires: DATABASE_URL, OPENROUTER_API_KEY (or OPENAI_API_KEY)
 */

import fs from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import { generateSeoContent } from "@/lib/services/seo-content-generator";
import { slugify } from "@/lib/utils/slugify";
import { absoluteUrl, normalizeSearchKeyword } from "@/lib/utils/url";
import type { Locale } from "@/types/i18n";
import { extractSlugFromKeyword } from "@/lib/keyword-extraction";
import { upsertListingPageBundle } from "@/lib/services/listing-page-upsert";

function loadEnvFiles(...files: string[]) {
  for (const file of files) {
    const resolved = path.join(process.cwd(), file);
    if (!fs.existsSync(resolved)) continue;

    const lines = fs.readFileSync(resolved, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;

      const key = trimmed.slice(0, eq).trim();
      if (process.env[key] !== undefined) continue;

      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

loadEnvFiles(".env", ".env.local");

const DEFAULT_LOCALES: Locale[] = ["en", "tr"];

function parseIntArg(value: string | undefined): number {
  if (value === undefined || value === "") return 10;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? 10 : n;
}

function parseLocalesFlag(): Locale[] {
  const eq = process.argv.find((a) => a.startsWith("--locales="));
  const raw = eq?.split("=")[1]?.trim();
  if (!raw) return [...DEFAULT_LOCALES];
  const list = raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const valid = list.filter((l): l is Locale => l === "en" || l === "tr");
  return valid.length > 0 ? valid : [...DEFAULT_LOCALES];
}

function isSlugOnlyKeyword(keyword: string): boolean {
  const trimmed = keyword.trim();
  if (!trimmed) return false;
  return /^\d/.test(trimmed);
}

function slugLooksNumericOnly(slug: string): boolean {
  return /^\d+/.test(slug.trim());
}

async function processOneKeyword(
  keyword: string,
  locale: Locale,
  model: string,
  force: boolean,
): Promise<{ status: "success" | "failed" | "skipped"; error?: string }> {
  try {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return { status: "skipped" };

    const normalizedForSearch = normalizeSearchKeyword(trimmedKeyword).trim();
    if (!normalizedForSearch) return { status: "skipped" };

    let listingId: string | null = null;

    const [primaryMeta, existingBySlug] = await Promise.all([
      db.seoContent.findFirst({
        where: {
          slug: normalizedForSearch,
          locale: locale as Locale,
          entityType: "NEIGHBORHOOD_LISTING",
        },
        select: { entityId: true },
      }),
      db.listingTranslation.findFirst({
        where: {
          slug: normalizedForSearch,
          locale: locale as Locale,
        },
        select: { listingId: true },
      }),
    ]);

    if (primaryMeta?.entityId) listingId = primaryMeta.entityId;
    else if (existingBySlug?.listingId) listingId = existingBySlug.listingId;

    const isUpdate = Boolean(listingId);
    if (isUpdate && !force) {
      const existingSeo = await db.seoContent.findFirst({
        where: {
          entityId: listingId!,
          locale: locale as Locale,
          entityType: "NEIGHBORHOOD_LISTING",
        },
        select: { id: true },
      });
      if (existingSeo) return { status: "skipped" };
    }

    const result = await generateSeoContent({
      keyword: trimmedKeyword,
      locale,
      model,
    });

    if (!result.success || !result.title || !result.content) {
      return {
        status: "failed",
        error: result.error ?? "AI generation failed",
      };
    }

    const listingSlug = slugify(trimmedKeyword) || normalizedForSearch;

    const upsertResult = await upsertListingPageBundle({
      listingId: listingId ?? undefined,
      listingSlug,
      locale,
      keyword: trimmedKeyword,
      title: result.title,
      content: result.content,
      seo: {
        title: result.seoTitle ?? result.title,
        h1: result.h1 ?? result.title,
        meta: result.meta ?? result.seoDescription,
        description: result.seoDescription ?? result.meta,
        canonicalUrl: absoluteUrl(`/${locale === "tr" ? "tr/" : ""}${normalizedForSearch}`),
      },
      faqs: result.faqs,
      places: result.places,
      imageUrl: result.imageUrl,
      imageAlt: result.imageAlt,
    });

    listingId = upsertResult.listingId;

    await db.seoContent.upsert({
      where: {
        entityType_entityId_locale: {
          entityType: "NEIGHBORHOOD_LISTING",
          entityId: listingId,
          locale: locale as Locale,
        },
      },
      create: {
        entityType: "NEIGHBORHOOD_LISTING",
        entityId: listingId,
        locale: locale as Locale,
        slug: normalizedForSearch,
        title: result.seoTitle ?? result.title,
        h1: result.h1 ?? result.title,
        description: result.seoDescription ?? result.meta,
        meta: result.meta ?? result.seoDescription,
        canonicalUrl: absoluteUrl(`/${locale === "tr" ? "tr/" : ""}${normalizedForSearch}`),
      },
      update: {
        slug: normalizedForSearch,
        title: result.seoTitle ?? result.title,
        h1: result.h1 ?? result.title,
        description: result.seoDescription ?? result.meta,
        meta: result.meta ?? result.seoDescription,
        canonicalUrl: absoluteUrl(`/${locale === "tr" ? "tr/" : ""}${normalizedForSearch}`),
      },
    });

    await db.searchKeyword.create({
      data: {
        keyword: normalizedForSearch,
        locale: locale as Locale,
        searchCount: 0,
        active: true,
      },
    }).catch(() => {});

    console.log(
      `${isUpdate ? "Updated" : "Created"} listing ${listingId} for "${trimmedKeyword}" (${locale})`,
    );
    return { status: "success" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: "failed", error: message };
  }
}

async function main() {
  const positional = process.argv.slice(2).find((a) => /^\d+$/.test(a));
  const limit = parseIntArg(positional);
  const locales = parseLocalesFlag();
  const force = process.argv.includes("--force");
  const model = "gpt-4o-mini";

  const keywords = await db.searchKeyword.findMany({
    where: { active: true },
    select: { keyword: true },
    orderBy: { keyword: "asc" },
  });

  const effectiveLimit = limit === 0 ? keywords.length : Math.min(limit, keywords.length);
  const slice = keywords.slice(0, effectiveLimit);

  console.log(`4-generate-listings-seo.ts — from SearchKeyword table`);
  console.log(`Keywords (active): ${keywords.length}, processing: ${slice.length}`);
  console.log(`Locale(s): ${locales.join(", ")}`);
  console.log(`Force regenerate: ${force ? "yes" : "no (skip existing)"}`);
  console.log(`Using model: ${model}`);

  let tasks = 0;
  let skipped = 0;
  let success = 0;
  let failed = 0;

  for (const row of slice) {
    const keywordFromDb = row.keyword?.trim();
    if (!keywordFromDb) {
      skipped += 1;
      continue;
    }

    if (isSlugOnlyKeyword(keywordFromDb)) {
      skipped += 1;
      continue;
    }

    const slugKeyword = normalizeSearchKeyword(keywordFromDb);
    if (!slugKeyword || slugLooksNumericOnly(slugKeyword)) {
      skipped += 1;
      continue;
    }

    let effectiveSlug = (await extractSlugFromKeyword(slugKeyword)) ?? slugKeyword;
    if (!effectiveSlug) effectiveSlug = slugKeyword;

    for (const locale of locales) {
      tasks += 1;
      if (process.env.SKIP_AI === "true") {
        console.log(`[skip AI] Would generate ${effectiveSlug} (${locale})`);
        continue;
      }

      const outcome = await processOneKeyword(effectiveSlug, locale, model, force);
      if (outcome.status === "success") success += 1;
      else if (outcome.status === "failed") {
        failed += 1;
        console.error(`Failed: ${effectiveSlug} (${locale}) — ${outcome.error ?? "unknown"}`);
      } else {
        skipped += 1;
        console.log(`Skipped (already exists): ${effectiveSlug} (${locale})`);
      }

      const sleepMs = parseInt(process.env.SLEEP_MS || "2000", 10);
      if (sleepMs > 0 && tasks < slice.length * locales.length) {
        await new Promise((r) => setTimeout(r, sleepMs));
      }
    }
  }

  await db.$disconnect();
  console.log(`\nDone. Tasks: ${tasks}, success: ${success}, skipped: ${skipped}, failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
