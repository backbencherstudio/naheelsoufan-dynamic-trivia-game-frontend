import { cookies } from "next/headers";

type Translations = Record<string, string>;

export async function getServerTranslations(lang?: string): Promise<{
  lang: string;
  dict: Translations;
}> {
  // 1) resolve language: URL param > cookie > default
  const cookieLang = (await cookies()).get("preferred_language")?.value;
  const resolvedLang = lang || cookieLang || "en";

  // 2) fetch languages from backend (server-side)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/admin/languages`, {
    // cache for 1 hour to avoid refetch
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  const list: Array<{ code: string; file_url: string }> = json?.data ?? [];

  const match = list.find((l) => l.code === resolvedLang) || list[0];
  if (!match?.file_url) return { lang: resolvedLang, dict: {} };

  // 3) fetch the translation file (also cached)
  const dictRes = await fetch(match.file_url, { next: { revalidate: 3600 } });
  const dict = (await dictRes.json()) as Translations;

  return { lang: resolvedLang, dict };
}

export function tServer(dict: Translations, key: string, fallback?: string) {
  return dict[key] ?? fallback ?? key;
}