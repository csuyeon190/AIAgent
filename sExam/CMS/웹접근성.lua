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




A multi-page form interface titled “Navigate to a Specific Page (Out of 13).” A dropdown selector shows the current section as “Section 7: About the Decision,” and a progress bar indicates the user is on page 7 of 13. The section heading reads “About the Decision” and contains two input areas. The first is a large text area with the label “Please describe the decision(s) that will be automated,” currently empty. The second is a checkbox group labeled “Does the decision pertain to any of the categories below (check all that apply),” listing seven options, all unchecked: Health related services; Economic interests (grants and contributions, tax benefits, debt collection); Social assistance (employment insurance, disability claims); Access and mobility (security clearances, border crossings); Licensing and issuance of permits; Employment (recruitment, hiring, promotion, performance evaluation, monitoring, security clearance); and Other (please specify). A status bar at the bottom displays Impact Level: 1, Current Score: 0, Raw Impact Score: 0, and Mitigation Score: 





Architecture diagram titled “Minimize human intervention through GenAI and strengthen connectivity between systems.” Three user groups on the left connect to four system layers in the center, all integrated with GenAI on the right. The first layer, ① Collaboration System (C&C), serves all employees and includes Mail, Messenger, Meeting, and Drive. The second layer, ② Core Business System, serves business managers and includes ERP, SCM, HCM, CRM, and additional systems. The third and fourth layers serve developers and operators respectively: ③ System Development includes Plan, Build, Code, and Release stages supported by DevOps; ④ System Operation includes Deploy, Monitor, Operate, and Test stages. All four layers connect via arrows to the GenAI cloud on the right, representing AI-driven integration across the entire enterprise system landscape.






==============

Diagram showing three core features of a GenAI service: 1. GenAI service structure utilizing internal knowledge and data (Data icon); 2. Contextual and Seamless user experience for improved work efficiency (Tool and Output icons); 3. Enterprise-grade GenAI security management (Security icon).


Architecture diagram of Brity Copilot showing data flow between internal data sources (knowledge assets, HR information, management information), external data sources (market trends, academic materials, latest news), and two LLM types: Private LLM and Public LLM. Key features: multi-LLM selection enabling simultaneous use of multiple LLMs by purpose, and fine-tuned Private LLM for company-specific optimized responses.


Diagram illustrating Brity Copilot's internal data integration structure. Internal data sources including collaboration solutions (mail, messages, documents) and business systems connect via Connector (Plug-in) and Knowledge Search modules to an LLM. Key benefits: unified search across mail, chat, and documents for relevant information retrieval, and plug-in integration with internal business systems for structured data processing, enabling a practical enterprise knowledge management system.


Screenshot of Brity Copilot for Documentation integrated within Microsoft Word, displaying a document titled "Cloud Market 2023 Q2 Trends." The Copilot panel on the right shows a document summary with callouts highlighting two features: unified search across business materials for quick summary review, and internal LLM selection for enterprise document search.


Security architecture diagram of Brity Copilot deployed on Private Cloud (SCP). The system includes two security options: keyword filtering to block sensitive information before it reaches the Public LLM, and access permission settings to prevent unauthorized access to the Private LLM and business systems. Bottom section highlights two security controls: keyword filtering to prevent leakage of sensitive information and source code, and organization/user-level data access permission management.


Timeline diagram showing the evolution of PLM (Product Lifecycle Management) systems from 1990 to 2023 and beyond. Phases: PDM (1990) focused on Time-To-Market; CPC (2000) focused on Collaboration; PLM (2000–2010) focused on Digital Enterprise; PLM Digital Transformation (2010–2023) focused on Digital Workplace, data-driven R&D, and cloud-based product integration. The next phase beyond ChatGPT (2023) is marked with a question mark, indicating future direction.


Diagram showing collaboration between an Engineer and AI Copilot across three product development stages. In Product Planning (market and technology analysis): Engineer reviews fact-based content; AI Copilot searches and provides materials. In Product Development (design): Engineer makes final decisions on content; AI Copilot searches, summarizes, and drafts. In Product Development (testing and verification): Engineer focuses on core tasks; AI Copilot supports repetitive work.


User experience flow diagram showing a To-Be scenario for a design engineer named Kim, interacting with AI Copilot across two phases: Ideation and Design. In the Ideation phase: Kim confirms content, requests analysis, and determines review direction; Copilot recognizes requests, collects data, generates analysis results, and sends reports. In the Design phase: Kim requests design generation and confirms and finalizes the design; Copilot generates designs with simulation results and transmits final designs. A side panel describes the scenario: an automotive parts engineer receives an urgent design request for parts to be adopted in an India-bound strategic model.


