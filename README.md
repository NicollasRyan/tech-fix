# Tech Fix

Sistema para cadastro de servicos tecnicos com notificacao por data no proprio app.

## Execucao

1. Crie `.env` com base em `.env.example`.
2. Instale dependencias e rode:

```bash
npm install
npm start
```

## Deploy Firestore

```bash
npx firebase-tools deploy --only firestore --project tech-fix-aee39
```

## Observacao

Este projeto nao usa mais Cloud Functions para Google Calendar/e-mail automatico.
