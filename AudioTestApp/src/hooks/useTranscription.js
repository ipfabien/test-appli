import { useState, useCallback } from 'react';
import TranscriptionService from '../services/TranscriptionService';

/**
 * Hook pour gérer la transcription audio -> texte
 * @returns {Object} { transcribe, isLoading, text, error, reset }
 */
const useTranscription = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState('');
    const [error, setError] = useState(null);

    const transcribe = useCallback(async (audioUri) => {
        setIsLoading(true);
        setError(null);
        setText('');
        try {
            const result = await TranscriptionService.transcribeAudio(audioUri);
            setText(result);
            setIsLoading(false);
            return result;
        } catch (err) {
            setError(err.message || 'Erreur de transcription');
            setIsLoading(false);
            return null;
        }
    }, []);

    const reset = useCallback(() => {
        setText('');
        setError(null);
        setIsLoading(false);
    }, []);

    return { transcribe, isLoading, text, error, reset };
};

export default useTranscription; 