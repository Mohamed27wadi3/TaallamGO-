# TaallamGO

## Déploiement Vercel

L'inscription et la connexion utilisent NextAuth + Prisma. Elles nécessitent une vraie base PostgreSQL.

Dans Vercel, ajoute ces variables d'environnement :

- `DATABASE_URL` : URL PostgreSQL publique, par exemple Neon, Supabase ou Vercel Postgres. Ne pas utiliser `localhost`.
- `AUTH_SECRET` : secret aléatoire de 32 caractères minimum.
- `AUTH_TRUST_HOST` : `true`.
- `NEXT_PUBLIC_APP_URL` : URL du site Vercel.

Après configuration de la base :

```bash
npx prisma migrate deploy
npx prisma db seed
```

Pour le développement local, démarre PostgreSQL localement ou remplace `DATABASE_URL` par une URL PostgreSQL distante.
