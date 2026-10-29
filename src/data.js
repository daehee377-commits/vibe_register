// q: Pixabay 검색어(영문이 결과가 잘 나옴)
export const ITEMS = [
  { id: "dolhareubang", name: "돌하르방", category: "상징", q: "jeju stone statue", desc: "제주의 수호신으로 불리는 현무암 석상. 제주 캐릭터 IP의 대표 모티브입니다." },
  { id: "haenyeo", name: "해녀", category: "문화", q: "haenyeo diver korea", desc: "숨비소리와 물질 문화로 유네스코 인류무형문화유산에 오른 제주 여성 잠수부." },
  { id: "tangerine", name: "감귤", category: "먹거리", q: "jeju tangerine", desc: "제주를 대표하는 특산물. 굿즈와 패키지 디자인에 가장 많이 쓰이는 소재." },
  { id: "hallasan", name: "한라산", category: "자연", q: "hallasan mountain", desc: "백록담을 품은 제주의 중심 화산. 세계자연유산 핵심 지역입니다." },
  { id: "oreum", name: "오름", category: "자연", q: "jeju oreum", desc: "제주 곳곳에 있는 작은 기생화산. 부드러운 곡선이 시각 아이덴티티가 됩니다." },
  { id: "seongsan", name: "성산일출봉", category: "자연", q: "seongsan ilchulbong", desc: "바다 위로 솟은 분화구 지형. 일출 명소이자 제주 관광의 상징." },
  { id: "olle", name: "올레길", category: "문화", q: "jeju olle trail", desc: "제주 해안과 마을을 잇는 걷기 길. 슬로 여행 콘텐츠의 원조입니다." },
  { id: "blackpork", name: "흑돼지", category: "먹거리", q: "korean black pork bbq", desc: "제주 향토 음식의 중심. 고기국수, 근고기 등 다양한 스토리를 가집니다." },
  { id: "pony", name: "제주 조랑말", category: "상징", q: "jeju pony horse", desc: "몸집이 작고 단단한 제주 토종말. 목장 풍경과 함께 자주 등장합니다." },
  { id: "stonewall", name: "돌담과 초가", category: "문화", q: "jeju stone wall village", desc: "바람을 견디는 현무암 돌담과 초가집. 제주다운 풍경의 기본 요소." },
  { id: "manjanggul", name: "만장굴", category: "자연", q: "manjanggul lava tube", desc: "세계 최장급 용암동굴. 신비로운 분위기의 콘텐츠 배경으로 적합합니다." },
  { id: "galot", name: "갈옷", category: "문화", q: "persimmon dyed fabric", desc: "감물로 염색한 제주 전통 의복. 친환경 패션 IP로 재해석되고 있습니다." },
];

export const CATEGORIES = ["전체", ...new Set(ITEMS.map((i) => i.category))];
