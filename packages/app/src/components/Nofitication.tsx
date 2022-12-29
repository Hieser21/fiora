import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useState, useEffect } from 'react';
import { Platform, AppState } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { setNotificationToken } from '../service';
import action from '../state/action';
import { State, User } from '../types/redux';
import { isiOS } from '../utils/platform';
import { useIsLogin, useStore } from '../hooks/useStore';
import store from '../state/store';

function enableNotification() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
}
function disableNotification() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: false,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });
}

function Nofitication() {
    const isLogin = useIsLogin();
    const state = useStore();
    const notificationTokens = (state.user as User)?.notificationTokens || [];
    const { connect } = state;

    const [notificationToken, updateNotificationToken] = useState('');

    async function registerForPushNotificationsAsync() {
        // Push notification to Android device need google service
        // Not supported in China
        if (Device.isDevice) {
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
              const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
              finalStatus = status;
            }
            if (finalStatus !== 'granted') {
              alert('Failed to get push token for push notification!');
              return;
            }
            const token = await Notifications.getExpoPushTokenAsync();
            console.log(token);
            this.setState({ expoPushToken: token });
          } else {
            alert('Must use physical device for Push Notifications');
          }
        
          if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('default', {
              name: 'default',
              sound: true,
              priority: 'max',
              vibrate: [0, 250, 250, 250],
            });
          }
        };
    }
    function handleClickNotification(response: any) {
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
        }, 1000);
    }
    useEffect(() => {
        disableNotification();
        registerForPushNotificationsAsync();

        Notifications.addNotificationResponseReceivedListener(
            handleClickNotification,
        );
    }, []);

    useEffect(() => {
        if (
            connect &&
            isLogin &&
            notificationToken &&
            !notificationTokens.includes(notificationToken)
        ) {
            setNotificationToken(notificationToken);
        }
    }, [connect, isLogin, notificationToken]);

    function handleAppStateChange(nextAppState: string) {
        if (nextAppState === 'active') {
            disableNotification();
        } else if (nextAppState === 'background') {
            enableNotification();
        }
    }
    useEffect(() => {
        AppState.addEventListener('change', handleAppStateChange);
        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
        };
    }, []);

    return null;
}

export default Nofitication;
