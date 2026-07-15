export interface User {
  id: string;
  name?: string;
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

export type PaymentMethod =
  | 'BANK_TRANSFER'
  | 'INSTAPAY'
  | 'VODAFONE_CASH'
  | 'ORANGE_CASH'
  | 'ETISALAT_CASH';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PaymentMethodSettingRecord {
  method: PaymentMethod;
  displayName: string;
  accountName?: string;
  accountNumber?: string;
  instructions?: string;
  isActive: boolean;
}

export type PaymentMethodSettingUpdate = {
  displayName?: string;
  accountName?: string | null;
  accountNumber?: string | null;
  instructions?: string | null;
  isActive?: boolean;
};

export interface PaymentRequestRecord {
  id: string;
  userId: string;
  userEmail?: string;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

export interface SubmitPaymentRequestResponse {
  id: string;
  status: PaymentStatus;
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
