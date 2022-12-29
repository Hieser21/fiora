import { Text } from 'native-base';
import React from 'react';
import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import Dialog from 'react-native-dialog';
import { removeStorageValue, setStorageValue } from '../../utils/storage';

export const PrivacyPolicyStorageKey = 'privacy-policy';

type Props = {
    visible: boolean;
    onClose: () => void;
};

function PrivacyPolicy({ visible, onClose }: Props) {
    function handleClickPrivacyPolicy() {
        Linking.openURL('https://fiora.suisuijiang.com/PrivacyPolicy.html');
    }

    async function handleAgree() {
        await setStorageValue(PrivacyPolicyStorageKey, 'true');
        onClose();
    }

    async function handleDisagree() {
        await removeStorageValue(PrivacyPolicyStorageKey);
        onClose();
    }

    return (
        <Dialog.Container visible={visible}>
            <Dialog.Title>Service Agreement and Privacy Policy</Dialog.Title>
            <Dialog.Description style={styles.container}>
            Welcome to Mason app. We attach great importance to your personal information and privacy protection, please read carefully before you use
                <TouchableOpacity onPress={handleClickPrivacyPolicy}>
                    <Text style={styles.text}>"Privacy Policy"</Text>
                </TouchableOpacity>
                , and fully understand the terms of the agreement. We will use your personal information strictly in accordance with the terms you agree to, in order to provide you with better services.
            </Dialog.Description>
            <Dialog.Button label="Disagree" onPress={handleDisagree} />
            <Dialog.Button label="Agree" onPress={handleAgree} />
        </Dialog.Container>
    );
}

export default PrivacyPolicy;

const styles = StyleSheet.create({
    container: {
        textAlign: 'left',
    },
    text: {
        fontSize: 12,
        color: '#2a7bf6',
    },
});
