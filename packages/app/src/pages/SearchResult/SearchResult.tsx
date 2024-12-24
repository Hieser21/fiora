import React from 'react';
import { Tab, Tabs, Text, View } from 'native-base';
import { ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import PageContainer from '../../components/PageContainer';
import Avatar from '../../components/Avatar';

const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    text: {
        primary: '#FFFFFF',
        secondary: '#666666'
    }
};

type Props = {
    groups: {
        _id: string;
        name: string;
        avatar: string;
        members: number;
    }[];
    users: {
        _id: string;
        username: string;
        avatar: string;
    }[];
};

function SearchResult({ groups, users }: Props) {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }, []);

    function handleClickGroup(group: any) {
        Actions.push('groupInfo', { group });
    }

    function handleClickUser(user: any) {
        Actions.push('userInfo', { user });
    }

    return (
        <PageContainer disableSafeAreaView>
            <BlurView intensity={20} tint="dark" style={styles.container}>
                <LinearGradient
                    colors={[PERSONA_COLORS.secondary, PERSONA_COLORS.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <Tabs
                        style={styles.tabs}
                        tabContainerStyle={styles.tabContainer}
                    >
                        <Tab
                            heading={`Groups(${groups.length})`}
                            tabStyle={styles.tab}
                            activeTabStyle={styles.activeTab}
                            textStyle={styles.tabText}
                            activeTextStyle={styles.activeTabText}
                        >
                            <ScrollView style={styles.scrollView}>
                                {groups.map((group) => (
                                    <Animated.View 
                                        key={group._id}
                                        style={{ opacity: fadeAnim }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => handleClickGroup(group)}
                                        >
                                            <View style={styles.item}>
                                                <Avatar src={group.avatar} size={40} />
                                                <View style={styles.groupInfo}>
                                                    <Text style={styles.groupName}>
                                                        {group.name}
                                                    </Text>
                                                    <Text style={styles.groupMembers}>
                                                        {group.members} members
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Animated.View>
                                ))}
                            </ScrollView>
                        </Tab>
                        <Tab
                            heading={`Users(${users.length})`}
                            tabStyle={styles.tab}
                            activeTabStyle={styles.activeTab}
                            textStyle={styles.tabText}
                            activeTextStyle={styles.activeTabText}
                        >
                            <ScrollView style={styles.scrollView}>
                                {users.map((user) => (
                                    <Animated.View 
                                        key={user._id}
                                        style={{ opacity: fadeAnim }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => handleClickUser(user)}
                                        >
                                            <View style={styles.item}>
                                                <Avatar src={user.avatar} size={40} />
                                                <Text style={styles.username}>
                                                    {user.username}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Animated.View>
                                ))}
                            </ScrollView>
                        </Tab>
                    </Tabs>
                </LinearGradient>
            </BlurView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 12,
        borderRadius: 12,
        overflow: 'hidden'
    },
    gradient: {
        flex: 1,
        padding: 2
    },
    tabs: {
        backgroundColor: 'transparent',
        elevation: 0
    },
    tabContainer: {
        backgroundColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 2,
        borderBottomColor: PERSONA_COLORS.primary
    },
    tab: {
        backgroundColor: 'transparent'
    },
    activeTab: {
        backgroundColor: 'transparent'
    },
    tabText: {
        color: PERSONA_COLORS.text.secondary
    },
    activeTabText: {
        color: PERSONA_COLORS.text.primary,
        fontWeight: 'bold'
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    item: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)'
    },
    groupInfo: {
        marginLeft: 12
    },
    groupName: {
        color: PERSONA_COLORS.text.primary,
        fontSize: 16,
        fontWeight: '600',
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    groupMembers: {
        fontSize: 14,
        color: PERSONA_COLORS.text.secondary,
        marginTop: 2
    },
    username: {
        color: PERSONA_COLORS.text.primary,
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '600',
        textShadowColor: PERSONA_COLORS.secondary,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    }
});

export default SearchResult;
