import { readFile, writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const DATA_DIR = join(process.cwd(), "data")
const SETTINGS_FILE = join(DATA_DIR, "settings.json")

export interface Settings {
  theme: "light" | "dark" | "system"
  companyName: string
  currency: string
  lowStockThreshold: number
  enableNotifications: boolean
  backupFrequency: "daily" | "weekly" | "monthly"
}

export async function getSettings(): Promise<Settings> {
  try {
    const data = await readFile(SETTINGS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    // If the file doesn't exist or there's an error reading it, return default settings
    return {
      theme: "system",
      companyName: "My Company",
      currency: "USD",
      lowStockThreshold: 10,
      enableNotifications: true,
      backupFrequency: "weekly",
    }
  }
}

export async function updateSettings(newSettings: Settings): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
  await writeFile(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), "utf8")
}

