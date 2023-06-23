import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export default async function downLoadDb() {
  const database = SQLite.openDatabase("engVoca051.db")
  database._db.close()

  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }

  await FileSystem.downloadAsync(
    Asset.fromModule(require('./assets/EnKoWords.db')).uri,
    FileSystem.documentDirectory + 'SQLite/engVoca051.db'
  );

  return SQLite.openDatabase('engVoca051.db');
};