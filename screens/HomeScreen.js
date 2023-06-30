import { Button, StyleSheet, Text, View } from 'react-native';
import {useState, useEffect} from 'react';
import downLoadDb from '../downLoadDb';
import shuffleArray from '../shuffleArray';

export default function HomeScreen({navigation}){
  const [db, setDb] = useState(null);
  const [wordDatas, setWordDatas] = useState();
  //const [randomDatas, setRandomDatas] = useState();

  useEffect(()=>{
    const fetchData = async () => {
      let newDb =  await downLoadDb();
      setDb(newDb);
    };
    fetchData();
  },[])
  
  useEffect(()=>{
    setAllDatas();
  }, [db]);

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
    if(wordDatas&&wordDatas.length >= 10) navigation.push('ShowWordsScreen', {datas:wordDatas, dbObj:db});
  }

  function toShowRandomWordsScreen(){
    if(wordDatas&&wordDatas.length >= 10){
      let randomDatas = shuffleArray([...wordDatas]);
      navigation.push('ShowWordsScreen', {datas:randomDatas, dbObj:db});
    }
  }

  function toStarWordsScreen(){
    navigation.push('StarWordsScreen', {datas:wordDatas,dbObj:db})//처음 누르면
  }
  return (
    // <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="단어 순서대로 보기" onPress={toShowWordsScreen}/>
        <Button title="단어 랜덤하게 보기" onPress={toShowRandomWordsScreen}/>
        <Button title="찜한 단어 보기" onPress={toStarWordsScreen}/>
      </View>
    );
}