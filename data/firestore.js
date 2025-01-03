// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp} from "firebase/app";
import { getFirestore, collection, getDocs , getDoc, doc, setDoc, Timestamp, deleteDoc, updateDoc, orderBy, query} from "firebase/firestore";

//todo-list
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
};

//calorie-tracker
const firebase2Config = {
    apiKey: process.env.API_KEY_2,
    authDomain: process.env.AUTH_DOMAIN_2,
    projectId: process.env.PROJECT_ID_2,
    storageBucket: process.env.STORAGE_BUCKET_2,
    messagingSenderId: process.env.MESSAGING_SENDER_ID_2,
    appId: process.env.APP_ID_2,
};
// Initialize Firebase
const app = !getApps().find((a) => a.name === "[DEFAULT]") ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const app_2 = !getApps().find((a) => a.name === "SECONDARY") ? initializeApp(firebase2Config, "SECONDARY") : getApp("SECONDARY");
const db_2 = getFirestore(app_2);

//모든 할일 가져오기
export async function fetchTodos(){
    const todosRef = collection(db, "todos"); //"todos"<--collection name
    const descQuery = query (todosRef, orderBy("created_at", "desc"));

    const querySnapshot = await getDocs(descQuery); 
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
            created_at: doc.data()["created_at"].toDate().toISOString().split('T')[0],
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
    }
    else {
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

//firebase의 컬렉션의 모든 문서 가져오기 참고
//칼로리 전부 다 가져오기
export async function fetchCalories(){
    const caloriesRef = collection(db_2, "calories");
    const descQuery = query(caloriesRef, orderBy("date", "desc"));

    const querySnapshot = await getDocs(descQuery);
    if (querySnapshot.empty){
        return [];
    }
    const fetchedCalories = [];//빈 배열 만들기
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
            const aCalorie = {
                id: doc.id,
                date: doc.data()["date"],
                breakfast: doc.data()["breakfast"],
                lunch: doc.data()["lunch"],
                dinner: doc.data()["dinner"],
                snack: doc.data()["snack"],
                total: doc.data()["total"],
                succeed: doc.data()["succeed"],
            }
        fetchedCalories.push(aCalorie);
    });
    return fetchedCalories;
}

//칼로리 추가
export async function addACalories({calorie}){
    const newCalorieRef = doc(collection(db_2, "calories"));

    const timestamp = Timestamp.fromDate(new Date())
    const date = timestamp.toDate();
    const hour = timestamp.toDate().getHours()

    const newCalorieData={
        id: newCalorieRef.id,
        date: date.toISOString().split('T')[0],
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snack: 0,
        total: 0,
        succeed: false
    }

    if (hour >= 6 && hour <= 10) {
        newCalorieData.breakfast = calorie
    }
    else if (hour >= 10 && hour <= 13) {
        newCalorieData.lunch = calorie
    }
    else if (hour >= 17 && hour <= 21) {
        newCalorieData.dinner = calorie
    }
    else{
        newCalorieData.snack = calorie
    }

    newCalorieData.total = newCalorieData.breakfast + 
    newCalorieData.lunch + newCalorieData.dinner +
    newCalorieData.snack;

    newCalorieData.succeed = newCalorieData.total > 2500;

    await setDoc(newCalorieRef, newCalorieData);

    return newCalorieData;
}

//한 날짜의 칼로리 가져오기
//데이터베이스에서 해당 아이디의 정보를 가져오는 함수
export async function fetchACalorie(id){

    if (id === null){
        return null;
    }

    const caloriedocRef = doc(db_2, "calories", id);
    const caloriedocSnap = await getDoc(caloriedocRef);//docs의 모음

    if(caloriedocSnap.exists()){
        const fetchedCalorie = {
            id : caloriedocSnap.id,
            date: caloriedocSnap.data()["date"],
            breakfast: caloriedocSnap.data()["breakfast"],
            lunch: caloriedocSnap.data()["lunch"],
            dinner: caloriedocSnap.data()["dinner"],
            snack: caloriedocSnap.data()["snack"],
            total: caloriedocSnap.data()["total"],
            succeed: caloriedocSnap.data()["succeed"],
        }
        return fetchedCalorie;
    }
    else{
        console.log("No such document!");
        return null;
    }
}

//해당 날짜의 내용 삭제
export async function deleteACalorie(id){
    const fetchedCalorie = await fetchACalorie(id);

    if (fetchedCalorie === null){
        return null;
    }

    await deleteDoc(doc(db_2, "calories", id));
    return fetchedCalorie;
}

//해당 날짜의 칼로리 수정
//id 뒤의 {} 안에 있는 매계변수들은 json형태로 받는다
export async function editACalorie(id, {breakfast, lunch, dinner, snack}){
    const fetchedCalorie = await fetchACalorie(id);

    if (fetchedCalorie === null){
        return null;
    }

    const calorieRef = doc(db_2, "calories", id);

    const total = breakfast + lunch + dinner + snack;

    const succeed = total > 2500

    await updateDoc(calorieRef, {
        breakfast: breakfast,
        lunch: lunch,
        dinner: dinner,
        snack: snack,
        total: total,
        succeed: succeed
    });

    return{
        id: id,
        date: fetchedCalorie.date,
        breakfast: breakfast,
        lunch: lunch,
        dinner: dinner,
        snack: snack,
        total: total,
        succeed: succeed
    }
}

export default { fetchTodos, addATodos, fetchATodo, deleteATodo, editATodo, fetchCalories, addACalories, fetchACalorie, deleteACalorie, editACalorie}
