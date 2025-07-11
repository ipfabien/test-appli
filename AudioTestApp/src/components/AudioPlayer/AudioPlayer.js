import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAudioPlayer from '../../hooks/useAudioPlayer';
import useTranscription from '../../hooks/useTranscription';
import Button from '../Button';

/**
 * Composant AudioPlayer pour la lecture audio
 * @param {Object} props - Propriétés du composant
 * @param {string} props.audioUri - URI du fichier audio à jouer
 * @param {Function} props.onPlay - Callback appelé au début de la lecture
 * @param {Function} props.onPause - Callback appelé lors de la pause
 * @param {Function} props.onEnd - Callback appelé à la fin de la lecture
 * @param {Function} props.onError - Callback appelé en cas d'erreur
 */
const AudioPlayer = ({
    audioUri,
    onPlay,
    onPause,
    onEnd,
    onError,
    style
}) => {
    // On passe audioUri au hook pour garantir la réactivité
    const {
        isPlaying,
        currentTime,
        duration,
        error,
        playAudio,
        pauseAudio,
        stopAudio,
        hasAudio,
        formatTime,
        getProgress
    } = useAudioPlayer(audioUri);

    // Hook transcription
    const {
        transcribe,
        isLoading: isTranscribing,
        text: transcriptionText,
        error: transcriptionError,
        reset: resetTranscription
    } = useTranscription();

    // Gérer les erreurs
    React.useEffect(() => {
        if (error && onError) {
            onError(error);
            Alert.alert('Erreur de lecture', error);
        }
    }, [error, onError]);

    // Déclencher la transcription à chaque lecture
    const handlePlay = async () => {
        try {
            resetTranscription();
            await playAudio(undefined, () => {
                if (onEnd) onEnd();
            });
            if (onPlay) {
                onPlay();
            }
            if (audioUri) {
                transcribe(audioUri);
            }
        } catch (error) {
            // déjà géré
        }
    };

    const handlePause = async () => {
        try {
            await pauseAudio();
            if (onPause) {
                onPause();
            }
        } catch (error) {
            // déjà géré
        }
    };

    const handleStop = async () => {
        try {
            await stopAudio();
        } catch (error) {
            // déjà géré
        }
    };

    return (
        <View style={[styles.container, style]}>
            {/* Indicateur de lecture */}
            {isPlaying && (
                <View style={styles.playingIndicator}>
                    <Ionicons name="play-circle" size={16} color="#007AFF" />
                    <Text style={styles.playingText}>
                        Lecture en cours... {formatTime(currentTime)}
                    </Text>
                </View>
            )}

            {/* Message d'erreur */}
            {error && !isPlaying && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            {/* Encart transcription */}
            <View style={styles.transcriptionBox}>
                {isTranscribing && (
                    <Text style={styles.transcriptionLoading}>Transcription en cours...</Text>
                )}
                {transcriptionError && (
                    <Text style={styles.transcriptionError}>Erreur : {transcriptionError}</Text>
                )}
                {transcriptionText && !isTranscribing && !transcriptionError && (
                    <Text style={styles.transcriptionText}>{transcriptionText}</Text>
                )}
            </View>

            {/* Contrôles de lecture */}
            <View style={styles.controlsContainer}>
                {!isPlaying ? (
                    <Button
                        title="🔊 Écouter l'enregistrement"
                        onPress={handlePlay}
                        disabled={!hasAudio()}
                        variant="primary"
                        style={styles.playButton}
                    />
                ) : (
                    <View style={styles.playingControls}>
                        <Button
                            title="⏸️ Pause"
                            onPress={handlePause}
                            variant="secondary"
                            style={styles.controlButton}
                        />
                        <Button
                            title="⏹️ Stop"
                            onPress={handleStop}
                            variant="secondary"
                            style={styles.controlButton}
                        />
                    </View>
                )}
            </View>

            {/* Indicateur d'audio disponible */}
            {hasAudio() && !isPlaying && !error && (
                <View style={styles.audioAvailable}>
                    <Ionicons name="musical-notes" size={20} color="#007AFF" />
                    <Text style={styles.audioAvailableText}>
                        Audio prêt à être écouté
                    </Text>
                </View>
            )}

            {/* Indicateur d'absence d'audio */}
            {!hasAudio() && !error && (
                <Text style={styles.noAudioText}>
                    Aucun enregistrement disponible
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    playingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#E5F2FF',
        borderRadius: 8,
    },
    playingText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    controlsContainer: {
        alignItems: 'center',
    },
    playButton: {
        minWidth: 200,
    },
    playingControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    controlButton: {
        minWidth: 100,
    },
    audioAvailable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        padding: 8,
        backgroundColor: '#E5F2FF',
        borderRadius: 6,
    },
    audioAvailableText: {
        marginLeft: 6,
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
    },
    noAudioText: {
        color: '#8E8E93',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
    transcriptionBox: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#F7F7F7',
        borderRadius: 8,
        minHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transcriptionLoading: {
        color: '#007AFF',
        fontStyle: 'italic',
        fontSize: 13,
    },
    transcriptionError: {
        color: '#FF3B30',
        fontSize: 13,
    },
    transcriptionText: {
        color: '#222',
        fontSize: 15,
        textAlign: 'center',
    },
});

export default AudioPlayer; 