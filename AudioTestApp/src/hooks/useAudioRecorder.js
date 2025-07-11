import { useState, useEffect, useCallback } from 'react';
import AudioService from '../services/AudioService';
import PermissionService from '../services/PermissionService';

/**
 * Hook personnalisé pour gérer l'enregistrement audio
 * Respecte l'architecture modulaire et réutilisable décrite dans PROJET.md
 * @returns {Object} État et fonctions pour l'enregistrement
 */
const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [error, setError] = useState(null);
    const [recordingUri, setRecordingUri] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState('undetermined');

    // Timer pour le temps d'enregistrement
    useEffect(() => {
        let interval = null;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            setRecordingTime(0);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRecording]);

    // Demande la permission micro au montage du hook
    useEffect(() => {
        requestPermission();
    }, []);

    /**
     * Demande la permission micro et met à jour l'état
     * @returns {Promise<string>} Le statut de la permission
     */
    const requestPermission = useCallback(async () => {
        try {
            const granted = await PermissionService.requestMicrophonePermission();
            const status = granted ? 'granted' : 'denied';
            setHasPermission(granted);
            setPermissionStatus(status);
            return status;
        } catch (error) {
            setHasPermission(false);
            setPermissionStatus('undetermined');
            return 'undetermined';
        }
    }, []);

    /**
     * Vérifie les permissions micro et met à jour l'état
     * @returns {Promise<string>} Le statut de la permission
     */
    const checkPermissions = useCallback(async () => {
        try {
            const status = await PermissionService.checkMicrophonePermissionStatus();
            setHasPermission(status === 'granted');
            setPermissionStatus(status);
            return status;
        } catch (error) {
            setHasPermission(false);
            setPermissionStatus('undetermined');
            return 'undetermined';
        }
    }, []);

    /**
     * Démarre l'enregistrement audio
     */
    const startRecording = useCallback(async () => {
        try {
            setError(null);
            // Vérifier les permissions
            if (!hasPermission) {
                const status = await requestPermission();
                if (status !== 'granted') {
                    setError('Permission microphone refusée. Veuillez l\'autoriser dans les paramètres de votre appareil.');
                    setHasPermission(false);
                    setPermissionStatus('denied');
                    return;
                }
                setHasPermission(true);
                setPermissionStatus('granted');
            }
            // Démarrer l'enregistrement
            await AudioService.startRecording();
            setIsRecording(true);
            setRecordingUri(null);
        } catch (error) {
            setError(error.message || 'Erreur lors du démarrage de l\'enregistrement');
        }
    }, [hasPermission, requestPermission]);

    /**
     * Arrête l'enregistrement audio
     */
    const stopRecording = useCallback(async () => {
        try {
            setError(null);
            if (!isRecording) {
                setError('Aucun enregistrement en cours');
                return;
            }
            const uri = await AudioService.stopRecording();
            setIsRecording(false);
            setRecordingUri(uri);
        } catch (error) {
            setError(error.message || 'Erreur lors de l\'arrêt de l\'enregistrement');
            setIsRecording(false);
        }
    }, [isRecording]);

    /**
     * Nettoie les ressources audio
     */
    const cleanup = useCallback(async () => {
        try {
            await AudioService.cleanup();
            setIsRecording(false);
            setRecordingTime(0);
            setError(null);
        } catch (error) {
            // rien
        }
    }, []);

    /**
     * Formate le temps d'enregistrement en MM:SS
     */
    const formatRecordingTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    /**
     * Vérifie si un enregistrement est disponible
     */
    const hasRecording = useCallback(() => {
        return recordingUri !== null;
    }, [recordingUri]);

    return {
        // État
        isRecording,
        recordingTime,
        error,
        recordingUri,
        hasPermission,
        permissionStatus,
        // Actions
        startRecording,
        stopRecording,
        cleanup,
        requestPermission,
        // Utilitaires
        formatRecordingTime,
        hasRecording,
        checkPermissions
    };
};

export default useAudioRecorder; 