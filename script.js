const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsTitle = document.getElementById('resultsTitle');
const loading = document.getElementById('loading');
const resultsContainer = document.getElementById('resultsContainer');

function showLoading(show) {
  loading.style.display = show ? 'block' : 'none';
}

function showResults(show) {
  resultsSection.style.display = show ? 'block' : 'none';
}

function displayResults(data) {
  if (!data.items || !Array.isArray(data.items)) {
    resultsContainer.innerHTML = `<div class="loading">검색 결과가 없습니다.</div>`;
    return;
  }
  resultsContainer.innerHTML = data.items.map(item => `
    <div class="result-item">
      <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title.replace(/<[^>]*>/g, '')}</a></h3>
      <div class="desc">${item.description.replace(/<[^>]*>/g, '')}</div>
      <div class="meta">${item.bloggername} | ${item.postdate}</div>
    </div>
  `).join('');
}

async function searchBlog() {
  const query = searchInput.value.trim();
  if (!query) {
    alert('검색어를 입력하세요!');
    return;
  }
  showLoading(true);
  showResults(true);
  resultsTitle.textContent = `"${query}" 검색 결과`;
  try {
    const res = await fetch(`/api/naver-search?query=${encodeURIComponent(query)}&display=10&start=1`);
    const data = await res.json();
    displayResults(data);
  } catch (e) {
    resultsContainer.innerHTML = `<div class="loading">검색 중 오류가 발생했습니다.</div>`;
  } finally {
    showLoading(false);
  }
}

searchBtn.addEventListener('click', searchBlog);
searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') searchBlog();
}); 