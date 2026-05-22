Samsung Cloud Platform의 이중 리전 재해복구(DR) 아키텍처 구성도. 왼쪽 West Region(운영)의 VPC#1에는 Web Server(Virtual Server, Volume#1·#2), App Server(Virtual Server, Volume), DB Server(DB#1 Active·DB#2 Standby), File Storage, Object Storage·Bucket이 계층 구조로 배치되어 있음. 오른쪽 East Region(DR)의 VPC#2에는 각각의 대응 DR 컴포넌트(Virtual Server DR, DR DB Replica, File Storage DR, Bucket DR, Object Storage DR)가 배치되어 있음. 두 VPC는 VPC Peering(①)으로 연결되며, Web Server·App Server·DB Server·File Storage·Object Storage Bucket 각각이 Replication(②~⑤)을 통해 DR 리전으로 데이터를 복제함.


Samsung Cloud Platform의 이중 리전 재해복구(DR) 아키텍처 구성도. 왼쪽 West Region(운영)의 VPC#1에는 Web Server(2개), App Server(2개), DB Server(2개)가 계층 구조로 연결되어 있으며, App Server는 Object Storage(③)와 Bucket(④)에 연결됨. 두 VPC는 VPC Peering(①)으로 연결되며, Bucket은 Replication을 통해 East Region(DR) VPC#2의 Bucket(DR)으로 복제됨. DR 리전에서는 Object Storage(DR)(⑤)가 Web Server·App Server·DB Server에 데이터를 제공하는 구조임.

On-Premises & CSP 환경에서 Samsung Cloud Platform으로의 서버 마이그레이션 아키텍처 구성도. 왼쪽 On-Premises & CSP 영역에는 WEB Server, APP Server, DB Server(각 OS MIG·Data/DB 복제 S/W 포함)(③)가 계층 구조로 배치되어 있으며, APP Server와 DB Server는 Replication Server(④⑤)로 데이터를 전송함. Replication Server는 Customer Edge를 통해 전용회선(①)으로 Samsung Cloud Platform의 Transit Gateway에 연결됨. 오른쪽 Samsung Cloud Platform 영역에는 Transit Gateway(①)에서 Replication Server(⑥)를 거쳐 WEB Server·APP Server·DB Server(각 OS MIG·Data/DB 복제 S/W 포함)(②)로 데이터가 전달되는 구조임.

On-Premises & CSP 환경에서 Samsung Cloud Platform으로의 백업 기반 마이그레이션 아키텍처 구성도. 왼쪽 On-Premises & CSP 영역에는 WEB Server, WAS Server, DB Server가 계층 구조로 연결되어 있으며, WAS Server는 Backup Server(③)로 데이터를 전송함. Backup Server는 Customer Edge를 통해 전용회선(①)으로 Samsung Cloud Platform의 Transit Gateway에 연결됨. 오른쪽 Samsung Cloud Platform 영역에서는 Transit Gateway(①)에서 Object Storage(④)를 거쳐 WEB Server·WAS Server·DB Server(②)로 데이터가 복원되는 





LLM 에이전트 아키텍처 다이어그램. 외부에서 Task(태스크)가 입력되면 LLM 에이전트 내부의 LLM이 Memory(메모리), Cognitive Skills(인지 기술), Tools(도구)와 상호작용하며 Reasoning(추론)을 수행한다. LLM 에이전트는 Environment(환경)에 Action(액션)을 전달하고 Results(결과)를 수신하며, 최종적으로 Decision(의사결정)을 출력한다.


