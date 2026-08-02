// src/app/api/coach/route.ts
import { NextRequest, NextResponse } from "next/server";
import { groqProvider } from "@/lib/ai/groq";
import { StuckReason } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.mode === "breakdown") {
      const result = await groqProvider.getBreakdown(body.task as string);
      return NextResponse.json(result);
    }

    if (body.mode === "empathy_restructure") {
      const result = await groqProvider.getEmpathyRestructure(
        body.reason as StuckReason,
        body.currentStepTitle as string,
        body.currentStepDescription as string
      );
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (err) {
    console.error("Coach API error:", err);
    return NextResponse.json(
      { error: "Something went wrong reaching the coach." },
      { status: 500 }
    );
  }
}