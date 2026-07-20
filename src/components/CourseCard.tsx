import type { Lang } from '../data'
import { t } from '../data'
import { ImageWithFallback } from './ImageWithFallback'

interface Course {
  id: string
  title: string
  titleAr: string
  platform: string
  category: string
  level: string
  levelAr: string
  price_dzd: number
  rating: number
  reviews: number
  duration: string
  instructor: string
  image: string
  certificate: boolean
  tag: string | null
  tagColor: string | null
}

interface Props {
  course: Course
  lang: Lang
  onClick: () => void
}

export function CourseCard({ course, lang, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E9F0',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(19,42,79,0.1)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        <ImageWithFallback
          src={course.image}
          alt={lang === 'ar' ? course.titleAr : course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {course.tag && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            backgroundColor: course.tagColor || '#132A4F',
            color: '#FFFFFF',
            fontSize: 11, fontWeight: 700,
            padding: '3px 8px', borderRadius: 6,
            letterSpacing: '0.03em',
          }}>
            {course.tag}
          </span>
        )}
        {course.certificate && (
          <span style={{
            position: 'absolute', top: 10, right: 10,
            backgroundColor: 'rgba(255,255,255,0.92)',
            color: '#132A4F',
            fontSize: 11, fontWeight: 600,
            padding: '3px 7px', borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            🎓 {t('Certifiant', 'شهادة', lang)}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Platform + level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 600, color: '#667085',
            backgroundColor: '#F0F3F8', borderRadius: 6,
            padding: '2px 8px',
          }}>
            {course.platform}
          </span>
          <span style={{ fontSize: 12, color: '#667085' }}>
            {lang === 'ar' ? course.levelAr : course.level}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          margin: '0 0 8px',
          fontSize: 14, fontWeight: 700, color: '#172033',
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {lang === 'ar' ? course.titleAr : course.title}
        </h3>

        <p style={{ margin: '0 0 10px', fontSize: 13, color: '#667085' }}>{course.instructor}</p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B' }}>{course.rating}</span>
          <div style={{ display: 'flex', gap: 1 }}>
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill={i <= Math.round(course.rating) ? '#F59E0B' : '#E4E9F0'}>
                <polygon points="6,1 7.5,4.5 11,4.9 8.5,7.2 9.2,11 6,9.1 2.8,11 3.5,7.2 1,4.9 4.5,4.5" />
              </svg>
            ))}
          </div>
          <span style={{ fontSize: 12, color: '#667085' }}>({course.reviews.toLocaleString()})</span>
        </div>

        {/* Price + duration */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E4E9F0', paddingTop: 12 }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#132A4F' }}>
              {course.price_dzd.toLocaleString()}
            </span>
            <span style={{ fontSize: 13, color: '#667085', marginLeft: 4 }}>DZD</span>
          </div>
          <span style={{ fontSize: 12, color: '#667085', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#667085" strokeWidth="1.5">
              <circle cx="7" cy="7" r="5.5" />
              <polyline points="7,4 7,7 9,8.5" />
            </svg>
            {course.duration}
          </span>
        </div>
      </div>
    </div>
  )
}
