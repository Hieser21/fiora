import React, { useState } from 'react';
import { ScrollView, StyleSheet, Animated } from 'react-native';
import { Icon, Input, View } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import Linkman from './Linkman';
import { useLinkmans } from '../../hooks/useStore';
import { Linkman as LinkmanType } from '../../types/redux';
import PageContainer from '../../components/PageContainer';
import { search } from '../../service';
import { isiOS } from '../../utils/platform';


const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    text: '#FFFFFF'
};

function ChatList() {
    const [searchKeywords, updateSearchKeywords] = useState('');
    const linkmans = useLinkmans();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    async function handleSearch() {
        const result = await search(searchKeywords);
        updateSearchKeywords('');
        Actions.push('searchResult', result);
    }

    function renderLinkman(linkman: LinkmanType) {
        const { _id: linkmanId, unread, messages, createTime } = linkman;
        const lastMessage =
            messages.length > 0 ? messages[messages.length - 1] : null;

        let time = new Date(createTime);
        let preview = 'No news';
        if (lastMessage) {
            time = new Date(lastMessage.createTime);
            preview =
                lastMessage.type === 'text'
                    ? `${lastMessage.content}`
                    : `[${lastMessage.type}]`;
            if (linkman.type === 'group') {
                preview = `${lastMessage.from.username}: ${preview}`;
            }
        }
        return (
            <Animated.View 
                style={{ 
                    opacity: fadeAnim,
                    transform: [{ translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, 0]
                    })}]
                }}
            >
                <Linkman
                    key={linkmanId}
                    id={linkmanId}
                    name={linkman.name}
                    avatar={linkman.avatar}
                    preview={preview}
                    time={time}
                    unread={unread}
                    linkman={linkman}
                    lastMessageId={lastMessage ? lastMessage._id : ''}
                />
            </Animated.View>
        );
    }

    return (
        <PageContainer>
            <BlurView intensity={20} tint="dark" style={styles.container}>
                <LinearGradient
                    colors={[PERSONA_COLORS.secondary, PERSONA_COLORS.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                   <View style={styles.searchContainer}>
    <View style={styles.searchItem}>
        <Icon name="search" style={styles.searchIcon} />
        <Input
            style={styles.searchText}
            placeholder="Search Groups/Users"
            placeholderTextColor={PERSONA_COLORS.accent}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            value={searchKeywords}
            onChangeText={updateSearchKeywords}
            onSubmitEditing={handleSearch}
        />
    </View>
</View>
                    <ScrollView style={styles.messageList}>
                        {linkmans && linkmans.map((linkman) => renderLinkman(linkman))}
                    </ScrollView>
                </LinearGradient>
            </BlurView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden'
    },
    gradient: {
        flex: 1,
        padding: 2
    },
    messageList: {
        flex: 1
    },
    searchContainer: {
        marginTop: isiOS ? 0 : 5,
        backgroundColor: 'transparent',
        height: 42,
        borderBottomWidth: 0,
        elevation: 0
    },
    searchItem: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        marginHorizontal: 8
    },
    searchIcon: {
        color: PERSONA_COLORS.accent
    },
    searchText: {
        fontSize: 14,
        color: PERSONA_COLORS.text
    }
});
export default ChatList