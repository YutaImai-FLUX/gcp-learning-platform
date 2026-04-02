import type { QuizQuestion } from "@/lib/types/quiz"

export const PCNE_EXTRA_QUESTIONS: QuizQuestion[] = [
  // ─── VPCネットワークの設計と実装 (35%) ───
  {
    id: "pcne-006",
    certId: "pcne",
    domain: "VPCネットワークの設計と実装",
    difficulty: "easy",
    question:
      "VPCピアリングで接続された2つのVPC間の通信について、正しい説明はどれですか？",
    options: [
      "トラフィックは公衆インターネットを経由する",
      "トラフィックはGoogleの内部ネットワークを経由し、パブリックIPアドレスは不要",
      "Cloud VPNトンネルが自動的に作成される",
      "両方のVPCが同じプロジェクトに属している必要がある",
    ],
    correctIndex: 1,
    explanation:
      "VPCピアリングはGoogleの内部ネットワークを使用してVPC間を接続します。トラフィックはインターネットを経由せず、低レイテンシで高帯域幅の通信が可能です。異なるプロジェクトや組織間でもピアリングできます。",
    tags: ["vpc-peering", "internal-network", "connectivity"],
  },
  {
    id: "pcne-007",
    certId: "pcne",
    domain: "VPCネットワークの設計と実装",
    difficulty: "easy",
    question:
      "Shared VPCにおいて、サービスプロジェクトのリソースがホストプロジェクトのサブネットを使用するために必要な権限はどれですか？",
    options: [
      "roles/compute.networkAdmin",
      "roles/compute.networkUser",
      "roles/owner",
      "roles/compute.securityAdmin",
    ],
    correctIndex: 1,
    explanation:
      "Shared VPCでサービスプロジェクトのユーザーがホストプロジェクトのサブネットにリソースをデプロイするには、compute.networkUserロールが必要です。このロールにより、指定されたサブネットへのアクセスが許可されます。",
    tags: ["shared-vpc", "iam", "network-user"],
  },
  {
    id: "pcne-008",
    certId: "pcne",
    domain: "VPCネットワークの設計と実装",
    difficulty: "medium",
    question:
      "VPCピアリングの推移的ルーティングに関する正しい説明はどれですか？",
    options: [
      "VPC-AとVPC-B、VPC-BとVPC-Cがピアリングされている場合、VPC-AからVPC-Cへ自動的に到達できる",
      "VPCピアリングは推移的ではないため、VPC-AからVPC-Cへの通信には別途ピアリングが必要",
      "Cloud Routerを使えば推移的ルーティングが自動的に有効になる",
      "ネットワークタグを設定すれば推移的ルーティングが可能になる",
    ],
    correctIndex: 1,
    explanation:
      "VPCピアリングは推移的（トランジティブ）ではありません。VPC-AとVPC-B、VPC-BとVPC-Cがピアリングされていても、VPC-AからVPC-Cへは直接通信できません。必要に応じてVPC-AとVPC-C間にも個別のピアリングを設定する必要があります。",
    tags: ["vpc-peering", "transitive-routing", "network-design"],
  },
  {
    id: "pcne-009",
    certId: "pcne",
    domain: "VPCネットワークの設計と実装",
    difficulty: "medium",
    question:
      "Private Google Accessを有効にする主な目的はどれですか？",
    options: [
      "外部IPアドレスを持つVMからGoogle APIに高速アクセスする",
      "外部IPアドレスを持たないVMからGoogle APIやサービスにアクセスする",
      "オンプレミスネットワークからGoogle Cloudリソースにアクセスする",
      "VPC間のプライベート通信を暗号化する",
    ],
    correctIndex: 1,
    explanation:
      "Private Google Accessをサブネットレベルで有効にすると、外部IPアドレスを持たないVMインスタンスがGoogle APIやサービス（Cloud Storage、BigQueryなど）にアクセスできるようになります。トラフィックはGoogleの内部ネットワーク経由でルーティングされます。",
    tags: ["private-google-access", "subnet", "google-apis"],
  },
  {
    id: "pcne-010",
    certId: "pcne",
    domain: "VPCネットワークの設計と実装",
    difficulty: "hard",
    question:
      "Shared VPCで、特定のサービスプロジェクトに対してのみ特定のサブネットへのアクセスを許可する最適な方法はどれですか？",
    options: [
      "ホストプロジェクトのVPCファイアウォールルールでサービスプロジェクトのIPを許可する",
      "サブネットレベルでcompute.networkUserロールをサービスプロジェクトのサービスアカウントに付与する",
      "組織ポリシーでサブネット使用を制限する",
      "VPCピアリングを使用して個別に接続する",
    ],
    correctIndex: 1,
    explanation:
      "Shared VPCでは、compute.networkUserロールをサブネットレベルで付与することで、特定のサービスプロジェクトに対して特定のサブネットのみへのアクセスを許可できます。プロジェクトレベルで付与すると全サブネットにアクセスできてしまうため、最小権限の原則に従ってサブネットレベルでの制御が推奨されます。",
    tags: ["shared-vpc", "subnet-level-iam", "least-privilege"],
  },
  {
    id: "pcne-011",
    certId: "pcne",
    domain: "VPCネットワークの設計と実装",
    difficulty: "hard",
    question:
      "カスタムモードVPCで、複数リージョンにまたがるサブネットの設計において考慮すべき制約はどれですか？",
    options: [
      "1つのサブネットは複数のリージョンにまたがることができる",
      "各サブネットは1つのリージョンに限定され、CIDR範囲はVPC内で重複できない",
      "サブネットのCIDR範囲は/16以上でなければならない",
      "1つのVPCに作成できるサブネット数は最大10個である",
    ],
    correctIndex: 1,
    explanation:
      "Google CloudのVPCサブネットはリージョナルリソースであり、1つのリージョンに限定されます。ただし、そのリージョン内の全ゾーンで利用可能です。また、同一VPC内のサブネットのCIDR範囲は重複できません。VPCはグローバルリソースですが、サブネットはリージョナルです。",
    tags: ["vpc-design", "subnet", "cidr", "regional"],
  },
  {
    id: "pcne-012",
    certId: "pcne",
    domain: "VPCネットワークの設計と実装",
    difficulty: "hard",
    question:
      "VPCフローログの設定で、コストを最適化しながら十分なネットワーク可視性を確保するためのベストプラクティスはどれですか？",
    options: [
      "すべてのサブネットで100%のサンプリングレートを設定する",
      "サンプリングレートを0.5に設定し、集約間隔を10秒にする",
      "VPCフローログを無効にしてCloud Monitoringのみを使用する",
      "ログを30日以上保持してBigQueryにエクスポートする",
    ],
    correctIndex: 1,
    explanation:
      "VPCフローログのサンプリングレートを0.5（50%）に設定し、集約間隔を調整することで、コストを削減しながらネットワークトラフィックの代表的なサンプルを取得できます。100%のサンプリングはコストが高く、多くのユースケースでは50%で十分な可視性が得られます。",
    tags: ["vpc-flow-logs", "cost-optimization", "monitoring"],
  },
  // ─── ハイブリッドネットワークの実装 (25%) ───
  {
    id: "pcne-013",
    certId: "pcne",
    domain: "ハイブリッドネットワークの実装",
    difficulty: "easy",
    question:
      "Cloud Interconnect（Dedicated）の最小帯域幅はどれですか？",
    options: ["50 Mbps", "500 Mbps", "10 Gbps", "100 Gbps"],
    correctIndex: 2,
    explanation:
      "Dedicated Interconnectの最小接続帯域幅は10 Gbpsです。より小さな帯域幅が必要な場合は、Partner Interconnectを使用して50 Mbpsから利用可能です。Dedicated Interconnectは10 Gbps、100 Gbpsのリンク容量をサポートします。",
    tags: ["cloud-interconnect", "dedicated", "bandwidth"],
  },
  {
    id: "pcne-014",
    certId: "pcne",
    domain: "ハイブリッドネットワークの実装",
    difficulty: "easy",
    question:
      "Cloud VPNで使用される暗号化プロトコルはどれですか？",
    options: ["TLS 1.3", "IPsec", "SSH", "WireGuard"],
    correctIndex: 1,
    explanation:
      "Cloud VPNはIPsec VPNトンネルを使用して、Google CloudのVPCネットワークとオンプレミスネットワーク間のトラフィックを暗号化します。HA VPNは99.99%のSLAを提供し、BGPによる動的ルーティングをサポートします。",
    tags: ["cloud-vpn", "ipsec", "encryption"],
  },
  {
    id: "pcne-015",
    certId: "pcne",
    domain: "ハイブリッドネットワークの実装",
    difficulty: "medium",
    question:
      "HA VPN（High Availability VPN）で99.99%のSLAを達成するための要件はどれですか？",
    options: [
      "1つのVPNゲートウェイと1つのトンネルを構成する",
      "2つのVPNゲートウェイインターフェースそれぞれにトンネルを構成し、BGPセッションを設定する",
      "Cloud Interconnectとの併用が必須",
      "プレミアムネットワークティアの使用が必須",
    ],
    correctIndex: 1,
    explanation:
      "HA VPNで99.99%のSLAを達成するには、VPNゲートウェイの2つのインターフェース（interface 0とinterface 1）それぞれにトンネルを構成し、BGPによる動的ルーティングを設定する必要があります。これにより冗長性が確保されます。",
    tags: ["ha-vpn", "sla", "redundancy", "bgp"],
  },
  {
    id: "pcne-016",
    certId: "pcne",
    domain: "ハイブリッドネットワークの実装",
    difficulty: "medium",
    question:
      "オンプレミスからGoogle Cloudへの接続で、低レイテンシかつ高帯域幅が必要だが、Googleのコロケーション施設に直接接続できない場合、最適な接続方法はどれですか？",
    options: [
      "Classic VPN",
      "HA VPN",
      "Partner Interconnect",
      "Direct Peering",
    ],
    correctIndex: 2,
    explanation:
      "Partner Interconnectは、サポートされているサービスプロバイダーを介してGoogle Cloudに接続できます。Googleのコロケーション施設に直接接続できない場合でも、パートナーのネットワーク経由で低レイテンシ・高帯域幅の接続が可能です。",
    tags: ["partner-interconnect", "hybrid-connectivity", "colocation"],
  },
  {
    id: "pcne-017",
    certId: "pcne",
    domain: "ハイブリッドネットワークの実装",
    difficulty: "hard",
    question:
      "Cloud RouterのBGPセッションでカスタムルートアドバタイズを使用する主なユースケースはどれですか？",
    options: [
      "デフォルトルートのみをオンプレミスに広告するため",
      "VPCサブネットルートに加えて、特定のカスタムIPレンジやPrivate Google Accessの範囲をオンプレミスに広告するため",
      "BGPセッションのキープアライブ間隔を変更するため",
      "Cloud VPNのトンネル帯域幅を増加させるため",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Routerのカスタムルートアドバタイズにより、デフォルトのサブネットルートに加えて、Private Google Accessの特別なIPレンジ（199.36.153.8/30など）やその他のカスタムIPレンジをオンプレミスに広告できます。これにより、オンプレミスからPrivate Google Access経由でGoogle APIにアクセスする構成が可能になります。",
    tags: ["cloud-router", "bgp", "custom-route-advertisement"],
  },
  {
    id: "pcne-018",
    certId: "pcne",
    domain: "ハイブリッドネットワークの実装",
    difficulty: "hard",
    question:
      "Dedicated Interconnectの冗長構成で、本番環境ワークロードに推奨されるトポロジはどれですか？",
    options: [
      "1つのコロケーション施設に1つのVLANアタッチメント",
      "1つのコロケーション施設に2つのVLANアタッチメント",
      "2つの異なるコロケーション施設にそれぞれInterconnect接続とVLANアタッチメントを配置",
      "Cloud VPNをバックアップとして使用し、Interconnectは1つで十分",
    ],
    correctIndex: 2,
    explanation:
      "本番環境では、2つの異なるメトロエリア（コロケーション施設）にInterconnect接続を配置し、それぞれにVLANアタッチメントを設定する冗長構成が推奨されます。これにより、1つの施設が停止しても接続が維持され、99.99%のSLAが達成できます。",
    tags: [
      "dedicated-interconnect",
      "redundancy",
      "production",
      "topology",
    ],
  },
  // ─── ネットワークサービスの管理 (20%) ───
  {
    id: "pcne-019",
    certId: "pcne",
    domain: "ネットワークサービスの管理",
    difficulty: "easy",
    question:
      "Cloud DNSでプライベートゾーンを作成する主な目的はどれですか？",
    options: [
      "インターネットからのDNSクエリに応答する",
      "VPC内のリソースに対してプライベートDNS名前解決を提供する",
      "ドメイン名を購入する",
      "DNSSECを有効にする",
    ],
    correctIndex: 1,
    explanation:
      "Cloud DNSのプライベートゾーンは、VPC内のリソースに対してプライベートDNS名前解決を提供します。プライベートゾーンのレコードはインターネットからは解決できず、承認されたVPCネットワーク内からのみクエリ可能です。",
    tags: ["cloud-dns", "private-zone", "name-resolution"],
  },
  {
    id: "pcne-020",
    certId: "pcne",
    domain: "ネットワークサービスの管理",
    difficulty: "medium",
    question:
      "Cloud CDNのキャッシュ無効化（Cache Invalidation）について正しい説明はどれですか？",
    options: [
      "キャッシュ無効化はリアルタイムで全エッジロケーションに即座に反映される",
      "キャッシュ無効化はURLパスパターンを指定して実行でき、伝播に数分かかる場合がある",
      "キャッシュ無効化はCloud Storageバケットのオブジェクトを削除する",
      "キャッシュ無効化は1日1回しか実行できない",
    ],
    correctIndex: 1,
    explanation:
      "Cloud CDNのキャッシュ無効化は、URLパスパターン（例: /images/*）を指定して実行できます。無効化リクエストは全エッジロケーションに伝播する必要があり、完了まで数分かかる場合があります。頻繁な無効化よりもキャッシュコントロールヘッダーの適切な設定が推奨されます。",
    tags: ["cloud-cdn", "cache-invalidation", "edge-locations"],
  },
  {
    id: "pcne-021",
    certId: "pcne",
    domain: "ネットワークサービスの管理",
    difficulty: "medium",
    question:
      "Cloud NATの動作について正しい説明はどれですか？",
    options: [
      "Cloud NATはVMにNATゲートウェイVMをデプロイして動作する",
      "Cloud NATはソフトウェア定義のマネージドサービスで、VM不要で動作する",
      "Cloud NATは受信（イングレス）トラフィックのNATも処理する",
      "Cloud NATは外部IPアドレスを持つVMにも適用される",
    ],
    correctIndex: 1,
    explanation:
      "Cloud NATはGoogle Cloudのソフトウェア定義マネージドネットワークアドレス変換サービスです。専用のVMやアプライアンスを必要とせず、外部IPアドレスを持たないVMやGKEポッドからインターネットへの送信（エグレス）トラフィックにNATを提供します。",
    tags: ["cloud-nat", "managed-service", "egress"],
  },
  {
    id: "pcne-022",
    certId: "pcne",
    domain: "ネットワークサービスの管理",
    difficulty: "hard",
    question:
      "グローバルHTTP(S)ロードバランサーとリージョナルHTTP(S)ロードバランサーの使い分けとして正しいのはどれですか？",
    options: [
      "グローバルは外部トラフィックのみ、リージョナルは内部トラフィックのみに使用する",
      "グローバルはプレミアムティアで複数リージョンのバックエンドに対応し、リージョナルは単一リージョン内のトラフィックに使用する",
      "リージョナルは常にグローバルより低コストである",
      "グローバルロードバランサーではSSL終端ができない",
    ],
    correctIndex: 1,
    explanation:
      "グローバルHTTP(S)ロードバランサーはプレミアムネットワークティアで利用可能で、複数リージョンのバックエンドグループに対してAnycastで最寄りのリージョンにルーティングします。リージョナルHTTP(S)ロードバランサーは単一リージョン内のバックエンドに対して使用し、内部・外部の両方で利用可能です。",
    tags: [
      "load-balancing",
      "global",
      "regional",
      "network-tier",
    ],
  },
  {
    id: "pcne-023",
    certId: "pcne",
    domain: "ネットワークサービスの管理",
    difficulty: "hard",
    question:
      "Cloud DNS転送ゾーン（Forwarding Zone）とピアリングゾーン（Peering Zone）の違いとして正しいのはどれですか？",
    options: [
      "転送ゾーンはオンプレミスDNSサーバーにクエリを転送し、ピアリングゾーンは別のVPCの名前解決順序を使用する",
      "転送ゾーンとピアリングゾーンは同じ機能で名前が異なるだけ",
      "ピアリングゾーンはインターネットのDNSサーバーへの転送に使用する",
      "転送ゾーンはVPC間でのみ使用でき、オンプレミスには使用できない",
    ],
    correctIndex: 0,
    explanation:
      "転送ゾーン（Forwarding Zone）は特定のドメインのDNSクエリをオンプレミスDNSサーバーなどの指定されたターゲットに転送します。ピアリングゾーン（Peering Zone）は、別のVPCの名前解決順序（解決チェーン）を使用してDNSクエリを解決します。ハイブリッド環境ではこれらを組み合わせて使用します。",
    tags: [
      "cloud-dns",
      "forwarding-zone",
      "peering-zone",
      "hybrid-dns",
    ],
  },
  // ─── ネットワークセキュリティの実装 (20%) ───
  {
    id: "pcne-024",
    certId: "pcne",
    domain: "ネットワークセキュリティの実装",
    difficulty: "medium",
    question:
      "階層型ファイアウォールポリシー（Hierarchical Firewall Policy）について正しい説明はどれですか？",
    options: [
      "プロジェクトレベルのファイアウォールルールよりも優先度が低い",
      "組織またはフォルダレベルで適用され、配下のプロジェクトのファイアウォールルールよりも先に評価される",
      "VPCファイアウォールルールとは互換性がない",
      "許可ルールのみ設定可能で、拒否ルールは設定できない",
    ],
    correctIndex: 1,
    explanation:
      "階層型ファイアウォールポリシーは組織またはフォルダレベルで作成・適用され、配下のプロジェクトのVPCファイアウォールルールよりも先に評価されます。「goto_next」アクションを使用して、下位レベルのファイアウォールルールの評価に委譲することも可能です。",
    tags: [
      "hierarchical-firewall",
      "organization",
      "security-policy",
    ],
  },
  {
    id: "pcne-025",
    certId: "pcne",
    domain: "ネットワークセキュリティの実装",
    difficulty: "medium",
    question:
      "パケットミラーリング（Packet Mirroring）の主な用途はどれですか？",
    options: [
      "ネットワークトラフィックの暗号化",
      "ネットワークトラフィックのコピーを取得してIDS/IPSやフォレンジック分析に使用する",
      "ファイアウォールルールの自動作成",
      "ロードバランサーのヘルスチェック",
    ],
    correctIndex: 1,
    explanation:
      "パケットミラーリングは、指定されたインスタンスのネットワークトラフィックのコピーをコレクタインスタンス（内部ロードバランサーの背後に配置）に送信します。侵入検知システム（IDS）、侵入防止システム（IPS）、ネットワークフォレンジック分析に使用されます。",
    tags: ["packet-mirroring", "ids", "ips", "forensics"],
  },
  {
    id: "pcne-026",
    certId: "pcne",
    domain: "ネットワークセキュリティの実装",
    difficulty: "medium",
    question:
      "Cloud Armor のセキュリティポリシーで提供される機能はどれですか？",
    options: [
      "VPC内のVM間通信の暗号化",
      "DDoS防御、WAFルール、IPアドレスベースのアクセス制御",
      "Cloud StorageバケットのIAMポリシー管理",
      "Cloud SQLインスタンスのSSL証明書管理",
    ],
    correctIndex: 1,
    explanation:
      "Cloud Armorは、グローバルHTTP(S)ロードバランサーの背後にあるアプリケーションに対して、DDoS防御、事前構成WAFルール（OWASP Top 10対策）、IPアドレス/地理ベースのアクセス制御、レート制限などのセキュリティ機能を提供します。",
    tags: ["cloud-armor", "ddos", "waf", "access-control"],
  },
  {
    id: "pcne-027",
    certId: "pcne",
    domain: "ネットワークセキュリティの実装",
    difficulty: "hard",
    question:
      "ファイアウォールポリシーのルール評価順序として正しいのはどれですか？",
    options: [
      "VPCファイアウォールルール → 階層型ファイアウォールポリシー → ネットワークファイアウォールポリシー",
      "階層型ファイアウォールポリシー（組織）→ 階層型ファイアウォールポリシー（フォルダ）→ ネットワークファイアウォールポリシー → VPCファイアウォールルール",
      "ネットワークファイアウォールポリシー → VPCファイアウォールルール → 階層型ファイアウォールポリシー",
      "すべてのファイアウォールルールは優先度番号のみで評価される",
    ],
    correctIndex: 1,
    explanation:
      "ファイアウォールルールの評価順序は、階層型ファイアウォールポリシー（組織レベル）→ 階層型ファイアウォールポリシー（フォルダレベル）→ ネットワークファイアウォールポリシー → VPCファイアウォールルールの順です。各レベルで「goto_next」を使用すると次のレベルに評価が委譲されます。",
    tags: [
      "firewall-policy",
      "evaluation-order",
      "hierarchical",
      "network-security",
    ],
  },
  {
    id: "pcne-028",
    certId: "pcne",
    domain: "ネットワークセキュリティの実装",
    difficulty: "hard",
    question:
      "Private Service Connectを使用してGoogle APIにアクセスする構成の利点として正しいのはどれですか？",
    options: [
      "インターネット経由でGoogle APIにアクセスするためレイテンシが低い",
      "コンシューマーVPC内にエンドポイントIPアドレスを作成し、そのIPアドレス経由でGoogle APIにプライベートアクセスできる",
      "Cloud VPN経由でのみ利用可能な機能である",
      "すべてのGoogle APIに対して自動的にアクセスが許可される",
    ],
    correctIndex: 1,
    explanation:
      "Private Service Connectを使用すると、コンシューマーVPC内に転送ルールとエンドポイントIPアドレスを作成し、そのIPアドレス経由でGoogle APIにプライベートアクセスできます。Private Google Accessとは異なり、個別のIPアドレスで制御でき、DNS構成も柔軟に行えます。",
    tags: [
      "private-service-connect",
      "google-apis",
      "endpoint",
      "private-access",
    ],
  },
  {
    id: "pcne-029",
    certId: "pcne",
    domain: "VPCネットワークの設計と実装",
    difficulty: "medium",
    question:
      "VPCネットワークのサブネットでセカンダリIPレンジを設定する主なユースケースはどれですか？",
    options: [
      "VMインスタンスに複数のネットワークインターフェースを追加するため",
      "GKEクラスタのPodおよびServiceに専用のIPレンジを割り当てるため",
      "Cloud VPNトンネルの帯域幅を増やすため",
      "ファイアウォールルールの適用範囲を拡大するため",
    ],
    correctIndex: 1,
    explanation:
      "サブネットのセカンダリIPレンジは、主にGKEクラスタでPodとServiceに専用のIPアドレス空間を割り当てるために使用されます。VPCネイティブクラスタ（エイリアスIP）では、PodレンジとServiceレンジを個別に管理でき、VPCルーティングとの統合が容易になります。",
    tags: ["secondary-ip-range", "gke", "alias-ip", "vpc-native"],
  },
  {
    id: "pcne-030",
    certId: "pcne",
    domain: "ハイブリッドネットワークの実装",
    difficulty: "hard",
    question:
      "オンプレミスとGoogle Cloud間でCloud Interconnect接続を使用する際、MACsec（Media Access Control Security）暗号化の役割として正しいのはどれですか？",
    options: [
      "アプリケーション層のデータを暗号化する",
      "Cloud Interconnect接続のレイヤー2（データリンク層）で回線レベルの暗号化を提供する",
      "VPNトンネルのIPsec暗号化を置き換える",
      "Cloud Storageへのデータ転送を暗号化する",
    ],
    correctIndex: 1,
    explanation:
      "MACsecはCloud Interconnectの接続においてレイヤー2（データリンク層）でホップバイホップの暗号化を提供します。これにより、Googleのネットワークエッジとオンプレミスルーター間の物理回線上のデータが暗号化され、傍受リスクを軽減できます。IPsec VPNとは異なるレイヤーで動作します。",
    tags: [
      "cloud-interconnect",
      "macsec",
      "layer2-encryption",
      "security",
    ],
  },
]
