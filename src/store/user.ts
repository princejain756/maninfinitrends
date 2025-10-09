import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // 10-digit, India only
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
};

type UserStore = {
  profile: UserProfile | null;
  isLoggedIn: boolean;
  createAccount: (profile: UserProfile) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: null,
      isLoggedIn: false,
      createAccount: (profile) => set({ profile, isLoggedIn: true }),
      logout: () => set({ profile: null, isLoggedIn: false }),
    }),
    { name: 'maninfini-user' }
  )
);

