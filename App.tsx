/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import WebView from 'react-native-webview';
import {
  BackHandler,
  Dimensions,
  Linking,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {handleCloseApp} from './src/utils/common';
import SendIntentAndroid from 'react-native-send-intent';
import {ShouldStartLoadRequest} from 'react-native-webview/lib/WebViewTypes';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const App = () => {
  const webview = useRef<WebView | null>(null);
  const [navState, setNavState] = useState({
    url: '',
    canGoBack: false,
  });

  const originalBackHandler = () => {
    if (navState.canGoBack) {
      if (navState.url === 'http://10.0.2.2:3000') {
        handleCloseApp();
      } else {
        webview.current?.goBack();
      }
    } else {
      handleCloseApp();
    }

    return true;
  };

  // const customBackHandler = () => {
  //   webview.current?.injectJavaScript(`
  //       test();

  //       true;
  //     `);

  //   return true;
  // };

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     customBackHandler,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      originalBackHandler,
    );

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navState]);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        style={styles.webview}
        ref={webview}
        source={{uri: 'https://withbbang.github.io/test-sdk-react/'}}
        onNavigationStateChange={({url, canGoBack}) =>
          setNavState({url, canGoBack})
        }
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={(event: ShouldStartLoadRequest) => {
          const {url} = event;

          if (
            url.startsWith('http://') ||
            url.startsWith('https://') ||
            url.startsWith('about:blank')
          ) {
            return true;
          }

          if (url.includes('intent')) {
            SendIntentAndroid.openAppWithUri(url).catch((err: any) => {
              ToastAndroid.show('앱 실행에 실패했습니다.', err);
            });

            return false;
          } else {
            Linking.openURL(url).catch((err: any) => {
              ToastAndroid.show('앱 실행에 실패했습니다.', err);
            });
            return false;
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  webview: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
  },
});

export default App;
