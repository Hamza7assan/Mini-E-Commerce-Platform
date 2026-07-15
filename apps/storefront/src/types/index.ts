export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Variant {
  id: number;
  product: number;
  color: string;
  size: string;
  stock: number;
  image: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  category: number;
  category_name?: string;
  is_active: boolean;
  image: string | null;
  variants?: Variant[];
  total_stock?: number;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: number;
  product_name?: string;
  variant_details?: string;
  unit_price?: string | number;
  line_total?: string | number;
  variant_id: number;
  quantity: number;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: string | number;
  created_at: string;
  items?: OrderItem[];
}

export interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_revenue: number;
}
