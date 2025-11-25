# Gemma Chat Frontend

Interface moderne et professionnelle pour discuter avec le modèle Gemma de Google.

## Fonctionnalités

- **Interface moderne** : Design inspiré de ChatGPT avec des composants shadcn/ui
- **Chat en temps réel** : Communication fluide avec l'API backend
- **Composant PromptBox** : Interface d'input avancée avec outils et pièces jointes
- **Mode sombre/clair** : Support automatique du thème système
- **Responsive** : Fonctionne sur desktop et mobile

## Technologies utilisées

- **Next.js 16** : Framework React moderne
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire
- **shadcn/ui** : Composants UI accessibles
- **Radix UI** : Primitives UI headless

## Démarrage

### Installation des dépendances

```bash
cd frontend
npm install
```

### Configuration

Créer un fichier `.env.local` pour configurer l'URL de l'API backend :

```env
BACKEND_API_URL=http://localhost:8000
```

### Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

### Build pour la production

```bash
npm run build
npm start
```

## Architecture

### Composants

- **`PromptBox`** : Composant principal d'input avec outils et pièces jointes
- **Messages** : Affichage des messages utilisateur et assistant
- **API Proxy** : Route Next.js qui proxy les requêtes vers l'API FastAPI

### API Routes

- **`POST /api/chat`** : Envoie un message à l'API backend et retourne la réponse

## Fonctionnalités du PromptBox

- **Input multi-ligne** : S'adapte automatiquement à la hauteur du contenu
- **Pièces jointes** : Support pour l'upload d'images
- **Outils** : Menu d'outils (recherche web, génération d'images, etc.)
- **Enregistrement vocal** : Bouton pour l'enregistrement audio (UI seulement)
- **Validation** : Désactivation du bouton envoyer si aucun contenu

## Déploiement

L'application peut être déployée sur Vercel, Netlify, ou tout autre service supportant Next.js.

### Variables d'environnement pour la production

```env
BACKEND_API_URL=https://votre-api-render.com
```

## API Backend

L'application frontend communique avec une API FastAPI qui doit fournir :

```typescript
POST /chat
{
  "message": string,
  "max_tokens": number,
  "temperature": number
}

Response:
{
  "response": string,
  "status": string
}
```

## Personnalisation

### Thème

L'application supporte automatiquement le mode sombre/clair selon les préférences système.

### Styles

Les styles sont basés sur Tailwind CSS avec des variables CSS personnalisées pour une cohérence parfaite.