// sync-players.mjs — Sincronizador de fotos a Firebase Storage + Firestore
// Uso: node scripts/sync-players.mjs
console.log('Iniciando script de sincronizacion...');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Timeout de seguridad: si algo se cuelga, salimos en 60s
setTimeout(() => {
  console.error('TIMEOUT: El script tardo demasiado. Saliendo...');
  process.exit(1);
}, 60000);

// ═══ Leer .env manualmente ═══
const envPath = path.resolve(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('ERROR: No se encontro el archivo .env en:', envPath);
  process.exit(1);
}
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let val = trimmed.slice(eqIdx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

console.log('Variables de entorno leidas OK');
console.log('Proyecto:', env.VITE_FIREBASE_PROJECT_ID);
console.log('Bucket:', env.VITE_FIREBASE_STORAGE_BUCKET);

// ═══ Firebase Init ═══
console.log('Cargando Firebase SDK...');

let initializeApp, getFirestore, doc2, updateDoc, getDoc, setDoc;
let getStorage, ref2, uploadBytes, getDownloadURL;

try {
  const appMod = await import('firebase/app');
  initializeApp = appMod.initializeApp;
  
  const fsMod = await import('firebase/firestore');
  doc2 = fsMod.doc;
  updateDoc = fsMod.updateDoc;
  getDoc = fsMod.getDoc;
  setDoc = fsMod.setDoc;
  getFirestore = fsMod.getFirestore;
  
  const stMod = await import('firebase/storage');
  getStorage = stMod.getStorage;
  ref2 = stMod.ref;
  uploadBytes = stMod.uploadBytes;
  getDownloadURL = stMod.getDownloadURL;
  
  console.log('Firebase SDK cargado OK');
} catch (err) {
  console.error('ERROR cargando Firebase SDK:', err.message);
  process.exit(1);
}

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
console.log('Firebase inicializado OK');

// ═══ Escanear fotos ═══
const playersDir = path.resolve(__dirname, '../public/players');
if (!fs.existsSync(playersDir)) {
  console.error('ERROR: No existe la carpeta:', playersDir);
  process.exit(1);
}

const allFiles = fs.readdirSync(playersDir);
const imageFiles = allFiles.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
console.log(`Encontradas ${imageFiles.length} imagenes en public/players/`);

if (imageFiles.length === 0) {
  console.log('No hay imagenes para sincronizar.');
  process.exit(0);
}

// ═══ Subir cada imagen ═══
const photoUpdates = {};
let ok = 0;
let fail = 0;

for (const file of imageFiles) {
  const idStr = path.parse(file).name;
  const id = parseInt(idStr);
  if (isNaN(id)) {
    console.warn(`Saltando: ${file} (nombre no numerico)`);
    continue;
  }

  const filePath = path.join(playersDir, file);
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(file).toLowerCase();
  const mimeMap = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
  const contentType = mimeMap[ext] || 'image/png';

  const storageRef = ref2(storage, `player_photos/${file}`);

  try {
    console.log(`Subiendo ${file} (${(fileBuffer.length / 1024).toFixed(0)} KB)...`);
    await uploadBytes(storageRef, fileBuffer, { contentType });
    const url = await getDownloadURL(storageRef);
    photoUpdates[`${id}_photo`] = url;
    ok++;
    console.log(`  -> OK`);
  } catch (err) {
    fail++;
    console.error(`  -> ERROR: ${err.code || err.message}`);
    if (err.code === 'storage/unauthorized') {
      console.error('');
      console.error('*** Firebase Storage necesita reglas de acceso. ***');
      console.error('Ve a: https://console.firebase.google.com/project/vendetta-games/storage/rules');
      console.error('Y pon: allow read, write: if true;');
      console.error('');
    }
  }
}

console.log('');
console.log(`Resumen: ${ok} subidas exitosas, ${fail} errores`);

// ═══ Guardar URLs en Firestore ═══
if (Object.keys(photoUpdates).length > 0) {
  console.log('Actualizando Firestore con las URLs...');
  try {
    const docRef = doc2(db, 'state', 'gameState');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, photoUpdates);
    } else {
      const initial = {};
      for (let i = 0; i <= 59; i++) initial[i] = true;
      await setDoc(docRef, { ...initial, ...photoUpdates });
    }
    console.log('Firestore actualizado OK');
  } catch (err) {
    console.error('ERROR actualizando Firestore:', err.message);
  }
}

console.log('');
console.log('=== Sincronizacion completada ===');
process.exit(0);
