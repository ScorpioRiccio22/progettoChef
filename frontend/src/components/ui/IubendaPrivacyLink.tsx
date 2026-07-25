import type { ReactNode, AnchorHTMLAttributes } from 'react'

// Codice di embedding fornito da iubenda (Privacy Policy -> "Codice di embedding").
// Nota: iubenda intercetta automaticamente il click sui link con classe
// "iubenda-nc"/"iubenda-embed" e apre il popup al posto della navigazione,
// una volta che lo script è presente nell'<head> di index.html, ad es.:
//
//   <script type="text/javascript">
//     var _iub = _iub || [];
//     _iub.csConfiguration = { ... };
//   </script>
//   <script src="https://cdn.iubenda.com/iubenda.js"></script>

const PRIVACY_POLICY_LINK = {
  href: 'https://www.iubenda.com/privacy-policy/64194362',
  className: 'iubenda-white iubenda-noiframe iubenda-embed',
  title: 'Privacy Policy',
  label: 'Privacy Policy',
} as const

const COOKIE_POLICY_LINK = {
  href: 'https://www.iubenda.com/privacy-policy/64194362/cookie-policy',
  className: 'iubenda-white iubenda-noiframe iubenda-embed',
  title: 'Cookie Policy',
  label: 'Cookie Policy',
} as const

interface IubendaLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  link: typeof PRIVACY_POLICY_LINK | typeof COOKIE_POLICY_LINK
  children?: ReactNode
}

function IubendaLink({ link, children, className, ...rest }: IubendaLinkProps) {
  return (
    <a
      href={link.href}
      className={`${link.className} ${className ?? ''}`}
      title={link.title}
      {...rest}
    >
      {children ?? link.label}
    </a>
  )
}

interface IubendaPrivacyCookieLinksProps {
  className?: string
  linkClassName?: string
}

/**
 * Coppia di link Privacy Policy + Cookie Policy di iubenda, in riga.
 * Usa uno `span` con `inline-flex` così può stare anche dentro testo/frasi
 * (es. il consenso nel form newsletter) oltre che in blocchi dedicati
 * (es. la pagina Privacy).
 */
export default function IubendaPrivacyCookieLinks({
  className,
  linkClassName,
}: IubendaPrivacyCookieLinksProps) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-4 gap-y-1 ${className ?? ''}`}>
      <IubendaLink link={PRIVACY_POLICY_LINK} className={linkClassName} />
      <IubendaLink link={COOKIE_POLICY_LINK} className={linkClassName} />
    </span>
  )
}