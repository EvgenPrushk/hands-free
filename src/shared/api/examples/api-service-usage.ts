// Example usage of ApiService for Medusa commerce API calls

import { apiService, type RequestConfig } from '../ApiService';

// Example interfaces for Medusa entities
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
}

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Cart {
  id: string;
  customer_id?: string;
  items: CartItem[];
  total: number;
}

interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
}

// Example API service methods
export class MedusaApiService {
  // Get all products
  static async getProducts(limit = 20, offset = 0): Promise<Product[]> {
    const config: RequestConfig = {
      url: '/store/products',
      requestConfig: {
        params: { limit, offset }
      }
    };

    const response = await apiService.get<{ products: Product[] }>(config);
    return response.data.products;
  }

  // Get product by ID
  static async getProduct(id: string): Promise<Product> {
    const config: RequestConfig = {
      url: `/store/products/${id}`
    };

    const response = await apiService.get<{ product: Product }>(config);
    return response.data.product;
  }

  // Create customer
  static async createCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer> {
    const config: RequestConfig = {
      url: '/store/customers',
      requestConfig: {
        data: customerData
      }
    };

    const response = await apiService.post<{ customer: Customer }>(config);
    return response.data.customer;
  }

  // Create cart
  static async createCart(): Promise<Cart> {
    const config: RequestConfig = {
      url: '/store/carts'
    };

    const response = await apiService.post<{ cart: Cart }>(config);
    return response.data.cart;
  }

  // Add item to cart
  static async addToCart(cartId: string, variantId: string, quantity: number): Promise<Cart> {
    const config: RequestConfig = {
      url: `/store/carts/${cartId}/line-items`,
      requestConfig: {
        data: {
          variant_id: variantId,
          quantity
        }
      }
    };

    const response = await apiService.post<{ cart: Cart }>(config);
    return response.data.cart;
  }

  // Update cart item
  static async updateCartItem(cartId: string, itemId: string, quantity: number): Promise<Cart> {
    const config: RequestConfig = {
      url: `/store/carts/${cartId}/line-items/${itemId}`,
      requestConfig: {
        data: { quantity }
      }
    };

    const response = await apiService.patch<{ cart: Cart }>(config);
    return response.data.cart;
  }

  // Remove item from cart
  static async removeFromCart(cartId: string, itemId: string): Promise<Cart> {
    const config: RequestConfig = {
      url: `/store/carts/${cartId}/line-items/${itemId}`
    };

    const response = await apiService.delete<{ cart: Cart }>(config);
    return response.data.cart;
  }
}

// Example usage in a component or hook:
/*
// In a React hook or component:
import { MedusaApiService } from '@/shared/api/examples/api-service-usage';

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    try {
      const products = await MedusaApiService.getProducts();
      setProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return { products, loadProducts };
};
*/