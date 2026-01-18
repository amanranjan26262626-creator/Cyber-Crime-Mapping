import { createClient } from '@supabase/supabase-js';

// Using a publicly accessible demo Supabase instance for this prototype
// Note: In a real deployment, these would be secure env variables
const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseKey = 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const createUser = async (email, role) => {
    // This is where real authentication logic happens
    // For now, we simulate a real backend response since we don't have a live DB connection string
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Math.random().toString(36).substr(2, 9),
                email: email,
                role: role,
                status: 'Invite Sent',
                created_at: new Date().toISOString()
            });
        }, 800);
    });
};
