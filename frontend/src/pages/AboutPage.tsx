import { Container } from '@mui/material'
import PageHero from '@/components/ui/PageHero'
import NewsletterSection from '@/components/sections/NewsletterSection'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function AboutPage() {
  const { brand, settings, about, t } = useSiteContent()

  const paragraph1 =
    settings?.aboutParagraph1 ||
    "Sono Andrea, e cucino da quando ero un bambino seduto al bancone di cucina di mia nonna, a guardare come si prepara una vera genovese. Quella tavola è il punto da cui parte ancora oggi ogni mio menu: ingredienti semplici, tempi lunghi e rispetto per la materia prima."
  const paragraph2 =
    settings?.aboutParagraph2 ||
    "Dopo anni nelle cucine di alcuni ristoranti storici di Napoli, ho deciso di portare quella stessa cura fuori dalle quattro mura di un locale: a casa tua, nel tuo ufficio, nella location del tuo evento. Oggi affianco famiglie per cene speciali, aziende per i loro eventi e nuove attività che vogliono partire con un'identità di cucina chiara."

  const milestones = about?.milestones ?? []
  const values = about?.values ?? []

  return (
    <>
      <PageHero
        eyebrow={t('about.page.eyebrow', 'La mia storia')}
        title={`La storia di ${brand.name}`}
        description={t(
          'about.page.description',
          "Non un'azienda, ma un percorso: dalla cucina di famiglia alle cucine professionali di Napoli, fino a diventare il servizio su misura che porto oggi sulla tua tavola.",
        )}
      />

      <div className="bg-ivory py-16 md:py-[88px]">
        <Container maxWidth="md">
          <div className="mb-16 flex flex-col gap-6">
            <p className="text-[1.1rem] leading-[1.85] text-ink-soft">{paragraph1}</p>
            <p className="text-[1.1rem] leading-[1.85] text-ink-soft">{paragraph2}</p>
          </div>

          {milestones.length > 0 && (
            <>
              <p className="mb-6 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-gold-600">
                {t('about.milestones.heading', 'Le tappe della mia storia')}
              </p>
              <div className="mb-16 border-l-2 border-gold-200 pl-8">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="relative pb-8">
                    <div className="absolute -left-[45px] top-0.5 h-3 w-3 rounded-full bg-gold-500" />
                    <p className="mb-1 font-display font-semibold">{milestone.year}</p>
                    <p className="text-ink-soft">{milestone.text}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {values.length > 0 && (
            <>
              <p className="mb-6 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-gold-600">
                {t('about.values.heading', 'I principi della mia cucina')}
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {values.map((value) => (
                  <div key={value.id} className="rounded-2xl bg-ivory-deep p-7">
                    <p className="mb-2 font-display font-semibold">{value.title}</p>
                    <p className="text-[0.92rem] leading-relaxed text-ink-soft">{value.text}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </Container>
      </div>

      <NewsletterSection />
    </>
  )
}
