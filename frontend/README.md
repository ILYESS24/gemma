# Gemma Frontend - React/Next.js

Interface moderne React/Next.js avec shadcn/ui pour discuter avec Gemma AI.

## Fonctionnalités

- **Interface React moderne** avec Next.js 16 et TypeScript
- **shadcn/ui components** : PromptBox et ShaderAnimation
- **Animations shader avancées** : gradients, vagues, bruit, effets matrix
- **Design dark mode** avec effets visuels sophistiqués
- **Chat en temps réel** avec l'API backend FastAPI
- **Composants accessibles** avec Radix UI
- **Responsive design** pour tous les appareils

## Technologies utilisées

- **Next.js 16** : Framework React moderne
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire
- **shadcn/ui** : Composants UI accessibles
- **Radix UI** : Primitives UI headless
- **Lucide React** : Icônes modernes

## Installation et démarrage

### 1. Installation des dépendances

```bash
cd frontend
npm install
```

### 2. Configuration de l'environnement

Créer un fichier `.env.local` :

```env
BACKEND_API_URL=http://localhost:8000
```

### 3. Démarrage en développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## Composants

### PromptBox
Composant d'input inspiré de shadcn/ui avec :
- **Textarea adaptative** qui s'ajuste à la hauteur
- **Barre d'outils** : Plus, Tools, Voice, Send
- **Popover animé** pour les outils
- **Outils sélectionnables** : Recherche, Image, Code, Pensée
- **Gestion d'images** avec aperçu et dialogue

### ShaderAnimation
Composant d'animation avec plusieurs variantes :
- **Gradient** : Animation de dégradé fluide
- **Wave** : Effet de vague traversante
- **Noise** : Texture de bruit animée
- **Matrix** : Effet Matrix avec caractères

## API Backend

L'application communique avec une API FastAPI qui doit fournir :

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

## Déploiement

### Sur Render

1. **Créer un nouveau service** sur Render
2. **Sélectionner le repo** GitHub
3. **Racine** : `frontend/`
4. **Build Command** : `npm run build`
5. **Start Command** : `npm start`
6. **Variable d'environnement** :
   ```env
   BACKEND_API_URL=https://votre-api-render.onrender.com
   ```

### Variables d'environnement

```env
# Développement
BACKEND_API_URL=http://localhost:8000

# Production
BACKEND_API_URL=https://votre-api-render.onrender.com
```

## Structure du projet

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts    # Proxy API vers backend
│   │   ├── globals.css          # Styles Tailwind
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Page d'accueil
│   ├── components/ui/
│   │   ├── prompt-box.tsx       # Composant PromptBox
│   │   └── shader-animation.tsx # Composant ShaderAnimation
│   └── lib/
│       └── utils.ts             # Fonctions utilitaires
├── package.json                 # Dépendances
├── tailwind.config.ts           # Config Tailwind
├── tsconfig.json               # Config TypeScript
└── render.yaml                 # Config déploiement Render
```

## Personnalisation

### Thèmes et couleurs

Les couleurs sont définies dans `globals.css` avec des variables CSS personnalisées pour un thème cohérent.

### Animations

Le composant `ShaderAnimation` accepte plusieurs props :
- `variant` : "gradient" | "wave" | "noise" | "matrix"
- `speed` : "slow" | "normal" | "fast"
- `intensity` : "subtle" | "medium" | "strong"

### Outils du PromptBox

Les outils sont configurables dans le tableau `toolsList` du composant PromptBox.

## Développement

### Scripts disponibles

```bash
npm run dev      # Démarrage en développement
npm run build    # Build pour la production
npm run start    # Démarrage en production
npm run lint     # Vérification du code
```

### Architecture

- **Client-side rendering** avec Next.js App Router
- **API Routes** pour le proxy vers le backend FastAPI
- **Composants réutilisables** avec TypeScript
- **Styling cohérent** avec Tailwind CSS

## Compatibilité

- **Navigateurs modernes** (Chrome, Firefox, Safari, Edge)
- **Mobile responsive** avec design adaptatif
- **Accessibilité** avec composants Radix UI
- **Performance optimisée** avec Next.js