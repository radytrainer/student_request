# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Firebase setup

Requests are stored in Cloud Firestore.

1. In the [Firebase console](https://console.firebase.google.com), create a project, then:
   - **Build → Firestore Database → Create database**
   - **Build → Authentication → Sign-in method → Email/Password → Enable**
   - **Project settings → General → Add app → Web** and copy the config values.
2. Copy `.env.example` to `.env.local` and fill in the values. On Vercel, add the same
   `VITE_FIREBASE_*` variables under **Settings → Environment Variables**.
3. Publish the security rules: paste `firestore.rules` into **Firestore → Rules** and click
   **Publish** (or run `npx firebase-tools deploy --only firestore:rules`).
4. Add staff:
   - **Authentication → Users → Add user** (email + password).
   - Copy the user's **UID**, then in **Firestore → Data** create a document in the `staff`
     collection with that UID as the document ID (any field, e.g. `name: "..."`).
5. Staff sign in at `/admin` to see full requests, contacts and totals, move requests through
   the steps, and mark them **Collected** (each step's date and time is recorded).

### How it works

- **Students (no login):** submit at `/form` and get a 6-character tracking code. They follow
  progress at `/track/<code>`. They can only open a request by its exact code.
- **Steps:** Requested → Waiting → In progress → Completed (ready to collect) → Collected.

### Collections

| Collection | Who can read | Contents |
|---|---|---|
| `requests/{code}` | staff only | full request: name, batch, contact, copy/new, documents, total, status, timeline |
| `tracking/{code}` | anyone with the exact code (staff can list all) | public copy: shortened name (e.g. "Sok D."), batch, documents, status, timeline |
| `staff/{uid}` | the staff member themself | marks a user as staff |

## Deploy to Vercel

1. Import the GitHub repo in Vercel. Framework, build command and output folder are set in
   `vercel.json`, so the defaults are correct.
2. **Settings → Environment Variables** (Production and Preview):

   | Name | Where to get it |
   |---|---|
   | `VITE_FIREBASE_API_KEY` … `VITE_FIREBASE_APP_ID` (6 vars) | same values as your `.env.local` |
   | `TELEGRAM_BOT_TOKEN` | @BotFather in Telegram — server-only, never exposed to the browser |
   | `TELEGRAM_CHAT_ID` | the group chat ID payment screenshots go to |

   Redeploy after changing variables (`VITE_*` values are built into the site).
3. **Firebase console → Authentication → Settings → Authorized domains**: add your Vercel
   domain (e.g. `your-app.vercel.app`) and any custom domain, or staff sign-in will fail.
4. Make sure the latest `firestore.rules` is published.

Payment screenshots go through `api/send-payment.js` (a Vercel function), which also runs
locally under `npm run dev` when `TELEGRAM_*` is set in `.env.local`.
