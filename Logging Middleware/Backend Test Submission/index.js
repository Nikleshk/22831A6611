const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const links = {}; // In-memory DB for demo

app.post('/api/shorten', (req, res) => {
    const { url, slug, expiresIn } = req.body;
    const shortSlug = slug || Math.random().toString(36).substring(2, 8);

    const expirationDate = getExpirationDate(expiresIn);
    links[shortSlug] = { url, expirationDate };

    res.json({
        slug: shortSlug,
        originalUrl: url,
        expiration: expirationDate
    });
});

app.get('/:slug', (req, res) => {
    const link = links[req.params.slug];
    if (link) {
        res.redirect(link.url);
    } else {
        res.status(404).send('Short URL not found');
    }
});

function getExpirationDate(exp) {
    if (exp === 'never') return 'Never';
    const days = parseInt(exp.replace('d', ''));
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
