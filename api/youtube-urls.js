const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
    'https://hlxmcnykwjdbpxxyosoc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseG1jbnlrd2pkYnB4eHlvc29jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODg4MDgyNSwiZXhwIjoyMDY0NDU2ODI1fQ.RGe-KTVUK2F71Uv9EpIl2Nmlj_mJEEmxHN091Fs0a-c'
);

module.exports = async (req, res) => {
    console.log('YouTube URLs API called:', req.method, req.url);
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS request');
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            console.log('Fetching YouTube URLs from Supabase...');
            
            // Get all YouTube URLs
            const { data: urls, error } = await supabase
                .from('youtube_urls')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
                return res.status(500).json({ 
                    error: 'Failed to fetch YouTube URLs',
                    details: error.message
                });
            }

            if (!urls) {
                console.log('No URLs found');
                return res.json([]);
            }

            console.log(`Found ${urls.length} URLs`);
            res.json(urls);
        } catch (error) {
            console.error('Unexpected error fetching YouTube URLs:', error);
            res.status(500).json({ 
                error: 'Failed to fetch YouTube URLs',
                details: error.message
            });
        }
    } else if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const { status } = req.body;

            console.log('Updating URL status:', { id, status });

            if (!id) {
                return res.status(400).json({ error: 'URL ID is required' });
            }

            const { data, error } = await supabase
                .from('youtube_urls')
                .update({ status })
                .eq('id', id)
                .select();

            if (error) {
                console.error('Supabase error:', error);
                return res.status(500).json({ 
                    error: 'Failed to update YouTube URL status',
                    details: error.message
                });
            }

            console.log('URL status updated successfully:', data[0]);
            res.json(data[0]);
        } catch (error) {
            console.error('Error updating YouTube URL status:', error);
            res.status(500).json({ error: 'Failed to update YouTube URL status' });
        }
    } else {
        console.log('Method not allowed:', req.method);
        res.status(405).json({ error: 'Method not allowed' });
    }
}; 