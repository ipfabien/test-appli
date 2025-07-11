import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * Composant Button réutilisable
 * @param {Object} props - Propriétés du bouton
 * @param {string} props.title - Texte du bouton
 * @param {Function} props.onPress - Fonction appelée lors du clic
 * @param {boolean} props.disabled - Si le bouton est désactivé
 * @param {string} props.variant - Variante du bouton ('primary', 'secondary', 'danger')
 * @param {Object} props.style - Styles personnalisés
 * @param {Object} props.textStyle - Styles personnalisés pour le texte
 */
const Button = ({
    title,
    onPress,
    disabled = false,
    variant = 'primary',
    style,
    textStyle,
    ...props
}) => {
    const buttonStyle = [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style
    ];

    const textStyleCombined = [
        styles.text,
        styles[`${variant}Text`],
        disabled && styles.disabledText,
        textStyle
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
            {...props}
        >
            <Text style={textStyleCombined}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        minWidth: 120,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },

    // Variante primary
    primary: {
        backgroundColor: '#007AFF',
    },
    primaryText: {
        color: '#FFFFFF',
    },

    // Variante secondary
    secondary: {
        backgroundColor: '#F2F2F7',
        borderWidth: 1,
        borderColor: '#C7C7CC',
    },
    secondaryText: {
        color: '#007AFF',
    },

    // Variante danger
    danger: {
        backgroundColor: '#FF3B30',
    },
    dangerText: {
        color: '#FFFFFF',
    },

    // État désactivé
    disabled: {
        backgroundColor: '#E5E5EA',
        opacity: 0.6,
    },
    disabledText: {
        color: '#8E8E93',
    },
});

export default Button; 