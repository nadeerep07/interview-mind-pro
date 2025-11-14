"use client";

import { useState } from "react";
import { ProtectedLayout } from "@/components/protected-layout";
import {
  GlassCard,
  GlowButton,
  GradientText,
} from "@/components/animated-components";
import { InputField } from "@/components/input-field";
import { SelectField } from "@/components/select-field";
import { useAuth } from "@/lib/auth-context";
import { Save, LogOut } from "lucide-react";

import SuccessModal from "@/components/success-modal";
import ConfirmModal from "@/components/confirm-modal";
import StackSelector from "@/components/stack-selector";

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();

  const [successModal, setSuccessModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    language: user?.language || "en",
    timezone: "UTC",
    notifications: true,
    emailUpdates: true,
    stack: user?.stack || [],
  });

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/update-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            name: formData.name,
            email: formData.email,
            language: formData.language,
            stack: formData.stack,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        updateUser(data.user);
        setSuccessModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmLogout = async () => {
    await logout();
  };

  return (
    <ProtectedLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            <GradientText>Settings</GradientText>
          </h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <GlassCard className="p-8 space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>

          <InputField
            label="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <InputField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          {/* Language Selector */}
          <div className="grid grid-cols-2 gap-6">
            <SelectField
              label="Language"
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, timezone: e.target.value })
              }
              options={[
                { value: "UTC", label: "UTC" },
                { value: "EST", label: "Eastern" },
                { value: "CST", label: "Central" },
                { value: "PST", label: "Pacific" },
              ]}
            />
          </div>

          {/* 🔥 Stack Selector Added Here */}
          <StackSelector
            value={formData.stack}
            onChange={(newStacks) =>
              setFormData({ ...formData, stack: newStacks })
            }
          />

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

        {/* logout section */}
        <GlassCard className="p-8 border border-destructive/30 space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Danger Zone</h2>
          <p className="text-foreground">
            Once you log out, you'll need to sign in again to access your
            account.
          </p>

          <GlowButton
            variant="outline"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setLogoutModal(true)}
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </GlowButton>
        </GlassCard>
      </div>

      {/* Modals */}
      <SuccessModal
        open={successModal}
        onClose={() => setSuccessModal(false)}
        message="Your profile has been updated successfully!"
      />

      <ConfirmModal
        open={logoutModal}
        onCancel={() => setLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </ProtectedLayout>
  );
}
