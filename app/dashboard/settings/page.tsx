import { SettingsForm } from "@/components/dashboard/settings/settings-form"
import { getSettings } from "@/lib/settings"

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure system-wide settings and preferences.</p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  )
}

