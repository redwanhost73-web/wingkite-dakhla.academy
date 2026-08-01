'use client'

import { useTranslations } from '@/lib/i18n-context'
import { Shield, Eye, Database, Lock, Mail, RefreshCw, Globe, UserCheck } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function PrivacyContent() {
  const { locale } = useTranslations()

  const getText = (frText: string, enText: string, esText: string, arText: string): string => {
    if (locale === 'fr') return frText
    if (locale === 'es') return esText
    if (locale === 'ar') return arText
    return enText
  }

  const lastUpdated = getText('11 mars 2025', 'March 11, 2025', '11 de marzo de 2025', '11 مارس 2025')

  const sections = [
    {
      icon: Database,
      title: getText(
        'Collecte des données personnelles',
        'Collection of Personal Data',
        'Recopilación de datos personales',
        'جمع البيانات الشخصية'
      ),
      content: getText(
        `Wing Kite Dakhla Academy collecte des données personnelles lorsque vous utilisez notre site internet, remplissez un formulaire de contact ou effectuez une réservation. Les données collectées peuvent inclure :\n\n• Votre nom et prénom\n• Votre adresse e-mail\n• Votre numéro de téléphone\n• Vos préférences de cours et niveau de pratique\n• Les informations relatives à votre réservation`,
        `Wing Kite Dakhla Academy collects personal data when you use our website, fill out a contact form, or make a booking. The data collected may include:\n\n• Your first and last name\n• Your email address\n• Your phone number\n• Your course preferences and skill level\n• Information related to your booking`,
        `Wing Kite Dakhla Academy recopila datos personales cuando usted utiliza nuestro sitio web, rellena un formulario de contacto o realiza una reserva. Los datos recopilados pueden incluir:\n\n• Su nombre y apellidos\n• Su dirección de correo electrónico\n• Su número de teléfono\n• Sus preferencias de curso y nivel de práctica\n• La información relacionada con su reserva`,
        `تجمع أكاديمية وينج كايت الداخلة البيانات الشخصية عند استخدامك لموقعنا الإلكتروني، أو ملء نموذج الاتصال، أو إجراء حجز. قد تشمل البيانات المجمعة:\n\n• اسمك الأول والأخير\n• عنوان بريدك الإلكتروني\n• رقم هاتفك\n• تفضيلاتك للدروس ومستوى مهارتك\n• المعلومات المتعلقة بحجزك`
      ),
    },
    {
      icon: Eye,
      title: getText(
        "Utilisation des données",
        "Use of Data",
        "Uso de los datos",
        "استخدام البيانات"
      ),
      content: getText(
        `Les données personnelles collectées sont utilisées pour :\n\n• Traiter vos demandes de réservation et vous contacter\n• Vous envoyer des informations sur nos cours et services\n• Améliorer notre site web et nos services\n• Respecter nos obligations légales et réglementaires\n\nWing Kite Dakhla Academy ne vend jamais vos données personnelles à des tiers. Vos données ne sont partagées qu'avec des prestataires de services nécessaires à l'exécution de nos services (hébergement, paiement sécurisé).`,
        `The personal data collected is used to:\n\n• Process your booking requests and contact you\n• Send you information about our courses and services\n• Improve our website and services\n• Comply with our legal and regulatory obligations\n\nWing Kite Dakhla Academy never sells your personal data to third parties. Your data is only shared with service providers necessary for the delivery of our services (hosting, secure payment).`,
        `Los datos personales recopilados se utilizan para:\n\n• Procesar sus solicitudes de reserva y contactarle\n• Enviarle información sobre nuestros cursos y servicios\n• Mejorar nuestro sitio web y servicios\n• Cumplir con nuestras obligaciones legales y reglamentarias\n\nWing Kite Dakhla Academy nunca vende sus datos personales a terceros. Sus datos solo se comparten con proveedores de servicios necesarios para la prestación de nuestros servicios (alojamiento, pago seguro).`,
        `تُستخدم البيانات الشخصية المجمعة من أجل:\n\n• معالجة طلبات الحجز والتواصل معك\n• إرسال معلومات حول دروسنا وخدماتنا\n• تحسين موقعنا الإلكتروني وخدماتنا\n• الامتثال لالتزاماتنا القانونية والتنظيمية\n\nلا تبيع أكاديمية وينج كايت الداخلة أبداً بياناتك الشخصية لأطراف ثالثة. تتم مشاركة بياناتك فقط مع مزودي الخدمات الضروريين لتقديم خدماتنا (الاستضافة، الدفع الآمن).`
      ),
    },
    {
      icon: Lock,
      title: getText(
        'Protection des données',
        'Data Protection',
        'Protección de datos',
        'حماية البيانات'
      ),
      content: getText(
        `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction. Ces mesures comprennent :\n\n• Chiffrement SSL/TLS de toutes les communications\n• Accès restreint aux données personnelles\n• Hébergement sécurisé sur des serveurs certifiés\n• Révision régulière de nos pratiques de sécurité`,
        `We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, modification, disclosure, or destruction. These measures include:\n\n• SSL/TLS encryption of all communications\n• Restricted access to personal data\n• Secure hosting on certified servers\n• Regular review of our security practices`,
        `Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, modificación, divulgación o destrucción. Estas medidas incluyen:\n\n• Cifrado SSL/TLS de todas las comunicaciones\n• Acceso restringido a datos personales\n• Alojamiento seguro en servidores certificados\n• Revisión regular de nuestras prácticas de seguridad`,
        `نطبق تدابير تقنية وتنظيمية مناسبة لحماية بياناتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. تشمل هذه التدابير:\n\n• تشفير SSL/TLS لجميع الاتصالات\n• وصول مقيد إلى البيانات الشخصية\n• استضافة آمنة على خوادم معتمدة\n• مراجعة منتظمة لممارسات الأمان لدينا`
      ),
    },
    {
      icon: UserCheck,
      title: getText(
        'Vos droits',
        'Your Rights',
        'Sus derechos',
        'حقوقك'
      ),
      content: getText(
        `Conformément au Règlement Général sur la Protection des Données (RGPD) et à la législation applicable, vous disposez des droits suivants concernant vos données personnelles :\n\n• Droit d'accès : obtenir une copie de vos données personnelles\n• Droit de rectification : corriger des données inexactes ou incomplètes\n• Droit à l'effacement : demander la suppression de vos données\n• Droit à la portabilité : recevoir vos données dans un format structuré\n• Droit d'opposition : vous opposer au traitement de vos données\n• Droit à la limitation : restreindre le traitement de vos données\n\nPour exercer ces droits, contactez-nous à : wingkitedakhla@gmail.com`,
        `In accordance with the General Data Protection Regulation (GDPR) and applicable legislation, you have the following rights regarding your personal data:\n\n• Right of access: obtain a copy of your personal data\n• Right of rectification: correct inaccurate or incomplete data\n• Right to erasure: request deletion of your data\n• Right to portability: receive your data in a structured format\n• Right to object: object to the processing of your data\n• Right to restriction: restrict the processing of your data\n\nTo exercise these rights, contact us at: wingkitedakhla@gmail.com`,
        `De conformidad con el Reglamento General de Protección de Datos (RGPD) y la legislación aplicable, usted tiene los siguientes derechos con respecto a sus datos personales:\n\n• Derecho de acceso: obtener una copia de sus datos personales\n• Derecho de rectificación: corregir datos inexactos o incompletos\n• Derecho de supresión: solicitar la eliminación de sus datos\n• Derecho de portabilidad: recibir sus datos en un formato estructurado\n• Derecho de oposición: oponerse al tratamiento de sus datos\n• Derecho de limitación: restringir el tratamiento de sus datos\n\nPara ejercer estos derechos, contáctenos en: wingkitedakhla@gmail.com`,
        `وفقاً للائحة العامة لحماية البيانات (GDPR) والتشريعات المعمول بها، لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:\n\n• حق الوصول: الحصول على نسخة من بياناتك الشخصية\n• حق التصحيح: تصحيح البيانات غير الدقيقة أو غير المكتملة\n• حق الحذف: طلب حذف بياناتك\n• حق قابلية النقل: استلام بياناتك بتنسيق منظم\n• حق الاعتراض: الاعتراض على معالجة بياناتك\n• حق التقييد: تقييد معالجة بياناتك\n\nلممارسة هذه الحقوق، تواصل معنا على: wingkitedakhla@gmail.com`
      ),
    },
    {
      icon: Globe,
      title: getText(
        'Cookies et traceurs',
        'Cookies and Trackers',
        'Cookies y rastreadores',
        'ملفات تعريف الارتباط والمتتبعون'
      ),
      content: getText(
        `Notre site web utilise des cookies pour améliorer votre expérience de navigation. Les cookies sont de petits fichiers texte stockés sur votre appareil. Nous utilisons :\n\n• Cookies essentiels : nécessaires au bon fonctionnement du site\n• Cookies analytiques : pour comprendre comment vous utilisez notre site (Google Analytics)\n• Cookies de performance : pour améliorer les performances du site\n\nVous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient ne plus être disponibles.`,
        `Our website uses cookies to improve your browsing experience. Cookies are small text files stored on your device. We use:\n\n• Essential cookies: necessary for the proper functioning of the site\n• Analytical cookies: to understand how you use our site (Google Analytics)\n• Performance cookies: to improve site performance\n\nYou can configure your browser to refuse cookies, but some site features may no longer be available.`,
        `Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación. Las cookies son pequeños archivos de texto almacenados en su dispositivo. Utilizamos:\n\n• Cookies esenciales: necesarias para el correcto funcionamiento del sitio\n• Cookies analíticas: para entender cómo usa nuestro sitio (Google Analytics)\n• Cookies de rendimiento: para mejorar el rendimiento del sitio\n\nPuede configurar su navegador para rechazar las cookies, pero algunas funciones del sitio pueden dejar de estar disponibles.`,
        `يستخدم موقعنا الإلكتروني ملفات تعريف الارتباط لتحسين تجربة التصفح لديك. ملفات تعريف الارتباط هي ملفات نصية صغيرة مخزنة على جهازك. نستخدم:\n\n• ملفات تعريف الارتباط الأساسية: ضرورية لحسن سير الموقع\n• ملفات تعريف الارتباط التحليلية: لفهم كيفية استخدامك لموقعنا (Google Analytics)\n• ملفات تعريف الارتباط للأداء: لتحسين أداء الموقع\n\nيمكنك ضبط متصفحك لرفض ملفات تعريف الارتباط، لكن بعض ميزات الموقع قد لا تكون متاحة.`
      ),
    },
    {
      icon: RefreshCw,
      title: getText(
        'Conservation des données',
        'Data Retention',
        'Conservación de datos',
        'الاحتفاظ بالبيانات'
      ),
      content: getText(
        `Nous conservons vos données personnelles aussi longtemps que nécessaire pour les finalités décrites dans cette politique, et conformément aux exigences légales applicables. En général :\n\n• Les données de contact et de réservation sont conservées 3 ans après votre dernière interaction avec nous\n• Les données de facturation sont conservées 10 ans conformément à la législation comptable\n• Les données de cookies analytiques sont conservées 13 mois maximum`,
        `We retain your personal data for as long as necessary for the purposes described in this policy, and in accordance with applicable legal requirements. In general:\n\n• Contact and booking data is retained for 3 years after your last interaction with us\n• Billing data is retained for 10 years in accordance with accounting legislation\n• Analytical cookie data is retained for a maximum of 13 months`,
        `Conservamos sus datos personales durante el tiempo necesario para los fines descritos en esta política y de acuerdo con los requisitos legales aplicables. En general:\n\n• Los datos de contacto y reserva se conservan durante 3 años después de su última interacción con nosotros\n• Los datos de facturación se conservan durante 10 años de acuerdo con la legislación contable\n• Los datos de cookies analíticas se conservan un máximo de 13 meses`,
        `نحتفظ ببياناتك الشخصية طالما كان ذلك ضرورياً للأغراض الموضحة في هذه السياسة، وفقاً للمتطلبات القانونية المعمول بها. بشكل عام:\n\n• يتم الاحتفاظ ببيانات الاتصال والحجز لمدة 3 سنوات بعد آخر تفاعل معنا\n• يتم الاحتفاظ ببيانات الفواتير لمدة 10 سنوات وفقاً لتشريعات المحاسبة\n• يتم الاحتفاظ ببيانات ملفات تعريف الارتباط التحليلية لمدة أقصاها 13 شهراً`
      ),
    },
    {
      icon: Mail,
      title: getText(
        'Contact et réclamations',
        'Contact and Complaints',
        'Contacto y reclamaciones',
        'التواصل والشكاوى'
      ),
      content: getText(
        `Pour toute question concernant cette politique de confidentialité, ou pour exercer vos droits, vous pouvez nous contacter :\n\n• Par e-mail : wingkitedakhla@gmail.com\n• Par téléphone : +212 766 910 203\n• Par courrier : Wing Kite Dakhla Academy, Lagon de Dakhla, Dakhla, Maroc\n\nSi vous estimez que vos droits ne sont pas respectés, vous avez également le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente de votre pays.`,
        `For any questions regarding this privacy policy, or to exercise your rights, you can contact us:\n\n• By email: wingkitedakhla@gmail.com\n• By phone: +212 766 910 203\n• By mail: Wing Kite Dakhla Academy, Dakhla Lagoon, Dakhla, Morocco\n\nIf you believe your rights are not being respected, you also have the right to file a complaint with the competent supervisory authority in your country.`,
        `Para cualquier pregunta sobre esta política de privacidad, o para ejercer sus derechos, puede contactarnos:\n\n• Por correo electrónico: wingkitedakhla@gmail.com\n• Por teléfono: +212 766 910 203\n• Por correo postal: Wing Kite Dakhla Academy, Laguna de Dakhla, Dakhla, Marruecos\n\nSi considera que sus derechos no están siendo respetados, también tiene derecho a presentar una reclamación ante la autoridad de control competente de su país.`,
        `لأي أسئلة تتعلق بسياسة الخصوصية هذه، أو لممارسة حقوقك، يمكنك التواصل معنا:\n\n• عبر البريد الإلكتروني: wingkitedakhla@gmail.com\n• عبر الهاتف: +212 766 910 203\n• عبر البريد: أكاديمية وينج كايت الداخلة، بحيرة الداخلة، الداخلة، المغرب\n\nإذا كنت تعتقد أن حقوقك غير محترمة، فلديك أيضاً الحق في تقديم شكوى إلى السلطة الرقابية المختصة في بلدك.`
      ),
    },
  ]

  return (
    <div className="w-full bg-[#FAF8F3]" data-nav-theme="light">
      {/* Hero */}
      <div className="surface-noise relative overflow-hidden bg-[#0B1F3B] text-white pt-44 pb-32" data-nav-theme="dark">
        <span aria-hidden className="blob -top-32 left-1/3 h-120 w-120 bg-[#0046A4]/25" />

        <div className="container-narrow relative z-10 text-center">
          <Reveal>
            <span className="glass-panel eyebrow inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-white/90">
              <Shield className="h-3.5 w-3.5 text-[#C9A66B]" />
              {getText('Politique de confidentialité', 'Privacy Policy', 'Política de privacidad', 'سياسة الخصوصية')}
            </span>
          </Reveal>
          <Reveal delay={110}>
            <h1 className="font-heading text-display-sm mx-auto max-w-3xl mt-8 text-balance">
              {getText(
                'Protection de vos données personnelles',
                'Protection of Your Personal Data',
                'Protección de sus datos personales',
                'حماية بياناتك الشخصية'
              )}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-small text-white/50 mt-7">
              {getText('Dernière mise à jour :', 'Last updated:', 'Última actualización:', 'آخر تحديث:')} {lastUpdated}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Content */}
      <div className="container-narrow pb-24">
        {/* Intro card */}
        <div className="mx-auto max-w-3xl -mt-20 mb-14">
          <Reveal>
          <div className="card-premium bg-white/95 p-8 sm:p-10 backdrop-blur-xl">
            <p className="text-body-lg text-[#3D4F6F]">
              {getText(
                'Wing Kite Dakhla Academy s\'engage à protéger la vie privée de ses utilisateurs et clients. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre site internet wingkite-dakhla.academy ou nos services.',
                'Wing Kite Dakhla Academy is committed to protecting the privacy of its users and clients. This privacy policy explains how we collect, use and protect your personal data when you use our website wingkite-dakhla.academy or our services.',
                'Wing Kite Dakhla Academy se compromete a proteger la privacidad de sus usuarios y clientes. Esta política de privacidad explica cómo recopilamos, utilizamos y protegemos sus datos personales cuando utiliza nuestro sitio web wingkite-dakhla.academy o nuestros servicios.',
                'تلتزم أكاديمية وينج كايت الداخلة بحماية خصوصية مستخدميها وعملائها. تشرح سياسة الخصوصية هذه كيف نجمع بياناتك الشخصية ونستخدمها ونحميها عند استخدام موقعنا الإلكتروني wingkite-dakhla.academy أو خدماتنا.'
              )}
            </p>
          </div>
          </Reveal>
        </div>

        {/* Sections */}
        <div className="mx-auto max-w-3xl space-y-7">
          {sections.map((section, index) => {
            const Icon = section.icon
            const paragraphs = section.content.split('\n\n')
            return (
              <Reveal key={index} delay={40}>
                <div className="card-premium">
                  {/* Section header */}
                  <div className="flex items-center gap-4 px-8 py-7">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#0046A4]/8">
                      <Icon className="h-5 w-5 text-[#0046A4]" />
                    </span>
                    <h2 className="font-heading text-lg font-bold text-[#072A5A]">
                      <span className="text-small me-2 font-extrabold text-[#C9A66B]">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      {section.title}
                    </h2>
                  </div>
                  <hr className="hairline" />
                  {/* Section content */}
                  <div className="space-y-4 px-8 py-7">
                    {paragraphs.map((para, pIdx) => {
                      const isList = para.startsWith('•')
                      if (isList) {
                        const items = para.split('\n').filter((l) => l.startsWith('•'))
                        return (
                          <ul key={pIdx} className="space-y-2.5">
                            {items.map((item, iIdx) => (
                              <li key={iIdx} className="flex items-start gap-3">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A66B]" />
                                <span className="text-small text-[#3D4F6F]">
                                  {item.replace('• ', '')}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )
                      }
                      return (
                        <p key={pIdx} className="text-small text-[#3D4F6F]">
                          {para}
                        </p>
                      )
                    })}
                  </div>
                </div>
              </Reveal>
            )
          })}

          {/* Bottom note */}
          <div className="rounded-[24px] border border-[#0046A4]/12 bg-[#0046A4]/4 px-8 py-7">
            <p className="text-small text-center text-[#7A8AA3]">
              {getText(
                'Wing Kite Dakhla Academy se réserve le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec la date de mise à jour.',
                'Wing Kite Dakhla Academy reserves the right to modify this privacy policy at any time. Any changes will be published on this page with the update date.',
                'Wing Kite Dakhla Academy se reserva el derecho de modificar esta política de privacidad en cualquier momento. Cualquier cambio será publicado en esta página con la fecha de actualización.',
                'تحتفظ أكاديمية وينج كايت الداخلة بالحق في تعديل سياسة الخصوصية هذه في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة مع تاريخ التحديث.'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
