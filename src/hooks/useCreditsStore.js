import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export const useCreditsStore = create((set) => ({
    credits: null,
    loading: false,
    error: null,

    fetchCredits: async (userId) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('credit_accounts')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    set({ credits: null, loading: false });
                    return;
                }
                throw error;
            }
            set({ credits: data, loading: false });
        } catch (err) {
            console.error('Error fetching credits:', err);
            set({ error: err.message, loading: false });
        }
    },

    resetCredits: () => set({ credits: null, loading: false, error: null }),
}));
