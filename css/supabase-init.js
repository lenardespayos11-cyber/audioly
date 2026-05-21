// css/supabase-init.js
const SUPABASE_URL = "https://fjbikbgrayivnotwcfkx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zqdVgvh9w9m6yef9g7jFWA_LDJ5y_yb";

if (typeof supabase === 'undefined') {
    document.write('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
}

let supabaseClient = null;
function getSupabase() {
    if (!supabaseClient) {
        if (typeof supabase === 'undefined') return null;
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseClient;
}

// Session state interceptor
async function checkUserSession() {
    const client = getSupabase();
    if (!client) return null;
    const { data: { session } } = await client.auth.getSession();
    if (!session && !window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
        window.location.href = 'index.html';
    }
    return session?.user || null;
}

// Active Profile State Synchronization Tools
function getActiveProfileId() {
    return localStorage.getItem('audioly_active_profile_id');
}

function setActiveProfileId(id) {
    localStorage.setItem('audioly_active_profile_id', id);
}

function clearActiveProfile() {
    localStorage.removeItem('audioly_active_profile_id');
}

// Add this helper function at the bottom of your css/supabase-init.js file
async function ensureDefaultProfileExists(userId) {
    const sb = getSupabase();
    if (!sb) return;

    // Check if the user already has at least one profile context layer
    const { data: profiles } = await sb.from('user_profiles').select('id').eq('account_id', userId);
    
    // If no profile exists yet, create a default one automatically so selection doesn't freeze
    if (!profiles || profiles.length === 0) {
        await sb.from('user_profiles').insert([
            { 
                account_id: userId, 
                profile_name: "Main Listener", 
                avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Main" 
            }
        ]);
    }
}