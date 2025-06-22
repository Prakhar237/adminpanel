const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
    'https://hlxmcnykwjdbpxxyosoc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseG1jbnlrd2pkYnB4eHlvc29jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg4MDgyNSwiZXhwIjoyMDY0NDU2ODI1fQ.RGe-KTVUK2F71Uv9EpIl2Nmlj_mJEEmxHN091Fs0a-c',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            console.log('Fetching YouTube URLs from Supabase...');
            
            // First, get all YouTube URLs without the join
            const { data: urls, error } = await supabase
                .from('youtube_urls')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
                return res.status(500).json({ 
                    error: 'Failed to fetch YouTube URLs',
                    details: error.message,
                    hint: error.hint || 'Check if the youtube_urls table exists in your Supabase database'
                });
            }

            if (!urls) {
                console.log('No URLs found');
                return res.json([]);
            }

            console.log(`Found ${urls.length} URLs, fetching user data...`);
            
            // Fetch user data for each URL separately
            const transformedUrls = await Promise.all(urls.map(async (url) => {
                try {
                    // Try to get user data from auth.users table
                    const { data: userData, error: userError } = await supabase
                        .from('auth.users')
                        .select('email, raw_user_meta_data')
                        .eq('id', url.user_id)
                        .single();

                    if (userError) {
                        console.log(`Could not fetch user data for user_id: ${url.user_id}`, userError.message);
                        // If we can't get user data, just return the URL with basic info
                        return {
                            ...url,
                            user: {
                                email: `User ${url.user_id}`,
                                raw_user_meta_data: { country: 'Unknown' }
                            }
                        };
                    }

                    return {
                        ...url,
                        user: {
                            email: userData.email || `User ${url.user_id}`,
                            raw_user_meta_data: userData.raw_user_meta_data || { country: 'Unknown' }
                        }
                    };
                } catch (userError) {
                    console.error('Error fetching user data for URL:', url.id, userError);
                    return {
                        ...url,
                        user: {
                            email: `User ${url.user_id}`,
                            raw_user_meta_data: { country: 'Unknown' }
                        }
                    };
                }
            }));

            console.log('Successfully transformed URLs data');
            res.json(transformedUrls);
        } catch (error) {
            console.error('Unexpected error fetching YouTube URLs:', error);
            res.status(500).json({ 
                error: 'Failed to fetch YouTube URLs',
                details: error.message
            });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}; 