# Gemma API - Déploiement sur Render

Cette API FastAPI permet d'interagir avec le modèle Gemma de Google via des requêtes HTTP.

## Endpoints

### GET /
Informations générales sur l'API.

### GET /health
Vérification de la santé de l'API et du modèle.

### POST /chat
Envoyer un message au modèle Gemma.

**Requête :**
```json
{
  "message": "Bonjour, comment allez-vous ?",
  "max_tokens": 100,
  "temperature": 0.7
}
```

**Réponse :**
```json
{
  "response": "Je vais bien, merci ! Comment puis-je vous aider ?",
  "status": "success"
}
```

## Déploiement sur Render

L'application est configurée pour être déployée sur Render avec le fichier `render.yaml`.

## Utilisation locale

```bash
pip install -r requirements.txt
python app.py
```

L'API sera disponible sur `http://localhost:8000`.

## Test de l'API

```bash
curl -X POST "http://localhost:8000/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "Bonjour Gemma !"}'
```
