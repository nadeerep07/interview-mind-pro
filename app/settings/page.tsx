"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { GlassCard, GlowButton, GradientText } from "@/components/animated-components"
import { InputField } from "@/components/input-field"
import { SelectField } from "@/components/select-field"
import { useAuth } from "@/lib/auth-context"
import { Save, LogOut } from "lucide-react"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    language: "en",
    timezone: "UTC",
    notifications: true,
    emailUpdates: true,
  })

  const handleSave = async () => {
    // Mock save - replace with actual backend call
    console.log("Saving settings:", formData)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <ProtectedLayout>
      <div className="p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            <GradientText>Settings</GradientText>
          </h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <GlassCard className="p-8 space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>

          <InputField
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <InputField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-6">
            <SelectField
              label="Language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
                { value: "fr", label: "French" },
                { value: "de", label: "German" },
              ]}
            />

            <SelectField
              label="Timezone"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              options={[
                { value: "UTC", label: "UTC" },
                { value: "EST", label: "Eastern" },
                { value: "CST", label: "Central" },
                { value: "PST", label: "Pacific" },
              ]}
            />
          </div>

          <GlowButton
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleSave}
          >
            <Save className="w-5 h-5" />
            Save Changes
          </GlowButton>
        </GlassCard>

        {/* Preferences Section */}
        <GlassCard className="p-8 space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-foreground">Preferences</h2>

          <div className="space-y-4">
            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                className="w-5 h-5 rounded accent-purple-neon"
              />
              <div>
                <p className="font-semibold text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive reminders for daily challenges</p>
              </div>
            </label>

            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.emailUpdates}
                onChange={(e) => setFormData({ ...formData, emailUpdates: e.target.checked })}
                className="w-5 h-5 rounded accent-purple-neon"
              />
              <div>
                <p className="font-semibold text-foreground">Email Updates</p>
                <p className="text-sm text-muted-foreground">Weekly progress reports and tips</p>
              </div>
            </label>
          </div>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard className="p-8 border border-destructive/30 space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Danger Zone</h2>

          <p className="text-foreground">Once you log out, you'll need to sign in again to access your account.</p>

          <GlowButton
            variant="outline"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </GlowButton>
        </GlassCard>
      </div>
    </ProtectedLayout>
  )
}
