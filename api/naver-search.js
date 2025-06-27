export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { keyword } = req.body;
  const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
  const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

  if (!keyword) {
    return res.status(400).json({ error: '검색어(keyword) 파라미터가 필요합니다.' });
  }

  const apiUrl = 'https://openapi.naver.com/v1/datalab/search';
  const today = new Date();
  const endDate = today.toISOString().slice(0, 10);
  const startDate = new Date(today.setFullYear(today.getFullYear() - 1)).toISOString().slice(0, 10); // 1년 전부터

  const body = {
    startDate,
    endDate,
    timeUnit: 'month',
    keywordGroups: [
      {
        groupName: keyword,
        keywords: [keyword]
      }
    ],
    device: '',
    ages: [],
    gender: ''
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: '네이버 데이터랩 API 요청 실패', details: err.message });
  }
} 