Architecture diagram of a Generative AI service platform integrated with a unified work environment called Brity Works. The APP layer includes four domains: Design and Development, Product Management, SW Management, and Digital Twin. The Collaboration Platform layer (Brity Works) provides Dashboard and Widgets, Messenger and Video Conferencing, Workspace (Document Management), and 3D Collaboration. The AI Platform layer consists of three module groups: Data Modules (Collection and Preprocessing, Structured Data, Vectorization), Learning Modules (LLM Model Serving, LLMOps Support, Model Repository, Learning Data Management, Fine Tuning, Pre-training), and Service Modules (Orchestrator, Filtering, Knowledge Search).


67
Photo of an Amazon warehouse fulfillment center showing a worker in a pink shirt scanning packages on a roller conveyor belt. Multiple Amazon-branded cardboard boxes move along the conveyor line in a large industrial facility with high ceilings and yellow structural supports.

68
Circular flywheel diagram illustrating Amazon's growth strategy. The cycle flows clockwise: Lower Cost Structure leads to Lower Prices, which improves Customer Experience, driving more Traffic, attracting more Sellers, expanding Selection, which feeds back into Lower Cost Structure. The Amazon logo and the word "Growth" are displayed at the center.

69
Four-panel photo collage of Amazon Go cashierless convenience stores. Top left: exterior of an Amazon Go store with customers entering. Top right: automated entry gates with turnstiles inside the store. Bottom left: a customer browsing fully stocked product shelves. Bottom right: a person holding a smartphone displaying the Amazon Go app with a receipt, next to a beverage.

70
Product photo of the Amazon Echo smart speaker, a tall black cylindrical device, displayed against a dark background with the Amazon Echo logo shown in white and teal text to the right.

71
Product lineup photo for Amazon Basics showing a variety of everyday household and lifestyle items arranged on a white background under the Amazon Basics logo. Items include a knife block set, a camera tripod, a duffel bag, gray towels, headphones, dinnerware, dumbbells, a pet bed, a keyboard and mouse, a memory card, and a wooden hanger.

72
Interior photo of an Amazon fulfillment center showing an extensive automated conveyor belt system with multiple branching tracks and yellow safety railings. An Amazon Fulfillment sign is visible in the foreground.

73
Aerial photo of a large Amazon warehouse interior showing vast rows of tall storage shelving stocked with products, extending to the far end of the facility. Workers in orange safety vests and forklifts operate in the central floor area between the shelving rows.

74
Infographic titled "How Amazon FBA Works" showing a six-step process using illustrated figures. Step 1: Seller decides to make money on Amazon FBA. Step 2: Find a profitable product already in demand on Amazon. Step 3: Find a supplier or manufacturer for the chosen product. Step 4: Send inventory to the Amazon Fulfillment Center via truck. Step 5: Amazon FBA packs, fulfills, and ships the products. Step 6: Seller sits back and waits for profits.

75
Diagram titled "The Drop-Ship Model" illustrating a three-step e-commerce fulfillment process. Step 1: Your store's products are synced with the products of your drop-ship partner (shown with bidirectional dotted arrows between an online storefront and a warehouse). Step 2: Your customer places and pays for an order (shown with a dotted arrow from a house icon to the online store). Step 3: The supplier ships the product directly to your customer (shown with a solid arrow from the warehouse to the customer's house).

76
Side-by-side comparison illustration titled "Typical Warehouse VS Amazon's Warehouse." The left side shows a traditional warehouse with shelves organized by product type, each shelf holding only one type of item in uniform rows. The right side shows Amazon's warehouse with shelves storing mixed product types and sizes together, representing a chaotic storage model optimized for algorithmic retrieval efficiency.

77
Photo of a yellow industrial robotic arm in an Amazon facility, positioned over an Amazon-branded cardboard box on a conveyor or work surface. The robot is equipped with a suction cup end effector, demonstrating automated package handling.

78
Stacked bar chart titled "Amazon's Fleet Growth 2016–2021" showing quarterly growth in the number of Amazon Air cargo aircraft from 2016 through Q3 2021. The fleet grew from approximately 1 aircraft in 2016 to nearly 70 by Q3 2021. Aircraft types are shown in four colors: 767-200 (blue), 767-300 (orange), 737-800 (gray), and ATR72-500 (yellow). Source: Insight IQ.

