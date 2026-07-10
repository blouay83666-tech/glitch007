import { NextRequest, NextResponse } from "next/server";
import { getSlider, saveSlider } from "@/lib/store";
import { sliderSchema } from "@/lib/validation";
import { isAuthenticated } from "@/lib/auth";
import type { SliderSlide } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ slider: await getSlider() });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = sliderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid slide." }, { status: 400 });
  }

  const slide: SliderSlide = {
    id: `s_${Date.now().toString(36)}`,
    image: parsed.data.image,
    title: parsed.data.title,
    subtitle: parsed.data.subtitle,
  };
  const next = [...(await getSlider()), slide];
  await saveSlider(next);
  return NextResponse.json({ ok: true, slider: next });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  const next = (await getSlider()).filter((s) => s.id !== id);
  await saveSlider(next);
  return NextResponse.json({ ok: true, slider: next });
}
