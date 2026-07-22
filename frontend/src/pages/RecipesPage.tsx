import { useMemo, useState } from 'react'
import { Button, Chip, Container } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import StorefrontIcon from '@mui/icons-material/Storefront'
import PageHero from '@/components/ui/PageHero'
import DishCard from '@/components/ui/DishCard'
import { useSiteContent } from '@/hooks/useSiteContent'

function formatPrice(price: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)
}

export default function RecipesPage() {
  const { dishes, activeMenu, contact, t } = useSiteContent()
  const [activeCategory, setActiveCategory] = useState<string>('tutti')

  const CATEGORIES: { key: string; label: string }[] = [
    { key: 'tutti', label: t('recipes.category.tutti', 'Tutti i piatti') },
    { key: 'antipasti', label: t('recipes.category.antipasti', 'Antipasti') },
    { key: 'primi', label: t('recipes.category.primi', 'Primi') },
    { key: 'secondi', label: t('recipes.category.secondi', 'Secondi') },
    { key: 'dolci', label: t('recipes.category.dolci', 'Dolci') },
  ]

  const filteredDishes = useMemo(
    () => (activeCategory === 'tutti' ? dishes : dishes.filter((dish) => dish.category === activeCategory)),
    [activeCategory, dishes],
  )

  return (
    <>
      <PageHero
        eyebrow={t('recipes.page.eyebrow', 'A Modo Mio')}
        title={t('recipes.page.title', 'Cosa porto sulla tua tavola')}
        description={t(
          'recipes.page.description',
          'Una selezione di "A MoDo mio" che uso per costruire i menu: ogni servizio viene poi personalizzato in base ai tuoi gusti, alle stagioni e all\'occasione.',
        )}
      />

      {activeMenu && activeMenu.items.length > 0 && (
        <div className="bg-ivory-deep py-12 md:py-16">
          <Container maxWidth="lg">
            <div className="mb-2 flex items-center gap-3">
              <StorefrontIcon className="text-gold-600" />
              <Chip
                label={t('recipes.menuBanner.label', 'In vetrina ora nel negozio')}
                size="small"
                className="bg-gold-500/20 font-semibold text-gold-600"
              />
            </div>
            <h2 className="mb-2 font-display text-2xl font-semibold md:text-[1.9rem]">{activeMenu.name}</h2>
            {activeMenu.description && (
              <p className="mb-6 max-w-[640px] text-ink-soft">{activeMenu.description}</p>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {activeMenu.items.map((item) => (
                <div key={item.id} className="flex items-baseline justify-between gap-4 rounded-xl bg-white p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.name}</p>
                    {item.description && <p className="truncate text-[0.85rem] text-clay">{item.description}</p>}
                  </div>
                  <p className="whitespace-nowrap font-bold text-gold-600">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}

      <div className="bg-ivory py-14 md:py-20">
        <Container maxWidth="lg">
          <div className="mb-10 flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <Button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                variant={activeCategory === category.key ? 'contained' : 'outlined'}
                size="small"
                className={
                  activeCategory === category.key
                    ? 'bg-gold-500 text-ink normal-case hover:bg-gold-600'
                    : 'border-ink/20 text-ink-soft normal-case hover:border-gold-500'
                }
              >
                {category.label}
              </Button>
            ))}
          </div>

          {filteredDishes.length === 0 ? (
            <p className="py-8 text-center text-clay">
              {t('recipes.emptyCategory', 'Nessun piatto disponibile in questa categoria al momento.')}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {filteredDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          )}
        </Container>
      </div>

      <div className="bg-ivory-deep py-16 md:py-20">
        <Container maxWidth="sm" className="text-center">
          <h2 className="mb-3 font-display text-2xl font-semibold md:text-3xl">
            {t('recipes.cta.title', 'Vuoi un menu pensato per te?')}
          </h2>
          <p className="mb-6 text-ink-soft">
            {t(
              'recipes.cta.description',
              "Raccontami l'occasione, il numero di invitati e le tue preferenze: costruiamo insieme il menu giusto.",
            )}
          </p>
          <Button
            variant="contained"
            size="large"
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<WhatsAppIcon />}
            className="bg-olive text-ivory normal-case hover:bg-[#2C3424]"
          >
            {t('recipes.cta.button', 'Parliamone su WhatsApp')}
          </Button>
        </Container>
      </div>
    </>
  )
}
