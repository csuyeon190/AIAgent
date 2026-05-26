Samsung Cloud Platform의 이중 리전 재해복구(DR) 아키텍처 구성도. 왼쪽 West Region(운영)의 VPC#1에는 Web Server(Virtual Server, Volume#1·#2), App Server(Virtual Server, Volume), DB Server(DB#1 Active·DB#2 Standby), File Storage, Object Storage·Bucket이 계층 구조로 배치되어 있음. 오른쪽 East Region(DR)의 VPC#2에는 각각의 대응 DR 컴포넌트(Virtual Server DR, DR DB Replica, File Storage DR, Bucket DR, Object Storage DR)가 배치되어 있음. 두 VPC는 VPC Peering(①)으로 연결되며, Web Server·App Server·DB Server·File Storage·Object Storage Bucket 각각이 Replication(②~⑤)을 통해 DR 리전으로 데이터를 복제함.


Samsung Cloud Platform의 이중 리전 재해복구(DR) 아키텍처 구성도. 왼쪽 West Region(운영)의 VPC#1에는 Web Server(2개), App Server(2개), DB Server(2개)가 계층 구조로 연결되어 있으며, App Server는 Object Storage(③)와 Bucket(④)에 연결됨. 두 VPC는 VPC Peering(①)으로 연결되며, Bucket은 Replication을 통해 East Region(DR) VPC#2의 Bucket(DR)으로 복제됨. DR 리전에서는 Object Storage(DR)(⑤)가 Web Server·App Server·DB Server에 데이터를 제공하는 구조임.

On-Premises & CSP 환경에서 Samsung Cloud Platform으로의 서버 마이그레이션 아키텍처 구성도. 왼쪽 On-Premises & CSP 영역에는 WEB Server, APP Server, DB Server(각 OS MIG·Data/DB 복제 S/W 포함)(③)가 계층 구조로 배치되어 있으며, APP Server와 DB Server는 Replication Server(④⑤)로 데이터를 전송함. Replication Server는 Customer Edge를 통해 전용회선(①)으로 Samsung Cloud Platform의 Transit Gateway에 연결됨. 오른쪽 Samsung Cloud Platform 영역에는 Transit Gateway(①)에서 Replication Server(⑥)를 거쳐 WEB Server·APP Server·DB Server(각 OS MIG·Data/DB 복제 S/W 포함)(②)로 데이터가 전달되는 구조임.

On-Premises & CSP 환경에서 Samsung Cloud Platform으로의 백업 기반 마이그레이션 아키텍처 구성도. 왼쪽 On-Premises & CSP 영역에는 WEB Server, WAS Server, DB Server가 계층 구조로 연결되어 있으며, WAS Server는 Backup Server(③)로 데이터를 전송함. Backup Server는 Customer Edge를 통해 전용회선(①)으로 Samsung Cloud Platform의 Transit Gateway에 연결됨. 오른쪽 Samsung Cloud Platform 영역에서는 Transit Gateway(①)에서 Object Storage(④)를 거쳐 WEB Server·WAS Server·DB Server(②)로 데이터가 복원되는 


Hugging Face Enterprise Hub 구조도. 중앙의 Enterprise Security(보안 잠금 아이콘)를 경계로 좌우가 구분됨. 왼쪽 ‘Your Private Hub’ 영역에는 Private and Secure Hugging Face Hub가 원형으로 표시되며, Private Models, Private Datasets, Private Spaces, Private Inferences 4가지 요소로 구성됨. 오른쪽 ‘Hugging Face Ecosystem’ 영역은 세 가지 그룹으로 구성됨. Open Source 그룹은 Transformers, Accelerate, Datasets, Tokenizers를 포함하고, Public Hub 그룹은 Public Models, Public Datasets, Public Spaces를 포함하며, Solutions 그룹은 Inference API, Infinity, AutoTrain, EAP를 포함함. 오른쪽 각 그룹에서 Enterprise Security를 거쳐 왼쪽 Private Hub로 점선 화살표가 연결되어 선택적 접근 통제 구조를 나타냄.

