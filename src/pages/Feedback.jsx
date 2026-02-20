import { useState } from 'react';
import { Send, BarChart3, Users, Star, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { feedbackSurveys } from '../data/feedback';

export default function Feedback() {
  const [surveys, setSurveys] = useState(feedbackSurveys);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [expandedResponse, setExpandedResponse] = useState(null);
  const [newSurvey, setNewSurvey] = useState({ title: '', questions: [''] });
  const [sendSuccess, setSendSuccess] = useState(false);

  const openSurvey = (survey) => {
    setSelectedSurvey(survey);
    setActiveTab('detail');
  };

  const handleAddQuestion = () => {
    setNewSurvey(p => ({ ...p, questions: [...p.questions, ''] }));
  };

  const handleSendSurvey = (e) => {
    e.preventDefault();
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 3000);
  };

  const avgRating = (survey, qId) => {
    const vals = survey.responses
      .map(r => r.answers.find(a => a.qId === qId)?.value)
      .filter(v => typeof v === 'number');
    if (!vals.length) return null;
    return (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">キャリアフィードバック管理</h1>
        <p className="text-gray-500 text-sm mt-1">アンケート送信・回答管理・タイムライン確認</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {[
          { key: 'list', label: 'アンケート一覧' },
          { key: 'create', label: '新規作成' },
          ...(selectedSurvey ? [{ key: 'detail', label: '回答詳細' }] : []),
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === key ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {surveys.map(survey => (
            <div key={survey.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">{survey.title}</h3>
                    <span className={`badge text-xs ${
                      survey.status === 'open' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {survey.status === 'open' ? '受付中' : '終了'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">送信日: {survey.sentAt}</p>

                  {/* Response Rate */}
                  <div className="mt-4 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{survey.respondedCount}</span>
                        /{survey.targetCount}名回答
                      </span>
                    </div>
                    <div className="flex-1 max-w-32">
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div
                          className="h-2 bg-primary-500 rounded-full"
                          style={{ width: `${(survey.respondedCount / survey.targetCount) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary-600">
                      {Math.round((survey.respondedCount / survey.targetCount) * 100)}%
                    </span>
                  </div>

                  {/* Rating averages */}
                  <div className="mt-3 flex flex-wrap gap-3">
                    {survey.questions.filter(q => q.type === 'rating').map(q => {
                      const avg = avgRating(survey, q.id);
                      return avg && (
                        <div key={q.id} className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-gray-500">{q.text.slice(0, 14)}…</span>
                          <span className="text-xs font-semibold text-gray-800">{avg}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={() => openSurvey(survey)}
                  className="btn-secondary text-sm shrink-0 ml-4"
                >
                  回答を見る
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Tab */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl">
          <h2 className="font-bold text-gray-900 mb-5">新規アンケート作成</h2>
          {sendSuccess ? (
            <div className="text-center py-10">
              <CheckCircle className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">送信しました!</h3>
              <p className="text-sm text-gray-500 mt-2">対象者にアンケートが送信されました。</p>
            </div>
          ) : (
            <form onSubmit={handleSendSurvey} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">アンケートタイトル</label>
                <input
                  type="text"
                  required
                  value={newSurvey.title}
                  onChange={e => setNewSurvey(p => ({ ...p, title: e.target.value }))}
                  placeholder="例：2025年度 講演フィードバック"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">質問</label>
                <div className="space-y-2">
                  {newSurvey.questions.map((q, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0 mt-2">
                        {i + 1}
                      </span>
                      <input
                        type="text"
                        value={q}
                        onChange={e => {
                          const qs = [...newSurvey.questions];
                          qs[i] = e.target.value;
                          setNewSurvey(p => ({ ...p, questions: qs }));
                        }}
                        placeholder={`質問 ${i + 1}`}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="mt-2 text-sm text-primary-600 hover:underline"
                >
                  + 質問を追加
                </button>
              </div>

              <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                アンケートを送信
              </button>
            </form>
          )}
        </div>
      )}

      {/* Detail Tab */}
      {activeTab === 'detail' && selectedSurvey && (
        <div className="space-y-5 max-w-4xl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 text-lg mb-1">{selectedSurvey.title}</h2>
            <p className="text-sm text-gray-400">送信日: {selectedSurvey.sentAt} / 回答数: {selectedSurvey.respondedCount}/{selectedSurvey.targetCount}件</p>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedSurvey.questions.filter(q => q.type === 'rating').map(q => {
                const avg = avgRating(selectedSurvey, q.id);
                return (
                  <div key={q.id} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= Math.round(avg) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{avg}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-tight">{q.text.slice(0, 15)}…</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline of responses */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              回答タイムライン
            </h3>
            <div className="space-y-3">
              {selectedSurvey.responses.map(res => (
                <div key={res.id} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedResponse(expandedResponse === res.id ? null : res.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                        {res.respondentName.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{res.respondentName}</p>
                        <p className="text-xs text-gray-400">{res.submittedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {res.answers.filter(a => typeof a.value === 'number').map(a => (
                        <div key={a.qId} className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= a.value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      ))}
                      {expandedResponse === res.id
                        ? <ChevronUp className="w-4 h-4 text-gray-400" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                    </div>
                  </button>
                  {expandedResponse === res.id && (
                    <div className="px-4 pb-4 space-y-3 bg-gray-50">
                      {res.answers.filter(a => typeof a.value === 'string').map(a => {
                        const q = selectedSurvey.questions.find(q => q.id === a.qId);
                        return (
                          <div key={a.qId}>
                            <p className="text-xs font-semibold text-gray-500 mb-1">{q?.text}</p>
                            <p className="text-sm text-gray-700 bg-white rounded-lg p-3 leading-relaxed">{a.value}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
