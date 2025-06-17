"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Save,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Mail,
  CreditCard,
  Globe,
  HardDrive,
  Upload,
  Download,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "Admin Dashboard",
    adminEmail: "admin@example.com",
    notifications: {
      newOrders: true,
      lowStock: true,
      consultations: true,
      systemUpdates: false,
    },
    security: {
      twoFactor: false,
      sessionTimeout: "30",
    },
    system: {
      autoBackup: true,
      maintenanceMode: false,
    },
    appearance: {
      theme: "light",
      compactMode: false,
    },
    email: {
      smtpServer: "",
      smtpPort: "587",
      enabled: false,
    },
    payment: {
      currency: "USD",
      stripeEnabled: false,
      paypalEnabled: false,
    },
    localization: {
      language: "en",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
    },
    dataManagement: {
      autoExport: false,
      retentionDays: "365",
    },
  })

  const { toast } = useToast()

  const handleSave = () => {
    // Save settings logic here
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully updated.",
    })
  }

  const updateSetting = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Manage your basic account and company information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={settings.companyName}
                onChange={(e) => setSettings((prev) => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings((prev) => ({ ...prev, adminEmail: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure when and how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Orders</Label>
                <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
              </div>
              <Switch
                checked={settings.notifications.newOrders}
                onCheckedChange={(checked) => updateSetting("notifications", "newOrders", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">Get alerted when products are running low</p>
              </div>
              <Switch
                checked={settings.notifications.lowStock}
                onCheckedChange={(checked) => updateSetting("notifications", "lowStock", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Consultation Requests</Label>
                <p className="text-sm text-muted-foreground">Get notified of new consultation requests</p>
              </div>
              <Switch
                checked={settings.notifications.consultations}
                onCheckedChange={(checked) => updateSetting("notifications", "consultations", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Updates</Label>
                <p className="text-sm text-muted-foreground">Receive notifications about system updates</p>
              </div>
              <Switch
                checked={settings.notifications.systemUpdates}
                onCheckedChange={(checked) => updateSetting("notifications", "systemUpdates", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch
                checked={settings.security.twoFactor}
                onCheckedChange={(checked) => updateSetting("security", "twoFactor", checked)}
              />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting("security", "sessionTimeout", e.target.value)}
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>Configure system-wide settings and maintenance options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
              </div>
              <Switch
                checked={settings.system.autoBackup}
                onCheckedChange={(checked) => updateSetting("system", "autoBackup", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Enable maintenance mode for system updates</p>
              </div>
              <Switch
                checked={settings.system.maintenanceMode}
                onCheckedChange={(checked) => updateSetting("system", "maintenanceMode", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance Settings
            </CardTitle>
            <CardDescription>Customize the look and feel of your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Theme</Label>
              <Select
                value={settings.appearance?.theme || "light"}
                onValueChange={(value) => updateSetting("appearance", "theme", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Use smaller spacing and components</p>
              </div>
              <Switch
                checked={settings.appearance?.compactMode || false}
                onCheckedChange={(checked) => updateSetting("appearance", "compactMode", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Settings
            </CardTitle>
            <CardDescription>Configure email server and templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="smtp-server">SMTP Server</Label>
              <Input
                id="smtp-server"
                value={settings.email?.smtpServer || ""}
                onChange={(e) => updateSetting("email", "smtpServer", e.target.value)}
                placeholder="smtp.example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                type="number"
                value={settings.email?.smtpPort || "587"}
                onChange={(e) => updateSetting("email", "smtpPort", e.target.value)}
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email notifications to customers</p>
              </div>
              <Switch
                checked={settings.email?.enabled || false}
                onCheckedChange={(checked) => updateSetting("email", "enabled", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Settings
            </CardTitle>
            <CardDescription>Configure payment gateways and options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Default Currency</Label>
              <Select
                value={settings.payment?.currency || "USD"}
                onValueChange={(value) => updateSetting("payment", "currency", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Stripe Integration</Label>
                <p className="text-sm text-muted-foreground">Enable Stripe payment processing</p>
              </div>
              <Switch
                checked={settings.payment?.stripeEnabled || false}
                onCheckedChange={(checked) => updateSetting("payment", "stripeEnabled", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>PayPal Integration</Label>
                <p className="text-sm text-muted-foreground">Enable PayPal payment processing</p>
              </div>
              <Switch
                checked={settings.payment?.paypalEnabled || false}
                onCheckedChange={(checked) => updateSetting("payment", "paypalEnabled", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Localization Settings
            </CardTitle>
            <CardDescription>Configure language and regional settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Language</Label>
              <Select
                value={settings.localization?.language || "en"}
                onValueChange={(value) => updateSetting("localization", "language", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Timezone</Label>
              <Select
                value={settings.localization?.timezone || "UTC"}
                onValueChange={(value) => updateSetting("localization", "timezone", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Date Format</Label>
              <Select
                value={settings.localization?.dateFormat || "MM/DD/YYYY"}
                onValueChange={(value) => updateSetting("localization", "dateFormat", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>Manage your data backup and export options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Export Reports</Label>
                <p className="text-sm text-muted-foreground">Automatically generate monthly reports</p>
              </div>
              <Switch
                checked={settings.dataManagement?.autoExport || false}
                onCheckedChange={(checked) => updateSetting("dataManagement", "autoExport", checked)}
              />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label>Data Retention (days)</Label>
              <Input
                type="number"
                value={settings.dataManagement?.retentionDays || "365"}
                onChange={(e) => updateSetting("dataManagement", "retentionDays", e.target.value)}
                className="w-32"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Backup Options</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export All Data
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