글로벌 시가총액 상위 기업과 네트워크 효과 분류 다이어그램. 왼쪽에 시가총액 순위 목록이 표시됨. 1위 Apple(AAPL), 2위 Microsoft(MSFT), 3위 Saudi Aramco(흐림 처리), 4위 Alphabet/Google(GOOG), 5위 Amazon(AMZN), 6위 Berkshire Hathaway(흐림 처리), 7위 NVIDIA(NVDA), 8위 Meta Platforms/Facebook(META), 9위 Johnson & Johnson(흐림 처리), 10위 Tesla(TSLA). 중앙에는 각 기업의 주요 제품 및 서비스 로고가 배치됨. Apple은 iPhone·iMac, Microsoft는 Azure·Office·Windows, Alphabet은 Google Search·YouTube·Google Cloud, Amazon은 Amazon 쇼핑·Amazon Web Services, NVIDIA는 GeForce GTX·CUDA, Meta는 Facebook·Instagram·WhatsApp으로 연결됨. 오른쪽에는 네트워크 효과의 4가지 유형 분류가 색상별로 표시됨. Platforms(보라), Social networks(파랑), Marketplaces(노랑), AI Products(초록)로 구분되며, 하단에 ‘Network effects’라는 제목이 


이더리움(ETH) 6개월 가격 차트 (단위: 원). 2025년 9월 26일 오후 2시 58분 UTC 기준 현재가 5,545,461.06원이며, 지난 6개월 대비 +2,577,168.78원(+86.82%) 상승. 차트는 2025년 4월경 약 200만~300만원대에서 시작하여 6월에 350만~400만원대로 상승한 후, 9월 13일(토) 최고가 6,615,376.59원을 기록하였으며 이후 하락하여 현재 약 554만원대에 위치함. 하단에 1 ETH = 5,545,461.06 KRW 환산 정보가 표시됨.





SESG Platform의 Annual Performance Entry(연간 성과 입력) 화면. 2026년도 Corporation 탭이 선택되어 있으며, 데이터 제공자가 정량적 성과 데이터를 입력하는 인터페이스임. 표는 Status, Category, Datapoint·ID, I/F 열과 월별·분기별·반기별 입력 열, YTD Value, UOM, Guide, Supporting Doc. 열로 구성됨. 입력 항목은 남성 일직원 수·여성 일직원 수(월별), 대기 오염물질·직접 에너지·AAAA 에너지(분기별), 간접 에너지·AA 배출량(반기별), AA 인원 수·K 건수·남성 일직원 수(연간) 등이며, 각 행의 Status는 Completed(초록), Pending(노랑), Delayed(빨강), Scheduled(회색)로 구분되어 있음.


SESG Platform의 Issue Discovery(이슈 발굴) 화면. 상단에 AI Suggest 기능이 활성화되어 있으며, AI가 추천한 이슈 5건이 카드 형태로 표시됨(사이버 보안 공시 의무화, Circular Economy based on water and waste management, EU AI 규제 준수, 인재 확보 및 기술 격차, 그린 워싱). 하단에는 E(환경성과 및 재무영향), S(사회적 책임 성과 및 리스크), G(지배구조 건전성) 세 영역으로 구분된 이슈 목록이 표시됨. 각 영역에는 수자원 및 해양자원, 자원 관리 및 순환 경제 카테고리 아래 재생에너지 사용, Circular Economy, 자원 효율성, 재생 원료 사용, RE 100 참여, 탄소세 대응 등의 항목이 나열되어 있으며, 일부 항목에는 Material Issue 태그가 표시됨.


주요국 ESG 지속가능성 공시 제도 비교표. 6개국의 공시 제도, 공시 주제, 적용 시점, 공시 대상을 정리한 표임. EU는 기업지속가능성보고지침(CSRD)으로 환경·사회·거버넌스를 공시 주제로 하며 2025년/2028년(FY27)부터 단계적으로 적용되고 NFRD 비상장 대기업 및 상장 중소기업·Non-EU 모회사가 대상임. 미국은 캘리포니아주 기후기업데이터책임법(SB253)과 기후관련재무위험법(SB261)으로 각각 온실가스 배출량과 기후 관련 위험을 공시하며 SB253은 2026년 8월, SB261은 2026년 1월부터 일정 매출 이상 기업에 적용됨. 호주는 지속가능성보고기준(ASRS)으로 기후 관련 재무 공시를 2025년(FY24) 시행하여 2026년(FY25)부터 단계적으로 의무화하며 연결기준 매출·총자산·직원 수 중 2개 이상 조건에 해당하는 기업이 대상임. 일본은 지속가능성공시기준(SSBJ)으로 기후 관련 재무 공시를 2027년(FY26) 의무화 예정이며 대형 상장기업이 대상임. 인도는 지속가능성보고체계(BRSR)로 환경·사회·거버넌스를 2025년(FY24)부터 단계적으로 적용하며 상위 1,000개 상장기업이 대상임. 한국은 지속가능성공시기준(KSSB)으로 기후 관련 재무 공시를 2028년(FY27)부터 단계적으로 적용하며 연결기준 일정 총자산 이상 기업이 대상임.




