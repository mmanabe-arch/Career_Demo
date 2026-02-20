export const feedbackSurveys = [
  {
    id: 1,
    title: "2024年度 OB・OG講演フィードバックアンケート",
    sentAt: "2024-12-10",
    targetCount: 12,
    respondedCount: 9,
    status: "closed",
    questions: [
      { id: 1, text: "講演の内容は参考になりましたか？", type: "rating" },
      { id: 2, text: "講師の話し方・わかりやすさはいかがでしたか？", type: "rating" },
      { id: 3, text: "どのような点が最も印象に残りましたか？", type: "text" },
      { id: 4, text: "今後聞いてみたい講演テーマはありますか？", type: "text" },
    ],
    responses: [
      { id: 1, respondentName: "高1-A 田中", submittedAt: "2024-12-11 10:23", answers: [{ qId: 1, value: 5 }, { qId: 2, value: 4 }, { qId: 3, value: "弁護士になるまでの具体的な勉強法が参考になりました。" }, { qId: 4, value: "医師・医療系のキャリアについて聞きたいです。" }] },
      { id: 2, respondentName: "高2-B 鈴木", submittedAt: "2024-12-11 11:45", answers: [{ qId: 1, value: 5 }, { qId: 2, value: 5 }, { qId: 3, value: "高校時代の具体的なエピソードが聞けてよかった。" }, { qId: 4, value: "起業・ベンチャーのキャリア" }] },
      { id: 3, respondentName: "高3-A 山田", submittedAt: "2024-12-12 09:15", answers: [{ qId: 1, value: 4 }, { qId: 2, value: 4 }, { qId: 3, value: "失敗談も話してくれて親近感が持てた。" }, { qId: 4, value: "理系進学のキャリアパスを知りたい" }] },
      { id: 4, respondentName: "高1-C 佐藤", submittedAt: "2024-12-12 14:30", answers: [{ qId: 1, value: 5 }, { qId: 2, value: 5 }, { qId: 3, value: "司法試験の実態がわかった。予備試験という選択肢があることを初めて知った。" }, { qId: 4, value: "金融・投資銀行" }] },
      { id: 5, respondentName: "高2-A 中村", submittedAt: "2024-12-13 16:00", answers: [{ qId: 1, value: 4 }, { qId: 2, value: 3 }, { qId: 3, value: "話のスピードが少し速かったが内容は良かった。" }, { qId: 4, value: "海外で働くキャリア" }] },
    ],
  },
  {
    id: 2,
    title: "2025年春 面談プログラム満足度調査",
    sentAt: "2025-03-01",
    targetCount: 8,
    respondedCount: 3,
    status: "open",
    questions: [
      { id: 1, text: "面談は役に立ちましたか？", type: "rating" },
      { id: 2, text: "OB・OGの対応はいかがでしたか？", type: "rating" },
      { id: 3, text: "面談を通じて得た気づきを教えてください", type: "text" },
    ],
    responses: [
      { id: 1, respondentName: "高3-B 伊藤", submittedAt: "2025-03-02 09:00", answers: [{ qId: 1, value: 5 }, { qId: 2, value: 5 }, { qId: 3, value: "志望する職種のリアルな仕事内容を聞けた。進路が具体的になった。" }] },
      { id: 2, respondentName: "高2-C 渡辺", submittedAt: "2025-03-03 11:30", answers: [{ qId: 1, value: 4 }, { qId: 2, value: 4 }, { qId: 3, value: "OBの方が丁寧に時間を取ってくれた。" }] },
    ],
  },
];

export const lectureRequests = [
  { id: 1, teacherName: "山田 先生", title: "金融・投資銀行業界の仕事", targetAlumniId: 3, targetAlumniName: "佐藤 健一", requestedDate: "2025-05-20", format: "対面", status: "pending", message: "金融業界を志望する生徒が多く、ぜひ実務のお話を聞かせてください。" },
  { id: 2, teacherName: "鈴木 先生", title: "AIとエンジニアリングの未来", targetAlumniId: 2, targetAlumniName: "山本 美咲", requestedDate: "2025-04-15", format: "オンライン", status: "confirmed", message: "理系進学を考えている生徒のキャリア意識を高めたいと思っています。" },
  { id: 3, teacherName: "山田 先生", title: "医師という仕事 ─ 志望動機から医学部受験まで", targetAlumniId: 4, targetAlumniName: "中村 彩花", requestedDate: "2025-06-10", format: "対面", status: "completed", message: "医学部志望者が増えており、リアルな体験談をぜひ。" },
];
