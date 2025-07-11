import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView
} from 'react-native';
import AudioRecorder from './src/components/AudioRecorder';
import AudioPlayer from './src/components/AudioPlayer';
import useAudioRecorder from './src/hooks/useAudioRecorder';

export default function App() {
  // Utilisation du hook pour respecter l'architecture modulaire
  const audioRecorder = useAudioRecorder();

  const [currentRecordingUri, setCurrentRecordingUri] = useState(null);

  // Force la demande de permission micro au lancement de l'app
  useEffect(() => {
    audioRecorder.requestPermission();
  }, [audioRecorder.requestPermission]);

  // Callbacks pour AudioRecorder
  const handleRecordingStart = () => {
    // rien de spécial
  };

  const handleRecordingStop = (uri) => {
    console.log('App.js: URI de l\'enregistrement reçu :', uri);
    setCurrentRecordingUri(uri);
    Alert.alert(
      'Enregistrement terminé',
      'Votre enregistrement est prêt à être écouté !',
      [{ text: 'OK' }]
    );
  };

  const handleRecordingError = (error) => {
    console.error('Erreur d\'enregistrement:', error);
  };

  // Callbacks pour AudioPlayer
  const handlePlayStart = () => { };
  const handlePlayPause = () => { };
  const handlePlayEnd = () => { };
  const handlePlayError = (error) => {
    console.error('Erreur de lecture:', error);
  };

  // Met à jour l'URI de l'enregistrement dès qu'il y en a un de disponible
  useEffect(() => {
    if (audioRecorder.recordingUri) {
      setCurrentRecordingUri(audioRecorder.recordingUri);
    }
  }, [audioRecorder.recordingUri]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>🎤 Test Audio</Text>
          <Text style={styles.subtitle}>
            Enregistrez et écoutez votre voix
          </Text>
        </View>

        {/* Section d'enregistrement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enregistrement</Text>
          <AudioRecorder
            {...audioRecorder}
            onRecordingStart={handleRecordingStart}
            onRecordingStop={handleRecordingStop}
            onError={handleRecordingError}
            style={styles.component}
          />
        </View>

        {/* Section de lecture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lecture</Text>
          <AudioPlayer
            audioUri={currentRecordingUri}
            onPlay={handlePlayStart}
            onPause={handlePlayPause}
            onEnd={handlePlayEnd}
            onError={handlePlayError}
            style={styles.component}
          />
        </View>

        {/* Affichage debug de l'URI de l'enregistrement */}
        {currentRecordingUri && (
          <Text style={{ fontSize: 12, color: '#888', margin: 16, textAlign: 'center' }}>
            [DEBUG] URI de l'enregistrement : {currentRecordingUri}
          </Text>
        )}

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Comment utiliser :</Text>
          <Text style={styles.instructionText}>
            1. Appuyez sur "Démarrer l'enregistrement" pour commencer
          </Text>
          <Text style={styles.instructionText}>
            2. Parlez dans le microphone de votre appareil
          </Text>
          <Text style={styles.instructionText}>
            3. Appuyez sur "Arrêter l'enregistrement" pour terminer
          </Text>
          <Text style={styles.instructionText}>
            4. Utilisez "Écouter l'enregistrement" pour tester le son
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  component: {
    marginBottom: 8,
  },
  instructions: {
    margin: 16,
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
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#3A3A3C',
    marginBottom: 8,
    lineHeight: 20,
  },
});
