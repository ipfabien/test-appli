## Objectif

Le but de ce projet est de pouvoir tester le micro et la réception du son dans une application mobile et de la tester dans le téléphone.

## Front et fonctionnalités

Version 1.0.0

- Un bouton pour lancer l'enregsitrement audio de l'utilisateur
- Un un bouton d'arrêt pour stopper l'enregistrement
- un bouton pour écouter l'enregistrement qui diffuserait le son enregistré

Version 1.1.0

- avoir un encart texte sous bouton d'écoute de l'enregistrement. Et quand on écoute l'audio ça retranscris l'audio en texte dans cet encart.

## Impératif

- l'application doit être en react natif

### Structure des dossiers

```
src/
├── components/          # Composants réutilisables
│   ├── AudioRecorder/   # Composant d'enregistrement audio
│   ├── AudioPlayer/     # Composant de lecture audio
│   └── Button/          # Composant bouton personnalisé
├── services/            # Services métier
│   ├── AudioService.js  # Service de gestion audio
│   └── PermissionService.js # Service de gestion des permissions
├── hooks/               # Hooks personnalisés
│   ├── useAudioRecorder.js # Hook pour l'enregistrement
│   └── useAudioPlayer.js   # Hook pour la lecture
├── utils/               # Utilitaires et helpers
│   ├── audioUtils.js    # Fonctions utilitaires audio
│   └── constants.js     # Constantes de l'application
├── styles/              # Styles et thèmes
│   ├── theme.js         # Thème de l'application
│   └── components.js    # Styles des composants
└── tests/               # Tests unitaires et fonctionnels
    ├── components/      # Tests des composants
    ├── services/        # Tests des services
    └── hooks/           # Tests des hooks
```

### Approche POO et modulaire

#### 1. **Services (Couche métier)**

- **AudioService** : Classe responsable de la gestion audio
  - Méthodes : `startRecording()`, `stopRecording()`, `playAudio()`, `pauseAudio()`
  - Gestion des erreurs et des états
  - Interface claire pour les composants

- **PermissionService** : Classe pour la gestion des permissions
  - Méthodes : `requestMicrophonePermission()`, `checkPermissionStatus()`
  - Centralisation de la logique des permissions

#### 2. **Hooks personnalisés (Couche logique)**

- **useAudioRecorder** : Hook pour l'enregistrement
  - État : `isRecording`, `recordingTime`, `error`
  - Actions : `startRecording`, `stopRecording`
  - Réutilisable dans d'autres composants

- **useAudioPlayer** : Hook pour la lecture
  - État : `isPlaying`, `currentTime`, `duration`
  - Actions : `play`, `pause`, `stop`
  - Gestion automatique du cycle de vie

#### 3. **Composants réutilisables (Couche présentation)**

- **AudioRecorder** : Composant d'enregistrement
  - Props : `onRecordingStart`, `onRecordingStop`, `onError`
  - État interne géré par le hook `useAudioRecorder`
  - Interface utilisateur personnalisable

- **AudioPlayer** : Composant de lecture
  - Props : `audioUri`, `onPlay`, `onPause`, `onEnd`
  - Contrôles de lecture intégrés
  - Visualisation de la progression

- **Button** : Composant bouton générique
  - Props : `title`, `onPress`, `disabled`, `variant`
  - Styles personnalisables
  - Accessibilité intégrée

#### 4. **Avantages de cette architecture**

**Réutilisabilité** :

- Les services peuvent être utilisés dans différents composants
- Les hooks encapsulent la logique métier réutilisable
- Les composants sont modulaires et interchangeables

**Testabilité** :

- Services isolés facilement testables
- Hooks testables indépendamment
- Composants testables avec des props mockées

**Extensibilité** :

- Ajout facile de nouvelles fonctionnalités audio
- Intégration simple de nouveaux types de médias
- Architecture prête pour les tests unitaires et fonctionnels

**Maintenabilité** :

- Séparation claire des responsabilités
- Code modulaire et lisible
- Documentation intégrée dans la structure

### Développement

1. ✅ **Initialisation du projet**
   - Créer un nouveau projet Expo React Native
   - Installer les dépendances : `expo-av`, `expo-permissions`
   - Configurer le fichier `app.json` avec les permissions microphone

2. ✅ **Structure de l'interface utilisateur**
   - Créer le composant principal App.js
   - Implémenter les 3 boutons avec leurs états
   - Ajouter un indicateur visuel pendant l'enregistrement
   - Styliser l'interface avec des couleurs et icônes

3. ✅ **Logique d'enregistrement audio**
   - Implémenter la fonction `startRecording()`
   - Gérer les permissions microphone avec `expo-permissions`
   - Sauvegarder l'enregistrement dans le stockage temporaire
   - Gérer les erreurs et les cas d'échec

4. ✅ **Logique de lecture audio**
   - Implémenter la fonction `playRecording()`
   - Charger et lire le fichier audio enregistré
   - Ajouter des contrôles de volume et de pause
   - Gérer la fin de lecture automatique

5. ✅ **Gestion des états et interactions**
   - Gérer l'état des boutons (actif/inactif selon le contexte)
   - Implémenter la fonction `stopRecording()`
   - Synchroniser l'interface avec l'état de l'enregistrement
   - Ajouter des messages d'information pour l'utilisateur

6. **Tests et débogage**
   - Tester sur émulateur Android/iOS
   - Tester sur appareil physique avec Expo Go
   - Corriger les bugs et optimiser les performances
   - Vérifier la gestion des permissions

7. **Préparation au déploiement**
   - Configurer le fichier `app.json` pour la production
   - Optimiser les métadonnées de l'application
   - Vérifier que toutes les permissions sont correctement déclarées

8. **Build de l'application**
   - Utiliser `expo build:android` pour créer un APK
   - Utiliser `expo build:ios` pour créer un IPA (si nécessaire)
   - Ou utiliser EAS Build pour un build cloud

9. **Test sur appareil réel**
   - Installer l'APK sur un téléphone Android
   - Tester toutes les fonctionnalités sur l'appareil réel
   - Vérifier la compatibilité avec différents appareils

10. **Distribution**
    - Option 1 : Partage direct de l'APK
    - Option 2 : Publication sur Google Play Store
    - Option 3 : Distribution via Expo Application Services (EAS)
