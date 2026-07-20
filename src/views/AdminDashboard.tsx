import { useState } from 'react'
import type { Lang } from '../data'
import { t, mockOrders, orderStatuses } from '../data'
import { taallamGoLogoSrc } from '../logo'

interface Props {
  lang: Lang
  navigate: (page: string) => void
  dir: 'ltr' | 'rtl'
}

type AdminTab = 'dashboard' | 'orders' | 'catalog' | 'clients' | 'payments' | 'support' | 'settings' | 'audit'

const adminLinks = [
  { key: 'dashboard', icon: '📊', fr: 'Dashboard', ar: 'لوحة القيادة' },
  { key: 'orders', icon: '📦', fr: 'Commandes', ar: 'الطلبات' },
  { key: 'catalog', icon: '📚', fr: 'Catalogue', ar: 'الكتالوج' },
  { key: 'clients', icon: '👥', fr: 'Clients', ar: 'العملاء' },
  { key: 'payments', icon: '💳', fr: 'Paiements', ar: 'المدفوعات' },
  { key: 'support', icon: '🎧', fr: 'Tickets', ar: 'التذاكر' },
  { key: 'settings', icon: '⚙️', fr: 'Paramètres', ar: 'الإعدادات' },
  { key: 'audit', icon: '📋', fr: 'Journal d\'audit', ar: 'سجل المراجعة' },
]

function StatusBadge({ statusKey, lang }: { statusKey: string; lang: Lang }) {
  const s = orderStatuses.find(x => x.key === statusKey) || orderStatuses[0]
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
      backgroundColor: s.color + '18',
      color: s.color,
      border: `1px solid ${s.color}40`,
      whiteSpace: 'nowrap',
    }}>
      {lang === 'ar' ? s.labelAr : s.label}
    </span>
  )
}

