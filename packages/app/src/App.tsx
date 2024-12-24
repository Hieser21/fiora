import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Scene, Router, Stack, Tabs, Lightbox } from 'react-native-router-flux';
import { Icon, Root } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { connect } from 'react-redux';

import ChatList from './pages/ChatList/ChatList';
import Chat from './pages/Chat/Chat';
import Login from './pages/LoginSignup/Login';
import Signup from './pages/LoginSignup/Signup';
import Loading from './components/Loading';
import Other from './pages/Other/Other';
import Notification from './components/Nofitication';
import { State, User } from './types/redux';
import SelfInfo from './pages/ChatList/SelfInfo';
import ChatBackButton from './pages/Chat/ChatBackButton';
import GroupProfile from './pages/GroupProfile/GroupProfile';
import ChatRightButton from './pages/Chat/ChatRightButton';
import UserInfo from './pages/UserInfo/UserInfo';
import ChatListRightButton from './pages/ChatList/ChatListRightButton';
import SearchResult from './pages/SearchResult/SearchResult';
import GroupInfo from './pages/GroupInfo/GroupInfo';
import BackButton from './components/BackButton';

const PERSONA_COLORS = {
    primary: '#FF0000',
    secondary: '#000000',
    accent: '#FFFFFF',
    text: '#FFFFFF'
};

type Props = {
    title: string;
    primaryColor: string;
    isLogin: boolean;
};

function App({ title, primaryColor, isLogin }: Props) {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }, []);

    const sceneCommonProps = {
        hideNavBar: false,
        navigationBarStyle: {
            backgroundColor: PERSONA_COLORS.secondary,
            borderBottomWidth: 0,
            elevation: 8,
            shadowColor: PERSONA_COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8
        },
        navBarButtonColor: PERSONA_COLORS.accent,
        renderLeftButton: () => <BackButton />,
    };

    return (
        <View style={styles.container}>
            <Root>
                <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                    <LinearGradient
                        colors={[PERSONA_COLORS.secondary, PERSONA_COLORS.primary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    >
                        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                        <Router sceneStyle={{ backgroundColor: 'transparent' }}>
                        <Stack hideNavBar>
                                    <Lightbox>
                                        <Tabs
                                            key="tabs"
                                            hideNavBar
                                            tabBarStyle={styles.tabBar}
                                            showLabel={false}
                                        >
                                            <Scene
                                                key="chatlist"
                                                navBarButtonColor="transparent"
                                                component={ChatList}
                                                initial
                                                hideNavBar={!isLogin}
                                                icon={({ focused }) => (
                                                    <Icon
                                                        name="chatbubble-ellipses-outline"
                                                        style={[
                                                            styles.tabIcon,
                                                            focused && styles.tabIconFocused
                                                        ]}
                                                    />
                                                )}
                                                renderLeftButton={() => <SelfInfo />}
                                                renderRightButton={() => <ChatListRightButton />}
                                                navigationBarStyle={styles.navBar}
                                            />
                                            <Scene
                                                key="other"
                                                component={Other}
                                                hideNavBar
                                                title="Other"
                                                icon={({ focused }) => (
                                                    <Icon
                                                        name="aperture-outline"
                                                        style={[
                                                            styles.tabIcon,
                                                            focused && styles.tabIconFocused
                                                        ]}
                                                    />
                                                )}
                                            />
                                        </Tabs>
                                    </Lightbox>
                                    <Scene
                                        key="chat"
                                        component={Chat}
                                        title="Chat"
                                        getTitle={title}
                                        {...sceneCommonProps}
                                        renderLeftButton={() => <ChatBackButton />}
                                        renderRightButton={() => <ChatRightButton />}
                                    />
                                    <Scene key="login" component={Login} title="Log In" {...sceneCommonProps} />
                                    <Scene key="signup" component={Signup} title="Sign Up" {...sceneCommonProps} />
                                    <Scene key="groupProfile" component={GroupProfile} title="Group Profile" {...sceneCommonProps} />
                                    <Scene key="userInfo" component={UserInfo} title="Personal Information" {...sceneCommonProps} />
                                    <Scene key="groupInfo" component={GroupInfo} title="Group Information" {...sceneCommonProps} />
                                    <Scene key="searchResult" component={SearchResult} title="Search Results" {...sceneCommonProps} />
                                </Stack>
                            </Router>
                        </Animated.View>
                    </LinearGradient>
                </BlurView>
            </Root>
            <Loading />
            <Notification />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PERSONA_COLORS.secondary
    },
    blurContainer: {
        flex: 1
    },
    gradient: {
        flex: 1
    },
    navBar: {
        backgroundColor: PERSONA_COLORS.secondary,
        borderBottomWidth: 0,
        elevation: 8,
        shadowColor: PERSONA_COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8
    },
    tabBar: {
        backgroundColor: PERSONA_COLORS.secondary,
        borderTopWidth: 0,
        elevation: 8,
        shadowColor: PERSONA_COLORS.primary,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.5,
        shadowRadius: 8
    },
    tabIcon: {
        fontSize: 24,
        color: 'rgba(255,255,255,0.5)'
    },
    tabIconFocused: {
        color: PERSONA_COLORS.accent
    }
});

export default connect((state: State) => ({
    primaryColor: state.ui.primaryColor,
    isLogin: !!(state.user as User)?._id,
}))(App);
