'use client'

import { useState, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Section } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GripVertical, Plus, Trash2, Eye, EyeOff } from 'lucide-react'

export default function PageBuilder() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections')
      if (response.ok) {
        const data = await response.json()
        setSections(data)
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const addSection = async (type: string) => {
    try {
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          pageId: 'home',
          config: {},
          order: sections.length,
        }),
      })
      if (response.ok) {
        fetchSections()
      }
    } catch (error) {
      console.error('Failed to add section:', error)
    }
  }

  const updateSection = async (id: string, updates: Partial<Section>) => {
    try {
      const response = await fetch(`/api/sections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (response.ok) {
        fetchSections()
        setEditingSection(null)
      }
    } catch (error) {
      console.error('Failed to update section:', error)
    }
  }

  const deleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return

    try {
      const response = await fetch(`/api/sections/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchSections()
      }
    } catch (error) {
      console.error('Failed to delete section:', error)
    }
  }

  const moveSection = async (dragIndex: number, hoverIndex: number) => {
    const newSections = [...sections]
    const [removed] = newSections.splice(dragIndex, 1)
    newSections.splice(hoverIndex, 0, removed)

    // Update orders
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }))

    setSections(updatedSections)

    // Update in database
    try {
      await Promise.all(
        updatedSections.map((section) =>
          fetch(`/api/sections/${section.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: section.order }),
          })
        )
      )
    } catch (error) {
      console.error('Failed to update section order:', error)
      fetchSections() // Revert on error
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Page Builder</h2>
        <div className="flex gap-2">
          <Button onClick={() => addSection('social-feed')} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Social Feed
          </Button>
          <Button onClick={() => addSection('about')} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            About
          </Button>
          <Button onClick={() => addSection('stats')} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Stats
          </Button>
          <Button onClick={() => addSection('custom')} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Custom
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <SectionItem
            key={section.id}
            section={section}
            index={index}
            isEditing={editingSection === section.id}
            onEdit={() => setEditingSection(section.id)}
            onSave={(updates) => updateSection(section.id, updates)}
            onCancel={() => setEditingSection(null)}
            onDelete={() => deleteSection(section.id)}
            onToggleVisibility={() =>
              updateSection(section.id, { visible: !section.visible })
            }
            onMove={moveSection}
          />
        ))}
        {sections.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No sections yet. Add a section to get started.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function SectionItem({
  section,
  index,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleVisibility,
  onMove,
}: {
  section: Section
  index: number
  isEditing: boolean
  onEdit: () => void
  onSave: (updates: Partial<Section>) => void
  onCancel: () => void
  onDelete: () => void
  onToggleVisibility: () => void
  onMove: (dragIndex: number, hoverIndex: number) => void
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'section',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'section',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index)
        item.index = index
      }
    },
  })

  const [config, setConfig] = useState(section.config || {})
  const [style, setStyle] = useState(section.style || {})

  if (isEditing) {
    return (
      <Card ref={(node) => drag(drop(node))} className={isDragging ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle>Edit {section.type} Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={config.title || ''}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              placeholder="Section title"
            />
          </div>

          {section.type === 'social-feed' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Platforms (comma-separated)</label>
                <Input
                  value={config.platforms?.join(',') || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      platforms: e.target.value.split(',').map((p) => p.trim()),
                    })
                  }
                  placeholder="twitter, github, youtube"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Limit</label>
                <Input
                  type="number"
                  value={config.limit || 6}
                  onChange={(e) =>
                    setConfig({ ...config, limit: parseInt(e.target.value) })
                  }
                />
              </div>
            </>
          )}

          {section.type === 'about' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={config.name || ''}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={config.bio || ''}
                  onChange={(e) => setConfig({ ...config, bio: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Avatar URL</label>
                <Input
                  value={config.avatar || ''}
                  onChange={(e) => setConfig({ ...config, avatar: e.target.value })}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Background Color</label>
            <Input
              type="color"
              value={style.backgroundColor || '#ffffff'}
              onChange={(e) => setStyle({ ...style, backgroundColor: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onSave({ config, style })}
              className="flex-1"
            >
              Save
            </Button>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card ref={(node) => drag(drop(node))} className={isDragging ? 'opacity-50' : ''}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
          <CardTitle className="capitalize">{section.type}</CardTitle>
          {!section.visible && (
            <span className="text-xs text-muted-foreground">(Hidden)</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleVisibility}
            title={section.visible ? 'Hide' : 'Show'}
          >
            {section.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}

