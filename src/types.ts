/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveView = 'home' | 'lifesteal' | 'survival' | 'support' | 'admin';

export type ProductTab = 'ranks' | 'keys' | 'coins' | 'tags' | 'crates';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  desc?: string;
  features?: string[];
  iconType: 'shield' | 'sword' | 'key' | 'coins' | 'tag' | 'chest' | 'gem';
  tab: ProductTab;
  isPopular?: boolean;
  command?: string;
  category: 'lifesteal' | 'survival';
  commands?: string[];
  permissions?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  username: string;
  avatarUrl: string;
  loggedInAt: string;
}

export interface SupportTicket {
  name: string;
  email: string;
  discordId: string;
  transactionId?: string;
  message: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  active: boolean;
}

export interface EmailDeliveryLog {
  type: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  timestamp: string;
}

export interface PurchaseHistory {
  id: string;
  username: string;
  email: string;
  utrNumber: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  items: string[];
  screenshotBase64?: string;
  rejectionReason?: string;
  emailDeliveryLogs?: EmailDeliveryLog[];
}

