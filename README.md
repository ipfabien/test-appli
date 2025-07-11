# Test Audio Mobile (React Native / Expo)

Ce projet permet de tester le micro et la réception du son dans une application mobile, en enregistrant et en réécoutant sa voix.

## Prérequis

- **Node.js** (version recommandée : >= 16)
- **npm** (installé avec Node.js)
- **Expo CLI** (installé globalement)
- **Un smartphone** (Android ou iOS) avec l'application **Expo Go** installée

### Installer Expo CLI (si besoin)

```bash
npm install -g expo-cli
```

### Installer Expo Go sur votre téléphone

- **Android** : [Expo Go sur Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS** : [Expo Go sur l'App Store](https://apps.apple.com/app/expo-go/id982107779)

## Installation du projet

1. Clonez ce dépôt ou copiez les fichiers sur votre machine.
2. Ouvrez un terminal dans le dossier du projet.
3. Installez les dépendances :

   ```bash
   cd AudioTestApp
   npm install
   ```

## Lancement de l'application

Dans le dossier `AudioTestApp`, lancez :

```bash
npx expo start
```

- Un QR code s'affiche dans le terminal.
- Scannez ce QR code avec l'application **Expo Go** sur votre téléphone.
- L'application se lance automatiquement sur votre appareil.

## Utilisation

1. Appuyez sur "Démarrer l'enregistrement" pour commencer à enregistrer votre voix.
2. Parlez dans le micro de votre téléphone.
3. Appuyez sur "Arrêter l'enregistrement" pour terminer.
4. Appuyez sur "Écouter l'enregistrement" pour réécouter ce que vous avez dit.

## Dépannage

- Si l'application ne se lance pas, vérifiez que votre téléphone et votre ordinateur sont sur le **même réseau Wi-Fi**.
- Si le micro ne fonctionne pas, vérifiez que vous avez bien autorisé l'accès au micro dans les paramètres de votre téléphone.
- Si besoin, relancez la commande `npx expo start`.

## ⚠️ Limitation Expo Go : Permission Microphone

> **Important :**
> L'enregistrement audio (microphone) ne fonctionne pas dans Expo Go sur certains appareils Android et sur tous les appareils iOS. Ceci est une limitation d'Expo Go (sandbox), pas un bug du projet.
>
> **Pour tester la permission micro dans des conditions réelles, il faut générer un APK (Android) ou un build iOS avec EAS Build.**

## Tester l'application en mode natif développement (Dev Client)

Pour un cycle de développement rapide avec toutes les fonctionnalités natives (micro, etc.), il est recommandé d'utiliser le **Dev Client Expo**.

### Pourquoi utiliser le Dev Client ?

- Permet de tester toutes les fonctionnalités natives (micro, caméra, etc.)
- Profite du hot reload : chaque modification JS est visible instantanément sur l'appareil
- Pas besoin de recompiler l'APK à chaque changement JS

### Étapes pour utiliser le Dev Client

1. **Installer EAS CLI**

   ```bash
   npm install -g eas-cli
   ```

2. **Se connecter à Expo**

   ```bash
   eas login
   ```

3. **Initialiser EAS dans le projet**

   ```bash
   eas build:configure
   ```

4. **Générer et installer le Dev Client (APK)**

   ```bash
   eas build -p android --profile development
   ```

   - Télécharge l'APK généré et installe-le sur ta tablette/téléphone Android.
5. **Lancer le serveur JS en mode Dev Client**

   ```bash
   npx expo start --dev-client
   ```

6. **Scanner le QR code avec l'app Dev Client**
   - Ouvre l'application Dev Client (APK installé) sur la tablette.
   - Scanne le QR code affiché dans le terminal.
   - L'application charge dynamiquement le code JS depuis ton ordinateur (hot reload natif).

**Remarque :**

- Tu n'as besoin de refaire un build Dev Client que si tu ajoutes une nouvelle dépendance native.
- Pour toute modification JS, il suffit de sauvegarder et de recharger l'app sur la tablette.

### Documentation officielle

- [Développement avec Expo Dev Client](https://docs.expo.dev/clients/installation/)
- [EAS Build pour Android](https://docs.expo.dev/build/android/)

## Générer un APK Android avec EAS Build (pour tester le micro)

### Pourquoi utiliser EAS Build ?

- Expo Go ne permet pas de tester la permission micro sur tous les appareils.
- Un APK généré avec EAS Build permet de tester l'application comme une vraie app installée, avec toutes les permissions système.

### Étapes pour générer un APK

1. **Installer EAS CLI**

   ```bash
   npm install -g eas-cli
   ```

2. **Se connecter à Expo**

   ```bash
   eas login
   ```

   (Créez un compte gratuit sur <https://expo.dev> si besoin)
3. **Initialiser EAS dans le projet**

   ```bash
   eas build:configure
   ```

4. **Lancer la génération d'un APK**

   ```bash
   eas build -p android --profile preview
   eas build -p android --profile development
   ```

   (ou `--profile development` pour un build debug)
5. **Télécharger l'APK**
   - Une fois le build terminé, Expo vous donnera un lien pour télécharger l'APK.
6. **Installer l'APK sur votre appareil**
   - Sur tablette/téléphone : transférez le fichier et ouvrez-le pour l'installer.
   - Sur émulateur : faites glisser le fichier APK sur la fenêtre de l'émulateur.

### Documentation officielle

- [EAS Build pour Android](https://docs.expo.dev/build/android/)
- [EAS Build pour iOS](https://docs.expo.dev/build/ios/)

## Structure du projet

Le code source principal se trouve dans le dossier `src/` et suit une architecture modulaire (voir `PROJET.md` pour plus de détails).

## Pour aller plus loin

- Vous pouvez tester sur un émulateur Android/iOS (commande `a` ou `i` dans le terminal Expo).
- Le projet est prêt pour l'ajout de tests unitaires et fonctionnels.

---
