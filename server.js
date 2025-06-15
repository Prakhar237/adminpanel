const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store URLs in memory (in production, use a database)
let pendingUrls = [];

// Endpoint to receive URL from Unreal Engine
app.post('/api/url', (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const urlRequest = {
        id: Date.now(),
        url,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    pendingUrls.push(urlRequest);
    res.status(201).json(urlRequest);
});

// Endpoint to get all pending URLs
app.get('/api/urls', (req, res) => {
    res.json(pendingUrls);
});

// Endpoint to update URL status
app.put('/api/urls/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const urlIndex = pendingUrls.findIndex(u => u.id === parseInt(id));
    if (urlIndex === -1) {
        return res.status(404).json({ error: 'URL not found' });
    }

    pendingUrls[urlIndex].status = status;
    res.json(pendingUrls[urlIndex]);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 