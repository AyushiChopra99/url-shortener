const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = 'http://localhost:5000';

// 1. Create short URL
app.post('/shorten', async (req, res) => {
  const { original_url } = req.body;

  if (!original_url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Add https:// if missing
  let url = original_url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  try {
    const code = nanoid(6); // e.g. "aB3xY9"

    await db.query(
      'INSERT INTO urls (original_url, short_code) VALUES (?, ?)',
      [url, code]
    );

    res.json({
      short_url: `${BASE_URL}/${code}`,
      short_code: code,
      original_url: url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 2. Get all URLs (for history page)
app.get('/urls', async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM urls ORDER BY created_at DESC'
  );
  res.json(rows);
});

// 3. Redirect short code → original URL
app.get('/:code', async (req, res) => {
  const { code } = req.params;

  const [rows] = await db.query(
    'SELECT * FROM urls WHERE short_code = ?',
    [code]
  );

  if (rows.length === 0) {
    return res.status(404).send('Short URL not found');
  }

  // Increment click count
  await db.query(
    'UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?',
    [code]
  );

  res.redirect(rows[0].original_url);
});

app.listen(5000, () => {
  console.log('✅ Backend running on http://localhost:5000');
});
