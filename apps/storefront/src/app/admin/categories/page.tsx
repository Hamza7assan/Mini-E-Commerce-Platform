"use client"
import { useState, useEffect } from "react"
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { Category } from "@/types"

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: "", slug: "", image: null as File | null, is_active: true })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await getAdminCategories()
      setCategories(data)
    } catch (err) {
      // handled via UI
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (category: Category | null = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ name: category.name, slug: category.slug, image: null, is_active: category.is_active })
    } else {
      setEditingCategory(null)
      setFormData({ name: "", slug: "", image: null, is_active: true })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const data = new FormData()
    data.append("name", formData.name)
    data.append("slug", formData.slug)
    data.append("is_active", formData.is_active.toString())
    if (formData.image) {
      data.append("image", formData.image)
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data)
      } else {
        await createCategory(data)
      }
      setIsModalOpen(false)
      fetchCategories()
    } catch (err) {
      alert("Error saving category")
      // handled via UI
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id)
        fetchCategories()
      } catch (err) {
        alert("Failed to delete category. It might be linked to existing products.")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Categories</h1>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={16} /> Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 text-neutral-500 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Image</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr><td colSpan={4} className="p-6 text-center text-neutral-500">Loading...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-center text-neutral-500">No categories found.</td></tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-neutral-50/50">
                      <td className="px-6 py-4">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-neutral-200 rounded flex items-center justify-center text-xs">No img</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-neutral-900">{cat.name}</td>
                      <td className="px-6 py-4 text-neutral-500">{cat.slug}</td>
                      <td className="px-6 py-4">
                        <Badge variant={cat.is_active ? 'default' : 'secondary'}>
                          {cat.is_active ? 'Active' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenModal(cat)} className="p-2 text-neutral-400 hover:text-blue-600 rounded bg-white border border-neutral-200 shadow-sm transition-colors">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(cat.id)} className="p-2 text-neutral-400 hover:text-red-600 rounded bg-white border border-neutral-200 shadow-sm transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{editingCategory ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-900"><X size={20} /></button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Slug</label>
                  <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required placeholder="e.g. lab-coats" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Image {editingCategory && "(Leave blank to keep current)"}</label>
                  <Input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image: e.target.files?.[0] || null })} required={!editingCategory} />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                  <label htmlFor="is_active" className="text-sm font-medium">Active (Visible to customers)</label>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Category"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
