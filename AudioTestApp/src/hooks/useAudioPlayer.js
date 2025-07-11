import { useState, useEffect, useCallback } from 'react';
import AudioService from '../services/AudioService';

/**
 * Hook personnalisé pour gérer la lecture audio
 * @param {string} initialAudioUri - URI initiale du fichier audio à jouer
 * @returns {Object} État et fonctions pour la lecture
 */
const useAudioPlayer = (initialAudioUri = null) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState(null);
    const [audioUri, setAudioUri] = useState(initialAudioUri);

    // Met à jour l'URI audio à chaque changement de prop
    useEffect(() => {
        setAudioUri(initialAudioUri);
    }, [initialAudioUri]);

    // Timer pour suivre le temps de lecture
    useEffect(() => {
        let interval = null;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prev => prev + 1);
            }, 1000);
        } else {
            setCurrentTime(0);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying]);

    /**
     * Joue l'audio
     * @param {string} uri - URI du fichier audio à jouer
     * @param {function} onEnd - Callback appelé à la fin de la lecture
     */
    const playAudio = useCallback(async (uri = null, onEnd = null) => {
        try {
            setError(null);
            const audioToPlay = uri || audioUri;
            if (!audioToPlay) {
                setError('Aucun fichier audio disponible');
                return;
            }
            await AudioService.playAudio(audioToPlay, () => {
                setIsPlaying(false);
                if (onEnd) onEnd();
            });
            setIsPlaying(true);
            setAudioUri(audioToPlay);
            setCurrentTime(0);
        } catch (error) {
            setError(error.message || 'Erreur lors de la lecture audio');
            setIsPlaying(false);
        }
    }, [audioUri]);

    /**
     * Met en pause la lecture
     */
    const pauseAudio = useCallback(async () => {
        try {
            setError(null);
            if (!isPlaying) {
                setError('Aucune lecture en cours');
                return;
            }
            await AudioService.pauseAudio();
            setIsPlaying(false);
        } catch (error) {
            setError(error.message || 'Erreur lors de la pause audio');
        }
    }, [isPlaying]);

    /**
     * Arrête la lecture
     */
    const stopAudio = useCallback(async () => {
        try {
            setError(null);
            await AudioService.stopAudio();
            setIsPlaying(false);
            setCurrentTime(0);
        } catch (error) {
            setError(error.message || 'Erreur lors de l\'arrêt audio');
        }
    }, []);

    /**
     * Définit l'URI de l'audio à jouer
     * @param {string} uri - URI du fichier audio
     */
    const setAudio = useCallback((uri) => {
        setAudioUri(uri);
        setCurrentTime(0);
        setError(null);
    }, []);

    /**
     * Vérifie si un fichier audio est disponible
     */
    const hasAudio = useCallback(() => {
        return !!audioUri;
    }, [audioUri]);

    /**
     * Formate le temps en MM:SS
     * @param {number} seconds - Secondes à formater
     */
    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    /**
     * Calcule le pourcentage de progression
     */
    const getProgress = useCallback(() => {
        if (duration === 0) return 0;
        return (currentTime / duration) * 100;
    }, [currentTime, duration]);

    /**
     * Nettoie les ressources audio
     */
    const cleanup = useCallback(async () => {
        try {
            await AudioService.cleanup();
            setIsPlaying(false);
            setCurrentTime(0);
            setError(null);
        } catch (error) {
            // rien
        }
    }, []);

    return {
        // État
        isPlaying,
        currentTime,
        duration,
        error,
        audioUri,
        // Actions
        playAudio,
        pauseAudio,
        stopAudio,
        setAudio,
        cleanup,
        // Utilitaires
        hasAudio,
        formatTime,
        getProgress
    };
};

export default useAudioPlayer; 