import { create } from 'zustand';
import { 
  telecomLines, 
  usageHistory, 
  costBreakdown, 
  monthlyBills, 
  usageAlerts, 
  quickStats, 
  promotionalBanners 
} from '@/constants/MockData';

interface DashboardState {
  telecomLines: typeof telecomLines;
  usageHistory: typeof usageHistory;
  costBreakdown: typeof costBreakdown;
  monthlyBills: typeof monthlyBills;
  usageAlerts: typeof usageAlerts;
  quickStats: typeof quickStats;
  promotionalBanners: typeof promotionalBanners;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  payBill: (month: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  telecomLines,
  usageHistory,
  costBreakdown,
  monthlyBills,
  usageAlerts,
  quickStats,
  promotionalBanners,
  isLoading: false,
  error: null,
  
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a successful data fetch with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({
        telecomLines,
        usageHistory,
        costBreakdown,
        monthlyBills,
        usageAlerts,
        quickStats,
        promotionalBanners,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to fetch dashboard data',
        isLoading: false,
      });
    }
  },
  
  payBill: async (month) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set(state => ({
        monthlyBills: state.monthlyBills.map(bill => 
          bill.month === month ? { ...bill, status: 'paid' } : bill
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: 'Failed to process payment',
        isLoading: false,
      });
    }
  },
}));
