import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// SUPPRIMER : import useAudioRecorder from '../../hooks/useAudioRecorder';
import Button from '../Button';

/**
 * Composant AudioRecorder pour l'enregistrement audio
 * @param {Object} props - Propriétés du composant
 * @param {Function} props.onRecordingStart - Callback appelé au début de l'enregistrement
 * @param {Function} props.onRecordingStop - Callback appelé à la fin de l'enregistrement
 * @param {Function} props.onError - Callback appelé en cas d'erreur
 */
const AudioRecorder = ({
    isRecording,
    recordingTime,
    error,
    recordingUri,
    hasPermission,
    permissionStatus,
    startRecording,
    stopRecording,
    formatRecordingTime,
    hasRecording,
    checkPermissions,
    onRecordingStart,
    onRecordingStop,
    onError,
    style
}) => {
    // SUPPRIMER : const { ... } = useAudioRecorder();

    // Demande la permission micro au montage du composant
    React.useEffect(() => {
        console.log('AudioRecorder: Montage du composant, vérification des permissions...');
        checkPermissions();
    }, [checkPermissions]);

    // Gérer les erreurs
    React.useEffect(() => {
        if (error && onError) {
            onError(error);
            Alert.alert('Erreur', error);
        }
    }, [error, onError]);

    // Callbacks
    const handleStartRecording = async () => {
        console.log('AudioRecorder: Démarrage de l\'enregistrement...');
        try {
            await startRecording();
            if (onRecordingStart) {
                onRecordingStart();
            }
        } catch (error) {
            console.error('Erreur lors du démarrage de l\'enregistrement:', error);
        }
    };

    const handleStopRecording = async () => {
        console.log('AudioRecorder: Arrêt de l\'enregistrement...');
        try {
            await stopRecording();
            if (onRecordingStop) {
                onRecordingStop(recordingUri);
            }
        } catch (error) {
            console.error('Erreur lors de l\'arrêt de l\'enregistrement:', error);
        }
    };

    // Affichage d'un message d'erreur plus visible si la permission est refusée
    const handleRequestPermission = async () => {
        console.log('AudioRecorder: Demande de permission micro...');
        try {
            const status = await checkPermissions();
            console.log('AudioRecorder: Statut de la permission après demande:', status);
        } catch (error) {
            console.error('AudioRecorder: Erreur lors de la demande de permission:', error);
        }
    };

    return (
        <View style={[styles.container, style]}>
            {/* Indicateur d'enregistrement */}
            {isRecording && (
                <View style={styles.recordingIndicator}>
                    <Ionicons name="radio-button-on" size={16} color="#FF3B30" />
                    <Text style={styles.recordingText}>
                        Enregistrement en cours... {formatRecordingTime(recordingTime)}
                    </Text>
                </View>
            )}

            {/* Message d'erreur */}
            {error && !isRecording && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            {/* Boutons d'enregistrement */}
            <View style={styles.buttonContainer}>
                {!isRecording ? (
                    <Button
                        title="🎤 Démarrer l'enregistrement"
                        onPress={handleStartRecording}
                        disabled={!hasPermission}
                        variant="primary"
                        style={styles.recordButton}
                    />
                ) : (
                    <Button
                        title="⏹️ Arrêter l'enregistrement"
                        onPress={handleStopRecording}
                        variant="danger"
                        style={styles.stopButton}
                    />
                )}
            </View>

            {/* Indicateur de permission */}
            {!hasPermission && !isRecording && (
                <TouchableOpacity
                    onPress={handleRequestPermission}
                    style={styles.permissionBox}
                    activeOpacity={0.7}
                >
                    <Ionicons name="alert-circle" size={18} color="#FF3B30" />
                    <Text style={styles.permissionText}>
                        Permission microphone requise pour enregistrer. Appuyez ici pour réessayer.
                    </Text>
                </TouchableOpacity>
            )}

            {/* Affichage du statut de la permission pour debug */}
            <Text style={styles.debugText}>[DEBUG] Statut permission micro : {permissionStatus}</Text>

            {/* Indicateur d'enregistrement disponible */}
            {hasRecording() && !isRecording && (
                <View style={styles.recordingAvailable}>
                    <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                    <Text style={styles.recordingAvailableText}>
                        Enregistrement disponible
                    </Text>
                </View>
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
    recordingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#FFE5E5',
        borderRadius: 8,
    },
    recordingText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    buttonContainer: {
        alignItems: 'center',
    },
    recordButton: {
        minWidth: 200,
    },
    stopButton: {
        minWidth: 200,
    },
    permissionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFE5E5',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    permissionText: {
        color: '#FF3B30',
        fontSize: 13,
        marginLeft: 8,
        textAlign: 'center',
        fontWeight: '600',
    },
    debugText: {
        color: '#888',
        fontSize: 12,
        marginTop: 8,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    recordingAvailable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        padding: 8,
        backgroundColor: '#E8F5E8',
        borderRadius: 6,
    },
    recordingAvailableText: {
        marginLeft: 6,
        fontSize: 12,
        color: '#34C759',
        fontWeight: '500',
    },
});

export default AudioRecorder; 