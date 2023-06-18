import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import {useState, useEffect} from 'react';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import downLoadDb from './downLoadDb';


export default function App() {
  const [db, setDb] = useState(null);
  const [datas, setDatas] = useState([]);

  useEffect(()=>{
    const fetchData = async () => {
      let newDb =  await downLoadDb();
      setDb(newDb);
    };
    fetchData();
  },[])

  const showData = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM words',
        [],
        (_, result) => {
          const { rows } = result;
          console.log("여기");
          if (rows && rows._array) {
            const words = rows._array;
            console.log('words: ', words);
            setDatas(words);
          }
        },
        (_, error) => {
          console.log('error : ', error);
        }
      );
    });
  };
  
  console.log('데이터스', datas);
  return (
    <View style={styles.container}>
      <Text>das</Text>
      <Button title="다운로드 디비"  />
      <Button title="클릭" />
      <Button title="데이터 삽입" />
      <Button title="데이터 보기" onPress={showData}/>
      <StatusBar style="auto"/>
    </View>
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
