import { NextResponse } from "next/server";
import { getServerTranslations, tServer } from "@/service/getServerTranslations";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lang = url.pathname.split("/")[1]; // /en/api/example
  const { dict } = await getServerTranslations(lang);

  return NextResponse.json({ heading: tServer(dict, "dashboard") });
}
