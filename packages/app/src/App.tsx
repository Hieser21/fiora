import React from 'react';
import { StyleSheet, View, Animated, Dimensions, ScaledSize, Linking } from 'react-native';
import { Scene, Router, Tabs, Lightbox, Actions, RouterProps } from 'react-native-router-flux';
import { Icon, NativeBaseProvider, extendTheme } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
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
const theme = extendTheme({
    colors: {
      primary: PERSONA_COLORS.primary,
      secondary: PERSONA_COLORS.secondary,
      accent: PERSONA_COLORS.accent,
    }
  });
type Props = {
    title: string;
    primaryColor: string;
    isLogin: boolean;
};
interface ExtendedRouterProps extends RouterProps {
    children: React.ReactNode;
}
function TabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen 
          name="ChatList" 
          component={ChatList}
          options={{
            tabBarIcon: ({ focused }) => (
              <Icon
                name="chatbubble-ellipses-outline"
                style={[styles.tabIcon, focused && styles.tabIconFocused]}
              />
            )
          }}
        />
        <Tab.Screen 
          name="Other" 
          component={Other}
          options={{
            tabBarIcon: ({ focused }) => (
              <Icon
                name="aperture-outline"
                style={[styles.tabIcon, focused && styles.tabIconFocused]}
              />
            )
          }}
        />
      </Tab.Navigator>
    );
  }
function App({ title, primaryColor, isLogin }: Props) {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const subscription = Dimensions.addEventListener(
            'change',
            ({ window }: { window: ScaledSize }) => {
                // Handle dimension changes
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);
    React.useEffect(() => {
        // Handle initial URL
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink(url);
            }
        });

        // Handle deep links when app is running
        const subscription = Linking.addEventListener('url', ({ url }) => {
            handleDeepLink(url);
        });

        return () => {
            subscription.remove();
        };
    }, []);
    const handleDeepLink = (url: string) => {
        const route = url.replace('fiora://', '').split('/');

        switch (route[0]) {
            case 'chat':
                Actions.chat({ id: route[1], title: route[2] });
                break;
            case 'user':
                Actions.userInfo({ user: { _id: route[1] } });
                break;
            case 'group':
                Actions.groupInfo({ group: { _id: route[1] } });
                break;
        }
    };

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }, []);

    const sceneCommonProps = {
        hideNavBar: false,
        // navigationBarStyle: {
        //     backgroundColor: PERSONA_COLORS.secondary,
        //     borderBottomWidth: 0,
        //     elevation: 8,
        //     shadowColor: PERSONA_COLORS.primary,
        //     shadowOffset: { width: 0, height: 4 },
        //     shadowOpacity: 0.5,
        //     shadowRadius: 8
        // },
        navBarButtonColor: PERSONA_COLORS.accent,
        renderLeftButton: () => <BackButton />,
    };

    return (
        <NativeBaseProvider theme={theme}>
            <View style={styles.fullScreen}>
        <NavigationContainer >
          <Stack.Navigator 
            screenOptions={{
              headerStyle: styles.navBar,
              headerShown: false,
              headerTintColor: PERSONA_COLORS.accent
            }}
          >
            <Stack.Screen  name="Main" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={Signup}  options={{ headerShown: false }} />
            <Stack.Screen name="GroupProfile" component={GroupProfile}  options={{ headerShown: false }} />
            <Stack.Screen name="UserInfo" component={UserInfo}  options={{ headerShown: false }} />
            <Stack.Screen name="GroupInfo" component={GroupInfo}  options={{ headerShown: false }} />
            <Stack.Screen name="SearchResult" component={SearchResult}  options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
        </View>
        </NativeBaseProvider>
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
    },
    fullScreen: {
        flex: 1,
        width: '100%',
        height: '100%'
      }
});

export default connect((state: State) => ({
    primaryColor: state.ui.primaryColor,
    isLogin: !!(state.user as User)?._id,
}))(App);
