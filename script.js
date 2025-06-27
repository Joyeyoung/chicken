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

function displayResults(data, keyword) {
  if (!data.items || !Array.isArray(data.items)) {
    resultsContainer.innerHTML = `<div class="loading">검색 결과가 없습니다.</div>`;
    return;
  }
  resultsTitle.textContent = `"${keyword}" 검색 결과`;
  resultsContainer.innerHTML = data.items.map(item => `
    <div class="result-item">
      <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title.replace(/<[^>]*>/g, '')}</a></h3>
      <div class="desc">${item.description.replace(/<[^>]*>/g, '')}</div>
      <div class="meta">${item.bloggername} | ${item.postdate}</div>
    </div>
  `).join('');
}

async function searchByKeyword(keyword) {
  showLoading(true);
  showResults(true);
  resultsTitle.textContent = `"${keyword}" 검색 결과`;
  try {
    const res = await fetch(`/api/naver-search?query=${encodeURIComponent(keyword)}&display=10&start=1`);
    const data = await res.json();
    displayResults(data, keyword);
  } catch (e) {
    resultsContainer.innerHTML = `<div class="loading">검색 중 오류가 발생했습니다.</div>`;
  } finally {
    showLoading(false);
  }
}

document.querySelectorAll('.keyword-card').forEach(card => {
  card.addEventListener('click', () => {
    const keyword = card.dataset.keyword;
    searchByKeyword(keyword);
  });
}); 