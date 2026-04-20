import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';

// ── Trip CRUD ──────────────────────────────────────

const tripsCol = (userId) => collection(db, 'users', userId, 'trips');

export async function createTrip(userId, tripData) {
  const docRef = await addDoc(tripsCol(userId), {
    ...tripData,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...tripData };
}

export async function getTrips(userId) {
  const q = query(tripsCol(userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteTrip(userId, tripId) {
  await deleteDoc(doc(db, 'users', userId, 'trips', tripId));
}

export async function updateTrip(userId, tripId, data) {
  await updateDoc(doc(db, 'users', userId, 'trips', tripId), data);
}

// ── Expenses ───────────────────────────────────────

const expensesCol = (userId, tripId) =>
  collection(db, 'users', userId, 'trips', tripId, 'expenses');

export async function addExpense(userId, tripId, expense) {
  const docRef = await addDoc(expensesCol(userId, tripId), {
    ...expense,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...expense };
}

export async function getExpenses(userId, tripId) {
  const q = query(expensesCol(userId, tripId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteExpense(userId, tripId, expenseId) {
  await deleteDoc(
    doc(db, 'users', userId, 'trips', tripId, 'expenses', expenseId)
  );
}

// ── Itinerary ──────────────────────────────────────

const itineraryCol = (userId, tripId) =>
  collection(db, 'users', userId, 'trips', tripId, 'itinerary');

export async function addItineraryDay(userId, tripId, dayData) {
  const docRef = await addDoc(itineraryCol(userId, tripId), {
    ...dayData,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...dayData };
}

export async function getItinerary(userId, tripId) {
  const q = query(itineraryCol(userId, tripId), orderBy('day', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateItineraryDay(userId, tripId, dayId, data) {
  await updateDoc(
    doc(db, 'users', userId, 'trips', tripId, 'itinerary', dayId),
    data
  );
}

export async function deleteItineraryDay(userId, tripId, dayId) {
  await deleteDoc(
    doc(db, 'users', userId, 'trips', tripId, 'itinerary', dayId)
  );
}

// ── Documents ──────────────────────────────────────

const documentsCol = (userId, tripId) =>
  collection(db, 'users', userId, 'trips', tripId, 'documents');

export async function uploadDocument(userId, tripId, file) {
  const storageRef = ref(
    storage,
    `users/${userId}/trips/${tripId}/documents/${Date.now()}_${file.name}`
  );
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);

  const docRef = await addDoc(documentsCol(userId, tripId), {
    name: file.name,
    url,
    storagePath: snapshot.ref.fullPath,
    size: file.size,
    type: file.type,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    name: file.name,
    url,
    storagePath: snapshot.ref.fullPath,
    size: file.size,
    type: file.type,
  };
}

export async function getDocuments(userId, tripId) {
  const q = query(documentsCol(userId, tripId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteDocument(userId, tripId, docId, storagePath) {
  await deleteObject(ref(storage, storagePath));
  await deleteDoc(
    doc(db, 'users', userId, 'trips', tripId, 'documents', docId)
  );
}
