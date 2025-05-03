import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  accountNumber: string;
  plan: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would be an API call
          // For now, we'll simulate a successful login with mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const user: User = {
            id: '1',
            name: 'John Smith',
            email: email,
            company: 'Smith Enterprises Ltd.',
            phone: '+355 69 123 4567',
            address: 'Rruga Myslym Shyri, Tirana, Albania',
            accountNumber: 'ONE-12345-B',
            plan: 'Business Premium',
          };
          
          const token = 'mock-jwt-token';
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: 'Invalid email or password',
            isLoading: false,
          });
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'one-albania-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
