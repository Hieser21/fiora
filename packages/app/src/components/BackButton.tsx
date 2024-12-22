import { View, Icon, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

type Props = {
    text?: string;
};

function BackButton({ text = '' }: Props) {
    return (
        <TouchableOpacity onPress={() => Actions.pop()}>
            <View 
                background="#2B2B2B" 
                borderWidth={2} 
                borderColor="#FF0000"
                shadow={5}
                style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center',
                    transform: [{ skewX: '-10deg' }] 
                }}
                px={4}
                py={2}
            >
                <Icon
                    name="chevron-back-outline"
                    color="#FF0000"
                    size={7}
                />
                <Text
                    color="white"
                    fontSize="md"
                    fontWeight="bold"
                    letterSpacing={1}
                    textTransform="uppercase"
                >
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default BackButton;
