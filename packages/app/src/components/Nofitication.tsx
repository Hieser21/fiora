import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useState, useEffect } from 'react';
import { Platform, AppState, StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as Device from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { register, setNotificationToken } from '../service';
import action from '../state/action';
import { State, User } from '../types/redux';
import { isiOS } from '../utils/platform';
import { useIsLogin, useStore } from '../hooks/useStore';
import store from '../state/store';

function configureNotifications() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
        }),
    });
}

function Notification() {
    const isLogin = useIsLogin();
    const state = useStore();
    const notificationTokens = (state.user as User)?.notificationTokens || [];
    const { connect } = state;

    const [notificationToken, updateNotificationToken] = useState('');

    async function registerForPushNotificationsAsync() {
        if (!Device.isDevice) return;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
          
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
          
        if (finalStatus !== 'granted') return;
      
        const token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });
        return token.data;
    }

    function handleNotificationResponse(response: any) {
        const { focus } = response.notification.request.content.data;
        setTimeout(() => {
            const currentState = store.getState() as State;
            const linkmans = currentState.linkmans || [];
            if (linkmans.find((linkman) => linkman._id === focus)) {
                action.setFocus(focus);
                if (Actions.currentScene !== 'chat') {
                    Actions.chat();
                }
            }
        }, 300);
    }

    useEffect(() => {
        configureNotifications();
        registerForPushNotificationsAsync().then(token => {
            if (token) updateNotificationToken(token);
        });

        const subscription = Notifications.addNotificationResponseReceivedListener(
            handleNotificationResponse
        );

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (connect && isLogin && notificationToken && !notificationTokens.includes(notificationToken)) {
            setNotificationToken(notificationToken);
        }
    }, [connect, isLogin, notificationToken]);

    function handleAppStateChange(nextAppState: string) {
        if (nextAppState === 'active') {
            Notifications.setBadgeCountAsync(0);
        }
    }

    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, []);

    return null;
}

export default Notification;
