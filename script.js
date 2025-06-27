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

async function searchChickenTrends(query) {
    if (!query.trim()) {
        alert('검색어를 입력해주세요.');
        return;
    }

    showLoading(true);
    resultsSection.style.display = 'block';
    resultsTitle.textContent = `"${query}" 트렌드`;

    try {
        const response = await fetch('/api/naver-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword: query })
        });
        const data = await response.json();
        displayTrendResults(data, query);
    } catch (error) {
        showError('트렌드 데이터 요청 중 오류가 발생했습니다.');
    } finally {
        showLoading(false);
    }
}

function displayTrendResults(data, query) {
    if (!data.results || !Array.isArray(data.results) || !data.results[0].data) {
        resultsCount.textContent = 0;
        resultsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 20px;"></i>
                <h3>트렌드 데이터를 불러올 수 없습니다.</h3>
                <p>API 키 또는 서버 설정을 확인해 주세요.</p>
            </div>
        `;
        return;
    }
    const trendData = data.results[0].data;
    resultsCount.textContent = trendData.length;
    resultsContainer.innerHTML = `<canvas id="trendChart" height="120"></canvas>`;
    loadChartJs(() => {
        const ctx = document.getElementById('trendChart').getContext('2d');
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendData.map(item => item.period),
                datasets: [{
                    label: `${query} 검색 트렌드`,
                    data: trendData.map(item => item.ratio),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102,126,234,0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                    title: { display: false }
                },
                scales: {
                    x: { title: { display: true, text: '기간' } },
                    y: { title: { display: true, text: '검색 비율' } }
                }
            }
        });
    });
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
    searchChickenTrends(query);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        searchChickenTrends(query);
    }
});

quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const keyword = btn.getAttribute('data-keyword');
        searchInput.value = keyword;
        searchChickenTrends(keyword);
    });
});

trendCards.forEach(card => {
    card.addEventListener('click', () => {
        const keyword = card.querySelector('h3').textContent;
        searchInput.value = keyword;
        searchChickenTrends(keyword);
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    searchInput.focus();
    const placeholders = [
        '치킨 트렌드를 확인해보세요',
        '후라이드치킨 검색 트렌드',
        '양념치킨 트렌드',
        '치킨맛집 트렌드',
        '치킨배달 트렌드'
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
`;
document.head.appendChild(style); 