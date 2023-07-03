import { useEffect, useState } from 'react';
import {  WithLocalSvg } from 'react-native-svg';
import { TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native';
import trashbin from '../assets/trash.svg';
import Star from '../assets/star.svg';
import showToast from '../utils/toast';
import Toast from 'react-native-toast-message';


function deleteCollectionFromTableByValue(db, value){
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM staredWords WHERE eng = ?',
      [value],
      (_, result) => {
        console.log('Record deleted successfully.');
      },
      (_, error) => {
        console.log('Error deleting record:', error);
      }
    );
  });  
}

export default function StarScreen({route, navigation }){
    const [starDatas, setStarDatas] = useState([]);
    const db = route.params.dbObj;

    function toStarQuizScreen(){
      console.log("클릭");
      let datas = {
        allDatas:route.params.datas,
        starDatas:starDatas
      }
      if(datas.starDatas&&datas.starDatas.length >= 1){
        navigation.push('StarQuizScreen', datas);
      }
      else{
        console.log("여기");
        showToast('단어를 추가해 주세요!');
      }
    }

    function deleteThis(ele){
      console.log(ele.eng)
      deleteCollectionFromTableByValue(db, ele.eng);
      selectAllDatas();
    }

    function selectAllDatas(){
        db.transaction(tx => {
          tx.executeSql(
            `SELECT * FROM staredWords`,
            [],
            (_, result) => {
              const { rows } = result;
              console.log("여기 로우 ", rows);
              if (rows && rows._array) {
                const words = rows._array;
                setStarDatas(words);
              }
            },
            (_, error) => {
              console.log('error : ', error);
            }
          );
        });
    }

    useEffect(()=>{
        selectAllDatas();
    }, [])
    
    const test = starDatas&&starDatas.map((ele)=>{
      //style={styles.star}
        return (
            <View style={styles.textContainer}>
              <View style={{flexDirection: "row", alignItems: "flex-end", justifyContent:"flex-end", width:'100%', marginTop:5}}>
                <WithLocalSvg 
                            width={38}
                            height={38}
                            asset={trashbin}
                            onPress={()=>deleteThis(ele)}
                          />
              </View>
              <Text style={{fontSize:25, marginBottom:10}}>{ele.eng}</Text>
              <Text style={{fontSize:18, marginBottom:20}}>{ele.kor}</Text>
            </View>
        )
    })

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {test}
        </ScrollView>
        <TouchableOpacity onPress={toStarQuizScreen} style={styles.quizBtn}><Text>단어 퀴즈</Text></TouchableOpacity>
        <Toast/>
      </View>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white',
    width:'100%',
    height:'100%'
  },

  textContainer:{
    position:'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderRadius:15,
    borderColor: '#ffdc5e',
    minWidth: 300,
    minHeight: 150,
    maxWidth:300,
    width:300,
    margin:30,
    padding:10
  },
  quizBtn:{
    marginBottom:20,
    padding:10,
    width:200,
    borderRadius:10,
    alignItems: 'center',
    backgroundColor:'#ffa62b',
  },
});