import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export default async function downLoadDb() {
  const database = SQLite.openDatabase("engVoca051.db")
  database._db.close()

  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }//SQLite폴더 존재하지 않으면 폴더 생성

  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/engVoca051.db')).exists){
    await FileSystem.downloadAsync(
      Asset.fromModule(require('./assets/EnKoWords.db')).uri,
      FileSystem.documentDirectory + 'SQLite/engVoca051.db'
    );
  }//db파일 없으면 새로 다운로드

  return SQLite.openDatabase('engVoca051.db');
};