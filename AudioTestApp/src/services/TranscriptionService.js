import { OPENAI_API_KEY } from '@env';

const TranscriptionService = {
    /**
     * Transcrit un fichier audio en texte via l'API OpenAI Whisper
     * @param {string} audioUri - URI locale du fichier audio
     * @returns {Promise<string>} - Texte transcrit
     */
    async transcribeAudio(audioUri) {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: audioUri,
                type: 'audio/m4a',
                name: 'recording.m4a',
            });
            formData.append('model', 'whisper-1');

            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Erreur lors de la transcription');
            }

            const data = await response.json();
            return data.text;
        } catch (error) {
            console.error('Erreur de transcription:', error);
            throw error;
        }
    },
};

export default TranscriptionService; 