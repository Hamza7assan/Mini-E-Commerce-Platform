"use client"
import { useEffect, useState } from "react"
import { getAdminProducts, getAdminCategories, createProduct, updateProduct, deleteProduct, getAdminVariants, createAdminVariant, deleteAdminVariant, updateAdminVariant } from "@/lib/api"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { Plus, Edit, Trash2, X, Search, Layers } from "lucide-react"
import { Product, Category, Variant } from "@/types"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("")

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Product Form State
  const [formData, setFormData] = useState({
    name: "", slug: "", category: "", price: "", description: "", is_active: true, image: null as File | null
  })

  // Variants Modal State
  const [variantsModalOpen, setVariantsModalOpen] = useState(false)
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<Product | null>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [isVariantsLoading, setIsVariantsLoading] = useState(false)
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null)
  const [variantFormData, setVariantFormData] = useState({ color: "", size: "", stock: "0", image: null as File | null })
  const [isVariantSaving, setIsVariantSaving] = useState(false)

  useEffect(() => {
    getAdminCategories().then(data => setCategories(data)).catch(() => {})
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [search, categoryId])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getAdminProducts(search, categoryId)
      setProducts(data?.results || data || [])
    } catch (err) {
      // handled via UI
    } finally {
      setLoading(false)
    }
  }

  // --- Product Handlers ---
  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        slug: product.slug,
        category: String(product.category || ""),
        price: String(product.price || ""),
        description: product.description,
        is_active: product.is_active,
        image: null
      })
    } else {
      setEditingProduct(null)
      setFormData({ name: "", slug: "", category: "", price: "", description: "", is_active: true, image: null })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    const data = new FormData()
    data.append("name", formData.name)
    data.append("slug", formData.slug)
    data.append("category", formData.category)
    data.append("price", formData.price)
    data.append("description", formData.description)
    data.append("is_active", formData.is_active.toString())
    if (formData.image) data.append("image", formData.image)

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data)
      } else {
        await createProduct(data)
      }
      setIsModalOpen(false)
      fetchProducts()
    } catch (err) {
      alert("Error saving product")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id)
        fetchProducts()
      } catch (err) {
        alert("Failed to delete product.")
      }
    }
  }

  // --- Variants Handlers ---
  const handleOpenVariants = async (product: Product) => {
    setSelectedProductForVariants(product)
    setVariantsModalOpen(true)
    setEditingVariant(null)
    setVariantFormData({ color: "", size: "", stock: "0", image: null })
    fetchVariants(product.id)
  }

  const fetchVariants = async (productId: number) => {
    setIsVariantsLoading(true)
    try {
      const data = await getAdminVariants(productId)
      setVariants(data?.results || data || [])
    } catch (err) {
      // handled via UI
    } finally {
      setIsVariantsLoading(false)
    }
  }

  const handleVariantSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductForVariants) return
    setIsVariantSaving(true)
    
    const data = new FormData()
    data.append("product", String(selectedProductForVariants.id))
    data.append("color", variantFormData.color)
    data.append("size", variantFormData.size)
    data.append("stock", variantFormData.stock)
    if (variantFormData.image) data.append("image", variantFormData.image)

    try {
      if (editingVariant) {
        await updateAdminVariant(editingVariant.id, data)
      } else {
        await createAdminVariant(data)
      }
      setEditingVariant(null)
      setVariantFormData({ color: "", size: "", stock: "0", image: null })
      fetchVariants(selectedProductForVariants.id)
      fetchProducts() // Refresh total stock in main table
    } catch (err) {
      alert("Error saving variant")
    } finally {
      setIsVariantSaving(false)
    }
  }

  const handleEditVariant = (variant: Variant) => {
    setEditingVariant(variant)
    setVariantFormData({ color: variant.color, size: variant.size, stock: variant.stock.toString(), image: null })
  }

  const handleVariantDelete = async (id: number) => {
    if (!selectedProductForVariants) return
    if (confirm("Delete this variant?")) {
      try {
        await deleteAdminVariant(id)
        fetchVariants(selectedProductForVariants.id)
      } catch (err) {
        alert("Failed to delete variant.")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-neutral-900">Products</h1>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <Input 
            placeholder="Search products..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="border rounded-md px-4 py-2 bg-white"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-neutral-600">Product</th>
                <th className="px-6 py-4 font-semibold text-neutral-600">Category</th>
                <th className="px-6 py-4 font-semibold text-neutral-600">Price</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 text-center">Total Stock</th>
                <th className="px-6 py-4 font-semibold text-neutral-600">Status</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-500">No products found.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      {product.image ? (
                        <img src={product.image} className="w-10 h-10 rounded-lg object-cover bg-neutral-100" alt={product.name} />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">N/A</div>
                      )}
                      <span className="font-medium text-neutral-900">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{product.category_name}</td>
                    <td className="px-6 py-4 font-medium text-neutral-900">${Number(product.price || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-center font-medium text-neutral-600">{product.total_stock}</td>
                    <td className="px-6 py-4">
                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                        {product.is_active ? 'Active' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenVariants(product)} className="p-2 text-neutral-400 hover:text-purple-600 rounded bg-white border shadow-sm" title="Manage Variants">
                          <Layers size={16} />
                        </button>
                        <button onClick={() => handleOpenModal(product)} className="p-2 text-neutral-400 hover:text-blue-600 rounded bg-white border shadow-sm" title="Edit Product">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-neutral-400 hover:text-red-600 rounded bg-white border shadow-sm" title="Delete Product">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Main Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-900"><X size={20} /></button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Name</label>
                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Slug</label>
                    <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <select 
                      className="border rounded-md px-3 py-2 w-full bg-white text-sm"
                      value={formData.category} 
                      onChange={e => setFormData({ ...formData, category: e.target.value })} 
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Price</label>
                    <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <textarea 
                    className="border rounded-md p-2 w-full text-sm min-h-[100px]"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Main Image</label>
                  <Input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image: e.target.files?.[0] || null })} required={!editingProduct} />
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                  <label htmlFor="is_active" className="text-sm font-medium">Active (Visible to customers)</label>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Product"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Variants Modal */}
      {variantsModalOpen && selectedProductForVariants && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b shrink-0 bg-white">
              <div>
                <h2 className="text-xl font-bold">Manage Variants</h2>
                <p className="text-sm text-neutral-500">{selectedProductForVariants.name}</p>
              </div>
              <button onClick={() => setVariantsModalOpen(false)} className="text-neutral-400 hover:text-neutral-900"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto grow space-y-8 bg-neutral-50">
              
              {/* Existing Variants Table */}
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium">Image</th>
                      <th className="px-4 py-3 font-medium">Color</th>
                      <th className="px-4 py-3 font-medium">Size</th>
                      <th className="px-4 py-3 font-medium">Stock</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {isVariantsLoading ? (
                      <tr><td colSpan={5} className="px-4 py-6 text-center text-neutral-500">Loading variants...</td></tr>
                    ) : variants.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-6 text-center text-neutral-500">No variants found.</td></tr>
                    ) : (
                      variants.map(v => (
                        <tr key={v.id}>
                          <td className="px-4 py-3">
                            {v.image ? (
                              <img src={v.image} className="w-10 h-10 rounded object-cover border" alt={v.color} />
                            ) : (
                              <div className="w-10 h-10 bg-neutral-100 rounded border flex items-center justify-center text-xs text-neutral-400">N/A</div>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium">{v.color}</td>
                          <td className="px-4 py-3">{v.size}</td>
                          <td className="px-4 py-3">{v.stock}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEditVariant(v)} className="p-1.5 text-neutral-400 hover:text-blue-600 rounded bg-white border shadow-sm">
                                <Edit size={14} />
                              </button>
                              <button onClick={() => handleVariantDelete(v.id)} className="p-1.5 text-neutral-400 hover:text-red-600 rounded bg-white border shadow-sm">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add/Edit Variant Form */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-sm font-bold text-neutral-900 border-b pb-3 mb-5">
                  {editingVariant ? "Edit Variant" : "Add New Variant"}
                </h3>
                <form onSubmit={handleVariantSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Color</label>
                      <Input placeholder="e.g. Navy Blue" value={variantFormData.color} onChange={e => setVariantFormData({ ...variantFormData, color: e.target.value })} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Size</label>
                      <Input placeholder="e.g. M" value={variantFormData.size} onChange={e => setVariantFormData({ ...variantFormData, size: e.target.value })} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Stock</label>
                      <Input type="number" min="0" value={variantFormData.stock} onChange={e => setVariantFormData({ ...variantFormData, stock: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Variant Image (Optional)</label>
                    <Input type="file" accept="image/*" onChange={e => setVariantFormData({ ...variantFormData, image: e.target.files?.[0] || null })} />
                  </div>
                  <div className="flex justify-end pt-2 gap-2">
                    <Button type="submit" className="bg-neutral-900 hover:bg-neutral-800" disabled={isVariantSaving}>
                        {isVariantSaving ? "Saving..." : editingVariant ? "Save Variant" : "Add Variant"}
                      </Button>
                      {editingVariant && (
                        <Button type="button" variant="outline" onClick={() => { setEditingVariant(null); setVariantFormData({ color: "", size: "", stock: "0", image: null }) }}>
                          Cancel Edit
                        </Button>
                      )}
                    </div>
                </form>
              </div>

            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
