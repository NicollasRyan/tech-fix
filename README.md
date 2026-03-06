# Tech Fix

Sistema para cadastro de servicos tecnicos com notificacao por data no proprio app.

## Execucao

1. Crie `.env` com base em `.env.example`.
2. Crie `functions/.env` com base em `functions/.env.example`.
3. Instale dependencias e rode:

```bash
npm install
npm start
```

## Deploy Firestore

```bash
npx firebase-tools deploy --only firestore --project tech-fix-aee39
```

## Observacao

Google Calendar agora roda via Cloud Functions (backend serverless).

Variaveis obrigatorias:

- Frontend (`.env`): `REACT_APP_GOOGLE_OAUTH_CLIENT_ID`
- Functions (`functions/.env`): `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`
