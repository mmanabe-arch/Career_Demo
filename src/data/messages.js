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

export const mockInterviewRequests = [
  { id: 1, studentName: "高校3年 鈴木 一郎", alumniId: 1, alumniName: "田中 康介", date: "2025-03-15", time: "16:00", method: "オンライン", status: "pending", message: "法律の道に進みたいと思っており、アドバイスをいただきたいです。" },
  { id: 2, studentName: "高校2年 佐々木 花", alumniId: 2, alumniName: "山本 美咲", date: "2025-03-20", time: "17:00", method: "オンライン", status: "confirmed", message: "AIエンジニアの仕事について詳しく聞かせてください。" },
];
