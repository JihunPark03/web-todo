// Import the functions you need from the SDKs you need
import { timeStamp } from "console";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs , getDoc, doc, setDoc, Timestamp, deleteDoc, updateDoc} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//모든 할일 가져오기
export async function fetchTodos(){
    const querySnapshot = await getDocs(collection(db, "todos")); //"todos"<--collection name
    if (querySnapshot.empty){
        return [];
    }
    const fetchedTodos = [];
    querySnapshot.forEach((doc) => {

        console.log(doc.id, " => ", doc.data());

        const aTodo={
            id: doc.id,
            title: doc.data()["title"],
            is_done: doc.data()["is_done"],
            created_at: doc.data()["created_at"].toDate(),
        }
        //.toLocaleTimeString('ko')
        fetchedTodos.push(aTodo);
    });
    return fetchedTodos;
}

//할일 추가
export async function addATodos({title}){
    // Add a new document with a generated id
    const newTodoRef = doc(collection(db, "todos")); // 새로운 todo reference 가져옴

    const createAtTimestamp=Timestamp.fromDate(new Date())

    const newTodoData={
        id: newTodoRef.id,
        title: title,
        is_done: false,
        created_at: createAtTimestamp
    }
    await setDoc(newTodoRef, newTodoData);
    
    return {
        id: newTodoRef.id,
        title: title,
        is_done: false,
        created_at: createAtTimestamp.toDate(), 
    };
}

//단일 할일 조회
export async function fetchATodo(id){

    if (id === null){
        return null;
    }

    const tododocRef = doc(db, "todos", id);
    const tododocSnap = await getDoc(tododocRef);//유저 데이터 가져오기
    
    if (tododocSnap.exists()) {//데이터 존재시
        console.log("Document data:", tododocSnap.data());
        const fetchedTodo ={
        id: tododocSnap.id,
        title: tododocSnap.data()["title"],
        is_done: tododocSnap.data()["is_done"],
        created_at: tododocSnap.data()["created_at"].toDate(),
    }
      return fetchedTodo;
    } else {
      // docSnap.data() will be undefined in this case
        console.log("No such document!");
        return null;
    }

}

//단일 할일 삭제
export async function deleteATodo(id){

    // instead of just deleting, check if the file exist

    const fetchedTodo = await fetchATodo(id);

    if (fetchedTodo === null){
        return null;
    }

    await deleteDoc(doc(db, "todos", id));
    return fetchedTodo;
}


//단일 할일 수정
export async function editATodo(id, {title, is_done}){ // id는 변수로 받고 나머지는 json 파일로 받기

    const fetchedTodo = await fetchATodo(id);

    if (fetchedTodo === null){
        return null;
    }

    const todoRef = doc(db, "todos", id);
    
    await updateDoc(todoRef, {
      title: title,
      is_done: is_done
    });

    return {
        id: id,
        title: title,
        is_done: is_done,
        created_at: fetchATodo.created_at
    };
}

export default { fetchTodos, addATodos, fetchATodo, deleteATodo, editATodo}
