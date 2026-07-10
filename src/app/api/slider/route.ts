import { NextRequest, NextResponse } from "next/server";
import { getSlider, addSlide, deleteSlide } from "@/lib/store";
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

  try {
    const slider = await addSlide(slide);
    return NextResponse.json({ ok: true, slider });
  } catch (err) {
    console.error("slider: add failed", err);
    return NextResponse.json({ ok: false, error: "Could not add slide." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });

  try {
    const slider = await deleteSlide(id);
    return NextResponse.json({ ok: true, slider });
  } catch (err) {
    console.error("slider: delete failed", err);
    return NextResponse.json({ ok: false, error: "Could not delete slide." }, { status: 500 });
  }
}
