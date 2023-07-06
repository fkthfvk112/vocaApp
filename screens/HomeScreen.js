import { ImageBackground, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import {useState, useEffect} from 'react';
import downLoadDb from '../downLoadDb';
import shuffleArray from '../shuffleArray';
import { Dimensions } from 'react-native';
import backImg from '../assets/wordCloud.png';
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

  console.log(backImg, "백이미지")
  return (
    // <View style={styles.container}>
      <View style={{flex: 1,justifyContent: 'center', alignItems: 'center', backgroundColor:'white'}}>
          <Text>수능 영단어</Text>
          <TouchableOpacity onPress={toShowWordsScreen} style={styles.btn}><Text>단어</Text></TouchableOpacity>
          <TouchableOpacity onPress={toShowRandomWordsScreen} style={styles.btn}><Text>랜덤 단어</Text></TouchableOpacity>
          <TouchableOpacity onPress={toStarWordsScreen} style={styles.btn}><Text>내 단어장</Text></TouchableOpacity>
      </View>
    );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  btn:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
    width: windowWidth * 0.8,
    height: 50,
    borderColor:"skyblue",
    borderWidth:3,
    borderRadius:10,
    margin:10,
    elevation: 2
  }
})