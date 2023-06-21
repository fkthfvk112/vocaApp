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
  
  const setAllDatas = async () => {
    await db.transaction(tx => {
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

  const setDataPromise = function(){
    return new Promise((resolve, reject)=>{
      setAllDatas();
      if(wordDatas&&wordDatas.length >= 10){
        resolve("데이터 받아옴");
      }
      else{
        reject(Error("실패"));//실패시 어떻게 처리할 것인가.
      }
    })
  }
  function toShowWordsScreen(){//여기 수정
    setDataPromise()
      .then((text)=>{
        console.log('성공', text);
        navigation.push('ShowWordsScreen', {datas:wordDatas})//처음 누르면
      }, (error)=>{
        console.error("실패", error);
      })
    //setAllDatas();
    //navigation.navigate('ShowWordsScreen');
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