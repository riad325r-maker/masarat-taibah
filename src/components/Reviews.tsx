import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../lib/useLanguage';
import { useScrollReveal } from '../lib/useScrollReveal';
import { StarRating } from './CssIcons';
import { Send, Loader2, CheckCircle, MessageSquarePlus, User, Building2, Clock, ThumbsUp, Trash2, X } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  company: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

function getVisitorId(): string {
  let id = localStorage.getItem('mt_visitor_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('mt_visitor_id', id);
  }
  return id;
}

function timeAgo(dateStr: string, isAr: boolean): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return isAr ? 'الآن' : 'Just now';
  if (diff < 3600) { const m = Math.floor(diff / 60); return isAr ? `منذ ${m} دقيقة` : `${m}m ago`; }
  if (diff < 86400) { const h = Math.floor(diff / 3600); return isAr ? `منذ ${h} ساعة` : `${h}h ago`; }
  const d = Math.floor(diff / 86400);
  if (d < 30) return isAr ? `منذ ${d} يوم` : `${d}d ago`;
  const mo = Math.floor(d / 30);
  return isAr ? `منذ ${mo} شهر` : `${mo}mo ago`;
}

function ReviewCard({ review, index, lang, likes, liked, onLike, onDelete }: {
  review: Review; index: number; lang: string; likes: number; liked: boolean;
  onLike: () => void; onDelete: () => void;
}) {
  const isAr = lang === 'ar';
  const initials = review.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#e8690b', '#3b82f6', '#22c55e', '#a855f7', '#ef4444', '#f59e0b', '#06b6d4', '#ec4899'];
  const color = colors[review.name.length % colors.length];
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="group rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
            style={{ background: color }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{review.name}</h4>
              <div className="flex items-center gap-1 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                <Clock size={9} />
                <span className="text-[10px] mono">{timeAgo(review.created_at, isAr)}</span>
              </div>
            </div>
            {review.company && (
              <div className="flex items-center gap-1 mt-0.5">
                <Building2 size={9} style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{review.company}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stars */}
        <div className="mb-3">
          <StarRating rating={review.rating} size={13} />
        </div>

        {/* Comment */}
        <p className="text-sm leading-[1.7] mb-4" style={{ color: 'var(--text-secondary)' }}>
          {review.comment}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          {/* Like */}
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: liked ? 'var(--accent-bg-strong)' : 'transparent',
              color: liked ? 'var(--accent)' : 'var(--text-tertiary)',
              border: `1px solid ${liked ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            <ThumbsUp size={13} fill={liked ? 'currentColor' : 'none'} />
            {likes > 0 && <span className="mono">{likes}</span>}
            {likes === 0 && <span>{isAr ? 'إعجاب' : 'Like'}</span>}
          </button>

          {/* Delete */}
          <AnimatePresence mode="wait">
            {confirmDelete ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1.5"
              >
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {isAr ? 'متأكد؟' : 'Sure?'}
                </span>
                <button
                  onClick={() => { onDelete(); setConfirmDelete(false); }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  {isAr ? 'احذف' : 'Delete'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="p-1 rounded-md hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <X size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="delete-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <Trash2 size={12} />
                {isAr ? 'حذف' : 'Delete'}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function Reviews() {
  const { lang } = useLanguage();
  const { ref, visible } = useScrollReveal();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', rating: 5, comment: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [userLiked, setUserLiked] = useState<Record<number, boolean>>({});

  const isAr = lang === 'ar';
  const visitorId = typeof window !== 'undefined' ? getVisitorId() : '';

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  const fetchLikes = useCallback(async () => {
    if (!visitorId) return;
    try {
      const res = await fetch(`/api/reviews-likes-count?visitor_id=${visitorId}`);
      const data = await res.json();
      setLikeCounts(data.counts || {});
      setUserLiked(data.userLiked || {});
    } catch (err) { console.error(err); }
  }, [visitorId]);

  useEffect(() => { fetchReviews(); fetchLikes(); }, [fetchReviews, fetchLikes]);

  const handleLike = async (reviewId: number) => {
    // Optimistic update
    const wasLiked = userLiked[reviewId];
    setUserLiked(prev => ({ ...prev, [reviewId]: !wasLiked }));
    setLikeCounts(prev => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + (wasLiked ? -1 : 1) }));

    try {
      const res = await fetch('/api/reviews-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_id: reviewId, visitor_id: visitorId }),
      });
      const data = await res.json();
      setLikeCounts(prev => ({ ...prev, [reviewId]: data.likes }));
      setUserLiked(prev => ({ ...prev, [reviewId]: data.liked }));
    } catch (err) {
      // Revert on error
      setUserLiked(prev => ({ ...prev, [reviewId]: wasLiked }));
      setLikeCounts(prev => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + (wasLiked ? 1 : -1) }));
    }
  };

  const handleDelete = async (reviewId: number) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    try {
      await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId }),
      });
    } catch (err) {
      console.error(err);
      fetchReviews();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', company: '', rating: 5, comment: '' });
        await fetchReviews();
        setTimeout(() => { setSent(false); setShowForm(false); }, 2000);
      }
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

  return (
    <section id="reviews" className="section-pad transition-colors" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} className="mb-12">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3 block" style={{ color: 'var(--accent)' }}>
            {isAr ? 'تقييمات العملاء' : 'CLIENT REVIEWS'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
            {isAr ? 'آراء عملائنا' : 'What Our Clients Say'}
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>
              {isAr ? 'تقييمات حقيقية من عملاء مسارات طيبة' : 'Real reviews from Masarat Taibah clients'}
            </p>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <span className="text-lg font-extrabold mono" style={{ color: 'var(--accent)' }}>{avgRating.toFixed(1)}</span>
                <StarRating rating={Math.round(avgRating)} size={12} />
                <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>({reviews.length})</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Add Review Button */}
        <div className="mb-8">
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: showForm ? 'var(--bg-card)' : 'var(--accent)',
              color: showForm ? 'var(--text-primary)' : 'white',
              border: showForm ? '1px solid var(--border)' : 'none',
            }}>
            <MessageSquarePlus size={15} />
            {showForm ? (isAr ? 'إلغاء' : 'Cancel') : (isAr ? 'أضف تقييمك' : 'Write a Review')}
          </button>
        </div>

        {/* Review Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }} className="overflow-hidden mb-10">
              <form onSubmit={handleSubmit} className="max-w-2xl p-6 sm:p-8 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="text-base font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
                  {isAr ? 'شاركنا تجربتك' : 'Share your experience'}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="flex items-center gap-1 text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <User size={10} /> {isAr ? 'الاسم' : 'Name'} *
                    </label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                      placeholder={isAr ? 'أحمد محمد' : 'Ahmed Mohammed'} />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <Building2 size={10} /> {isAr ? 'الشركة' : 'Company'}
                    </label>
                    <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                      placeholder={isAr ? 'اختياري' : 'Optional'} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--text-secondary)' }}>{isAr ? 'التقييم' : 'Rating'}</label>
                  <StarRating rating={form.rating} size={26} interactive onChange={r => setForm({ ...form, rating: r })} />
                </div>
                <div className="mb-5">
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{isAr ? 'تعليقك' : 'Your review'} *</label>
                  <textarea rows={3} required value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-[var(--accent)]"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    placeholder={isAr ? 'شاركنا تجربتك...' : 'Tell us about your experience...'} />
                </div>
                <button type="submit" disabled={sending || !form.name.trim() || !form.comment.trim()}
                  className="w-full py-3 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition disabled:opacity-50"
                  style={{ background: 'var(--accent)' }}>
                  {sent ? <><CheckCircle size={15} /> {isAr ? 'تم!' : 'Done!'}</> : sending ? <Loader2 size={15} className="animate-spin" /> : <><Send size={13} /> {isAr ? 'نشر' : 'Submit'}</>}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px dashed var(--border-strong)' }}>
            <MessageSquarePlus size={32} className="mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
            <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {isAr ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              {isAr ? 'كن أول من يشارك تجربته' : 'Be the first to share'}
            </p>
            <button onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--accent)' }}>
              {isAr ? 'أضف تقييم' : 'Write a review'}
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {reviews.map((review, i) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={i}
                  lang={lang}
                  likes={likeCounts[review.id] || 0}
                  liked={!!userLiked[review.id]}
                  onLike={() => handleLike(review.id)}
                  onDelete={() => handleDelete(review.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
