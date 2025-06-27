// Chart.js CDN 동적 로드
function loadChartJs(callback) {
    if (window.Chart) return callback();
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = callback;
    document.head.appendChild(script);
}

// DOM 요소들
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const quickBtns = document.querySelectorAll('.quick-btn');
const resultsSection = document.getElementById('resultsSection');
const resultsTitle = document.getElementById('resultsTitle');
const resultsCount = document.getElementById('resultsCount');
const loading = document.getElementById('loading');
const resultsContainer = document.getElementById('resultsContainer');
const trendCards = document.querySelectorAll('.trend-card');

let chartInstance = null;

async function searchChicken(query) {
    if (!query.trim()) {
        alert('검색어를 입력해주세요.');
        return;
    }

    showLoading(true);
    resultsSection.style.display = 'block';
    resultsTitle.textContent = `"${query}" 검색 결과`;

    try {
        const response = await fetch(`/api/naver-search?query=${encodeURIComponent(query)}&display=10&start=1`);
        const data = await response.json();
        displaySearchResults(data, query);
    } catch (error) {
        showError('검색 요청 중 오류가 발생했습니다.');
    } finally {
        showLoading(false);
    }
}

function displaySearchResults(data, query) {
    if (!data.items || !Array.isArray(data.items)) {
        resultsCount.textContent = 0;
        resultsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 20px;"></i>
                <h3>검색 결과를 불러올 수 없습니다.</h3>
                <p>API 키 또는 서버 설정을 확인해 주세요.</p>
            </div>
        `;
        return;
    }
    
    resultsCount.textContent = data.total || data.items.length;
    
    const resultsHTML = data.items.map(item => `
        <div class="search-result-item">
            <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title.replace(/<[^>]*>/g, '')}</a></h3>
            <p class="description">${item.description.replace(/<[^>]*>/g, '')}</p>
            <div class="meta">
                <span class="blogger">${item.bloggername}</span>
                <span class="date">${item.postdate}</span>
            </div>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = resultsHTML;
}

function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    if (show) {
        resultsContainer.innerHTML = '';
    }
}

function showError(message) {
    resultsContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 20px;"></i>
            <h3>오류가 발생했습니다</h3>
            <p>${message}</p>
        </div>
    `;
}

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    searchChicken(query);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        searchChicken(query);
    }
});

quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const keyword = btn.getAttribute('data-keyword');
        searchInput.value = keyword;
        searchChicken(keyword);
    });
});

trendCards.forEach(card => {
    card.addEventListener('click', () => {
        const keyword = card.querySelector('h3').textContent;
        searchInput.value = keyword;
        searchChicken(keyword);
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    searchInput.focus();
    const placeholders = [
        '치킨 관련 블로그를 검색해보세요',
        '후라이드치킨 맛집 검색',
        '양념치킨 레시피 검색',
        '치킨맛집 추천 검색',
        '치킨배달 맛집 검색'
    ];
    let placeholderIndex = 0;
    setInterval(() => {
        searchInput.placeholder = placeholders[placeholderIndex];
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    }, 3000);
});

const style = document.createElement('style');
style.textContent = `
    .error-message {
        text-align: center;
        padding: 60px 20px;
        color: #666;
    }
    .error-message h3 {
        margin-bottom: 10px;
        color: #333;
    }
    .error-message i {
        color: #e74c3c;
    }
    .search-result-item {
        background: white;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .search-result-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .search-result-item h3 {
        margin: 0 0 10px 0;
        font-size: 1.2rem;
    }
    .search-result-item h3 a {
        color: #1a0dab;
        text-decoration: none;
        line-height: 1.4;
    }
    .search-result-item h3 a:hover {
        text-decoration: underline;
    }
    .search-result-item .description {
        color: #4d5156;
        line-height: 1.5;
        margin: 10px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .search-result-item .meta {
        display: flex;
        gap: 15px;
        font-size: 0.9rem;
        color: #70757a;
        margin-top: 10px;
    }
    .search-result-item .blogger {
        font-weight: 500;
    }
`;
document.head.appendChild(style); 