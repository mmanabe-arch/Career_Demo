import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, Clock, Eye, Heart, ArrowLeft, Play, Tag } from 'lucide-react';
import { articles, lectures, allContents } from '../data/contents';

export default function Contents() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = allContents.filter(c => filter === 'all' || c.type === filter);

  if (selected) {
    return <ContentDetail content={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">コンテンツ</h1>
        <p className="text-gray-500 text-sm mt-1">OB・OGによる記事・講演アーカイブ</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'すべて' },
          { key: 'article', label: '記事', icon: BookOpen },
          { key: 'lecture', label: '講演', icon: Video },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              filter === key
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(content => (
          <ContentCard key={content.id} content={content} onClick={() => setSelected(content)} />
        ))}
      </div>
    </div>
  );
}

function ContentCard({ content, onClick }) {
  const isArticle = content.type === 'article';
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left overflow-hidden group"
    >
      {/* Thumbnail placeholder */}
      <div className={`h-36 flex items-center justify-center ${isArticle ? 'bg-gradient-to-br from-primary-100 to-primary-200' : 'bg-gradient-to-br from-blue-100 to-blue-200'}`}>
        {isArticle
          ? <BookOpen className="w-12 h-12 text-primary-400 opacity-60" />
          : (
            <div className="relative">
              <Video className="w-12 h-12 text-blue-400 opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-8 h-8 text-blue-500 opacity-80" />
              </div>
            </div>
          )
        }
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge text-xs ${isArticle ? 'bg-primary-100 text-primary-700' : 'bg-blue-100 text-blue-700'}`}>
            {isArticle ? '記事' : '講演'}
          </span>
          <span className="text-xs text-gray-400">{content.date}</span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
          {content.title}
        </h3>

        <p className="text-xs text-gray-500 mb-3">by {content.author}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {content.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" />{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          {isArticle ? (
            <>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{content.readTime}分</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{content.views.toLocaleString()}</span>
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{content.likes}</span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{content.duration}分</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{content.views.toLocaleString()}</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}

function ContentDetail({ content, onBack }) {
  const isArticle = content.type === 'article';
  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        コンテンツ一覧に戻る
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className={`h-48 flex items-center justify-center ${isArticle ? 'bg-gradient-to-br from-primary-100 to-primary-300' : 'bg-gradient-to-br from-blue-100 to-blue-300'}`}>
          {isArticle
            ? <BookOpen className="w-20 h-20 text-primary-400 opacity-50" />
            : (
              <div className="relative">
                <Video className="w-20 h-20 text-blue-400 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 text-blue-600 ml-1" />
                  </div>
                </div>
              </div>
            )
          }
        </div>

        <div className="p-6">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`badge text-xs ${isArticle ? 'bg-primary-100 text-primary-700' : 'bg-blue-100 text-blue-700'}`}>
              {isArticle ? '記事' : '講演アーカイブ'}
            </span>
            <span className="text-sm text-gray-400">{content.date}</span>
            {content.tags.map(tag => (
              <span key={tag} className="badge bg-gray-100 text-gray-500 text-xs">{tag}</span>
            ))}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">{content.title}</h1>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                {content.author.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700">{content.author}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 ml-auto">
              {isArticle ? (
                <>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />読了 {content.readTime}分</span>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{content.views.toLocaleString()} views</span>
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-400" />{content.likes}</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{content.duration}分</span>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{content.views.toLocaleString()} views</span>
                </>
              )}
            </div>
          </div>

          {/* Body */}
          {isArticle ? (
            <div className="prose prose-sm max-w-none">
              {content.content.split('\n\n').map((block, i) => {
                if (block.startsWith('## ')) {
                  return <h2 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2">{block.replace('## ', '')}</h2>;
                }
                return <p key={i} className="text-gray-700 leading-relaxed mb-4">{block}</p>;
              })}
            </div>
          ) : (
            <div className="bg-blue-50 rounded-xl p-5 text-center">
              <Play className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm leading-relaxed">{content.description}</p>
              <button className="mt-4 btn-primary">
                動画を再生する（デモ）
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
