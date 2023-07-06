import * as Speech from 'expo-speech';//구현
export default function speakWord(word, lang = 'en'){
    Speech.speak(word, {
        language:lang
    })
}
