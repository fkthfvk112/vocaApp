import { useState, useEffect } from 'react';
import { TouchableOpacity, Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import shuffleArray from '../shuffleArray';

export default function StarQuizScreen({route}){
    const [starDatas, setStarDatas] = useState();
    const [allDatas, setAllDatas] = useState();
    const [preAns, setPreAns] = useState();
    const [page, setPage] = useState(0);

    const [showAnsToggle, setAnsToggle] = useState();
    const [time, setTime] = useState(1);
    const [timerId, setTimerId] = useState();

    const [wrongAns, setWronAns] = useState([]);
    const [endQuiz, setEndQuiz] = useState(false);


    useEffect(()=>{//initial value
        setAllDatas(route.params.allDatas);
        setStarDatas(route.params.starDatas);
    })

    useEffect(()=>{//make problem
        console.log("이거 실행이요1");
        if(starDatas && allDatas){
            console.log("이거 실행이요2");
            let tempArr = makePreAns();
            tempArr.push(starDatas[page].kor);
            tempArr = shuffleArray(tempArr);
            setPreAns(tempArr);
            console.log("fsd", tempArr);
        }
    }, [allDatas, starDatas, page]);

    let makePreAns = ()=>{
        let randomIndex =[];
        for(let i = 0; i < 4; i++){
            let inx = Math.floor(Math.random() * allDatas.length +1);
            if(randomIndex.includes(inx)){
                i--;
                continue;
            }
            randomIndex.push(inx);
        }
        return [allDatas[randomIndex[0]].kor, allDatas[randomIndex[1]].kor, allDatas[randomIndex[2]].kor, allDatas[randomIndex[3]].kor];
    }
    
    useEffect(()=>{
        if(time == 1&&showAnsToggle){
            intervalId = setInterval(() => {
                setTime((prevSeconds) => prevSeconds - 1);
            }, 1000);
            setTimerId(intervalId);
        }
        console.log(time);
        if (time <= 0) {
            clearInterval(timerId);
            setTime(1)
            setAnsToggle(false);

            if(page+1 <= starDatas.length-1){
                console.log("통과")
                setPage(page+1);
            }
            else{
                setEndQuiz(true);
            }
        }
    }, [time, showAnsToggle])
    
    let ansBtn= (kor)=>{
        if(starDatas[page].kor == kor){//정답
            console.log("정답");
        }
        else{
            console.log("오답");
            setWronAns([...wrongAns, {
                eng:starDatas[page].eng,
                kor:starDatas[page].kor,
                myAns:kor
            }])
        }
        setAnsToggle(true);
    }
    let preAnsComp = preAns&&preAns.map((ele)=>{
        let containerColor = showAnsToggle&&"#ff8799";
        if(showAnsToggle&&ele == starDatas[page].kor){
            containerColor = "#49f566";
        }
        if(!showAnsToggle) containerColor="white";
        return(
            <TouchableOpacity onPress={() => ansBtn(ele)} style={[styles.textContainer, { backgroundColor: containerColor }]}>
                <Text style={{fontSize:15}}>{ele}</Text>
            </TouchableOpacity>
        )
    })

    console.log("틀림", wrongAns);

    function QuizComp(){
        if(!endQuiz){
            return(
                <>
                <Text>{time}</Text>
                    <View style={[styles.engContainer, {borderColor: '#89a7f5'}]}>
                        <Text style={{fontSize:25}}>{starDatas&&starDatas[page].eng}</Text>
                    </View>
                {preAnsComp}
                </>
            )
        }
        else{
            let wrongArr = wrongAns&&wrongAns.map((ele)=>{
                return(
                        <View key={ele.eng} style={[styles.engContainer, {borderColor: '#ff8fa3'}]} >
                            <Text style={{fontSize:30}}>{ele.eng}</Text>
                            <Text style={{fontSize:20}}>{ele.kor}</Text>
                            <Text  style={{marginTop:20, fontSize:13, color:'gray'}}>내가 고른 답</Text>
                            <Text style={{fontSize:18, color:'#cbccc8'}}>{ele.myAns}</Text>
                        </View>
                )
            })
            
            console.log("끝");
            return(
                <>
                <Text style={{color:"#ff8fa3", fontSize:30, margin:30, fontWeight:"bold"}}>오답 노트</Text>
                {wrongArr}
                </>
            )
        }
    }

    return(
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.quizContainer} showsVerticalScrollIndicator={false}>
                <QuizComp></QuizComp>
            {/* <Text>{time}</Text>
            <View style={styles.engContainer}>
                <Text style={{fontSize:25}}>{starDatas&&starDatas[page].eng}</Text>
            </View>
            {preAnsComp} */}
            </ScrollView>
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

    quizContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white',
        width:'100%',
    },
      engContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.5,
        borderRadius:5,
        padding:50,
        minWidth: "80%",
        maxWidth: "80%",
        marginBottom:50
      },
      textContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.5,
        borderRadius:5,
        borderColor: '#CCDAFF',
        minWidth: "80%",
        maxWidth: "80%",
        minHeight:70,
        padding:10,
        margin:5,
      },
})