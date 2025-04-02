import {Alert, BackHandler} from 'react-native';

export function handleCloseApp() {
  Alert.alert('종료하시겠습니까?', '확인을 누르면 종료됩니다.', [
    {
      text: '취소',
      onPress: () => {},
      style: 'cancel',
    },
    {
      text: '확인',
      onPress: () => BackHandler.exitApp(),
    },
  ]);
}
