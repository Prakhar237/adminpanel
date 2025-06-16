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
        const { data: urls, error } = await supabase
            .from('youtube_urls')
            .select(`
                *,
                user:user_id (
                    email,
                    raw_user_meta_data
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        // Transform the data to ensure we have the email
        const transformedUrls = await Promise.all(urls.map(async (url) => {
            if (!url.user?.email) {
                // If email is not in the joined data, fetch it directly from auth.users
                const { data: userData, error: userError } = await supabase
                    .from('auth.users')
                    .select('email, raw_user_meta_data')
                    .eq('id', url.user_id)
                    .single();

                if (!userError && userData) {
                    url.user = {
                        email: userData.email,
                        raw_user_meta_data: userData.raw_user_meta_data
                    };
                }
            }
            return url;
        }));

        res.json(transformedUrls);
    } catch (error) {
        console.error('Error fetching YouTube URLs:', error);
        res.status(500).json({ error: 'Failed to fetch YouTube URLs' });
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