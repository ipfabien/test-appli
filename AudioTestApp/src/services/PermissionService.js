import { Audio } from 'expo-av';

class PermissionService {
    constructor() {
        this.permissions = {
            microphone: 'undetermined'
        };
    }

    /**
     * Demande les permissions microphone (expo-av)
     * @returns {Promise<boolean>} true si les permissions sont accordées
     */
    async requestMicrophonePermission() {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            this.permissions.microphone = status;
            return status === 'granted';
        } catch (error) {
            console.error('Erreur lors de la demande de permission microphone:', error);
            this.permissions.microphone = 'denied';
            return false;
        }
    }

    /**
     * Vérifie le statut des permissions microphone (expo-av)
     * @returns {Promise<string>} Le statut des permissions
     */
    async checkMicrophonePermissionStatus() {
        try {
            const { status } = await Audio.getPermissionsAsync();
            this.permissions.microphone = status;
            return status;
        } catch (error) {
            console.error('Erreur lors de la vérification des permissions microphone:', error);
            this.permissions.microphone = 'undetermined';
            return 'undetermined';
        }
    }

    hasMicrophonePermission() {
        return this.permissions.microphone === 'granted';
    }

    isMicrophonePermissionDenied() {
        return this.permissions.microphone === 'denied';
    }

    isMicrophonePermissionUndetermined() {
        return this.permissions.microphone === 'undetermined';
    }

    getMicrophonePermissionStatus() {
        return this.permissions.microphone;
    }

    async requestAllPermissions() {
        const results = {
            microphone: false
        };
        try {
            results.microphone = await this.requestMicrophonePermission();
        } catch (error) {
            console.error('Erreur lors de la demande des permissions:', error);
        }
        return results;
    }

    async checkAllPermissions() {
        const results = {
            microphone: 'undetermined'
        };
        try {
            results.microphone = await this.checkMicrophonePermissionStatus();
        } catch (error) {
            console.error('Erreur lors de la vérification des permissions:', error);
        }
        return results;
    }

    hasAllPermissions() {
        return this.hasMicrophonePermission();
    }

    getPermissionErrorMessage() {
        if (this.isMicrophonePermissionDenied()) {
            return "L'accès au microphone a été refusé. Veuillez l'activer dans les paramètres de votre appareil.";
        } else if (this.isMicrophonePermissionUndetermined()) {
            return "L'accès au microphone n'a pas encore été demandé.";
        } else {
            return "Erreur inconnue avec les permissions microphone.";
        }
    }
}

export default new PermissionService(); 