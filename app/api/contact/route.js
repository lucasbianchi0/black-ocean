import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory rate limit: max 3 submissions per IP per 10 minutes
const rateMap = new Map()
function isRateLimited(ip) {
  const now = Date.now()
  const window = 10 * 60 * 1000
  const hits = (rateMap.get(ip) || []).filter(t => now - t < window)
  if (hits.length >= 3) return true
  rateMap.set(ip, [...hits, now])
  return false
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (isRateLimited(ip)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { empresa, nombre, email, mensaje } = body

  if (
    typeof empresa !== 'string' || !empresa.trim() ||
    typeof nombre  !== 'string' || !nombre.trim()  ||
    typeof email   !== 'string' || !EMAIL_RE.test(email.trim()) ||
    typeof mensaje !== 'string' || !mensaje.trim()
  ) {
    return Response.json({ error: 'Campos inválidos' }, { status: 400 })
  }

  if (empresa.length > 200 || nombre.length > 200 || email.length > 200 || mensaje.length > 3000) {
    return Response.json({ error: 'Campos demasiado largos' }, { status: 400 })
  }

  const e = escapeHtml(empresa.trim())
  const n = escapeHtml(nombre.trim())
  const em = escapeHtml(email.trim())
  const m = escapeHtml(mensaje.trim())

  const date = new Date().toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'lucmbianchi2000@gmail.com',
    subject: `Nueva consulta de ${n} — ${e}`,
    html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:'Georgia',serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:40px 20px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">

        <!-- Header -->
        <tr><td style="background:#0a0a0a;padding:36px 40px;text-align:center;border-radius:4px 4px 0 0">
          <p style="margin:0 0 6px;color:#8a7a6a;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:Arial,sans-serif">Ocean Black &amp; Co.</p>
          <h1 style="margin:0;color:#f0ece6;font-size:22px;font-weight:400;letter-spacing:1px">Nueva Consulta Institucional</h1>
        </td></tr>

        <!-- Divider line -->
        <tr><td style="background:#0a0a0a;padding:0 40px">
          <div style="height:1px;background:linear-gradient(to right,transparent,#8a7a6a,transparent)"></div>
        </td></tr>

        <!-- Source badge -->
        <tr><td style="background:#0a0a0a;padding:16px 40px 28px;text-align:center">
          <span style="display:inline-block;background:#1a1a1a;color:#8a7a6a;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;padding:6px 16px;border:1px solid #2a2a2a;border-radius:2px">
            Recibido desde oceanblack.com.ar — ${date}
          </span>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px 40px">

          <!-- Contact info -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ede8;width:90px;color:#999;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-family:Arial,sans-serif;vertical-align:top">Empresa</td>
              <td style="padding:10px 0 10px 16px;border-bottom:1px solid #f0ede8;color:#1a1a1a;font-size:15px;font-weight:bold">${e}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ede8;color:#999;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-family:Arial,sans-serif;vertical-align:top">Nombre</td>
              <td style="padding:10px 0 10px 16px;border-bottom:1px solid #f0ede8;color:#1a1a1a;font-size:15px">${n}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#999;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-family:Arial,sans-serif;vertical-align:top">Email</td>
              <td style="padding:10px 0 10px 16px;font-size:15px"><a href="mailto:${em}" style="color:#0a0a0a;text-decoration:underline">${em}</a></td>
            </tr>
          </table>

          <!-- Message -->
          <p style="margin:0 0 10px;color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif">Mensaje</p>
          <div style="background:#f8f6f3;border-left:3px solid #0a0a0a;padding:18px 20px;border-radius:0 3px 3px 0">
            <p style="margin:0;color:#333;font-size:15px;line-height:1.7;white-space:pre-wrap">${m}</p>
          </div>

          <!-- Reply CTA -->
          <div style="margin-top:32px;text-align:center">
            <a href="mailto:${em}" style="display:inline-block;background:#0a0a0a;color:#f0ece6;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:14px 32px;border-radius:2px">Responder</a>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#1a1a1a;padding:20px 40px;text-align:center;border-radius:0 0 4px 4px">
          <p style="margin:0;color:#555;font-size:11px;font-family:Arial,sans-serif;letter-spacing:1px">© 2026 Ocean Black &amp; Co. &nbsp;·&nbsp; Buenos Aires, Argentina</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })

  if (error) return Response.json({ error: 'Error al enviar' }, { status: 500 })
  return Response.json({ ok: true })
}
