# i18n testing guide (Crowdin + Paraglide)

This project uses **Crowdin** for translations and **Paraglide** for type-safe messages in the app.

| Layer | Path / tool |
| --- | --- |
| Source (English) | `web/messages/en.json` |
| Translations | `web/messages/de.json`, `web/messages/fr.json` |
| Crowdin config | `crowdin.yml` (repo root) |
| inlang / Paraglide | `web/project.inlang/`, compiled to `web/src/paraglide/` |
| Demo UI | http://localhost:3000/demo/i18n |

---

## 1. Local smoke test (no Crowdin)

### Prerequisites

- Node.js 22+
- Dependencies installed in `web/`

```bash
cd web
npm ci
```

### Compile messages

After any edit to `web/messages/*.json` or `web/project.inlang/settings.json`:

```bash
npm run i18n:compile
```

CI runs the same command on PRs that touch message files.

### Run the app

```bash
npm run dev
```

Open **http://localhost:3000/demo/i18n**.

### What to verify

| Step | Expected |
| --- | --- |
| Page loads | No console errors about missing `m.*` keys |
| Locale **EN** | Ticket line shows `No tickets` at 0, `1 ticket` at 1, `5 tickets` at 5 |
| Switch to **FR** | `Aucun billet` / `1 billet` / `5 billets` |
| Switch to **DE** | `Keine Tickets` / `1 Ticket` / `5 Tickets` |
| **+** / **−** buttons | Count updates and copy follows plural rules |

The `name` key uses **ICU MessageFormat** (Crowdin-friendly):

```json
"name": "{total, plural, =0 {No tickets} one {1 ticket} other {# tickets}}"
```

French and German variants live in `web/messages/fr.json` and `web/messages/de.json`.

---

## 2. Crowdin CLI test (optional)

Use this when you have a Crowdin project and API token.

### Install CLI

```bash
npm install -g @crowdin/cli
```

### Configure credentials

```bash
export CROWDIN_PROJECT_ID="<your-project-id>"
export CROWDIN_PERSONAL_TOKEN="<your-personal-access-token>"
```

`crowdin.yml` at the repo root already points to:

- **Source:** `web/messages/en.json`
- **Translations:** `web/messages/%two_letters_code%.json` (`de`, `fr`, …)

### Upload source strings

From the **repository root**:

```bash
crowdin upload sources
```

### Download translations

```bash
crowdin download
```

### Recompile and re-test

```bash
cd web
npm run i18n:compile
npm run dev
```

Re-check `/demo/i18n` in the locales you downloaded.

### Edit plurals in Crowdin

1. Open the `name` key in Crowdin.
2. Use the **ICU** plural editor (not raw JSON).
3. Keep the variable name `total` so it matches `m.name({ total })` in code.
4. After download, run `npm run i18n:compile` before committing.

---

## 3. Crowdin GitHub integration (recommended)

Instead of the CLI, connect the repo in Crowdin:

1. **Integrations → GitHub** → select this repository.
2. Set **Source files** to `web/messages/en.json`.
3. Set **Translation files** to `web/messages/%two_letters_code%.json`.
4. Enable PRs to a branch such as `l10n/crowdin` (or merge via Crowdin’s PR workflow).

When a Crowdin PR changes `web/messages/**`, GitHub Actions runs **i18n** workflow (`.github/workflows/i18n.yaml`) and fails if Paraglide cannot compile.

---

## 4. CI check (same as GitHub Actions)

From repo root:

```bash
cd web
npm ci
npm run i18n:compile
```

Exit code `0` means messages are valid for the ICU inlang plugin.

---

## 5. Adding a new language

1. Add the locale to `web/project.inlang/settings.json` → `"locales"`.
2. Add `web/messages/<locale>.json` (copy `en.json` and translate).
3. Add the language in Crowdin (code must match filename, e.g. `es` → `web/messages/es.json`).
4. Run `npm run i18n:compile` and commit generated `web/src/paraglide/` if you vendor it, or rely on build-time compile (this project compiles on `vite` dev/build via the Paraglide plugin).

---

## 6. Troubleshooting

| Problem | Fix |
| --- | --- |
| `PluginImportError` for ICU plugin on compile | Network access required once to load `@inlang/plugin-icu1` from CDN; CI has network. |
| Crowdin updated JSON but app unchanged | Run `npm run i18n:compile` (or restart `npm run dev`). |
| Plural shows `0 tickets` instead of `No tickets` at zero | ICU `=0` is compiled as string `"0"`; demo passes `'0'` when count is 0. Use the same in app code if needed. |
| Keys missing at runtime | Every locale file must contain the same keys as `en.json`. |
| Old `translations/` folder | Removed; use `web/messages/` only. |

---

## 7. What we removed

- **`translations/fr.json`** – Crowdin now writes directly to `web/messages/`.
- **Tolgee GitHub workflow** – replaced by Crowdin + Paraglide compile CI.
- **`npm run i18n:sync` (Tolgee)** – use Crowdin upload/download instead.

Tolgee in `docker-compose.yaml` is optional for local experiments only; it is not part of the Crowdin → Paraglide path.
