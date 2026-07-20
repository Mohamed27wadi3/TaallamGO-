import { useState, useMemo } from 'react'
import type { Lang } from '../data'
import { t, categories, courses, platforms } from '../data'
import { CourseCard } from '../components/CourseCard'

interface Props {
  lang: Lang
  navigate: (page: string, data?: unknown) => void
  dir: 'ltr' | 'rtl'
}

export function CatalogPage({ lang, navigate }: Props) {
  const [search, setSearch] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)

  const levels = [
    { id: 'Débutant', fr: 'Débutant', ar: 'مبتدئ' },
    { id: 'Intermédiaire', fr: 'Intermédiaire', ar: 'متوسط' },
    { id: 'Avancé', fr: 'Avancé', ar: 'متقدم' },
  ]

  const filtered = useMemo(() => {
    let result = [...courses]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.titleAr.includes(q) ||
        c.platform.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)
      )
    }
    if (selectedPlatform) result = result.filter(c => c.platform === selectedPlatform)
    if (selectedCategory) result = result.filter(c => c.category === selectedCategory)
    if (selectedLevel) result = result.filter(c => c.level === selectedLevel)

    if (sortBy === 'price-asc') result.sort((a, b) => a.price_dzd - b.price_dzd)
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price_dzd - a.price_dzd)
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating)
    else result.sort((a, b) => b.reviews - a.reviews)

    return result
  }, [search, selectedPlatform, selectedCategory, selectedLevel, sortBy])

  const activeFilterCount = [selectedPlatform, selectedCategory, selectedLevel].filter(Boolean).length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F9FC' }}>
      {/* Page header */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E4E9F0', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#172033', margin: '0 0 6px' }}>
            {t('Catalogue des formations', 'كتالوج الدورات', lang)}
          </h1>
          <p style={{ fontSize: 15, color: '#667085', margin: '0 0 24px' }}>
            {t(`${courses.length} formations disponibles`, `${courses.length} دورة متاحة`, lang)}
          </p>

          {/* Search */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="7.5" cy="7.5" r="5" stroke="#667085" strokeWidth="1.8" />
                <line x1="11" y1="11" x2="15" y2="15" stroke="#667085" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('Rechercher...', 'بحث...', lang)}
                style={{
                  width: '100%', height: 44,
                  border: '1.5px solid #E4E9F0', borderRadius: 10,
                  padding: '0 16px 0 40px', fontSize: 14,
                  color: '#172033', outline: 'none', backgroundColor: '#FFFFFF',
                  fontFamily: lang === 'ar' ? "'IBM Plex Sans Arabic'" : "'Plus Jakarta Sans'",
                }}
              />
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                height: 44, border: '1.5px solid #E4E9F0', borderRadius: 10,
                padding: '0 36px 0 12px', fontSize: 14, color: '#172033',
                backgroundColor: '#FFFFFF', cursor: 'pointer', outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpolyline points='3,5 7,9 11,5' stroke='%23667085' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              <option value="popular">{t('Plus populaires', 'الأكثر شعبية', lang)}</option>
              <option value="rating">{t('Mieux notés', 'الأعلى تقييماً', lang)}</option>
              <option value="price-asc">{t('Prix croissant', 'السعر تصاعدي', lang)}</option>
              <option value="price-desc">{t('Prix décroissant', 'السعر تنازلي', lang)}</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                height: 44, padding: '0 16px',
                border: '1.5px solid ' + (activeFilterCount > 0 ? '#132A4F' : '#E4E9F0'),
                borderRadius: 10, cursor: 'pointer',
                backgroundColor: activeFilterCount > 0 ? '#132A4F' : '#FFFFFF',
                color: activeFilterCount > 0 ? '#FFFFFF' : '#172033',
                fontSize: 14, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {t('Filtres', 'الفلاتر', lang)}
              {activeFilterCount > 0 && (
                <span style={{
                  backgroundColor: '#18A979', color: '#FFFFFF',
                  borderRadius: '50%', width: 18, height: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                }}>{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E4E9F0', padding: '24px', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 40, flexWrap: 'wrap' }}>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                {t('Plateforme', 'المنصة', lang)}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {platforms.filter(p => p.status === 'available').map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlatform(selectedPlatform === p.name ? null : p.name)}
                    style={{
                      padding: '5px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s',
                      backgroundColor: selectedPlatform === p.name ? '#132A4F' : '#F0F3F8',
                      color: selectedPlatform === p.name ? '#FFFFFF' : '#172033',
                      border: 'none',
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                {t('Catégorie', 'الفئة', lang)}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {categories.slice(0, 5).map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
                    style={{
                      padding: '5px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s',
                      backgroundColor: selectedCategory === c.id ? '#132A4F' : '#F0F3F8',
                      color: selectedCategory === c.id ? '#FFFFFF' : '#172033',
                      border: 'none',
                    }}
                  >
                    {c.icon} {lang === 'ar' ? c.labelAr : c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                {t('Niveau', 'المستوى', lang)}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {levels.map(lv => (
                  <button
                    key={lv.id}
                    onClick={() => setSelectedLevel(selectedLevel === lv.id ? null : lv.id)}
                    style={{
                      padding: '5px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', transition: 'all 0.15s',
                      backgroundColor: selectedLevel === lv.id ? '#132A4F' : '#F0F3F8',
                      color: selectedLevel === lv.id ? '#FFFFFF' : '#172033',
                      border: 'none',
                    }}
                  >
                    {lang === 'ar' ? lv.ar : lv.fr}
                  </button>
                ))}
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={() => { setSelectedPlatform(null); setSelectedCategory(null); setSelectedLevel(null) }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: '#DC3545', fontWeight: 600,
                  alignSelf: 'flex-end', padding: '5px 0',
                }}
              >
                {t('Effacer les filtres', 'مسح الفلاتر', lang)}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: '#667085' }}>
            {filtered.length} {t('résultat(s)', 'نتيجة', lang)}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#172033', margin: '0 0 8px' }}>
              {t('Aucun résultat', 'لا توجد نتائج', lang)}
            </h3>
            <p style={{ fontSize: 15, color: '#667085' }}>
              {t('Essayez d\'autres mots-clés ou filtres.', 'جرب كلمات مفتاحية أو فلاتر أخرى.', lang)}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {filtered.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                lang={lang}
                onClick={() => navigate('course', course)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
