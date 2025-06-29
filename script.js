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

async function searchByRegion(region) {
  const sort = document.getElementById('sortSelect').value;
  const keyword = region + ' 치킨맛집';
  showLoading(true);
  showResults(true);
  resultsTitle.textContent = `"${keyword}" 검색 결과`;
  try {
    const res = await fetch(`/api/naver-search?query=${encodeURIComponent(keyword)}&display=10&start=1&sort=${sort}`);
    const data = await res.json();
    displayResults(data, keyword);
  } catch (e) {
    resultsContainer.innerHTML = `<div class="loading">검색 중 오류가 발생했습니다.</div>`;
  } finally {
    showLoading(false);
  }
}

document.getElementById('regionSearchBtn').addEventListener('click', () => {
  const region = document.getElementById('regionSelect').value;
  if (!region) {
    alert('지역을 선택하세요!');
    return;
  }
  searchByRegion(region);
}); 