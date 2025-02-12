import { NextResponse } from "next/server"
import { updateSettings } from "@/lib/settings"

export async function POST(request: Request) {
  try {
    const newSettings = await request.json()
    await updateSettings(newSettings)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

