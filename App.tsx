/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import WebView from 'react-native-webview';
import {BackHandler, Dimensions, SafeAreaView, StyleSheet} from 'react-native';
import {handleCloseApp} from './src/utils/common';

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

  const customBackHandler = () => {
    webview.current?.injectJavaScript(`
        test();
        
        true;
      `);

    return true;
  };

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
  }, [navState]);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        style={styles.webview}
        ref={webview}
        source={{uri: 'http://10.0.2.2:3000'}}
        onNavigationStateChange={({url, canGoBack}) =>
          setNavState({url, canGoBack})
        }
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
