import { Container } from '@mui/material'
import PageHero from '@/components/ui/PageHero'
import { useSiteContent } from '@/hooks/useSiteContent'

export default function PrivacyPolicyPage() {
  const { t } = useSiteContent()

  return (
    <>
      <PageHero
        eyebrow={t('legal.privacy.eyebrow', 'Informazioni legali')}
        title={t('legal.privacy.title', 'Privacy Policy')}
      />

      <div className="bg-ivory py-16 md:py-[88px]">
        <Container maxWidth="md">
          {/*
            Il testo arriva dal sistema site-texts (stessa fonte usata in
            tutto il resto del sito), quindi è modificabile da /admin/testi
            senza bisogno di un redeploy. white-space: pre-line rispetta gli
            "a capo" inseriti nell'editor admin senza dover salvare HTML.
          */}
          <div
            className="whitespace-pre-line text-[1.02rem] leading-relaxed text-ink-soft [&>*+*]:mt-4"
          >
            {t(
              'legal.privacy.content',
              'Il testo della privacy policy non è ancora stato configurato. Vai su Area Admin → Testi del sito per inserirlo.',
            )}
          </div>
        </Container>
      </div>
    </>
  )
}
