import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import {useState, useEffect} from 'react';
import downLoadDb from './downLoadDb';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ShowWordsScreen from './screens/ShowWordsScreen';
import StarScreen from './screens/StarScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [db, setDb] = useState(null);
  const [wordDatas, setWordDatas] = useState([]);

  useEffect(()=>{
    const fetchData = async () => {
      let newDb =  await downLoadDb();
      setDb(newDb);
    };
    fetchData();
  },[])

  const setAllDatas = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM words',
        [],
        (_, result) => {
          const { rows } = result;
          console.log("여기");
          if (rows && rows._array) {
            const words = rows._array;
            setWordDatas(words);
          }
        },
        (_, error) => {
          console.log('error : ', error);
        }
      );
    });
  };
  
  console.log('단어 개수', wordDatas[0]);
  return (
    <NavigationContainer style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="ShowWordsScreen" component={ShowWordsScreen}/>
        <Stack.Screen name="StarWordsScreen" component={StarScreen}/>
      </Stack.Navigator>
      <View>
        <Text>광고</Text>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
