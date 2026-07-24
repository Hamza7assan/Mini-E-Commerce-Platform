const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

export async function getProducts(categorySlug?: string, q?: string, sort?: string) {
  const url = new URL(`${API_BASE_URL}/products/`)
  if (categorySlug) {
    url.searchParams.append('category__slug', categorySlug)
  }
  if (q) {
    url.searchParams.append('search', q)
  }
  if (sort) {
    url.searchParams.append('ordering', sort)
  }
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function getProductBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/products/${slug}/`, { next: { revalidate: 60 } })
  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error('Failed to fetch product')
  }
  return res.json()
}

export async function getCategories() {
  const res = await fetch(`${API_BASE_URL}/categories/`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export async function createOrder(data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_URL}/orders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData ? JSON.stringify(errorData) : 'Failed to create order')
  }
  
  return res.json()
}


// --- Admin API Wrappers ---
export async function authFetch(endpoint: string, options: RequestInit = {}) {
  const { useAuthStore } = await import("@/store/useAuthStore")
  const token = useAuthStore.getState().accessToken

  const headers = new Headers(options.headers || {})
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    cache: 'no-store' // Fixes admin panel caching issues
  }

  let res = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions)

  if (res.status === 401 && useAuthStore.getState().refreshToken) {
    // Attempt refresh
    const refreshRes = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: useAuthStore.getState().refreshToken })
    })

    if (refreshRes.ok) {
      const data = await refreshRes.json()
      useAuthStore.getState().setAccessToken(data.access)
      fetchOptions.headers = new Headers(fetchOptions.headers)
      fetchOptions.headers.set('Authorization', `Bearer ${data.access}`)
      res = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions)
    } else {
      useAuthStore.getState().logout()
      throw new Error('Session expired')
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData ? JSON.stringify(errorData) : 'API Error')
  }

  // Not all endpoints return JSON (e.g., 204 No Content)
  if (res.status !== 204) {
      return res.json()
  }
  return null
}

export async function loginAdmin(credentials: Record<string, string>) {
  const res = await fetch(`${API_BASE_URL}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  if (!res.ok) throw new Error('Invalid credentials')
  return res.json()
}

export async function getAdminOrders(status?: string) {
  let endpoint = '/admin/orders/'
  if (status) {
    endpoint += `?status=${status}`
  }
  return authFetch(endpoint)
}

export async function updateOrderStatus(orderId: string | number, status: string) {
  return authFetch(`/admin/orders/${orderId}/update_status/`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

export async function getAdminProducts(search?: string, categoryId?: string) {
  let endpoint = '/admin/products/'
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (categoryId) params.append('category', categoryId)
  
  if (params.toString()) {
    endpoint += `?${params.toString()}`
  }
  return authFetch(endpoint)
}

export async function createProduct(data: FormData) {
  return authFetch('/admin/products/', {
    method: 'POST',
    body: data, // FormData handles its own Content-Type
    headers: {} // Need to omit Content-Type for FormData
  })
}

export async function updateProduct(id: string | number, data: FormData) {
  return authFetch(`/admin/products/${id}/`, {
    method: 'PATCH',
    body: data,
    headers: {}
  })
}

export async function deleteProduct(id: string | number) {
  return authFetch(`/admin/products/${id}/`, {
    method: 'DELETE'
  })
}

export async function getAdminCategories() {
  return authFetch("/admin/categories/")
}

export async function createCategory(data: FormData) {
  return authFetch('/admin/categories/', {
    method: 'POST',
    body: data,
    headers: {}
  })
}

export async function updateCategory(id: string | number, data: FormData) {
  return authFetch(`/admin/categories/${id}/`, {
    method: 'PATCH',
    body: data,
    headers: {}
  })
}

export async function deleteCategory(id: string | number) {
  return authFetch(`/admin/categories/${id}/`, {
    method: 'DELETE'
  })
}

export async function getDashboardStats() {
  return authFetch("/admin/dashboard-stats/")
}

export async function getAdminVariants(productId: string | number) {
  return authFetch(`/admin/variants/?product=${productId}`)
}

export async function createAdminVariant(data: FormData) {
  return authFetch('/admin/variants/', {
    method: 'POST',
    body: data,
    headers: {}
  })
}

export async function updateAdminVariant(id: string | number, data: FormData) {
  return authFetch(`/admin/variants/${id}/`, {
    method: 'PATCH',
    body: data,
    headers: {}
  })
}

export async function deleteAdminVariant(id: string | number) {
  return authFetch(`/admin/variants/${id}/`, {
    method: 'DELETE'
  })
}

