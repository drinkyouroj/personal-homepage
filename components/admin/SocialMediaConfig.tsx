'use client'

import { useState, useEffect } from 'react'
import { SocialMediaConfig as SocialConfig } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
  { id: 'github', name: 'GitHub', icon: '💻' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'facebook', name: 'Facebook', icon: '👤' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'substack', name: 'Substack', icon: '📰' },
  { id: 'discord', name: 'Discord', icon: '💬' },
  { id: 'steam', name: 'Steam', icon: '🎮' },
]

export default function SocialMediaConfig() {
  const [configs, setConfigs] = useState<Record<string, SocialConfig>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/social/configs')
      if (response.ok) {
        const data = await response.json()
        const configMap: Record<string, SocialConfig> = {}
        data.forEach((config: SocialConfig) => {
          configMap[config.platform] = config
        })
        setConfigs(configMap)
      }
    } catch (error) {
      console.error('Failed to fetch configs:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (platform: string, updates: Partial<SocialConfig>) => {
    try {
      const response = await fetch(`/api/social/configs/${platform}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (response.ok) {
        fetchConfigs()
      }
    } catch (error) {
      console.error('Failed to update config:', error)
    }
  }

  const togglePlatform = async (platform: string, enabled: boolean) => {
    const existing = configs[platform]
    if (existing) {
      await updateConfig(platform, { enabled })
    } else {
      // Create new config
      try {
        const response = await fetch('/api/social/configs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform,
            enabled,
          }),
        })
        if (response.ok) {
          fetchConfigs()
        }
      } catch (error) {
        console.error('Failed to create config:', error)
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Social Media Configuration</h2>
        <p className="text-muted-foreground">
          Connect your social media accounts to display your latest activity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PLATFORMS.map((platform) => {
          const config = configs[platform.id]
          return (
            <Card key={platform.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{platform.icon}</span>
                    <CardTitle>{platform.name}</CardTitle>
                  </div>
                  <Switch
                    checked={config?.enabled || false}
                    onCheckedChange={(enabled) => togglePlatform(platform.id, enabled)}
                  />
                </div>
              </CardHeader>
              {config?.enabled && (
                <CardContent className="space-y-4">
                  {platform.id === 'github' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          GitHub Token
                        </label>
                        <Input
                          type="password"
                          value={config.apiKey || ''}
                          onChange={(e) =>
                            updateConfig(platform.id, { apiKey: e.target.value })
                          }
                          placeholder="ghp_..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Username
                        </label>
                        <Input
                          value={config.username || ''}
                          onChange={(e) =>
                            updateConfig(platform.id, { username: e.target.value })
                          }
                          placeholder="your-username"
                        />
                      </div>
                    </>
                  )}

                  {platform.id === 'youtube' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          YouTube API Key
                        </label>
                        <Input
                          type="password"
                          value={config.apiKey || ''}
                          onChange={(e) =>
                            updateConfig(platform.id, { apiKey: e.target.value })
                          }
                          placeholder="AIza..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Channel ID
                        </label>
                        <Input
                          value={config.userId || ''}
                          onChange={(e) =>
                            updateConfig(platform.id, { userId: e.target.value })
                          }
                          placeholder="UC..."
                        />
                      </div>
                    </>
                  )}

                  {platform.id === 'twitter' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          API Key
                        </label>
                        <Input
                          type="password"
                          value={config.apiKey || ''}
                          onChange={(e) =>
                            updateConfig(platform.id, { apiKey: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          API Secret
                        </label>
                        <Input
                          type="password"
                          value={config.apiSecret || ''}
                          onChange={(e) =>
                            updateConfig(platform.id, { apiSecret: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Username
                        </label>
                        <Input
                          value={config.username || ''}
                          onChange={(e) =>
                            updateConfig(platform.id, { username: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}

                  {config.lastSync && (
                    <p className="text-xs text-muted-foreground">
                      Last synced: {new Date(config.lastSync).toLocaleString()}
                    </p>
                  )}

                  <Button
                    onClick={async () => {
                      const response = await fetch(
                        `/api/social/sync/${platform.id}`,
                        { method: 'POST' }
                      )
                      if (response.ok) {
                        fetchConfigs()
                      }
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Sync Now
                  </Button>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

