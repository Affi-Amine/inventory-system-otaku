export interface Settings {
    theme: "light" | "dark" | "system"
    companyName: string
    currency: string
    lowStockThreshold: number
    enableNotifications: boolean
    backupFrequency: "daily" | "weekly" | "monthly"
  }
  
  export async function getSettings(): Promise<Settings> {
    const response = await fetch("/api/settings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  
    if (!response.ok) {
      throw new Error("Failed to fetch settings")
    }
  
    return response.json()
  }
  
  export async function updateSettings(settings: Partial<Settings>): Promise<Settings> {
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })
  
    if (!response.ok) {
      throw new Error("Failed to update settings")
    }
  
    return response.json()
  }
  
  