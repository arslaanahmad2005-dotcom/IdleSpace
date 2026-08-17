export function renderErrorPage(correlationId?: string): string {
  const cid = correlationId ?? `err_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>500 — Server Error | IdleSpace</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2.5rem 2rem; background: #1e293b; border-radius: 1.25rem; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.3); }
      h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem; color: #f8fafc; }
      p { color: #94a3b8; margin: 0 0 1.25rem; font-size: 0.95rem; }
      .cid { font-size: 0.75rem; color: #64748b; font-family: ui-monospace, monospace; margin-bottom: 1.5rem; user-select: all; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.625rem 1.25rem; border-radius: 0.75rem; font: inherit; font-size: 0.875rem; font-weight: 500; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: opacity 0.2s; }
      .primary { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); color: #fff; }
      .secondary { background: #334155; color: #f8fafc; border-color: #475569; }
      a:hover, button:hover { opacity: 0.9; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Something went wrong</h1>
      <p>An unexpected error occurred while processing your request. Please try again later.</p>
      <div class="cid">Reference ID: ${cid}</div>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Return to Home</a>
      </div>
    </div>
  </body>
</html>`;
}
