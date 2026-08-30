'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { useTranslations } from '@/lib/i18n-context'
import {
  formatEuro,
  getHotel,
  getMealPlan,
  getRoom,
  nightsBetween,
  type MealPlanId,
} from '@/lib/accommodation'
import { pickLocale } from '@/lib/cms/types'
import { cn } from '@/lib/utils'
import { PhoneInput } from '@/components/ui/phone-input'

function useLoc() {
  const { locale } = useTranslations()
  return (fr: string, en: string, es: string, ar: string) => {
    if (locale === 'fr') return fr
    if (locale === 'es') return es
    if (locale === 'ar') return ar
    return en
  }
}

type Step = 0 | 1 | 2

export function AccommodationReserveContent({
  hotelId,
  roomId,
}: {
  hotelId: string
  roomId: string
}) {
  const { locale } = useTranslations()
  const getText = useLoc()
  const hotel = getHotel(hotelId)
  const room = getRoom(hotelId, roomId)

  const [step, setStep] = useState<Step>(0)
  const [guests, setGuests] = useState(1)
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [mealPlan, setMealPlan] = useState<MealPlanId>('bb')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const nights = useMemo(
    () => (arrival && departure ? nightsBetween(arrival, departure) : 0),
    [arrival, departure],
  )
  const meal = room ? getMealPlan(room, mealPlan) : undefined
  const total = meal && nights > 0 ? meal.pricePerNight * nights : 0

  if (!hotel || !room) return null

  const roomHref = `/${locale}/accommodation/${hotel.id}/${room.id}`
  const stepLabels = [
    getText('Dates & formule', 'Dates & meal plan', 'Fechas y pensión', 'التواريخ والوجبات'),
    getText('Vos coordonnées', 'Your details', 'Tus datos', 'بياناتك'),
    getText('Confirmation', 'Confirm', 'Confirmación', 'تأكيد'),
  ]

  const canNextStay =
    guests >= 1 &&
    guests <= room.maxGuests &&
    Boolean(arrival) &&
    Boolean(departure) &&
    nights >= 1 &&
    Boolean(meal)

  const canNextDetails = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const submit = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/accommodation/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: hotel.id,
          roomId: room.id,
          mealPlan,
          guests,
          arrival,
          departure,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          notes: notes.trim() || null,
          locale,
        }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(json.error || getText('Échec de l’envoi', 'Submit failed', 'Error al enviar', 'فشل الإرسال'))
        setBusy(false)
        return
      }
      setDone(true)
    } catch {
      setError(getText('Échec réseau', 'Network error', 'Error de red', 'خطأ في الشبكة'))
    }
    setBusy(false)
  }

  if (done) {
    return (
      <div className="bg-[#EAF4FF] min-h-[70svh]">
        <div className="container-editorial py-28 text-center" data-nav-theme="light">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white ring-1 ring-[#5AA8FF]/25">
            <CheckCircle className="h-8 w-8 text-[#5AA8FF]" />
          </span>
          <h1 className="font-heading mt-6 text-section text-[#0046A4]">
            {getText('Demande envoyée', 'Request sent', 'Solicitud enviada', 'تم إرسال الطلب')}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-body-lg text-[#3D5A80]">
            {getText(
              'L’équipe a reçu votre demande de séjour. Vous serez contacté pour confirmer la disponibilité.',
              'The team received your stay request. You’ll be contacted to confirm availability.',
              'El equipo recibió tu solicitud. Te contactarán para confirmar disponibilidad.',
              'استلم الفريق طلب إقامتك. سيتم التواصل معك لتأكيد التوفر.',
            )}
          </p>
          <Link
            href={`/${locale}/accommodation`}
            className="btn-pill mt-8 inline-flex bg-[#5AA8FF] text-white hover:bg-[#2D7FF9]"
          >
            {getText('Retour hébergement', 'Back to accommodation', 'Volver al alojamiento', 'العودة للإقامة')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-[#EAF4FF]"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(90,168,255,0.28), transparent 60%)',
      }}
    >
      <div className="container-editorial pt-28 pb-16 sm:pt-32" data-nav-theme="light">
        <Link
          href={roomHref}
          className="inline-flex items-center gap-2 text-small font-semibold text-[#5A7AA3] hover:text-[#0046A4]"
        >
          <ArrowLeft className="h-4 w-4" />
          {pickLocale(room.name, locale)}
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-[#5AA8FF]/15">
              <div className="relative aspect-[16/11]">
                <Image
                  src={room.image}
                  alt={pickLocale(room.name, locale)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#5AA8FF]">
                  {pickLocale(hotel.name, locale)}
                </p>
                <h1 className="font-heading mt-1 text-2xl font-bold text-[#0046A4]">
                  {pickLocale(room.name, locale)}
                </h1>
                <p className="mt-2 text-small text-[#3D5A80]">{pickLocale(room.beds, locale)}</p>
                <p className="mt-1 text-xs font-semibold text-[#5A7AA3]">
                  {getText(
                    `Max ${room.maxGuests} pers.`,
                    `Max ${room.maxGuests} guests`,
                    `Máx. ${room.maxGuests} pers.`,
                    `حد أقصى ${room.maxGuests}`,
                  )}
                </p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <p className="eyebrow text-[#5AA8FF]">
              {getText(
                `Étape ${step + 1} / 3`,
                `Step ${step + 1} / 3`,
                `Paso ${step + 1} / 3`,
                `الخطوة ${step + 1} / 3`,
              )}
            </p>
            <h2 className="font-heading mt-2 text-section text-[#0046A4]">{stepLabels[step]}</h2>

            <div className="mt-4 flex gap-2" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full',
                    i <= step ? 'bg-[#5AA8FF]' : 'bg-[#5AA8FF]/20',
                  )}
                />
              ))}
            </div>

            <div className="mt-8 space-y-6 rounded-3xl bg-white p-6 ring-1 ring-[#5AA8FF]/15 sm:p-8">
              {step === 0 && (
                <>
                  <p className="text-small text-[#3D5A80]">
                    {getText(
                      `Choisissez vos dates et le nombre de personnes (max ${room.maxGuests}).`,
                      `Select your dates and number of guests (max ${room.maxGuests}).`,
                      `Elige fechas y número de personas (máx. ${room.maxGuests}).`,
                      `اختر التواريخ وعدد الأشخاص (حد أقصى ${room.maxGuests}).`,
                    )}
                  </p>
                  <label className="block">
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
                      {getText('Nombre de personnes', 'Number of people', 'Número de personas', 'عدد الأشخاص')}
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={room.maxGuests}
                      value={guests}
                      onChange={(e) => setGuests(Math.min(room.maxGuests, Math.max(1, Number(e.target.value) || 1)))}
                      className="mt-2 h-12 w-full rounded-2xl border border-[#5AA8FF]/20 bg-[#EAF4FF]/40 px-4 text-[#0046A4]"
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
                        {getText('Arrivée', 'Arrival', 'Llegada', 'الوصول')}
                      </span>
                      <input
                        type="date"
                        value={arrival}
                        onChange={(e) => setArrival(e.target.value)}
                        className="mt-2 h-12 w-full rounded-2xl border border-[#5AA8FF]/20 bg-[#EAF4FF]/40 px-4 text-[#0046A4]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
                        {getText('Départ', 'Departure', 'Salida', 'المغادرة')}
                      </span>
                      <input
                        type="date"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        className="mt-2 h-12 w-full rounded-2xl border border-[#5AA8FF]/20 bg-[#EAF4FF]/40 px-4 text-[#0046A4]"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
                      {getText('Formule repas', 'Meal plan', 'Pensión', 'خطة الوجبات')}
                    </p>
                    <div className="mt-3 space-y-2">
                      {room.mealPlans.map((plan) => {
                        const selected = mealPlan === plan.id
                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setMealPlan(plan.id)}
                            className={cn(
                              'flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-start transition-colors',
                              selected
                                ? 'border-[#5AA8FF] bg-[#EAF4FF]'
                                : 'border-[#5AA8FF]/15 bg-white hover:border-[#5AA8FF]/40',
                            )}
                          >
                            <span>
                              <span className="block font-bold text-[#0046A4]">
                                {pickLocale(plan.name, locale)}
                              </span>
                              <span className="mt-0.5 block text-xs text-[#5A7AA3]">
                                {pickLocale(plan.includes, locale)}
                              </span>
                            </span>
                            <span className="shrink-0 text-small font-bold tabular-nums text-[#0046A4]">
                              {formatEuro(plan.pricePerNight, locale)}
                              <span className="block text-[0.65rem] font-semibold text-[#5A7AA3]">
                                {getText('/ nuit', '/ night', '/ noche', '/ ليلة')}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
                      {getText('Nom complet', 'Full name', 'Nombre completo', 'الاسم الكامل')}
                    </span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 h-12 w-full rounded-2xl border border-[#5AA8FF]/20 bg-[#EAF4FF]/40 px-4 text-[#0046A4]"
                      autoComplete="name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
                      Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 h-12 w-full rounded-2xl border border-[#5AA8FF]/20 bg-[#EAF4FF]/40 px-4 text-[#0046A4]"
                      autoComplete="email"
                    />
                  </label>
                  <div>
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
                      {getText('Téléphone', 'Phone', 'Teléfono', 'الهاتف')}
                    </span>
                    <div className="mt-2">
                      <PhoneInput value={phone} onChange={setPhone} />
                    </div>
                  </div>
                  <label className="block">
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[#7A8AA3]">
                      {getText('Notes', 'Notes', 'Notas', 'ملاحظات')}
                    </span>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="mt-2 w-full rounded-2xl border border-[#5AA8FF]/20 bg-[#EAF4FF]/40 px-4 py-3 text-[#0046A4]"
                      placeholder={getText(
                        'Demandes spéciales…',
                        'Special requests…',
                        'Peticiones especiales…',
                        'طلبات خاصة…',
                      )}
                    />
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 text-small text-[#3D5A80]">
                  <SummaryRow
                    label={getText('Chambre', 'Room', 'Habitación', 'الغرفة')}
                    value={pickLocale(room.name, locale)}
                  />
                  <SummaryRow
                    label={getText('Dates', 'Dates', 'Fechas', 'التواريخ')}
                    value={`${arrival} → ${departure} (${nights} ${getText('nuits', 'nights', 'noches', 'ليال')})`}
                  />
                  <SummaryRow
                    label={getText('Voyageurs', 'Guests', 'Huéspedes', 'الضيوف')}
                    value={String(guests)}
                  />
                  <SummaryRow
                    label={getText('Formule', 'Meal plan', 'Pensión', 'الوجبات')}
                    value={meal ? pickLocale(meal.name, locale) : '—'}
                  />
                  <SummaryRow
                    label={getText('Estimation', 'Estimate', 'Estimación', 'تقدير')}
                    value={formatEuro(total, locale)}
                  />
                  <SummaryRow label={getText('Contact', 'Contact', 'Contacto', 'التواصل')} value={`${name} · ${email}`} />
                  <p className="rounded-2xl bg-[#EAF4FF] px-4 py-3 text-xs text-[#5A7AA3]">
                    {getText(
                      'Ceci est une demande — pas un paiement. L’admin confirme la dispo depuis le tableau de bord.',
                      'This is a request — not a payment. Admins confirm availability from the dashboard.',
                      'Es una solicitud — no un pago. El admin confirma la disponibilidad en el panel.',
                      'هذا طلب وليس دفعاً. يؤكد المسؤول التوفر من لوحة التحكم.',
                    )}
                  </p>
                </div>
              )}

              {error && <p className="text-sm font-medium text-red-600">{error}</p>}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  disabled={step === 0 || busy}
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="btn-pill bg-transparent text-[#0046A4] ring-1 ring-[#5AA8FF]/25 disabled:opacity-40"
                >
                  {getText('Retour', 'Back', 'Atrás', 'رجوع')}
                </button>
                {step < 2 ? (
                  <button
                    type="button"
                    disabled={step === 0 ? !canNextStay : !canNextDetails}
                    onClick={() => setStep((s) => (s + 1) as Step)}
                    className="btn-pill bg-[#5AA8FF] text-white hover:bg-[#2D7FF9] disabled:opacity-40"
                  >
                    {getText('Suivant', 'Next', 'Siguiente', 'التالي')}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={submit}
                    className="btn-pill bg-[#5AA8FF] text-white hover:bg-[#2D7FF9] disabled:opacity-40"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {getText('Envoyer la demande', 'Send request', 'Enviar solicitud', 'إرسال الطلب')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#5AA8FF]/10 pb-3">
      <span className="font-semibold text-[#5A7AA3]">{label}</span>
      <span className="font-bold text-[#0046A4] text-end">{value}</span>
    </div>
  )
}
