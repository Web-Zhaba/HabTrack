import SettingsPaletteCard from "../features/settings/components/SettingsPaletteCard"
import SettingsLocaleCard from "../features/settings/components/SettingsLocaleCard"
import SettingsDataCard from "../features/settings/components/SettingsDataCard"
import SettingsExtrasCard from "../features/settings/components/SettingsExtrasCard"

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Настройки</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Управляйте внешним видом, данными и дополнительными опциями дневника привычек.
        </p>
      </div>

      <SettingsPaletteCard />

      <SettingsLocaleCard />

      <SettingsDataCard />

      <SettingsExtrasCard />
    </div>
  )
}
