export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  isPaid: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface FileRecord {
  id: string;
  title: string;
  description?: string;
  isPaidContent: boolean;
  createdAt: string;
}

export interface SignedUrlResponse {
  url: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface CheckoutResponse {
  url: string;
}

export interface PaginatedUsers {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
