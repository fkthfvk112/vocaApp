import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';


export default function StarScreen({route}){
    const [starDatas, setStarDatas] = useState([]);
    const db = route.params.dbObj;

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
        return <Text>{ele.eng}</Text>
    })
    console.log(db);
    return <Text>찜한 단어 : {test}</Text>
}