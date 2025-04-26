import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';

const Tooltip = ({ children, message, position = 'top' }) => {
    const [visible, setVisible] = useState(false);

    const handleHoverIn = () => setVisible(true);
    const handleHoverOut = () => setVisible(false);
    const handlePress = () => setVisible(!visible);

    const triggerProps = Platform.OS === 'web'
        ? {
            onMouseEnter: handleHoverIn,
            onMouseLeave: handleHoverOut,
        }
        : {
            onPress: handlePress,
        };

    return (
        <View style={styles.wrapper}>
            <Pressable {...triggerProps} style={styles.content}>
                {children}
            </Pressable>

            {visible && (
                <View style={[styles.tooltipContainer, styles[position]]}>
                    <Text style={styles.tooltipText}>{message}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
    },
    content: {
        // No estilos que cambien el tamaño del hijo
    },
    tooltipContainer: {
        position: 'absolute',
        backgroundColor: '#333',
        padding: 8,
        borderRadius: 6,
        zIndex: 1000,
        maxWidth: 200,
    },
    tooltipText: {
        color: '#fff',
        fontSize: 12,
    },
    top: {
        bottom: '100%',
        left: '50%',
        transform: [{ translateX: -100 }],
        marginBottom: 8,
    },
    bottom: {
        top: '100%',
        left: '50%',
        transform: [{ translateX: -100 }],
        marginTop: 8,
    },
    left: {
        right: '100%',
        top: '50%',
        transform: [{ translateY: -12 }],
        marginRight: 8,
    },
    right: {
        left: '100%',
        top: '50%',
        transform: [{ translateY: -12 }],
        marginLeft: 8,
    },
});

export default Tooltip;
