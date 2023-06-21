import React from 'react';
import {useState, useEffect} from 'react';
import { View, Text, StyleSheet, useWindowDimensions  } from 'react-native';
import Star from '../assets/star.svg';
import StarEmpty from '../assets/star_empty.svg';

import {  WithLocalSvg } from 'react-native-svg';
//e0e1dd

export default function ShowWordsScreen({route}){
  const datas = route.params.datas;
  const hidedKorean = {
      color:'#cbccc8',
      backgroundColor:'#cbccc8',
      paddingLeft:15,
      paddingRight:15
  }
  const exposedKorean = {
    color:'black'
  }

  const [starToggle, setStarToggle] = useState(StarEmpty);
  const [koreanState, setKoreanState] = useState(hidedKorean);
  const [page, setPage] = useState(0);
  const [wordEnd, setwordEnd] = useState();
  const [wordKor, setwordKor] = useState();

  useState(()=>{
    setwordEnd(datas&&datas[0].eng);
    setwordKor(datas&&datas[0].kor);
  },[])
  function handleStar(){
    if(starToggle == StarEmpty){
      /*db에서 찜 단어 삭제 작업
      셋 작업도 axios 내에서 하기*/
      setStarToggle(Star)
    }
    else{
      /*db에서 찜 단어 삭제 작업
      셋 작업도 axios 내에서 하기*/
      setStarToggle(StarEmpty)
    }
  }

  function hanldeKorean(){
    if(JSON.stringify(koreanState) == JSON.stringify(hidedKorean)){
      setKoreanState(exposedKorean)
    }
    else{
      setKoreanState(hidedKorean)
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
          <Text style={{fontSize:30}}>{wordEnd}</Text>
          <View style={{flexDirection: 'row'}}>
            <View style={[
              styles.triangle,
              styles.leftTriangle
            ]}/>
            <View style={[
              styles.triangle,
              styles.rightTriangle
            ]} />
          </View>
          <Text style={[koreanState, {fontSize:20}]} onPress={hanldeKorean}>{wordKor}</Text>

        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'
  },

  triangle: {
    width: 0,
    height: 0,
    borderBottomWidth: 30,
    borderTopWidth: 30,
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderLeftColor: '#e0e1dd',
    borderRightColor: 'transparent',
  },
  leftTriangle:{
    position: 'relative',
    left:-100,
    transform: [{ rotate: '180deg' }],
  },
  rightTriangle:{
    position: 'relative',
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