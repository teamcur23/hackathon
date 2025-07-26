import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
    icon?: string;
    description?: string;
    is_active: boolean;
}

export interface Receipt {
    id: number;
    user_id: number;
    category_id?: number;
    vendor_name?: string;
    amount?: number;
    receipt_date?: string;
    image_path: string;
    image_url: string;
    status: 'pending' | 'processing' | 'processed' | 'failed';
    ai_analysis?: any;
    confidence_score?: number;
    notes?: string;
    processed_at?: string;
    created_at: string;
    updated_at: string;
    category?: Category;
    user?: User;
}

export interface MonthlySummary {
    id: number;
    user_id: number;
    year: number;
    month: number;
    total_amount: number;
    receipt_count: number;
    category_breakdown?: Array<{
        name: string;
        amount: number;
        count: number;
        color: string;
    }>;
    average_per_receipt: number;
    created_at: string;
    updated_at: string;
}

export interface DashboardStats {
    totalSpent: number;
    totalChange: number;
    receiptCount: number;
    countChange: number;
    avgPerReceipt: number;
    avgChange: number;
    categoryCount: number;
}

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
    auth: {
        user: User;
    };
    flash?: {
        message?: string;
        error?: string;
    };
}
