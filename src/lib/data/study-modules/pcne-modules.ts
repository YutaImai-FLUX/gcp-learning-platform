import type { StudyModule } from "@/lib/types/study-module"

export const PCNE_MODULES: StudyModule[] = [
  {
    id: "pcne-vpc-design",
    certId: "pcne",
    domainName: "VPCネットワーク設計と実装",
    title: "VPCネットワーク設計と実装",
    description:
      "Professional Cloud Network Engineerとして必須のVPCアーキテクチャ設計、Shared VPC・VPC Peeringの使い分け、CIDR設計のベストプラクティス、Cloud NATとプライベートGoogleアクセスを体系的に学習します。",
    estimatedMinutes: 90,
    difficulty: "advanced",
    prerequisites: ["ace-networking"],
    relatedLabIds: ["lab-vpc-design", "lab-shared-vpc", "lab-cloud-nat"],
    sections: [
      {
        id: "pcne-vpc-s1",
        title: "VPCの基本アーキテクチャ",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "text",
            markdown: `## Auto mode vs Custom mode VPCの違いと推奨

### Auto mode VPC
Auto modeは、VPC作成時に全リージョンに自動的にサブネットを作成する。各サブネットは\`10.128.0.0/9\`の範囲から割り当てられ、新リージョン追加時には自動的にサブネットが追加される。

**Auto modeの問題点：**
- 全リージョンに不要なサブネットが作成される
- CIDRレンジが固定のため、オンプレミスや他VPCとの重複が発生しやすい
- 将来的なサブネット分割・設計変更が困難
- \`10.128.0.0/9\`はRFC1918の大部分を消費するため、VPC Peeringで使いにくい

### Custom mode VPC（本番推奨）
Custom modeは、必要なリージョンにのみ明示的にサブネットを作成する。

**Custom modeの利点：**
- CIDRを完全に制御でき、オンプレミスとの重複を避けられる
- 必要なリージョン・サブネットのみ作成（最小権限の考え方をネットワークにも適用）
- VPC Peeringで使用する場合にCIDR重複を避けやすい
- セキュリティゾーン（フロント/バック/管理）ごとにサブネットを設計できる

### 推奨アーキテクチャ

\`\`\`
Custom mode VPC: prod-vpc (10.0.0.0/8)
├── subnet-frontend (10.0.1.0/24) - asia-northeast1
├── subnet-backend  (10.0.2.0/24) - asia-northeast1
├── subnet-db       (10.0.3.0/24) - asia-northeast1
└── subnet-gke      (10.0.4.0/22) - asia-northeast1 (GKE用大きめCIDR)
\`\`\`
`,
          },
          {
            type: "concept_card",
            term: "VPCサブネットのCIDR構造",
            definition:
              "GCP VPCサブネットはプライマリIPv4範囲とセカンダリIPv4範囲を持つ。プライマリ範囲はVMインターフェースに使用され、セカンダリ範囲はGKE PodやServiceのIPアドレス割り当てに使用される。",
            useCases: [
              "プライマリ範囲：VMのネットワークインターフェースIPアドレス割り当て",
              "セカンダリ範囲：GKE Podへの/32アドレス割り当て（VPC-native cluster）",
              "セカンダリ範囲：GKE Serviceへのアドレス割り当て（ClusterIP）",
              "Alias IPレンジ：単一VMに複数IPを割り当てるコンテナ向け用途",
              "RFC1918プライベートアドレス空間（10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16）のみ使用可能",
            ],
            characteristics: [
              "サブネットはリージョナルリソース（ゾーン横断で使用可能）",
              "プライマリ範囲は変更不可（削除して再作成のみ）、セカンダリ範囲は追加可能",
              "GKEのVPC-native clusterには最低/28のプライマリ、/22のPod用セカンダリが必要",
              "サブネット範囲の拡張（expand）は可能だが縮小は不可",
              "プライベートGoogleアクセスを有効にするとサブネット内VMがGAPIにアクセス可能",
            ],
            examRelevance:
              "GKEクラスター作成時のCIDR設計問題は頻出。Pod用セカンダリ範囲のサイズ計算（ノード数×Pod数）と、オンプレミスCIDRとの重複回避が試験ポイント。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "本番環境ではCustom modeを必ず使用する",
            content: `Auto modeはPoC・学習目的のみ。本番でAuto modeを選択する理由はない。

**試験での判断基準：**
- オンプレミス接続がある → Custom mode（CIDR重複回避必須）
- VPC Peeringを使う → Custom mode（ピアリング先とのCIDR重複を設計段階で防ぐ）
- マルチリージョン展開 → Custom mode（リージョンごとにCIDR計画が必要）
- 「本番環境のベストプラクティス」と問われたら → 常にCustom mode`,
          },
        ],
      },
      {
        id: "pcne-vpc-s2",
        title: "Shared VPC vs VPC Peering",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "comparison_table",
            title: "VPC接続方式の比較：Shared VPC / VPC Peering / Private Service Connect",
            headers: ["比較項目", "Shared VPC", "VPC Peering", "Private Service Connect"],
            rows: [
              {
                label: "管理モデル",
                values: [
                  "ホストプロジェクトが中央でVPCを管理。サービスプロジェクトはリソースを配置するが、ネットワーク制御権を持たない",
                  "2つのVPCが対等に接続。各プロジェクトが独自VPCを保持・管理する",
                  "サービスプロバイダーがPSCエンドポイントを公開。コンシューマーはForwarding Ruleで接続",
                ],
                highlight: true,
              },
              {
                label: "推移的ルーティング",
                values: [
                  "サービスプロジェクト間の通信はホストVPC経由で可能（設計による）",
                  "非推移的。VPC-AとVPC-Bがピア、VPC-BとVPC-Cがピアでも、AとCは直接通信不可",
                  "該当なし（エンドポイント単位の接続）",
                ],
                highlight: true,
              },
              {
                label: "ユースケース",
                values: [
                  "同一組織内の複数チーム・部門が共通インフラを共有する大規模エンタープライズ",
                  "異なる組織・プロジェクト間で限定的なサービス接続が必要な場合",
                  "マネージドサービス（Cloud SQL, Memorystore等）へのプライベートアクセス、またはサードパーティSaaSとの接続",
                ],
              },
              {
                label: "CIDR重複",
                values: [
                  "全プロジェクトが同一VPCを共有するためCIDR重複問題なし",
                  "ピアリング間でCIDRが重複するとピアリング不可。設計段階でのCIDR計画が必須",
                  "IPアドレスはPSCエンドポイントのみで、バックエンドCIDRは無関係",
                ],
                highlight: false,
              },
              {
                label: "制限",
                values: [
                  "同一組織内のみ。ホストプロジェクト管理者の権限が強力で、単一障害点になりうる",
                  "プロジェクト間で最大25ピアグループ。VPCあたり最大25のピアリング接続",
                  "PSCエンドポイントごとに転送ルールが必要。一部サービスはPSC非対応",
                ],
              },
              {
                label: "コスト",
                values: [
                  "ホストVPCのリソースコストのみ（追加のピアリングコストなし）",
                  "同一リージョン内のピアリング通信は無料。リージョン間は通常の出力料金",
                  "PSCエンドポイントの作成と転送ルールに料金が発生",
                ],
              },
            ],
            footnote:
              "PCNE試験では接続要件（組織境界/推移的ルーティング必要性/マネージドサービス接続）に応じた適切な方式選択が問われる。特にVPC Peeringの非推移性は最頻出ポイント。",
          },
          {
            type: "decision_tree",
            title: "VPC接続方式の選択フロー",
            rootId: "q1",
            nodes: [
              {
                id: "q1",
                question: "接続先は同一Google Cloud組織内のプロジェクトか？",
                yesId: "q2",
                noId: "q5",
              },
              {
                id: "q2",
                question: "複数チームが共通のネットワークリソース（サブネット/FW等）を共有したいか？",
                yesId: "ans-shared-vpc",
                noId: "q3",
              },
              {
                id: "ans-shared-vpc",
                answer: "Shared VPCを使用",
                explanation:
                  "ホストプロジェクトにVPCを作成し、サービスプロジェクトをアタッチ。ネットワーク管理を一元化し、各チームはリソース配置のみを担当する。",
              },
              {
                id: "q3",
                question: "3つ以上のVPC間で推移的なルーティング（A↔B↔C）が必要か？",
                yesId: "ans-ncc",
                noId: "q4",
              },
              {
                id: "ans-ncc",
                answer: "Network Connectivity Center (NCC) を使用",
                explanation:
                  "NCCのHub-and-SpokeモデルでVPCをSpokeとして接続することで推移的ルーティングが実現できる。VPC Peeringは非推移的のため不適。",
              },
              {
                id: "q4",
                question: "接続対象はCloud SQL/Memorystore等のマネージドサービスか？",
                yesId: "ans-psc",
                noId: "ans-peering",
              },
              {
                id: "ans-psc",
                answer: "Private Service Connect (PSC) を使用",
                explanation:
                  "マネージドサービスへのプライベートアクセスにはPSCが最適。サービスエンドポイントに対してForwarding Ruleを作成し、プライベートIPで接続する。",
              },
              {
                id: "ans-peering",
                answer: "VPC Peeringを使用",
                explanation:
                  "2つのVPC間の限定的な接続にはVPC Peeringが適切。CIDRの重複がないことを必ず事前確認すること。",
              },
              {
                id: "q5",
                answer: "Partner Interconnect または Cloud VPN + PSC を検討",
                explanation:
                  "組織外との接続はVPC PeeringやShared VPCは使用不可。Cloud VPNまたはInterconnectで物理接続後、必要に応じてPSCを組み合わせる。",
              },
            ],
          },
          {
            type: "key_point",
            level: "common_mistake",
            title: "VPC Peeringは推移的でない — 最頻出の誤りポイント",
            content: `**間違いやすいシナリオ：**
VPC-A ↔ VPC-B（ピアリング済み）
VPC-B ↔ VPC-C（ピアリング済み）
→ A-C間の通信は**できない**（推移的ルーティング不可）

**解決策：**
1. A-Cを直接ピアリングする（25接続制限に注意）
2. Network Connectivity Centerを使用してHub-and-Spoke構成
3. Shared VPCに移行してネットワークを統合

**試験での識別パターン：**
「複数のVPCをメッシュ状に接続したい」→ NCC
「単純に2VPC接続したい」→ Peering
「同一組織で共通ネットワーク」→ Shared VPC`,
          },
        ],
      },
      {
        id: "pcne-vpc-s3",
        title: "CIDR設計のベストプラクティス",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "text",
            markdown: `## CIDR設計の考え方

### RFC1918プライベートアドレス空間
GCPのVPCで使用できるプライベートIPアドレス空間は以下の3つ：

| アドレス空間 | 範囲 | ホスト数 | 推奨用途 |
|---|---|---|---|
| 10.0.0.0/8 | 10.0.0.0 ～ 10.255.255.255 | 約1,600万 | 大規模企業VPC（推奨） |
| 172.16.0.0/12 | 172.16.0.0 ～ 172.31.255.255 | 約104万 | 中規模 |
| 192.168.0.0/16 | 192.168.0.0 ～ 192.168.255.255 | 約6万5千 | 小規模のみ |

### サブネット分割の考え方

\`\`\`
prod-vpc: 10.0.0.0/8 全体割り当て

asia-northeast1 (東京):
  ├── 10.0.1.0/24   → フロントエンド層（254ホスト）
  ├── 10.0.2.0/24   → バックエンド層（254ホスト）
  ├── 10.0.3.0/24   → データベース層（254ホスト）
  ├── 10.0.4.0/22   → GKE Pods（1022ホスト）
  └── 10.0.8.0/24   → GKE Services

us-central1 (DR環境):
  ├── 10.1.1.0/24   → フロントエンド層
  └── 10.1.2.0/24   → バックエンド層
\`\`\`

### GKEのサイジング計算
GKEクラスターのCIDR設計は試験でよく問われる：
- ノード数 × (最大Pod数/ノード) = 必要なPodアドレス数
- 例：50ノード × 110 Pod = 5,500 IP → /19サブネット必要
- 推奨：予想の2倍のサイズを確保（拡張は大変）
`,
          },
          {
            type: "code_example",
            language: "bash",
            title: "gcloud compute networks subnets create コマンド",
            code: `# Custom mode VPCの作成
gcloud compute networks create prod-vpc \\
  --subnet-mode=custom \\
  --bgp-routing-mode=global \\
  --mtu=1500

# フロントエンド用サブネット作成（Private Google Access有効）
gcloud compute networks subnets create subnet-frontend \\
  --network=prod-vpc \\
  --region=asia-northeast1 \\
  --range=10.0.1.0/24 \\
  --enable-private-ip-google-access \\
  --enable-flow-logs \\
  --logging-metadata=include-all

# GKE用サブネット（セカンダリ範囲付き）
gcloud compute networks subnets create subnet-gke \\
  --network=prod-vpc \\
  --region=asia-northeast1 \\
  --range=10.0.4.0/22 \\
  --secondary-range=gke-pods=10.4.0.0/14,gke-services=10.8.0.0/20 \\
  --enable-private-ip-google-access

# サブネット範囲の拡張（縮小は不可）
gcloud compute networks subnets expand-ip-range subnet-frontend \\
  --region=asia-northeast1 \\
  --prefix-length=23

# 既存サブネットのセカンダリ範囲追加
gcloud compute networks subnets update subnet-gke \\
  --region=asia-northeast1 \\
  --add-secondary-ranges=gke-pods-2=10.12.0.0/14`,
            explanation:
              "本番環境では--enable-flow-logsを必ず有効化してVPCフローログを収集する。GKEサブネットのセカンダリ範囲は後から追加できるが、プライマリ範囲の変更は不可なため初期設計が重要。",
          },
          {
            type: "key_point",
            level: "warning",
            title: "オーバーラップするCIDRはVPC Peeringで使えない",
            content: `**設計段階での必須チェックリスト：**

1. オンプレミスのCIDRと重複していないか
2. 既存VPC（ピアリング候補）のCIDRと重複していないか
3. 将来追加予定のリージョン・環境のCIDRスペースを確保しているか
4. GKEのセカンダリ範囲（Pods/Services）がプライマリと重複していないか

**重複が発覚した場合の対処：**
- VPC Peeringは設定不可（CIDRが重複しているVPC間はピアリングできない）
- Shared VPCへの移行を検討
- Cloud VPN + Cloud Routerでルートフィルタリングも選択肢

**試験でよく出るトラップ：**
Auto modeのVPC（10.128.0.0/9）は多くのオンプレミスCIDRと衝突しやすく、VPC Peeringを後から追加するのが困難になる典型的な失敗例。`,
          },
        ],
      },
      {
        id: "pcne-vpc-s4",
        title: "Cloud NATとプライベートGoogleアクセス",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "comparison_table",
            title: "プライベート化手法の比較：Cloud NAT / Private Google Access / Private Service Connect / VPC Service Controls",
            headers: ["比較項目", "Cloud NAT", "Private Google Access", "Private Service Connect", "VPC Service Controls"],
            rows: [
              {
                label: "目的",
                values: [
                  "外部IPなしのVMからインターネット（アウトバウンド）への通信を可能にする",
                  "外部IPなしのVMからGoogle APIへのアクセスを可能にする",
                  "プライベートIPでGoogleマネージドサービスへ接続するエンドポイント",
                  "Google APIへのアクセスをVPCペリメータで制限し、データ漏洩を防止",
                ],
                highlight: true,
              },
              {
                label: "対象",
                values: [
                  "インターネット上の任意のエンドポイント（アウトバウンドのみ）",
                  "Google API（storage.googleapis.com等）のみ",
                  "Cloud SQL/Memorystore/GKE等のGCPマネージドサービス",
                  "Cloud Storage/BigQuery等のGoogleサービス（アクセス制御）",
                ],
              },
              {
                label: "インバウンド通信",
                values: [
                  "不可（アウトバウンドのみ）",
                  "不可",
                  "可（PSCエンドポイントへのインバウンド）",
                  "該当なし（アクセス制御の仕組み）",
                ],
              },
              {
                label: "設定箇所",
                values: [
                  "Cloud Router + Cloud NATの設定（リージョン単位）",
                  "サブネット設定でenable-private-ip-google-accessを有効化",
                  "VPC内にForwarding Ruleを作成、DNSレコードを設定",
                  "Access Context Manager + サービスペリメータの設定",
                ],
                highlight: true,
              },
              {
                label: "主なユースケース",
                values: [
                  "パッケージダウンロード、外部APIコール、ソフトウェア更新など",
                  "Cloud Storage/BigQuery/Secret Managerへのアクセス（外部IP不要）",
                  "Cloud SQLへのプライベート接続、サードパーティSaaSとのプライベート接続",
                  "機密データへのアクセスをVPC内に限定（DLP対策）",
                ],
              },
              {
                label: "コスト",
                values: [
                  "Cloud NAT処理料金 + データ処理料金（帯域幅による）",
                  "無料（サブネット設定のみ）",
                  "PSCエンドポイント作成料金 + データ転送料金",
                  "Access Context Managerのライセンス料金が必要",
                ],
              },
            ],
            footnote:
              "これらの手法は排他的ではなく、組み合わせて使用する。例：プライベートGoogleアクセス（Google API接続）+ Cloud NAT（インターネット接続）+ PSC（Cloud SQL接続）を同一サブネットで併用可能。",
          },
          {
            type: "concept_card",
            term: "Cloud NATのポート割り当てとPort Exhaustion",
            definition:
              "Cloud NATは複数のVMが共有するNATゲートウェイで、各VMに利用可能なポート数を割り当てる仕組み。NAT IPアドレス1つあたり65,535ポートをVMに分配する。大量の接続を維持するワークロードではPort Exhaustionが発生しアウトバウンド接続が失敗するリスクがある。",
            useCases: [
              "外部IPなしのコンピューティングインスタンスからのインターネットアクセス（aptアップデート等）",
              "GKEノードからDocker Hub等の外部コンテナレジストリへのアクセス",
              "Dataflow/Dataproc等のマネージドサービスからの外部APIコール",
              "Private Google Accessと組み合わせて完全プライベートな環境を構築",
              "オンプレミスからCloud NATを経由したインターネットアクセス（ハイブリッド環境）",
            ],
            characteristics: [
              "デフォルトのポート割り当ては動的（需要に応じて自動調整）、または静的（VM毎固定）",
              "静的ポート割り当て: min-ports-per-vm で最低保証ポート数を設定（デフォルト64）",
              "Port Exhaustion対策: NAT IPを追加するか、min-ports-per-vmを増やす（または両方）",
              "Cloud MonitoringのNAT割り当て/ドロップメトリクスでPort Exhaustionを監視",
              "Cloud NATはリージョン単位で設定し、同一リージョンの全サブネットに適用可能",
            ],
            examRelevance:
              "「VMから外部接続が失敗する」という問題の原因としてPort Exhaustionが頻出。解決策としてNAT IPの追加またはmin-ports-per-vmの増加を選択する問題が多い。",
          },
        ],
      },
    ],
  },
  {
    id: "pcne-hybrid-network",
    certId: "pcne",
    domainName: "ハイブリッドネットワークとCloud VPN",
    title: "ハイブリッドネットワークとCloud VPN",
    description:
      "オンプレミスとGCPを接続するCloud VPN・Cloud Interconnectの詳細設定、Network Connectivity Centerによる統合管理、BGPルーティング設計を実践的に学習します。",
    estimatedMinutes: 95,
    difficulty: "advanced",
    prerequisites: ["pcne-vpc-design"],
    relatedLabIds: ["lab-ha-vpn", "lab-dedicated-interconnect", "lab-ncc", "lab-cloud-router"],
    sections: [
      {
        id: "pcne-hybrid-s1",
        title: "Cloud VPNの種類と設定",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "comparison_table",
            title: "Classic VPN vs HA VPN の比較",
            headers: ["比較項目", "Classic VPN", "HA VPN"],
            rows: [
              {
                label: "SLA",
                values: ["99.9%（単一トンネル）", "99.99%（2トンネル構成時）"],
                highlight: true,
              },
              {
                label: "トンネル数",
                values: ["1つのVPNゲートウェイに最大4トンネル", "1つのゲートウェイに2つのインターフェース（各1+トンネル）"],
              },
              {
                label: "BGP要否",
                values: ["静的ルートまたはBGP（選択式）", "BGPが必須（動的ルーティング）"],
                highlight: true,
              },
              {
                label: "フェイルオーバー",
                values: [
                  "手動またはBGP（複数トンネル時）。フェイルオーバー後に再設定が必要なケースあり",
                  "自動フェイルオーバー（BGPによる自動ルート切り替え）",
                ],
                highlight: true,
              },
              {
                label: "帯域幅",
                values: ["最大3Gbps（3Gbpsトンネルの場合）", "最大3Gbps/トンネル（合計6Gbps）"],
              },
              {
                label: "Cloud Router",
                values: ["BGP使用時のみ必要", "必須（BGPが必須のため）"],
              },
              {
                label: "推奨用途",
                values: [
                  "開発・テスト環境、レガシー接続、一時的な接続",
                  "本番環境の全ての新規HA VPN構成（Classic VPNは新規作成非推奨）",
                ],
              },
            ],
            footnote:
              "Googleは新規構成にHA VPNを推奨。Classic VPNは既存環境の維持目的のみ。99.99% SLAはピア側も冗長構成が必要（Active/Activeの2トンネル）。",
          },
          {
            type: "concept_card",
            term: "IKEv2とBGP動的ルーティングの仕組み",
            definition:
              "HA VPNはIKEv2（Internet Key Exchange version 2）でIPsecトンネルを確立し、BGP（Border Gateway Protocol）で動的にルートを交換する。IKEv2は認証・暗号化ネゴシエーションを行い、BGPはトンネル上でネットワーク到達可能性情報（NLRI）を広告する。",
            useCases: [
              "オンプレミスデータセンターとGCPを99.99% SLAで接続",
              "複数のオンプレミスサイトをCloud Routerで動的ルーティング管理",
              "Interconnectのバックアップ回線としてHA VPNを使用",
              "異なるリージョンのVPCをVPN経由で接続（グローバルルーティング時）",
              "マルチクラウド接続（AWS/Azure VPN GWとのサイト間VPN）",
            ],
            characteristics: [
              "IKEv2ではPreShared Key（PSK）または証明書ベース認証をサポート",
              "BGP ASN: GCP側はCloud RouterのASN（64512-65534のプライベートAS推奨）",
              "BGPセッションはトンネルのリンクローカルアドレス（169.254.x.x）上で確立",
              "Cloud RouterはBGPで受信したルートをVPCルートテーブルに自動反映",
              "BGPのKeepAliveタイマーとHold Timeでトンネル障害を検知（デフォルト：Keepalive 20秒、Hold 60秒）",
            ],
            examRelevance:
              "HA VPNのBGPセッションがリンクローカルアドレスで確立される点、Cloud RouterのASN設定、ルート広告の制御（カスタムルートアドバタイズメント）が試験頻出。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "HA VPNで99.99% SLAを達成するための2トンネル構成",
            content: `**99.99% SLAの条件（両方必要）：**

1. **GCP側**: HA VPNゲートウェイに2つのインターフェース（interface 0とinterface 1）
2. **オンプレミス側**: 冗長なVPNデバイス（または1台に2つのWAN IP）に接続

\`\`\`
HA VPN Gateway (GCP)
  Interface 0 (IP-A) ─── Tunnel-0 ───> Peer VPN Device 1
  Interface 1 (IP-B) ─── Tunnel-1 ───> Peer VPN Device 2
\`\`\`

**試験での選択基準：**
- 「高可用性が必要」「SLA 99.99%が要件」→ HA VPN（2トンネル構成）
- 「コスト重視でダウンタイム許容」→ Classic VPN（ただし新規は非推奨）
- 「3Gbps以上の帯域が必要」→ Interconnectを検討（VPNの上限は3Gbps/トンネル）`,
          },
        ],
      },
      {
        id: "pcne-hybrid-s2",
        title: "Cloud Interconnect",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "comparison_table",
            title: "Dedicated Interconnect vs Partner Interconnect の比較",
            headers: ["比較項目", "Dedicated Interconnect", "Partner Interconnect"],
            rows: [
              {
                label: "帯域幅",
                values: [
                  "10Gbpsまたは100Gbpsの回線単位。複数回線でLAGによるアグリゲーション可能（最大200Gbps）",
                  "50Mbps～50Gbps（パートナーキャリアによって異なる）",
                ],
                highlight: true,
              },
              {
                label: "物理要件",
                values: [
                  "Googleのコロケーション施設（GCP POP）への物理的な専用回線が必要",
                  "パートナーキャリアの施設への接続のみでGCP POPへの直接接続不要",
                ],
                highlight: true,
              },
              {
                label: "SLA",
                values: [
                  "99.9%（シングル）→ 99.99%（2リージョン×2回線の冗長構成）",
                  "99.9%（シングル）→ 99.99%（冗長構成。パートナーのSLAに依存）",
                ],
              },
              {
                label: "コスト",
                values: [
                  "高い（専用回線の物理ポート料金 + GCPデータ転送料金）。大容量利用時はコスト効率が良い",
                  "中程度（パートナーのサービス料金 + GCPデータ転送料金）。小容量では割安",
                ],
              },
              {
                label: "セットアップ期間",
                values: [
                  "数週間〜数ヶ月（物理回線工事・クロスコネクト設置が必要）",
                  "数日〜数週間（パートナーがGCPとの接続を管理）",
                ],
              },
              {
                label: "BGP設定",
                values: [
                  "自社でCloud RouterとBGPセッションを設定・管理",
                  "Layered（L2/L3）によって異なる。L3パートナーはBGP設定をパートナーが管理",
                ],
              },
              {
                label: "適切なシナリオ",
                values: [
                  "10Gbps以上の帯域が必要、GCP POPへのコロケーションが可能、長期的な大規模接続",
                  "10Gbps未満、GCP POPへの直接アクセスが困難、パートナーキャリアとの既存関係がある",
                ],
                highlight: true,
              },
            ],
            footnote:
              "99.99% SLAにはリージョンを跨いだ冗長構成が必要（同一メトロの2回線では99.99%にならない）。Cloud RouterはInterconnect専用を作成することを推奨（VPNと共用しない）。",
          },
          {
            type: "text",
            markdown: `## Dedicated Interconnectの物理接続プロセス

### 接続フロー

\`\`\`
1. GCPコンソールでInterconnect接続リクエスト
   └── GCP POPの場所・回線速度(10G/100G)を選択

2. Googleから「LOA-CFA（Letter of Authorization and Connecting Facility Assignment）」を取得
   └── コロケーション施設でのラック・ポート情報が記載

3. LOA-CFAをコロケーション施設のオペレーターに提出
   └── 施設がGCPの機器とクロスコネクト（光ファイバーケーブル）を接続

4. 物理リンクのテスト・確認
   └── GCPコンソールで光レベルとリンクステータスを確認

5. VLAN Attachmentの作成
   └── Cloud RouterとBGP設定を完了して通信開始
\`\`\`

### VLAN Attachmentの設計
- 1つのInterconnect回線に複数のVLAN Attachmentを作成可能
- 各VLAN AttachmentはCloud VPCのCloud Routerに接続
- 本番/開発環境を同一回線で分離する際はVLAN IDで分ける

### 冗長構成（99.99%）
\`\`\`
Metro A (Tokyo):
  Interconnect-1 → Cloud Router-A → VPC
  Interconnect-2 → Cloud Router-A → VPC（別のPOPへ）

Metro B (Osaka/別リージョン):
  Interconnect-3 → Cloud Router-B → VPC
  Interconnect-4 → Cloud Router-B → VPC
\`\`\`
`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "10Gbps以上ならDedicated、それ以下ならPartner",
            content: `**帯域幅による選択基準：**
- 50Mbps ～ 10Gbps未満 → Partner Interconnect
- 10Gbps以上 → Dedicated Interconnect（物理POPへのアクセスが前提）
- 100Gbps以上 → Dedicated（100G回線またはLAGアグリゲーション）

**その他の判断要因：**
- 「Google POPへの物理アクセスがない」→ Partner（Dedicatedは物理接続必須）
- 「今すぐ接続したい（数日以内）」→ Partner（Dedicatedは物理工事で数週間）
- 「コスト最小化」かつ「低帯域」→ Partner
- 「完全にGoogleとのSLAが必要」→ Dedicated（PartnerはパートナーSLAに依存）

**VPN vs Interconnectの選択：**
- 帯域 < 3Gbps かつ 厳密なSLA不要 → HA VPN
- 帯域 >= 1Gbps かつ 安定したSLA必要 → Interconnect`,
          },
        ],
      },
      {
        id: "pcne-hybrid-s3",
        title: "Network Connectivity Center",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "Network Connectivity Center (NCC) のHub-and-Spoke モデル",
            definition:
              "NCCはGoogleのバックボーンネットワークを活用してWANを構築するサービス。中央のHubに対して、VPN/Interconnect/SD-WANのSpokeを接続することで、Spoke間の推移的なルーティングを実現し、フルメッシュ接続なしにネットワークを統合管理できる。",
            useCases: [
              "複数のオンプレミスサイト（支社）をGCPのHubで統合し、サイト間通信をGCPバックボーン経由で実現",
              "VPN SpokeとInterconnect Spokeを混在させてハイブリッド環境を一元管理",
              "SD-WANデバイス（Cisco SD-WAN/VMware VeloCloud等）をSpokeとして接続",
              "異なるVPCをVPC Spokeとして接続し、VPC Peering非推移性の問題を解決",
              "Googleのグローバルバックボーンを使ったサイト間データ転送（インターネット経由より低レイテンシ）",
            ],
            characteristics: [
              "HubはGoogle Cloud組織に紐付き、リージョンをまたがる全Spokeを管理",
              "Spoke間のルーティングはGoogleバックボーン経由（インターネットを通過しない）",
              "VPN Spoke: HA VPNゲートウェイをSpokeとして登録",
              "Interconnect Spoke: VLAN AttachmentをSpokeとして登録",
              "VPC Spoke: 既存VPCをSpokeとして登録（VPC間の推移的ルーティングが可能に）",
            ],
            examRelevance:
              "「複数サイト間の推移的なルーティングが必要」「SD-WANをGCPに接続」「VPC Peeringの推移性問題を解決」という要件でNCCが正解になる。フルメッシュVPNよりNCCが管理コストで優位。",
          },
          {
            type: "text",
            markdown: `## VPN/Interconnect/SD-WANをNCCで統合管理する方法

### NCCのコアコンセプト

\`\`\`
                    [NCC Hub]
                        |
          ┌─────────────┼─────────────┐
          |             |             |
    [VPN Spoke]  [Interconnect   [VPC Spoke]
   (支社-東京)    Spoke]           (prod-vpc)
                (本社DC-大阪)
\`\`\`

### 設定手順

\`\`\`bash
# 1. NCCハブの作成
gcloud network-connectivity hubs create corporate-hub \\
  --description="企業WANハブ"

# 2. HA VPNをSpokeとして登録
gcloud network-connectivity spokes linked-vpn-tunnels create branch-tokyo \\
  --hub=corporate-hub \\
  --region=asia-northeast1 \\
  --vpn-tunnels=tunnel-tokyo-0,tunnel-tokyo-1 \\
  --site-to-site-data-transfer

# 3. InterconnectをSpokeとして登録
gcloud network-connectivity spokes linked-interconnect-attachments create hq-osaka \\
  --hub=corporate-hub \\
  --region=asia-northeast1 \\
  --interconnect-attachments=vlan-attachment-osaka-0,vlan-attachment-osaka-1 \\
  --site-to-site-data-transfer

# 4. VPCをSpokeとして登録
gcloud network-connectivity spokes linked-vpc-network create prod-vpc-spoke \\
  --hub=corporate-hub \\
  --vpc-network=prod-vpc
\`\`\`

### Spoke間ルーティングの確認
NCCでSpokeを接続すると、Spoke間のルートが自動的にCloud Routerに広告される。各Spokeのルートテーブルを確認して推移的ルーティングが機能していることを検証する。
`,
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "試験でのNCC vs 従来接続の選択基準",
            content: `**NCCを選ぶべきシナリオ：**
- 3つ以上のサイト/VPCを相互接続（フルメッシュは管理困難）
- オンプレミス支社間の通信をGCPバックボーン経由で行いたい
- SD-WANソリューションをGCPに統合
- VPC Peeringの推移性問題を解決したい

**従来接続（VPN/Interconnect単体）を選ぶシナリオ：**
- 単純なGCP-オンプレミス接続（1対1）
- NCCに追加コストを払いたくない
- SD-WAN不使用で単純なVPN接続のみ

**NCC使用時の注意点：**
- site-to-site-data-transferオプションを有効にするとSpokeを跨いだ通信に追加料金
- VPC Spokeはデータ転送料金が発生（VPC Peering相当のコスト感）`,
          },
        ],
      },
      {
        id: "pcne-hybrid-s4",
        title: "BGPルーティング設計",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "text",
            markdown: `## BGPアドバタイズメントとルート優先度の制御

### Cloud RouterのBGP基本動作

Cloud RouterはGCPのマネージドBGPルーターで、VPN/Interconnectトンネルを通じてオンプレミスとルート情報を交換する。

\`\`\`
Cloud Router の動作：
1. GCP側のVPCサブネットルートをBGPでオンプレミスに広告
2. オンプレミスから広告されたルートをVPCのカスタムルートとして追加
3. 複数のトンネルがある場合、優先度（MED/ローカルプリファレンス）に基づいてトラフィックを制御
\`\`\`

### カスタムルートアドバタイズメント

デフォルトではCloud RouterはVPCの全サブネットルートを広告するが、カスタム設定でフィルタリングできる：

\`\`\`
デフォルト広告:
  VPCの全サブネット → オンプレミスへ広告

カスタム広告（ルート集約の例）:
  10.0.0.0/8 (集約ルート) → 個別サブネットの代わりに広告
  追加ルート: 192.168.100.0/24 → 静的ルートも広告可能
\`\`\`

### Active/Passive フェイルオーバー設計

\`\`\`
Primary Path: Interconnect (MEDを低く設定)
  → オンプレミス側でより低いMEDを見て優先使用

Backup Path: HA VPN (MEDを高く設定)
  → Interconnect障害時に自動フェイルオーバー

GCP側の制御:
  Cloud Router に base-advertised-route-priority を設定
  Primary: 100 (低い=優先)
  Backup: 200 (高い=非優先)
\`\`\`
`,
          },
          {
            type: "code_example",
            language: "bash",
            title: "gcloud compute routers create --bgp-asn コマンド例",
            code: `# Cloud Routerの作成（HA VPN用）
gcloud compute routers create cloud-router-tokyo \\
  --network=prod-vpc \\
  --region=asia-northeast1 \\
  --asn=65001 \\
  --advertisement-mode=custom \\
  --set-advertisement-ranges=10.0.0.0/8 \\
  --set-advertisement-groups=ALL_SUBNETS

# BGPピア設定（HA VPNトンネル0用）
gcloud compute routers add-bgp-peer cloud-router-tokyo \\
  --region=asia-northeast1 \\
  --peer-name=peer-onprem-0 \\
  --peer-asn=65002 \\
  --interface=tunnel-tokyo-0 \\
  --peer-ip-address=169.254.0.2 \\
  --ip-address=169.254.0.1 \\
  --advertised-route-priority=100

# BGPピア設定（HA VPNトンネル1用、バックアップ優先度高め）
gcloud compute routers add-bgp-peer cloud-router-tokyo \\
  --region=asia-northeast1 \\
  --peer-name=peer-onprem-1 \\
  --peer-asn=65002 \\
  --interface=tunnel-tokyo-1 \\
  --peer-ip-address=169.254.1.2 \\
  --ip-address=169.254.1.1 \\
  --advertised-route-priority=200

# Cloud Routerのルート情報確認
gcloud compute routers get-status cloud-router-tokyo \\
  --region=asia-northeast1 \\
  --format="json(result.bgpPeerStatus)"

# カスタムルートアドバタイズメントの更新
gcloud compute routers update-bgp-peer cloud-router-tokyo \\
  --region=asia-northeast1 \\
  --peer-name=peer-onprem-0 \\
  --advertisement-mode=custom \\
  --set-advertisement-ranges=10.0.0.0/8,192.168.100.0/24`,
            explanation:
              "advertised-route-priorityはGCPがオンプレミスに広告するMED値。値が小さいほどそのパスが優先される。オンプレミス→GCP方向の優先度はオンプレミス側のBGP設定（ローカルプリファレンス）で制御する。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "MED vs ローカルプリファレンスの使い分け",
            content: `**MED（Multi-Exit Discriminator）:**
- GCP→オンプレミス方向の優先度制御
- Cloud RouterのAdvertised Route Priority = MEDとして送信される
- 値が**小さい**ほど優先される
- GCP側で設定（Cloud Router）

**ローカルプリファレンス（Local Preference）:**
- オンプレミス→GCP方向の優先度制御
- オンプレミスのルーターで設定（GCPで設定不可）
- 値が**大きい**ほど優先される
- AS内でのみ有効（eBGPでは広告されない）

**試験での判断：**
- 「GCPからオンプレミスへのトラフィック優先制御」→ Cloud RouterのAdvertised Route Priority（MED）
- 「オンプレミスからGCPへのトラフィック優先制御」→ オンプレミス側のローカルプリファレンス
- 「Active/Passive Interconnect + VPN バックアップ」→ InterconnectのCloud RouterにMED=100、VPNにMED=200`,
          },
        ],
      },
    ],
  },
  {
    id: "pcne-lb-services",
    certId: "pcne",
    domainName: "Cloud Load Balancingとネットワークサービス",
    title: "Cloud Load Balancingとネットワークサービス",
    description:
      "GCPの全7種類のロードバランサーの特性と使い分け、Network Endpoint Group（NEG）の5種類、Cloud CDN・Cloud DNS・Cloud Armorの設定を実践的に学習します。",
    estimatedMinutes: 100,
    difficulty: "advanced",
    prerequisites: ["pcne-vpc-design"],
    relatedLabIds: ["lab-https-lb", "lab-neg", "lab-cloud-armor", "lab-cloud-cdn"],
    sections: [
      {
        id: "pcne-lb-s1",
        title: "Cloud Load Balancingの全種類",
        estimatedMinutes: 30,
        blocks: [
          {
            type: "comparison_table",
            title: "Cloud Load Balancer 7種類の比較",
            headers: ["LBの種類", "レイヤー", "スコープ", "プロトコル", "主なユースケース"],
            rows: [
              {
                label: "Global External HTTPS LB",
                values: [
                  "L7",
                  "グローバル（Anycast IP）",
                  "HTTP/HTTPS/HTTP2/gRPC",
                  "Web アプリ、APIゲートウェイ、マルチリージョン展開。URLマップ・Cloud CDN・Cloud Armor統合",
                ],
                highlight: true,
              },
              {
                label: "Global SSL Proxy LB",
                values: [
                  "L4（SSL終端）",
                  "グローバル",
                  "TCP with SSL/TLS",
                  "TCP上でSSL終端が必要で、HTTPではないプロトコル（HTTPS以外）の負荷分散",
                ],
              },
              {
                label: "Global TCP Proxy LB",
                values: [
                  "L4（TCP）",
                  "グローバル",
                  "TCP（SSLなし）",
                  "グローバルなTCP負荷分散（SSLオフロード不要のケース）",
                ],
              },
              {
                label: "Regional External TCP/UDP LB",
                values: [
                  "L4",
                  "リージョナル",
                  "TCP/UDP（パススルー）",
                  "パケットをそのままバックエンドに転送（ソースIPを保持）。ゲームサーバー、IoT",
                ],
                highlight: true,
              },
              {
                label: "Regional External HTTPS LB",
                values: [
                  "L7",
                  "リージョナル",
                  "HTTP/HTTPS/HTTP2/gRPC",
                  "単一リージョン内のL7負荷分散。グローバルIPが不要な場合",
                ],
              },
              {
                label: "Internal TCP/UDP LB（Passthrough）",
                values: [
                  "L4",
                  "リージョナル（内部）",
                  "TCP/UDP",
                  "VPC内部のサービス間通信。マイクロサービスのサービスディスカバリ、オンプレミスからのプライベートアクセス",
                ],
                highlight: true,
              },
              {
                label: "Internal HTTPS LB",
                values: [
                  "L7",
                  "リージョナル（内部）",
                  "HTTP/HTTPS/HTTP2/gRPC",
                  "VPC内部のL7負荷分散。URLベースのルーティングが必要な内部マイクロサービス",
                ],
              },
            ],
            footnote:
              "選択の主な判断軸：①内部(Internal) or 外部(External)、②グローバル or リージョナル、③L4 or L7（URLルーティング・SSL終端が必要か）。試験では要件から正確に特定することが求められる。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "グローバル vs リージョナルの使い分け判断基準",
            content: `**グローバルLBを選ぶ条件（いずれか1つ以上）：**
- 複数リージョンにバックエンドを配置してAnyCastで最寄りリージョンに転送したい
- Cloud CDNを使用したい（グローバルHTTPS LBのみ対応）
- Cloud Armorを使用したい（グローバルHTTPS LBが最適、一部リージョナルも対応）
- DDoS対策としてGoogleのグローバルエッジで処理したい
- 単一グローバルIPアドレスで全世界からアクセスしたい

**リージョナルLBを選ぶ条件：**
- 単一リージョンのみにユーザーがいる
- データ居住性要件でリージョンをまたがるべきでない
- プライベートサービス（Internal LB）
- ソースIPアドレスの保持が必要（L4 passthrough）

**HTTPS LBの「Premium Tier vs Standard Tier」：**
- Premium（デフォルト）→ Googleバックボーン経由でエッジポップに接続（低レイテンシ）
- Standard → ユーザーからGCPリージョンへ通常インターネット経由（コスト削減）
- グローバルLBはPremium Tier必須`,
          },
        ],
      },
      {
        id: "pcne-lb-s2",
        title: "Network Endpoint Group (NEG)",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "comparison_table",
            title: "NEG 5種類の比較",
            headers: ["NEGの種類", "バックエンドタイプ", "主なユースケース"],
            rows: [
              {
                label: "Zonal NEG",
                values: [
                  "GCEインスタンス（VM）またはGKE Pod（IP:Portレベル）",
                  "GKEコンテナポートへの直接転送（Container-native LB）。Podに直接ヘルスチェックを実施",
                ],
                highlight: true,
              },
              {
                label: "Internet NEG",
                values: [
                  "インターネット上のエンドポイント（外部IPまたはFQDN）",
                  "サードパーティAPIやオンプレミスエンドポイントをGlobal HTTPS LBのバックエンドとして登録",
                ],
              },
              {
                label: "Serverless NEG",
                values: [
                  "Cloud Run / App Engine / Cloud Functions",
                  "サーバーレスサービスをHTTPS LBの背後に配置。Cloud Armorによるセキュリティ適用、Cloud CDN統合",
                ],
                highlight: true,
              },
              {
                label: "Hybrid NEG",
                values: [
                  "オンプレミスまたは他クラウドのIPアドレス（VPN/Interconnect経由）",
                  "オンプレミスのサービスをGCP LBのバックエンドに追加。ハイブリッドアーキテクチャの段階的移行",
                ],
              },
              {
                label: "PSC NEG（Private Service Connect）",
                values: [
                  "Private Service ConnectエンドポイントのIPアドレス",
                  "マネージドサービス（Cloud SQL等）やプロデューサーサービスをHTTPS LBのバックエンドとして使用",
                ],
              },
            ],
            footnote:
              "Instance GroupとNEGの使い分け：Instance GroupはVMインスタンス単位（L4/L7両対応）、Zonal NEGはPod/コンテナポート単位（Container-native LBでGKE最適化）。Cloud Run等のサーバーレスは必ずServerless NEGが必要。",
          },
          {
            type: "text",
            markdown: `## Cloud Run・GKE・オンプレミスをLBバックエンドとして使う方法

### Cloud Run + Serverless NEG + Global HTTPS LB

\`\`\`bash
# 1. Cloud RunのServerless NEGを作成
gcloud compute network-endpoint-groups create cloudrun-neg \\
  --region=asia-northeast1 \\
  --network-endpoint-type=serverless \\
  --cloud-run-service=my-service

# 2. バックエンドサービスにNEGを追加
gcloud compute backend-services create cloudrun-backend \\
  --load-balancing-scheme=EXTERNAL_MANAGED \\
  --global

gcloud compute backend-services add-backend cloudrun-backend \\
  --network-endpoint-group=cloudrun-neg \\
  --network-endpoint-group-region=asia-northeast1 \\
  --global
\`\`\`

### GKE + Zonal NEG（Container-native LB）

\`\`\`yaml
# GKE ServiceのアノテーションでNEGを有効化
apiVersion: v1
kind: Service
metadata:
  name: my-service
  annotations:
    cloud.google.com/neg: '{"ingress": true}'
    # またはカスタムNEG名：
    # cloud.google.com/neg: '{"exposed_ports":{"80":{}}}'
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 8080
\`\`\`

### Hybrid NEG（オンプレミスバックエンド）

\`\`\`bash
# HA VPN or Interconnect経由でオンプレミスに接続後
# Hybrid NEGでオンプレミスIPをバックエンドとして登録

gcloud compute network-endpoint-groups create onprem-neg \\
  --network-endpoint-type=non-gcp-private-ip-port \\
  --network=prod-vpc \\
  --zone=asia-northeast1-a

# オンプレミスエンドポイントを追加
gcloud compute network-endpoint-groups update onprem-neg \\
  --zone=asia-northeast1-a \\
  --add-endpoint="ip=192.168.1.10,port=8080"
\`\`\`
`,
          },
        ],
      },
      {
        id: "pcne-lb-s3",
        title: "Cloud CDNとCloud DNS",
        estimatedMinutes: 20,
        blocks: [
          {
            type: "concept_card",
            term: "Cloud CDNのキャッシュキーとオリジンとの通信",
            definition:
              "Cloud CDNはGlobal HTTPS LBと統合されたコンテンツデリバリーネットワーク。リクエストのキャッシュキー（デフォルト：URLフル文字列）に基づいてエッジキャッシュにコンテンツを保存し、オリジンへのリクエストを削減する。キャッシュヒット時はGCPエッジノードから直接レスポンスを返す。",
            useCases: [
              "静的アセット（画像/CSS/JS）のエッジキャッシュによるレイテンシ削減とバックエンド負荷軽減",
              "動画ストリーミングコンテンツのエッジ配信",
              "APIレスポンスのキャッシュ（Cache-Control: max-ageを適切に設定）",
              "バックエンドのスケールアウト不要なピーク対応（CDNがバッファ）",
              "Signed URLsによる一時的なプライベートコンテンツ配信",
            ],
            characteristics: [
              "キャッシュキーのカスタマイズ：ヘッダー/クエリパラメータを含める・除外する設定が可能",
              "キャッシュモード：CACHE_ALL_STATIC（静的コンテンツ自動判定）、USE_ORIGIN_HEADERS、FORCE_CACHE_ALL",
              "キャッシュ無効化（Invalidation）：特定URLまたはURLプレフィックスのキャッシュを即時パージ",
              "オリジン通信：キャッシュミス時はバックエンドサービス（NEG/Instance Group）へリクエスト転送",
              "負の有効期間（Negative Caching）：404や301等のエラーレスポンスもキャッシュ可能",
            ],
            examRelevance:
              "キャッシュキーのカスタマイズ問題（クエリ文字列をキャッシュキーに含めるかどうか）、Cache-Control設定とCDNの動作の関係、Signed URLによるコンテンツ保護が頻出。",
          },
          {
            type: "comparison_table",
            title: "Cloud DNS ゾーン種類の比較",
            headers: ["ゾーン種類", "用途", "可視性", "特徴"],
            rows: [
              {
                label: "Public Zone",
                values: [
                  "外部向けドメインのDNSレコード管理",
                  "インターネット全体から参照可能",
                  "Cloud DNSがGoogleのグローバルAnycastサーバーでホスト。99.999%のSLA",
                ],
                highlight: false,
              },
              {
                label: "Private Zone",
                values: [
                  "VPC内部のプライベートDNS名前解決",
                  "指定したVPCからのみ参照可能",
                  "VPC内のリソースが内部ドメイン名（例：service.internal）でアクセス可能。Cloud Runや内部サービスのDNS登録に使用",
                ],
                highlight: true,
              },
              {
                label: "Forwarding Zone",
                values: [
                  "特定ドメインのクエリをオンプレミスまたは外部DNSサーバーに転送",
                  "クエリを転送する（解決自体はしない）",
                  "ハイブリッド環境でオンプレミスのDNS（corp.example.com等）をGCPから解決。転送先はオンプレミスDNSのIP",
                ],
                highlight: true,
              },
              {
                label: "Peering Zone",
                values: [
                  "別のVPCのPrivate ZoneをピアリングVPCから参照",
                  "ピアリング設定したVPCから参照可能",
                  "Shared VPCやVPC Peeringで接続されたVPC間でPrivate Zoneを共有する場合に使用",
                ],
              },
              {
                label: "Managed Reverse Lookup Zone",
                values: [
                  "VPC内部のIPアドレスの逆引き（PTR）クエリを解決",
                  "指定したVPCからのみ",
                  "GCEインスタンスのデフォルトIPの逆引き解決に使用",
                ],
              },
            ],
            footnote:
              "ハイブリッド環境では「Inbound DNS Forwarding」（オンプレミス→GCP Private Zoneへのクエリ転送）と「Outbound DNS Forwarding」（GCP→オンプレミスDNSへのクエリ転送）を組み合わせて使用する。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "CDNによるバックエンド負荷削減の仕組み",
            content: `**Cache Hit率とバックエンド負荷削減の関係：**
- Cache Hit率90% → バックエンドへのリクエストが10%に削減
- 適切なCache-Control設定がキャッシュ効果を最大化

**Cloud CDN最適化設定：**
\`\`\`
Cache-Control: public, max-age=3600      → 1時間キャッシュ
Cache-Control: public, s-maxage=86400   → CDNで1日、ブラウザはデフォルト
Cache-Control: no-store                 → キャッシュ禁止（動的コンテンツ）
\`\`\`

**試験でよく問われるシナリオ：**
- 「静的コンテンツのレイテンシを下げたい」→ Cloud CDN有効化
- 「キャッシュされてほしくないAPIレスポンスがキャッシュされている」→ Cache-Control: no-storeを設定
- 「コンテンツ更新後すぐに反映させたい」→ Cache Invalidationを実行
- 「認証済みユーザーのみコンテンツを配信」→ Signed URLsを使用`,
          },
        ],
      },
      {
        id: "pcne-lb-s4",
        title: "Cloud Armorとネットワークセキュリティ",
        estimatedMinutes: 25,
        blocks: [
          {
            type: "text",
            markdown: `## Cloud ArmorのセキュリティポリシーとWAFルールの設定

### Cloud Armorの概要

Cloud ArmorはGlobal HTTPS LBに統合されたWebアプリケーションファイアウォール（WAF）およびDDoS防御サービス。セキュリティポリシーをバックエンドサービスに適用してL7レベルの攻撃からアプリケーションを保護する。

### セキュリティポリシーのルール構造

\`\`\`
セキュリティポリシー（policy-name）
  ├── Rule Priority 1000: IP許可リスト（信頼できる社内IP）
  ├── Rule Priority 2000: 日本以外のIPをブロック（地理的制限）
  ├── Rule Priority 3000: SQLインジェクション防御（WAF事前構成ルール）
  ├── Rule Priority 4000: XSS防御（WAF事前構成ルール）
  └── Rule Priority 2147483647 (Default): Denyまたは Allow
\`\`\`

### ルールの優先度

- 優先度の数値が**小さい**ほど先に評価される（1 = 最優先）
- デフォルトルール（2147483647）はマッチするルールがない場合に適用
- ルールは「allow」「deny」「redirect」「throttle」「rate_based_ban」アクションをサポート

### 事前構成WAFルール（Managed Rules）

Googleが管理するOWASP Top 10対応のルールセット：
- \`sqli-stable\` → SQLインジェクション防御
- \`xss-stable\` → クロスサイトスクリプティング防御
- \`lfi-stable\` → ローカルファイルインクルード防御
- \`rfi-stable\` → リモートファイルインクルード防御
- \`rce-stable\` → リモートコード実行防御

### Adaptive Protectionによる自動DDoS防御

Adaptive ProtectionはML（機械学習）でベースライントラフィックを学習し、DDoS攻撃を自動検出してルール提案を行う。Standard以上のCloud Armorプランで使用可能。
`,
          },
          {
            type: "code_example",
            language: "bash",
            title: "gcloud compute security-policies rules create コマンド",
            code: `# セキュリティポリシーの作成
gcloud compute security-policies create web-security-policy \\
  --description="Webアプリケーション用セキュリティポリシー" \\
  --type=CLOUD_ARMOR

# SQLインジェクション防御ルールの追加（WAF事前構成ルール）
gcloud compute security-policies rules create 1000 \\
  --security-policy=web-security-policy \\
  --expression="evaluatePreconfiguredExpr('sqli-stable')" \\
  --action=deny-403 \\
  --description="SQLインジェクション防御"

# XSS防御ルールの追加
gcloud compute security-policies rules create 1001 \\
  --security-policy=web-security-policy \\
  --expression="evaluatePreconfiguredExpr('xss-stable')" \\
  --action=deny-403 \\
  --description="XSS防御"

# 特定IPをブロック
gcloud compute security-policies rules create 2000 \\
  --security-policy=web-security-policy \\
  --src-ip-ranges="203.0.113.0/24" \\
  --action=deny-403 \\
  --description="悪意のあるIPブロック"

# 日本のIPのみ許可（地理的制限）
gcloud compute security-policies rules create 3000 \\
  --security-policy=web-security-policy \\
  --expression="origin.region_code != 'JP'" \\
  --action=deny-403 \\
  --description="日本以外のIPからのアクセス拒否"

# レート制限ルール（1IPから1分間に100リクエスト超過でブロック）
gcloud compute security-policies rules create 4000 \\
  --security-policy=web-security-policy \\
  --expression="true" \\
  --action=throttle \\
  --rate-limit-threshold-count=100 \\
  --rate-limit-threshold-interval-sec=60 \\
  --conform-action=allow \\
  --exceed-action=deny-429 \\
  --enforce-on-key=IP \\
  --description="レート制限"

# ポリシーをバックエンドサービスに適用
gcloud compute backend-services update my-backend-service \\
  --global \\
  --security-policy=web-security-policy`,
            explanation:
              "ルールの優先度（第1引数の数値）は小さいほど優先して評価される。WAF事前構成ルールはevaluatePreconfiguredExpr()で参照。throttleアクションでレート制限、rate_based_banでIP一時遮断が可能。",
          },
          {
            type: "key_point",
            level: "exam_tip",
            title: "PCNE試験でのCloud Armor vs VPC Firewallの使い分け",
            content: `**Cloud Armorを選ぶ場合：**
- L7（HTTP/HTTPS）レベルの攻撃防御（SQLi, XSS, DDoS）
- Webアプリケーションのグローバルなエッジ保護
- IP/地域ベースのアクセス制御（LBの手前で処理）
- レート制限・スロットリング
- 対象：Global/Regional HTTPS LBのバックエンドサービス

**VPC Firewallを選ぶ場合：**
- L4（TCP/UDP）レベルのポートベースアクセス制御
- VPC内部のVM間通信制御
- プロトコルレベルのアクセス制御（ポート番号・プロトコル）
- Network Tags/Service Accountsによる柔軟なルール適用

**組み合わせ使用（多層防御）：**
\`\`\`
インターネット
    ↓
Cloud Armor（L7: WAF/DDoS/地域制限）
    ↓
Global HTTPS LB
    ↓
VPC Firewall（L4: ポート/プロトコル制御）
    ↓
GCEインスタンス / GKE
\`\`\`

**試験のトラップ：**
「オンプレミスからのアクセスのみ許可したい」→ VPC Firewall（Cloud ArmorはExternal LBのみ）
「DDoS攻撃を自動検出したい」→ Cloud Armor Adaptive Protection`,
          },
        ],
      },
    ],
  },
]
