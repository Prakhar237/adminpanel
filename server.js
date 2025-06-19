const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = require('./config');

const app = express();
const port = 3000;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to get users
app.get('/api/users', async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('auth.users')
            .select('*');

        if (error) throw error;
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Endpoint to get YouTube URLs
app.get('/api/youtube-urls', async (req, res) => {
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
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Endpoint to update YouTube URL status
app.put('/api/youtube-urls/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('youtube_urls')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        console.error('Error updating YouTube URL status:', error);
        res.status(500).json({ error: 'Failed to update YouTube URL status' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 