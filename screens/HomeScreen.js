import { Button, StyleSheet, Text, View } from 'react-native';
import {useState, useEffect} from 'react';
import downLoadDb from '../downLoadDb';

export default function HomeScreen({navigation}){
  const [db, setDb] = useState(null);
  const [wordDatas, setWordDatas] = useState();
  useEffect(()=>{
    const fetchData = async () => {
      let newDb =  await downLoadDb();
      setDb(newDb);
    };
    fetchData();
  },[])
  
  useEffect(()=>{
    if(wordDatas&&wordDatas.length >= 10) navigation.push('ShowWordsScreen', {datas:wordDatas, dbObj:db})//처음 누르면
  }, [wordDatas])
  
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

  function toShowWordsScreen(){//여기 수정
    setAllDatas();
    //navigation.push('ShowWordsScreen', {datas:wordDatas})//처음 누르면
  }

  return (
    // <View style={styles.container}>
      <View>
        <Text>das</Text>
        <Button title="다운로드 디비"/>
        <Button title="단어 보기" onPress={toShowWordsScreen}/>
        <Button title="데이터 삽입" />
        <Button title="데이터 보기"/>
      </View>
    );
}