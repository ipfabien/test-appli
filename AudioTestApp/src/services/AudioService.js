import { Audio } from 'expo-av';

class AudioService {
    constructor() {
        this.recording = null;
        this.sound = null;
        this.recordingUri = null;
    }

    /**
     * Demande les permissions microphone
     * @returns {Promise<boolean>} true si les permissions sont accordées
     */
    async requestMicrophonePermission() {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Erreur lors de la demande de permission:', error);
            return false;
        }
    }

    /**
     * Vérifie le statut des permissions microphone
     * @returns {Promise<string>} Le statut des permissions
     */
    async checkPermissionStatus() {
        try {
            const { status } = await Audio.getPermissionsAsync();
            return status;
        } catch (error) {
            console.error('Erreur lors de la vérification des permissions:', error);
            return 'undetermined';
        }
    }

    /**
     * Configure l'audio pour l'enregistrement
     */
    async configureAudio() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
        } catch (error) {
            console.error('Erreur lors de la configuration audio:', error);
            throw error;
        }
    }

    /**
     * Démarre l'enregistrement audio
     * @returns {Promise<string>} URI du fichier enregistré
     */
    async startRecording() {
        try {
            // Vérifier les permissions
            const hasPermission = await this.requestMicrophonePermission();
            if (!hasPermission) {
                throw new Error('Permission microphone refusée');
            }

            // Configurer l'audio
            await this.configureAudio();

            // Démarrer l'enregistrement
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            this.recording = recording;
            return 'Enregistrement démarré';
        } catch (error) {
            console.error('Erreur lors du démarrage de l\'enregistrement:', error);
            throw error;
        }
    }

    /**
     * Arrête l'enregistrement audio
     * @returns {Promise<string>} URI du fichier enregistré
     */
    async stopRecording() {
        try {
            if (!this.recording) {
                throw new Error('Aucun enregistrement en cours');
            }

            await this.recording.stopAndUnloadAsync();
            this.recordingUri = this.recording.getURI();
            console.log('AudioService: URI de l\'enregistrement :', this.recordingUri);
            this.recording = null;

            return this.recordingUri;
        } catch (error) {
            console.error('Erreur lors de l\'arrêt de l\'enregistrement:', error);
            throw error;
        }
    }

    /**
     * Joue l'audio enregistré
     * @param {string} audioUri - URI du fichier audio à jouer
     * @param {function} onEnd - Callback appelé à la fin de la lecture
     */
    async playAudio(audioUri = null, onEnd = null) {
        try {
            const uri = audioUri || this.recordingUri;
            if (!uri) {
                throw new Error('Aucun fichier audio disponible');
            }

            // Arrêter la lecture en cours si elle existe
            if (this.sound) {
                await this.sound.unloadAsync();
            }

            // Charger et jouer le son
            const { sound } = await Audio.Sound.createAsync({ uri });
            this.sound = sound;

            await this.sound.setVolumeAsync(1.0); // Forcer le volume à 100%

            // Gérer la fin de lecture
            if (onEnd) {
                this.sound.setOnPlaybackStatusUpdate((status) => {
                    if (status.didJustFinish) {
                        onEnd();
                    }
                });
            }

            await this.sound.playAsync();
            return 'Lecture démarrée';
        } catch (error) {
            console.error('Erreur lors de la lecture audio:', error);
            throw error;
        }
    }

    /**
     * Met en pause la lecture audio
     */
    async pauseAudio() {
        try {
            if (this.sound) {
                await this.sound.pauseAsync();
                return 'Lecture mise en pause';
            }
        } catch (error) {
            console.error('Erreur lors de la pause audio:', error);
            throw error;
        }
    }

    /**
     * Arrête la lecture audio
     */
    async stopAudio() {
        try {
            if (this.sound) {
                await this.sound.stopAsync();
                await this.sound.unloadAsync();
                this.sound = null;
                return 'Lecture arrêtée';
            }
        } catch (error) {
            console.error('Erreur lors de l\'arrêt audio:', error);
            throw error;
        }
    }

    /**
     * Nettoie les ressources audio
     */
    async cleanup() {
        try {
            if (this.recording) {
                await this.recording.stopAndUnloadAsync();
                this.recording = null;
            }
            if (this.sound) {
                await this.sound.unloadAsync();
                this.sound = null;
            }
        } catch (error) {
            console.error('Erreur lors du nettoyage audio:', error);
        }
    }

    /**
     * Vérifie si un enregistrement est en cours
     * @returns {boolean}
     */
    isRecording() {
        return this.recording !== null;
    }

    /**
     * Vérifie si une lecture est en cours
     * @returns {boolean}
     */
    isPlaying() {
        return this.sound !== null;
    }

    /**
     * Retourne l'URI du dernier enregistrement
     * @returns {string|null}
     */
    getRecordingUri() {
        return this.recordingUri;
    }
}

export default new AudioService(); 