'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

export default function SiteSettings() {
  const [settings, setSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    googleAnalyticsId: '',
    plausibleDomain: '',
    analyticsEnabled: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          siteTitle: data.siteTitle || '',
          siteDescription: data.siteDescription || '',
          googleAnalyticsId: data.googleAnalyticsId || '',
          plausibleDomain: data.plausibleDomain || '',
          analyticsEnabled: data.analyticsEnabled || false,
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (response.ok) {
        alert('Settings saved!')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Site Settings</h2>
        <p className="text-muted-foreground">
          Configure your site's general settings and SEO
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>Configure your site's SEO metadata</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Site Title</label>
            <Input
              value={settings.siteTitle}
              onChange={(e) =>
                setSettings({ ...settings, siteTitle: e.target.value })
              }
              placeholder="Your Name - Personal Homepage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Site Description
            </label>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={settings.siteDescription}
              onChange={(e) =>
                setSettings({ ...settings, siteDescription: e.target.value })
              }
              placeholder="A brief description of your homepage"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Configure analytics tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium">Enable Analytics</label>
              <p className="text-xs text-muted-foreground">
                Track visitor statistics
              </p>
            </div>
            <Switch
              checked={settings.analyticsEnabled}
              onCheckedChange={(enabled) =>
                setSettings({ ...settings, analyticsEnabled: enabled })
              }
            />
          </div>

          {settings.analyticsEnabled && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Google Analytics ID
                </label>
                <Input
                  value={settings.googleAnalyticsId}
                  onChange={(e) =>
                    setSettings({ ...settings, googleAnalyticsId: e.target.value })
                  }
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Plausible Domain
                </label>
                <Input
                  value={settings.plausibleDomain}
                  onChange={(e) =>
                    setSettings({ ...settings, plausibleDomain: e.target.value })
                  }
                  placeholder="yourdomain.com"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button onClick={saveSettings} className="w-full">
        Save Settings
      </Button>
    </div>
  )
}