export function AdminDashboard({ lang, navigate }: Props) {
  const [tab, setTab] = useState<AdminTab>('dashboard')
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmAction, setConfirmAction] = useState('')

  const kpis = [
    { label: t('Commandes du jour', 'طلبات اليوم', lang), value: '12', delta: '+3', color: '#132A4F', icon: '📦' },
    { label: t('CA aujourd\'hui', 'رقم الأعمال اليوم', lang), value: '48 400 DZD', delta: '+18%', color: '#18A979', icon: '💰' },
    { label: t('Paiements à vérifier', 'مدفوعات للتحقق', lang), value: '4', delta: '', color: '#F59E0B', icon: '⚠️' },
    { label: t('Tickets ouverts', 'تذاكر مفتوحة', lang), value: '7', delta: '-2', color: '#DC3545', icon: '🎧' },
    { label: t('Retards', 'التأخيرات', lang), value: '2', delta: '', color: '#DC3545', icon: '⏰' },
    { label: t('Remboursements', 'الاستردادات', lang), value: '1', delta: '', color: '#667085', icon: '↩️' },
  ]

  const renderContent = () => {
    if (tab === 'orders') {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#172033', margin: 0 }}>
              {t('Commandes', 'الطلبات', lang)}
            </h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder={t('Rechercher...', 'بحث...', lang)}
                style={{
                  height: 38, border: '1.5px solid #E4E9F0', borderRadius: 8,
                  padding: '0 12px', fontSize: 13, color: '#172033', outline: 'none',
                  width: 200,
                }}
              />
              <select style={{
                height: 38, border: '1.5px solid #E4E9F0', borderRadius: 8,
                padding: '0 12px', fontSize: 13, color: '#172033', outline: 'none',
                backgroundColor: '#FFFFFF', cursor: 'pointer',
              }}>
                <option>{t('Tous les statuts', 'كل الحالات', lang)}</option>
                {orderStatuses.map(s => (
                  <option key={s.key} value={s.key}>{lang === 'ar' ? s.labelAr : s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: '#F7F9FC', borderBottom: '1px solid #E4E9F0' }}>
                  {[t('ID', 'الرقم', lang), t('Client', 'العميل', lang), t('Formation', 'الدورة', lang), t('Montant', 'المبلغ', lang), t('Statut', 'الحالة', lang), t('Date', 'التاريخ', lang), t('Actions', 'الإجراءات', lang)].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#667085', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F0F3F8', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F7F9FC')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#132A4F' }}>{order.id}</td>
                    <td style={{ padding: '14px 16px', color: '#172033' }}>Ahmed Bensalem</td>
                    <td style={{ padding: '14px 16px', color: '#172033', maxWidth: 200 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.course}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#172033' }}>{order.amount.toLocaleString()} DZD</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge statusKey={order.status} lang={lang} /></td>
                    <td style={{ padding: '14px 16px', color: '#667085' }}>{order.date}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button style={{
                          padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                          backgroundColor: '#E8EDF5', color: '#132A4F', border: 'none', cursor: 'pointer',
                        }}>
                          {t('Voir', 'عرض', lang)}
                        </button>
                        {order.status === 'processing' && (
                          <button
                            onClick={() => { setConfirmAction(t('Marquer comme livré', 'تحديد كمُسلَّم', lang)); setShowConfirm(true) }}
                            style={{
                              padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                              backgroundColor: '#E8FDF5', color: '#16A36A', border: 'none', cursor: 'pointer',
                            }}
                          >
                            {t('Livrer', 'تسليم', lang)}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    if (tab === 'payments') {
      return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#172033', margin: '0 0 20px' }}>
            {t('Paiements & remboursements', 'المدفوعات والاستردادات', lang)}
          </h2>
          <div style={{
            backgroundColor: '#FFFBEB', border: '1px solid #FDE68A',
            borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontSize: 14, color: '#92400E',
          }}>
            ⚠️ {t('Note de sécurité : la modification, la confirmation et le remboursement d\'une même transaction nécessitent deux validateurs différents.', 'ملاحظة أمان: تعديل وتأكيد واسترداد نفس المعاملة يتطلب مدققين مختلفين.', lang)}
          </div>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: '#F7F9FC', borderBottom: '1px solid #E4E9F0' }}>
                  {[t('ID', 'الرقم', lang), t('Client', 'العميل', lang), t('Montant', 'المبلغ', lang), t('Méthode', 'الطريقة', lang), t('Statut', 'الحالة', lang), t('Actions', 'الإجراءات', lang)].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#667085', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F0F3F8' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#132A4F' }}>{order.id}</td>
                    <td style={{ padding: '14px 16px' }}>Ahmed Bensalem</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{order.amount.toLocaleString()} DZD</td>
                    <td style={{ padding: '14px 16px', color: '#667085' }}>BaridiMob</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge statusKey={order.status} lang={lang} /></td>
                    <td style={{ padding: '14px 16px' }}>
                      <button style={{
                        padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                        backgroundColor: '#E8EDF5', color: '#132A4F', border: 'none', cursor: 'pointer',
                      }}>
                        {t('Détails', 'التفاصيل', lang)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    if (tab === 'audit') {
      return (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#172033', margin: '0 0 20px' }}>
            {t('Journal d\'audit', 'سجل المراجعة', lang)}
          </h2>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 16, overflow: 'hidden' }}>
            {[
              { time: '20 Jan 2025, 14:32', user: 'admin@taallamgo.dz', action: t('Commande TGO-2024-0892 marquée livrée', 'تم تحديد الطلب TGO-2024-0892 كمُسلَّم', lang), ip: '41.96.x.x' },
              { time: '20 Jan 2025, 12:15', user: 'support@taallamgo.dz', action: t('Ticket TKT-2025-0041 mis à jour', 'تم تحديث التذكرة TKT-2025-0041', lang), ip: '41.96.x.x' },
              { time: '20 Jan 2025, 09:40', user: 'admin@taallamgo.dz', action: t('Nouveau coupon CODE2025 créé', 'تم إنشاء كوبون CODE2025 جديد', lang), ip: '41.96.x.x' },
              { time: '19 Jan 2025, 18:55', user: 'admin@taallamgo.dz', action: t('Offre Udemy Python mise à jour (prix : 1890 DZD)', 'تم تحديث عرض Python Udemy (السعر: 1890 دج)', lang), ip: '41.96.x.x' },
            ].map((log, i) => (
              <div key={i} style={{
                display: 'flex', gap: 16, padding: '14px 20px',
                borderBottom: '1px solid #F0F3F8', alignItems: 'flex-start',
              }}>
                <div style={{ fontSize: 12, color: '#667085', flexShrink: 0, minWidth: 140 }}>{log.time}</div>
                <div style={{ flex: 1, fontSize: 13, color: '#172033' }}>{log.action}</div>
                <div style={{ fontSize: 12, color: '#667085', flexShrink: 0 }}>{log.user}</div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Default: dashboard overview
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#172033', margin: '0 0 4px' }}>
            {t('Dashboard Administration', 'لوحة تحكم الإدارة', lang)}
          </h2>
          <p style={{ fontSize: 14, color: '#667085', margin: 0 }}>
            {t('20 janvier 2025', '20 يناير 2025', lang)}
          </p>
        </div>

        {/* KPI grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          {kpis.map((kpi, i) => (
            <div key={i} style={{
              backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 14,
              padding: '18px 18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{kpi.icon}</span>
                {kpi.delta && (
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 20,
                    backgroundColor: kpi.delta.startsWith('+') ? '#E8FDF5' : '#FEE2E2',
                    color: kpi.delta.startsWith('+') ? '#16A36A' : '#DC3545',
                  }}>
                    {kpi.delta}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
              <div style={{ fontSize: 12, color: '#667085', marginTop: 4 }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Recent orders table */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E9F0', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #E4E9F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#172033', margin: 0 }}>
              {t('Commandes récentes', 'الطلبات الأخيرة', lang)}
            </h3>
            <button
              onClick={() => setTab('orders')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#18A979', fontWeight: 600 }}
            >
              {t('Tout voir', 'عرض الكل', lang)}
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: '#F7F9FC' }}>
                {[t('ID', 'الرقم', lang), t('Client', 'العميل', lang), t('Formation', 'الدورة', lang), t('Montant', 'المبلغ', lang), t('Statut', 'الحالة', lang)].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#667085', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockOrders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #F0F3F8' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#132A4F', fontSize: 12 }}>{order.id}</td>
                  <td style={{ padding: '12px 16px' }}>Ahmed B.</td>
                  <td style={{ padding: '12px 16px', maxWidth: 180 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>
                      {order.course}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{order.amount.toLocaleString()} DZD</td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge statusKey={order.status} lang={lang} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#0F1F3C' }}>
      {/* Admin Sidebar — dark theme */}
      <aside style={{
        width: 220, flexShrink: 0,
        backgroundColor: '#0F1F3C',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        padding: '24px 0',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '0 16px', marginBottom: 24 }}>
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <img src={taallamGoLogoSrc} alt="TaallamGo" style={{ height: 28, width: 'auto', filter: 'brightness(0) invert(1)' }} />
          </button>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#18A979', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 8 }}>
            ADMIN
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0 8px' }}>
          {adminLinks.map(link => (
            <button
              key={link.key}
              onClick={() => setTab(link.key as AdminTab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 500,
                backgroundColor: tab === link.key ? 'rgba(24,169,121,0.15)' : 'transparent',
                color: tab === link.key ? '#18A979' : 'rgba(255,255,255,0.6)',
                textAlign: 'left',
                marginBottom: 2,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (tab !== link.key) e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
              onMouseLeave={e => { if (tab !== link.key) e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
            >
              <span>{link.icon}</span>
              <span>{lang === 'ar' ? link.ar : link.fr}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>admin@taallamgo.dz</div>
          <button
            onClick={() => navigate('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}
          >
            ← {t('Site public', 'الموقع العام', lang)}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, backgroundColor: '#F7F9FC', padding: '32px 32px', minWidth: 0 }}>
        {renderContent()}
      </main>

      {/* Confirm modal */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: 20, padding: 32,
            maxWidth: 400, width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#172033', margin: '0 0 10px' }}>
              {t('Confirmer l\'action', 'تأكيد الإجراء', lang)}
            </h3>
            <p style={{ fontSize: 14, color: '#667085', margin: '0 0 24px', lineHeight: 1.6 }}>
              {t(`Voulez-vous confirmer : "${confirmAction}" ?`, `هل تريد تأكيد: "${confirmAction}"؟`, lang)}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: 12, borderRadius: 10, border: '1.5px solid #E4E9F0',
                  backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#172033',
                }}
              >
                {t('Annuler', 'إلغاء', lang)}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: 12, borderRadius: 10, border: 'none',
                  backgroundColor: '#132A4F', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#FFFFFF',
                }}
              >
                {t('Confirmer', 'تأكيد', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
