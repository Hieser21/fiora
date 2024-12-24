import { View, Icon } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Dialog from 'react-native-dialog';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { createGroup } from '../../service';
import action from '../../state/action';

const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    text: '#FFFFFF'
};

function ChatListRightButton() {
    const [showDialog, toggleDialog] = useState(false);
    const [groupName, updateGroupName] = useState('');
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    function handleCloseDialog() {
        updateGroupName('');
        toggleDialog(false);
    }

    async function handleCreateGroup() {
        const group = await createGroup(groupName);
        if (group) {
            action.addLinkman({
                ...group,
                type: 'group',
                unread: 1,
                messages: [],
            });
            action.setFocus(group._id);
            handleCloseDialog();
            Actions.push('chat', { title: group.name });
        }
    }

    return (
        <>
            <TouchableOpacity 
                onPress={() => toggleDialog(true)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                    <LinearGradient
                        colors={[PERSONA_COLORS.secondary, PERSONA_COLORS.primary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    >
                        <Animated.View style={[
                            styles.container,
                            { transform: [{ scale: scaleAnim }] }
                        ]}>
                            <Icon name="add-outline" style={styles.icon} />
                        </Animated.View>
                    </LinearGradient>
                </BlurView>
            </TouchableOpacity>
            <Dialog.Container 
                visible={showDialog}
                contentStyle={styles.dialogContent}
                buttonSeparatorStyle={styles.dialogSeparator}
            >
                <Dialog.Title style={styles.dialogTitle}>Create Group</Dialog.Title>
                <Dialog.Description style={styles.dialogDesc}>
                    Please enter group name
                </Dialog.Description>
                <Dialog.Input
                    value={groupName}
                    onChangeText={updateGroupName}
                    autoCapitalize="none"
                    autoFocus
                    autoCorrect={false}
                    style={styles.dialogInput}
                />
                <Dialog.Button 
                    label="Cancel" 
                    onPress={handleCloseDialog}
                    color={PERSONA_COLORS.accent} 
                />
                <Dialog.Button 
                    label="Create" 
                    onPress={handleCreateGroup}
                    color={PERSONA_COLORS.primary}
                    bold 
                />
            </Dialog.Container>
        </>
    );
}

const styles = StyleSheet.create({
    blurContainer: {
        borderRadius: 22,
        overflow: 'hidden',
        margin: 8
    },
    gradient: {
        padding: 2,
        borderRadius: 22
    },
    container: {
        width: 44,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 22
    },
    icon: {
        color: PERSONA_COLORS.accent,
        fontSize: 32,
        textShadowColor: PERSONA_COLORS.primary,
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4
    },
    dialogContent: {
        backgroundColor: PERSONA_COLORS.secondary,
        borderRadius: 12,
        padding: 16
    },
    dialogTitle: {
        color: PERSONA_COLORS.accent,
        fontSize: 18,
        fontWeight: 'bold'
    },
    dialogDesc: {
        color: PERSONA_COLORS.text,
        opacity: 0.8
    },
    dialogInput: {
        color: PERSONA_COLORS.text,
        borderBottomColor: PERSONA_COLORS.primary
    },
    dialogSeparator: {
        backgroundColor: PERSONA_COLORS.primary,
        opacity: 0.3
    }
});

export default ChatListRightButton;
