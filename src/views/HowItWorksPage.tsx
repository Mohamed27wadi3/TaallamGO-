import type { Lang } from '../data'
import { t } from '../data'

interface Props {
  lang: Lang
  navigate: (page: string) => void
  dir: 'ltr' | 'rtl'
}

export function HowItWorksPage({ lang, navigate }: Props) {
  const sections = [
    {
      title: t('Choisissez votre formation', 'اختر دورتك', lang),
      content: t(
        'Parcourez le catalogue ou utilisez la recherche pour trouver la formation qui vous convient. Consultez la fiche détaillée : description, caractéristiques, ce qui est inclus, durée, niveau et lien vers la page officielle.',
        'تصفح الكتالوج أو استخدم البحث للعثور على الدورة المناسبة. اطلع على الصفحة التفصيلية: الوصف والميزات وما هو مرفق والمدة والمستوى والرابط الرسمي.',
        lang
      ),
      icon: '🔍',
    },
    {
      title: t('Obtenez votre devis en DZD', 'احصل على عرض سعرك بالدينار', lang),
      content: t(
        'Avant toute commande, consultez le total à payer en DZD. Aucun engagement : le montant final est confirmé avant validation. Le devis est valide 48h ouvrables.',
        'قبل أي طلب، اطلع على الإجمالي المطلوب بالدينار. لا التزام: يتم تأكيد المبلغ النهائي قبل الموافقة. العرض صالح 48 ساعة عمل.',
        lang
      ),
      icon: '💰',
    },
    {
      title: t('Payez avec un moyen local', 'ادفع بوسيلة محلية', lang),
      content: t(
        'Choisissez parmi les méthodes de paiement autorisées en Algérie : virement CCP, BaridiMob, virement bancaire ou Mobilis Money. TaallamGo ne demandera jamais votre mot de passe sur une plateforme externe.',
        'اختر من طرق الدفع المرخصة في الجزائر: تحويل CCP أو BaridiMob أو تحويل بنكي أو Mobilis Money. لن يطلب TaallamGo أبداً كلمة مرورك على منصة خارجية.',
        lang
      ),
      icon: '🏦',
    },
    {
      title: t('Suivez et recevez votre accès', 'تابع واستلم وصولك', lang),
      content: t(
        'Votre commande est suivie en temps réel depuis votre espace client. L\'accès est livré sur votre propre compte existant via une méthode officielle (code d\'activation, invitation, abonnement direct). Aucun compte partagé.',
        'طلبك يُتابَع في الوقت الفعلي من لوحة تحكم العميل. يُسلَّم الوصول إلى حسابك الشخصي عبر طريقة رسمية (كود تفعيل، دعوة، اشتراك مباشر). لا حسابات مشتركة.',
        lang
      ),
      icon: '✅',
    },
  ]

  const details = [
    {
      icon: '📅',
      title: t('Délais de traitement', 'مواعيد المعالجة', lang),
      content: t('24 à 72 heures ouvrables selon la plateforme. Un délai indicatif vous est communiqué avant confirmation de commande.', '24 إلى 72 ساعة عمل حسب المنصة. يُبلَّغ لك الوقت التقريبي قبل تأكيد الطلب.', lang),
    },
    {
      icon: '📦',
      title: t('Méthodes de livraison', 'طرق التسليم', lang),
      content: t('Selon la plateforme : code voucher, activation directe sur votre compte ou abonnement nominatif. Détaillé sur chaque fiche de formation.', 'حسب المنصة: كود فاوتشر، تفعيل مباشر على حسابك أو اشتراك باسمك. مُفصَّل في كل بطاقة دورة.', lang),
    },
    {
      icon: '↩️',
      title: t('Politique de remboursement', 'سياسة الاسترداد', lang),
      content: t('Si l\'accès n\'a pas été activé et que la livraison est impossible, un remboursement total est effectué. Les cas particuliers sont traités au cas par cas.', 'إذا لم يُفعَّل الوصول وكان التسليم مستحيلاً، يُجرى استرداد كامل. الحالات الخاصة تُعالَج كلٌّ على حدة.', lang),
    },
    {
      icon: '🔒',
      title: t('Sécurité de vos données', 'أمان بياناتك', lang),
      content: t('Vos données personnelles sont protégées. Nous ne partageons jamais votre email avec une plateforme sans votre accord. Aucun mot de passe externe ne vous sera demandé.', 'بياناتك الشخصية محمية. لن نشارك بريدك مع أي منصة بدون موافقتك. لن نطلب منك أبداً كلمة مرور خارجية.', lang),
    },
    {
      icon: '🤝',
      title: t('Responsabilités', 'المسؤوليات', lang),
      content: t('TaallamGo facilite l\'accès, ne garantit pas les services des plateformes elles-mêmes. La qualité du contenu reste la responsabilité de chaque plateforme.', 'يسهّل TaallamGo الوصول ولا يضمن خدمات المنصات نفسها. جودة المحتوى تبقى مسؤولية كل منصة.', lang),
    },
    {
      icon: '⚖️',
      title: t('Conformité légale', 'الامتثال القانوني', lang),
      content: t('TaallamGo opère uniquement avec des méthodes de paiement autorisées par la réglementation algérienne en vigueur. Toute évolution réglementaire est prise en compte.', 'يعمل TaallamGo بطرق دفع مرخصة بالتنظيم الجزائري المعمول به. تؤخذ أي تحديثات تنظيمية بعين الاعتبار.', lang),
    },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F9FC' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#132A4F', padding: '56px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px' }}>
          {t('Comment ça marche ?', 'كيف يعمل؟', lang)}
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
          {t(
            'Un processus simple, transparent et sécurisé pour accéder aux formations mondiales depuis l\'Algérie.',
            'عملية بسيطة وشفافة وآمنة للوصول إلى الدورات العالمية من الجزائر.',
            lang
          )}
        </p>
      </div>

      {/* Steps */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 0' }}>
        {sections.map((section, i) => (
          <div key={i} style={{ display: 'flex', gap: 28, marginBottom: 48, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: '#132A4F',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>
                {section.icon}
              </div>
              {i < sections.length - 1 && (
                <div style={{
                  width: 2, height: 40, backgroundColor: '#E4E9F0',
                  margin: '8px auto 0',
                }} />
              )}
            </div>
            <div style={{ paddingTop: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#18A979', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                {t('ÉTAPE', 'خطوة', lang)} 0{i + 1}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#172033', margin: '0 0 10px' }}>{section.title}</h2>
              <p style={{ fontSize: 15, color: '#667085', margin: 0, lineHeight: 1.75 }}>{section.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Details grid */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#172033', margin: '0 0 40px', textAlign: 'center' }}>
            {t('Tout ce que vous devez savoir', 'كل ما تحتاج أن تعرفه', lang)}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {details.map((detail, i) => (
              <div key={i} style={{
                backgroundColor: '#F7F9FC', border: '1px solid #E4E9F0', borderRadius: 16, padding: 24,
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{detail.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#172033', margin: '0 0 10px' }}>{detail.title}</h3>
                <p style={{ fontSize: 14, color: '#667085', margin: 0, lineHeight: 1.7 }}>{detail.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#172033', margin: '0 0 16px' }}>
          {t('Prêt à commencer ?', 'مستعد للبدء؟', lang)}
        </h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('catalog')}
            style={{
              backgroundColor: '#132A4F', color: '#FFFFFF',
              border: 'none', cursor: 'pointer',
              padding: '13px 32px', borderRadius: 12,
              fontSize: 15, fontWeight: 700,
            }}
          >
            {t('Explorer les formations', 'استكشف الدورات', lang)}
          </button>
          <button
            onClick={() => navigate('custom-request')}
            style={{
              backgroundColor: '#FFFFFF', color: '#132A4F',
              border: '1.5px solid #E4E9F0', cursor: 'pointer',
              padding: '13px 32px', borderRadius: 12,
              fontSize: 15, fontWeight: 600,
            }}
          >
            {t('Demande personnalisée', 'طلب مخصص', lang)}
          </button>
        </div>
      </div>
    </div>
  )
}