79
Photo of multiple delivery drivers loading Amazon packages into personal vehicles parked along a curb. Workers are transferring brown paper bags and boxes from hand trucks into car trunks, representing Amazon's Flex last-mile delivery program.

80
Photo of a woman retrieving a package from an Amazon Scout autonomous delivery robot outside a residential home. The six-wheeled robot is light blue with the Amazon Prime logo, and its lid is open to reveal the package compartment.

81
Comparison graphic showing the Amazon logo on an orange background on the left versus the Shopify logo on a dark green background on the right, separated by the word "VS" in white, representing a comparison between the two e-commerce platforms.

82
Screenshot of a laptop displaying a third-party e-commerce store product page for headphones priced at $49 with a 4.5-star rating. A zoomed-in callout highlights the "Buy with Prime" button, showing a delivery promise of "Get it as soon as Tomorrow, Apr 22" with free delivery and returns, illustrating Amazon's Buy with Prime feature for external storefronts.



=========================


주요 AI 기업별 에이전트 기능 출시 현황 비교표. 범례: 진한 초록색(출시 완료), 연한 초록색(미리보기), 회색(미출시). 비교 항목은 브라우저 기반 에이전트, 컴퓨터 사용 에이전트, 에이전트 빌더, 에이전트 관리 대시보드 4가지이며, 비교 대상 기업은 OpenAI, Anthropic, Microsoft, AWS, SAP, Google, Manus(Meta*), Oracle, Salesforce, ServiceNow, Databricks, Snowflake 총 12개사임. OpenAI는 4개 항목 모두 출시 완료 또는 미리보기 단계이며, Anthropic은 에이전트 관리 대시보드가 미출시 상태임. SAP, Oracle, Databricks, Snowflake는 브라우저 기반 에이전트 및 컴퓨터 사용 에이전트 항목이 미출시 상태임. 출처: The Information 보도. *Meta는 Manus 인수에 합의함.

OpenAI Frontier 플랫폼 아키텍처 다이어그램. 총 4개 레이어로 구성됨. 인터페이스 레이어: ChatGPT Enterprise, ChatGPT Atlas, 비즈니스 애플리케이션. 에이전트 레이어: 사용자 에이전트, OpenAI 에이전트, 서드파티 에이전트. OpenAI Frontier 레이어(3단 구성): 평가 및 최적화(성능 향상을 위한 내장 평가 및 최적화 루프), 에이전트 실행(에이전트가 실제 작업을 계획·수행·복구할 수 있는 모델 인텔리전스 및 도구), 비즈니스 컨텍스트(데이터·시스템·워크플로우 전반의 공유 비즈니스 컨텍스트). 하단: 사용자의 레코드 시스템(Your systems of record). 우측에 민감하고 규제된 업무를 위한 엔터프라이즈 보안 및 거버넌스 기능이 전체 레이어를 아우르는 형태로 표시됨.

골드만삭스 리서치 영역형 차트. 제목: 소프트웨어 시장의 수익 풀이 AI 에이전트 방향으로 이동할 것으로 전망됨. 부제: SaaS(서비스형 소프트웨어)와 AI 에이전트의 총 유효 시장(TAM) 변화 예측(예시적 수치). 2025년부터 2030년까지의 시장 규모 변화를 두 개의 누적 영역으로 표시. SaaS TAM(진한 파란색)은 2025년 약 300억 달러에서 2030년 약 200억 달러로 감소. Agent TAM(연한 파란색)은 2025년 거의 0에서 2030년 약 500억 달러 이상으로 급격히 증가. 출처: Gartner, Goldman Sachs Research. Gartner 데이터 발행일: 2024년 10월 10일.








=================


아마존 모바일 앱의 AI 구매 대행 기능 "Buy for me" 화면 두 장. 왼쪽 화면: "Brand women's leggings" 검색 결과 페이지. 상단에 아마존 자체 상품(32달러, 35달러, Prime 2일 배송)이 표시되고, 하단에 "Shop brand sites directly(베타)" 섹션에서 브랜드 공식 사이트의 여성용 레깅스 3종(블랙, 블루, 핑크, 각 48달러)이 표시됨. 각 상품 하단에 "Buy for me" 버튼이 강조 표시되어 있음. 오른쪽 화면: "Buy for me" 기능 상세 안내 페이지. 상단에 "brand.com에서 아마존 AI로 구매, 1회 주문 한정" 안내와 검은색 "Buy for me" 버튼이 있으며, 무료 배송 및 무료 반품 교환 정보가 표시됨. 하단의 "AI는 무엇을 하나요?" 섹션(빨간 테두리 강조)에 AI의 4단계 역할이 순서대로 설명됨: 1단계 브랜드 웹사이트 방문, 2단계 최신 가격 및 재고 확인, 3단계 상품 구매 대행, 4단계 최신 주문 상태 공유.


