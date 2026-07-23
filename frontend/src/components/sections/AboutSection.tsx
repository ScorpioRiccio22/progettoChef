import { Button, Container } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Link as RouterLink } from 'react-router-dom'
import SectionHeading from '@/components/ui/SectionHeading'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function AboutSection() {
  const { brand, settings } = useSiteContent()

  const aboutIntro =
    settings?.aboutIntro ||
    "Cresciuto tra i fornelli di casa e le cucine professionali di Napoli, porto la tradizione partenopea dove serve davvero: sulla tua tavola. Ogni servizio nasce da un'idea semplice — la cucina di qualità non ha bisogno di un ristorante, ha bisogno di cura."

  const stats = [
    { value: settings?.statYearsValue || '8+', label: settings?.statYearsLabel || 'anni di esperienza' },
    { value: settings?.statEventsValue || '150+', label: settings?.statEventsLabel || 'eventi curati' },
    { value: settings?.statIngredientsValue || '100%', label: settings?.statIngredientsLabel || 'materie prime locali' },
  ]

  return (
    <div id="la-mia-storia" className="bg-ivory py-[72px] md:py-[104px]">
      <Container maxWidth="lg">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div className="relative flex aspect-[4/5] items-end overflow-hidden rounded-2xl bg-ink p-8">
            {settings?.aboutImageUrl ? (
              <img src={settings.aboutImageUrl} alt={brand.name} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(184,137,62,0.35),transparent_60%),linear-gradient(160deg,#2E2519,#1C1712)]" />
            )}
            <p className="relative font-display text-[1.6rem] italic text-gold-300">
              "Ogni piatto racconta una storia di famiglia."
            </p>
          </div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="La mia storia"
              title={`La cucina di ${brand.name}`}
              description={aboutIntro}
            />
            <div className="mb-8 flex gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-[1.8rem] font-semibold text-gold-600">{stat.value}</p>
                  <p className="max-w-[110px] text-[0.85rem] text-ink-soft">{stat.label}</p>
                </div>
              ))}
            </div>
            <Button
              component={RouterLink}
              to="/la-mia-storia"
              endIcon={<ArrowForwardIcon />}
              className="px-0 font-semibold normal-case text-gold-600 hover:bg-transparent hover:text-ink"
            >
              Scopri la mia storia
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
