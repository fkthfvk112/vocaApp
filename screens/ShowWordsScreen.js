import React from 'react';
import {useState, useEffect} from 'react';
import {Button, View, Text, StyleSheet, Pressable, Modal, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import Star from '../assets/star.svg';
import StarEmpty from '../assets/star_empty.svg';
import {  WithLocalSvg } from 'react-native-svg';
import BouncyCheckbox from "react-native-bouncy-checkbox";
//e0e1dd

export default function ShowWordsScreen({route}){
  const datas = route.params.datas;
  const db = route.params.dbObj;
  //console.log("디비오브제", dbObj);

  const hidedKorean = {
      color:'#cbccc8',
      backgroundColor:'#cbccc8',
      paddingLeft:15,
      paddingRight:15
  }
  const exposedKorean = {
    color:'black'
  }

  const [koreanState, setKoreanState] = useState(hidedKorean);
  const [page, setPage] = useState(1);
  const [wordEng, setwordEng] = useState();
  const [wordKor, setwordKor] = useState();
  const [seeKor, setSeeKor] = useState(false);
  const [totalPage, setTotalPage] = useState();
  const [pageText, setPageText] = useState(1);

  const [starToggle, setStarToggle] = useState(StarEmpty);
  const [starTable, setStarTable] = useState([]);

  useEffect(()=>{
    makeStarDbTable();
  })

  useEffect(()=>{
    setwordEng(datas&&datas[page-1].eng);
    setwordKor(datas&&datas[page-1].kor);
    setTotalPage(datas.length);
  },[page])

  useEffect(()=>{//eng 바뀐 후 처리
    let setInitialStart = ()=>{
      const inStard = starTable.some((obj)=>{
        return obj.eng == wordEng;
      });
      if(inStard){
        setStarToggle(Star);
      }
      else{
        setStarToggle(StarEmpty);
      }
    }
    SelectAllFromStard(setInitialStart);
  }, [wordEng])

    function SelectAllFromStard(callback){
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM staredWords`,
          [],
          (_, result) => {
            const { rows } = result;
            console.log("여기 로우 ", rows);
            if (rows && rows._array) {
              const words = rows._array;
              setStarTable(words);
              callback();
            }
          },
          (_, error) => {
            console.log('error : ', error);
          }
        );
      });
    }

    const starToggleFunc =  ()=>{
      //console.log("실행됌");
      const inStard = starTable.some((obj)=>{
        return obj.eng == wordEng;
      });
      //console.log("이즈 스타", inStard);
      if(!inStard){
        console.log("토글온")
        setStarToggle(Star);
      }
      else{
        console.log("토글오프")
        setStarToggle(StarEmpty);
      } 
    }


  function makeStarDbTable(){
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS staredWords (eng TEXT , kor TEXT, insertedDate DATE)',
        [],
        (_, result) => {
          console.log('Table created successfully.');
        },
        (_, error) => {
          console.log('Error creating table:', error);
        }
      );
    }, null, null, db.READ_WRITE);    
  }

  function onClickLeft(){
    if(page >1){
      setPage(page-1);
      !seeKor&&setKoreanState(hidedKorean);
    };
  }
  function onClickRight(){
    if(page < datas.length){
      setPage(page+1);
      !seeKor&&setKoreanState(hidedKorean);
    }
  }
  
  function handleStar(){
    if(starToggle == StarEmpty){
      const isStartd = starTable.some((obj)=>{
        obj&&obj.eng ===wordEng;
      });
      if(!isStartd){//테이블에 존재하지 않을 떄만 insert
        console.log("삽입 실행");
        db.transaction(tx => {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().split('T')[0];
          tx.executeSql(
            'INSERT INTO staredWords (eng, kor, insertedDate) VALUES (?, ?, ?)',
            [wordEng, wordKor, formattedDate],
            (_, result) => {
              console.log('Record inserted successfully.');
            },
            (_, error) => {
              console.log('Error inserting record:', error);
            }
          );
        });
      }
    }
    else{
      console.log("삭제 실행");
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM staredWords WHERE eng = ?',
          [wordEng],
          (_, result) => {
            console.log('Record deleted successfully.');
          },
          (_, error) => {
            console.log('Error deleting record:', error);
          }
        );
      });      
    }
    SelectAllFromStard(starToggleFunc);
  }

  function hanldeKorean(){
    if(seeKor) return;
    if(JSON.stringify(koreanState) == JSON.stringify(hidedKorean)){
      setKoreanState(exposedKorean)
    }
    else{
      setKoreanState(hidedKorean)
    }
  }

  function seeKoreanAllways(){
    if(seeKor === true) {
      setSeeKor(false);
    }
    else{
      setSeeKor(true);
      setKoreanState(exposedKorean);
    }
  }
  return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
        <WithLocalSvg style={styles.star}
            width={45}
            height={45}
            asset={starToggle}
            onPress={handleStar}
          />
          <Text style={{fontSize:30, marginTop:20}}>{wordEng}</Text>
          <View style={{flexDirection: 'row'}}>
            <Pressable style={[
              styles.triangle,
              styles.leftTriangle
            ]} onPress={onClickLeft}/>
              <Pressable style={[
                styles.triangle,
                styles.rightTriangle
              ]} onPress={onClickRight}/>
          </View>
          <Text style={[koreanState, {fontSize:20, marginTop:10}]} onPress={hanldeKorean}>{wordKor}</Text>
          <BouncyCheckbox
            textStyle={{
              textDecorationLine: "none",
            }}
            style={{paddingTop:15}}
            size={21}
            fillColor="skyblue"
            text="계속 뜻 보기"
            onPress={seeKoreanAllways}
            isChecked={seeKor}
          />
        </View>
          <Text>{page}/{totalPage}</Text>
        <View style={{alignItems:'center', flexDirection: 'row'}}>
        <TextInput
                placeholder="페이지 입력"
                onChangeText={(value)=>{
                  let num = parseInt(value);
                  if (!isNaN(num)&&num <= datas.length&&num >= 1) {
                    setPageText(num);
                  }
                }}
                value={pageText}
                style={{margin:15}}
                />
        <Pressable title="이동" 
        style={{backgroundColor:'#d3d6db', padding:5, borderRadius:10}}
        onPress={()=>{ 
          let nextPage = parseInt(pageText);
          setPage(nextPage)
          }}>
          <Text>이동</Text>
        </Pressable>

        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  modalView:{
    position:'relative',
    backgroundColor: 'white',
    padding: 15,  
    borderWidth: 2, 
    borderColor:'#d3d6db', 
    borderStyle:'solid', 
    borderRadius:10 
},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'
  },

  triangle: {
    width: 0,
    height: 0,
    borderBottomWidth: 20,
    borderTopWidth: 20,
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderLeftColor: '#e0e1dd',
    borderRightColor: 'transparent',
  },
  leftTriangle:{
    position: 'relative',
    zIndex:1,
    left:-100,
    transform: [{ rotate: '180deg' }],
  },
  rightTriangle:{
    position: 'relative',
    zIndex:1,
    right:-100,
  },
  textContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderRadius:15,
    borderColor: '#CCDAFF',
    minWidth: 300,
    minHeight: 300,
    maxHeight:300,
    maxWidth:300,
    width:300,
    height:300
  },
  star:{
    position:'absolute',
    top:15,
    right:20
  }
});