제목: Agentic Commerce Protocol — ChatGPT 즉시 결제(Instant Checkout) 구동 방식. 사용자(User), ChatGPT, 판매자(Merchant), 결제 처리사(Payment Processor) 4개 주체 간의 결제 프로세스 흐름도. 순서는 다음과 같음. 1단계: 사용자가 "구매" 버튼을 탭하고 결제 수단 및 배송지를 확인 → ChatGPT에 전달 → 판매자가 해당 상품 및 주소에 대한 배송 옵션 수집. 2단계: 판매자가 배송 옵션을 ChatGPT로 전달 → ChatGPT가 옵션 렌더링 → 사용자가 배송 옵션 선택. 3단계: 사용자 선택 정보가 ChatGPT를 통해 판매자로 전달 → 판매자가 판매세 및 최종 가격 계산 → ChatGPT가 최종 금액 렌더링 → 사용자가 "결제" 버튼으로 최종 확인. 4단계: ChatGPT가 보안 결제 토큰, 주문 정보 및 무결성 신호 수집 → 판매자가 주문 및 결제 정보를 수신하여 승인 또는 거부 → 결제 처리사가 결제 수단에 청구. 최종 단계: 사용자, ChatGPT, 판매자 모두 완료 체크 표시(초록색)로 거래 완료 확인.



========


Screenshot of Brity Copilot Meeting Assistant feature (3 of 3) demonstrating real-time multilingual subtitle and voice translation during a video conference, enabling meetings without language barriers.

Three participants are shown in separate video tiles:

Left tile: Lee Eun-ho, Seoul, South Korea (Brity Copilot overseas marketing lead). Speaking in Korean. Subtitles displayed in Korean: "I'd like to hear your thoughts on this. Is there any additional material needed here?"

Center tile: Wang Wei, Beijing, China (2024 International Forum event lead). Translated Voice indicator shows Korean to Chinese (中國語). Subtitles displayed in Chinese: "我想听听你对此的想法。这里还有您需要的更多信息吗？" (I'd like to hear your thoughts on this. Is there more information you need here?)

Right tile: Maximilian, Berlin, Germany (2024 International Forum event lead). Translated Voice indicator shows Korean to German (Deutsch). Subtitles displayed in German: "Ich würde gerne Ihre Meinung dazu hören. Benötigen Sie hier weitere Informationen?" (I would like to hear your opinion on this. Do you need more information here?)

Navigation tabs at top: Key Schedule & Work Briefing / Meeting Assistant (3/3, currently selected) / Voice Task Processing / Away Task Processing.

==========



Screenshot of a Brity Copilot AI assistant interface displaying a "Recommended Prompts" popup menu overlaid on a document about generative AI. The popup contains five selectable action buttons: Search Files, Search Information, Translate, Polish Grammar, and Summarize. A chat input field at the bottom reads "Ask anything you're curious about."


Screenshot of Brity Copilot's auto-generated meeting minutes after a video conference. A notification at the top reads: "The meeting has ended. You can edit or create a new draft of the meeting minutes written by Brity Copilot. Go to Meeting Minutes. Note: As this was generated by generative AI, it may contain inaccurate content. Please review before use."

Below is the generated meeting minutes document with a blue border, containing the following details:

Meeting Title: Meeting opened by Oh Se-yun

Date and Time: Thursday, May 9, 2024, 15:14–15:36 (Asia/Seoul, GMT+9:00)

Attendees: Planning Group S — Ba Jae-i, Oh Se-yun, Lee Mi-na

Key Discussion Points:
- Discussion on effective DSG campaign strategies for IT companies
- Four ESG activity ideas proposed
- Short-term goal: establishing a talent management system for social value creation, diversity, and inclusion
- Mid-to-long-term goals: reducing carbon emissions and strengthening information security and personal data protection
- Progress report scheduled for October 20; action plans for each task to be completed by October 30





