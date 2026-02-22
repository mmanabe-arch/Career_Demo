export const mockChats = [
  {
    alumniId: 1,
    alumniName: "田中 康介",
    messages: [
      { id: 1, sender: "student", text: "田中さん、初めまして。法律の道に進みたいと考えている高校3年生です。弁護士になるためのアドバイスをいただけますか？", time: "10:05" },
      { id: 2, sender: "alumni", text: "はじめまして！もちろんです。まず、どの分野の法律に興味がありますか？民事・刑事・企業法務など様々あります。", time: "10:12" },
      { id: 3, sender: "student", text: "企業法務に興味があります。M&Aのニュースをよく見るので。", time: "10:15" },
      { id: 4, sender: "alumni", text: "素晴らしい！企業法務は非常にやりがいがある分野です。まず大学で法学部に入り、司法試験に合格することが王道ルートです。法科大学院（ロースクール）か予備試験ルートがあります。私は予備試験から司法試験に合格しました。", time: "10:18" },
      { id: 5, sender: "student", text: "予備試験と法科大学院、どちらがおすすめですか？", time: "10:20" },
      { id: 6, sender: "alumni", text: "難易度は高いですが、予備試験ルートは費用・時間ともにメリットがあります。ただし合格率は非常に低いので、法科大学院との並行も一つの選択肢です。今は司法試験の合格者数が増えているので、昔より環境は良くなっています。", time: "10:25" },
    ],
  },
  {
    alumniId: 2,
    alumniName: "山本 美咲",
    messages: [
      { id: 1, sender: "student", text: "山本さん、AIエンジニアを目指しているのですが、高校時代に何を勉強しておけばよかったですか？", time: "14:30" },
      { id: 2, sender: "alumni", text: "数学と英語が最重要です！機械学習は線形代数・微積分・統計が基礎になります。英語は最新の論文を読むために必須です。", time: "14:35" },
      { id: 3, sender: "student", text: "プログラミングはいつ始めるべきですか？", time: "14:37" },
      { id: 4, sender: "alumni", text: "今すぐ始めてください！PythonはAI開発の主流言語で、無料で学べるリソースがたくさんあります。Kaggleのチュートリアルから始めるのがおすすめです。", time: "14:40" },
    ],
  },
];

// ===================== OBOGチャット受信箱（生徒→OBOG） =====================
// OBOG側から見た受信チャット一覧。sender: 'student' | 'alumni'
export const alumniInboxChats = [
  {
    chatId: 1,
    studentId: 1,
    studentName: "鈴木 一朗",
    studentGrade: "高3",
    studentStream: "理系",
    targetUniversity: "東京大学",
    messages: [
      { id: 1, sender: 'student', text: '田中さん、初めまして。東大工学部を志望している高3の鈴木です。AIや機械学習の研究に興味があり、ぜひアドバイスをいただけますか？', time: '09:05' },
      { id: 2, sender: 'alumni',  text: 'こんにちは！もちろんです。まずはどの分野のAIに興味がありますか？画像認識・自然言語処理・強化学習など様々あります。', time: '09:18' },
      { id: 3, sender: 'student', text: '自然言語処理に興味があります。ChatGPTみたいなシステムに感動して。', time: '09:22' },
      { id: 4, sender: 'alumni',  text: 'LLM（大規模言語モデル）は今最もホットな分野ですね！高校では線形代数と微積分をしっかり固めることが最重要です。Pythonは今から始めると有利ですよ。', time: '09:30' },
      { id: 5, sender: 'student', text: 'Pythonは少し触ったことがあります。どんなことを学ぶのが近道でしょうか？', time: '09:35' },
    ],
  },
  {
    chatId: 2,
    studentId: 4,
    studentName: "佐藤 美里",
    studentGrade: "高3",
    studentStream: "文系",
    targetUniversity: "慶應義塾大学",
    messages: [
      { id: 1, sender: 'student', text: '田中さん、はじめまして。法律の道に進みたい高3の佐藤です。国際的な企業法務に興味があるのですが、どんなキャリアパスがありますか？', time: '14:30' },
      { id: 2, sender: 'alumni',  text: 'はじめまして！国際企業法務はやりがいある分野ですよ。まず慶應法学部から法科大学院というルートが一般的です。英語は絶対必須ですが、もう準備できていますか？', time: '14:45' },
      { id: 3, sender: 'student', text: 'はい、英語は得意です！TOEFL も勉強中です。法科大学院では何を学ぶのでしょうか？', time: '14:50' },
    ],
  },
  {
    chatId: 3,
    studentId: 2,
    studentName: "中村 花",
    studentGrade: "高2",
    studentStream: "理系",
    targetUniversity: "京都大学",
    messages: [
      { id: 1, sender: 'student', text: 'こんにちは。京大理学部化学系を目指している高2の中村です。化学系の研究はどんな感じですか？', time: '16:00' },
      { id: 2, sender: 'alumni',  text: 'こんにちは！化学は今有機合成・材料・創薬など非常に幅広いですよ。特にどんな方向性に興味があります？', time: '16:15' },
      { id: 3, sender: 'student', text: '有機化学が好きです。でも数学の証明問題が苦手で悩んでいます。', time: '16:20' },
      { id: 4, sender: 'alumni',  text: '正直に言うと、大学の化学は思ったより数学が必要です。特に物理化学や量子化学では。でも高校レベルの証明は基礎だから大丈夫、少しずつ積み上げましょう！', time: '16:28' },
    ],
  },
  {
    chatId: 4,
    studentId: 5,
    studentName: "林 大輝",
    studentGrade: "高2",
    studentStream: "理系",
    targetUniversity: "東京工業大学",
    messages: [
      { id: 1, sender: 'student', text: '東工大の物理学系を目指しています。量子コンピューターに興味があるのですが、大学ではどんなことを学べますか？', time: '20:00' },
      { id: 2, sender: 'alumni',  text: '量子コンピューターは今一番面白い分野のひとつ！東工大の理学院なら量子情報・量子光学など第一線の研究ができますよ。英語も重要になってきますが今どれくらいできますか？', time: '20:15' },
    ],
  },
];

export const mockInterviewRequests = [
  { id: 1, studentName: "高校3年 鈴木 一郎", alumniId: 1, alumniName: "田中 康介", date: "2025-03-15", time: "16:00", method: "オンライン", status: "pending", message: "法律の道に進みたいと思っており、アドバイスをいただきたいです。" },
  { id: 2, studentName: "高校2年 佐々木 花", alumniId: 2, alumniName: "山本 美咲", date: "2025-03-20", time: "17:00", method: "オンライン", status: "confirmed", message: "AIエンジニアの仕事について詳しく聞かせてください。" },
];
