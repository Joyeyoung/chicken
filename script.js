// 네이버 API 설정
const CLIENT_ID = 'L2TR6oM5srkXUX20MNpz';
const CLIENT_SECRET = '2jw33LqmYA';

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

// 검색 함수
async function searchChickenTrends(query) {
    if (!query.trim()) {
        alert('검색어를 입력해주세요.');
        return;
    }

    showLoading(true);
    resultsSection.style.display = 'block';
    resultsTitle.textContent = `"${query}" 검색 결과`;
    
    try {
        // Vercel API Route를 통한 네이버 검색 API 호출
        const response = await fetch(`/api/naver-search?query=${encodeURIComponent(query + ' 치킨')}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayResults(data.items, query);
        
    } catch (error) {
        console.error('검색 중 오류가 발생했습니다:', error);
        showError('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
        showLoading(false);
    }
}

// 결과 표시 함수
function displayResults(items, query) {
    resultsCount.textContent = items.length;
    
    if (items.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h3>"${query}"에 대한 검색 결과가 없습니다.</h3>
                <p>다른 키워드로 검색해보세요.</p>
            </div>
        `;
        return;
    }

    const resultsHTML = items.map(item => {
        // HTML 태그 제거 및 텍스트 정리
        const cleanTitle = removeHtmlTags(item.title);
        const cleanDescription = removeHtmlTags(item.description);
        
        return `
            <div class="result-item">
                <div class="result-title">
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                        ${cleanTitle}
                    </a>
                </div>
                <div class="result-description">
                    ${cleanDescription}
                </div>
                <div class="result-meta">
                    <span>
                        <i class="fas fa-user"></i>
                        ${item.bloggername}
                    </span>
                    <span>
                        <i class="fas fa-calendar"></i>
                        ${formatDate(item.postdate)}
                    </span>
                    <span>
                        <i class="fas fa-external-link-alt"></i>
                        블로그
                    </span>
                </div>
            </div>
        `;
    }).join('');

    resultsContainer.innerHTML = resultsHTML;
}

// HTML 태그 제거 함수
function removeHtmlTags(text) {
    return text.replace(/<[^>]*>/g, '');
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}-${month}-${day}`;
}

// 로딩 표시 함수
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    if (show) {
        resultsContainer.innerHTML = '';
    }
}

// 에러 표시 함수
function showError(message) {
    resultsContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 20px;"></i>
            <h3>오류가 발생했습니다</h3>
            <p>${message}</p>
        </div>
    `;
}

// 이벤트 리스너들
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

// 빠른 검색 버튼들
quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const keyword = btn.getAttribute('data-keyword');
        searchInput.value = keyword;
        searchChickenTrends(keyword);
    });
});

// 트렌드 카드들
trendCards.forEach(card => {
    card.addEventListener('click', () => {
        const keyword = card.querySelector('h3').textContent;
        searchInput.value = keyword;
        searchChickenTrends(keyword);
        
        // 부드러운 스크롤
        resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// 페이지 로드 시 초기 설정
document.addEventListener('DOMContentLoaded', () => {
    // 검색창에 포커스
    searchInput.focus();
    
    // 검색창 플레이스홀더 애니메이션
    const placeholders = [
        '치킨 맛집을 찾아보세요',
        '후라이드치킨 추천',
        '양념치킨 맛집',
        '치킨 배달 추천',
        '치킨 브랜드 비교'
    ];
    
    let placeholderIndex = 0;
    setInterval(() => {
        searchInput.placeholder = placeholders[placeholderIndex];
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    }, 3000);
});

// 추가 스타일 (에러 메시지용)
const style = document.createElement('style');
style.textContent = `
    .no-results, .error-message {
        text-align: center;
        padding: 60px 20px;
        color: #666;
    }
    
    .no-results h3, .error-message h3 {
        margin-bottom: 10px;
        color: #333;
    }
    
    .error-message i {
        color: #e74c3c;
    }
`;
document.head.appendChild(style); 