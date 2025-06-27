export default async function handler(req, res) {
  const query = req.query.query;
  const CLIENT_ID = process.env.NAVER_CLIENT_ID;
  const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

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
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: '네이버 API 요청 실패', details: err.message });
  }
} 