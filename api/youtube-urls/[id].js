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

    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const { status } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'URL ID is required' });
            }

            if (!status) {
                return res.status(400).json({ error: 'Status is required' });
            }

            const { data, error } = await supabase
                .from('youtube_urls')
                .update({ status })
                .eq('id', id)
                .select();

            if (error) {
                console.error('Error updating YouTube URL status:', error);
                return res.status(500).json({ error: 'Failed to update YouTube URL status' });
            }

            res.json(data[0]);
        } catch (error) {
            console.error('Unexpected error updating YouTube URL status:', error);
            res.status(500).json({ 
                error: 'Failed to update YouTube URL status',
                details: error.message
            });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}; 