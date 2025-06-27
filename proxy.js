const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

const CLIENT_ID = 'L2TR6oM5srkXUX20MNpz';
const CLIENT_SECRET = '2jw33LqmYA';

app.get('/naver-search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: '검색어(query) 파라미터가 필요합니다.' });
  }
  const apiUrl = `https://openapi.naver.com/v1/search/blog?query=${encodeURIComponent(query)}&display=10&start=1&sort=date`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '네이버 API 요청 실패', details: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`프록시 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
}); 