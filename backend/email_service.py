"""
Invio email via SMTP standard (pensato per Brevo, ma funziona con
qualunque provider SMTP: nessun SDK proprietario, solo protocollo SMTP).

Se le variabili SMTP_* non sono configurate, le funzioni non falliscono:
loggano un avviso e restituiscono False, per non bloccare lo sviluppo
locale senza un vero account email.
"""
import secrets
from email.message import EmailMessage

import aiosmtplib

from config import settings
from logger import app_logger


async def send_email(to_email: str, subject: str, html_body: str, text_body: str | None = None) -> bool:
    """Invia una singola email. Restituisce True se inviata, False se SMTP
    non è configurato o l'invio fallisce (mai un'eccezione che rompe la
    richiesta chiamante: l'email è un side-effect, non deve bloccare l'azione
    principale, es. la pubblicazione di un piatto)."""
    if not settings.smtp_configured:
        app_logger.warning(f"SMTP non configurato: email a {to_email} NON inviata (subject: {subject})")
        return False

    message = EmailMessage()
    message["From"] = f"{settings.smtp_sender_name} <{settings.smtp_sender_email}>"
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(text_body or "Questa email richiede un client che supporti l'HTML.")
    message.add_alternative(html_body, subtype="html")

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_username,
            password=settings.smtp_password,
            start_tls=True,
        )
        return True
    except Exception as exc:
        app_logger.error(f"Invio email a {to_email} fallito: {exc}")
        return False


def generate_unsubscribe_token() -> str:
    return secrets.token_urlsafe(32)


async def send_password_reset_email(to_email: str, raw_token: str) -> bool:
    reset_link = f"{settings.frontend_base_url}/admin/reset-password?token={raw_token}"
    subject = "Reimposta la tua password — Andrea Moio Chef"
    html_body = f"""
    <p>Hai richiesto di reimpostare la password del tuo account admin.</p>
    <p><a href="{reset_link}">Clicca qui per impostare una nuova password</a></p>
    <p>Il link è valido per {settings.password_reset_token_expiration_minutes} minuti.
    Se non hai richiesto tu questo reset, ignora semplicemente questa email:
    la tua password attuale resta invariata.</p>
    """
    if not settings.smtp_configured:
        # SMTP non configurato (es. dominio ancora segnaposto): logghiamo il
        # link solo qui, per poter testare il flusso in sviluppo senza un
        # vero account email. In produzione, con SMTP configurato, questo
        # ramo non viene mai eseguito e il link resta solo nell'email.
        app_logger.warning(f"[DEV] SMTP non configurato — link di reset per {to_email}: {reset_link}")
        return False
    return await send_email(to_email, subject, html_body)


async def notify_newsletter_subscribers(
    subscribers: list[tuple[str, str]],
    resource_label: str,
    title: str,
    description: str | None,
) -> int:
    """Invia una notifica agli iscritti quando un nuovo contenuto viene
    pubblicato. `subscribers` è una lista di tuple (email, unsubscribe_token).
    Restituisce il numero di email inviate con successo."""
    subject = f"Novità: {title}"
    sent = 0
    for email, unsubscribe_token in subscribers:
        unsubscribe_link = f"{settings.frontend_base_url}/newsletter/unsubscribe?token={unsubscribe_token}"
        html_body = f"""
        <p>C'è una novità su Andrea Moio Chef: <strong>{resource_label}</strong></p>
        <h2>{title}</h2>
        <p>{description or ''}</p>
        <p><a href="{settings.frontend_base_url}">Scopri di più sul sito</a></p>
        <hr>
        <p style="font-size: 12px; color: #888;">
            Ricevi questa email perché ti sei iscritto alla newsletter.
            <a href="{unsubscribe_link}">Annulla iscrizione</a>
        </p>
        """
        if await send_email(email, subject, html_body):
            sent += 1
    return sent
