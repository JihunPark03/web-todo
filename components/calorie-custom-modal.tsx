"use client"

import {useState} from "react";
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {Input, Button,ModalHeader, ModalBody, ModalFooter, Switch, CircularProgress} from "@nextui-org/react";
import {CustomModalType, Calorie} from "@/types"



const CustomModal = ({focusedCalorie, modalType, onClose, onEdit, onDelete}: {
    focusedCalorie: Calorie, 
    modalType: CustomModalType, 
    onClose: () => void,
    onEdit: (id: string, breakfast: string, lunch: string, dinner: string, snack: string) => void
    onDelete: (id: string) => void,
}) => { /*인풋: 인풋 자료형*/

    //수정된 선택
    const [success, setSucess] = useState(focusedCalorie.succeed);

    //수정된 할일 입력
    const [editedBreakfastInput, setEditedBreakfastInput] = useState<string>(focusedCalorie.breakfast);//editedTodoInput는 원래 할일
    const [editedLunchInput, setEditedLunchInput] = useState<string>(focusedCalorie.lunch);
    const [editedDinnerInput, setEditedDinnerInput] = useState<string>(focusedCalorie.dinner);
    const [editedSnackInput, setEditedSnackInput] = useState<string>(focusedCalorie.snack);
    //로딩 상태
    const [isLoading, setIsLoading] = useState(false)

    const DetailModal = () =>{ 
    return (
    <>
        <ModalHeader className="flex flex-col gap-1">상세 보기</ModalHeader>
        <ModalBody>
            <p><span className="font-bold">id: </span>{focusedCalorie.id}</p>
            <p><span className="font-bold">날짜: </span>{`${focusedCalorie.date}`}</p>
            <p><span className="font-bold">아침 칼로리: </span>{focusedCalorie.breakfast}</p> 
            {/* <p><span className="font-bold">점심 칼로리: </span>{focusedCalorie.lunch}</p> 
            <p><span className="font-bold">저녁 칼로리: </span>{focusedCalorie.dinner}</p> 
            <p><span className="font-bold">간식 칼로리: </span>{focusedCalorie.snack}</p> 
            <p><span className="font-bold">총 칼로리: </span>{focusedCalorie.total}</p>  */}
            <div className="flex py-2 px-1 space-x-4">
                <span className="font-bold">목표 달성 여부: </span>
            {`${success ? '목표 달성':'목표 미달'}`} 
            </div>
        </ModalBody>    
        <ModalFooter>
            <Button color="primary" onPress={onClose}>{/*누르면 꺼짐*/}
            닫기
            </Button>
        </ModalFooter>
    </>           
    )
    }
    const EditModal = () =>{ 
    return (
        <>
            <ModalHeader className="flex flex-col gap-1">수정</ModalHeader>
            <ModalBody>
                {/* <p><span className="font-bold">id: </span>{focusedTodo.id}</p> */}
                {/* <p>입력된 할일:{editedTodoInput} 완료여부: {`${isDone}`}</p> */}
                <Input
                autoFocus
                label="내용: "
                placeholder="입력해주세요"
                variant="bordered"
                defaultValue={focusedCalorie.breakfast}
                value={editedBreakfastInput} //지금 내가 입력하고 있는 value 
                onValueChange={setEditedBreakfastInput} //value 가 변경이 되면
                />
                <div className="flex py-2 px-1 space-x -4"> {/*패딩*/}
                    <span className="font-bold">일: </span>
                    <p>{`${focusedCalorie.date}`}</p>
                </div>
            </ModalBody>    
            <ModalFooter>
                <Button color="danger" variant="flat" onPress={() => {
                    setIsLoading(true); //누르면 로딩표시
                    onEdit(focusedCalorie.id, editedBreakfastInput, editedLunchInput, editedDinnerInput, editedSnackInput )
                }}>
                {(isLoading)?<CircularProgress color="danger" aria-label="Loading..."/>:"수정"}
                </Button>
                <Button color="primary" onPress={onClose}>{/*누르면 꺼짐*/}
                닫기
                </Button>
            </ModalFooter>
        </>                                                       
    )
}
    const DeleteModal = () =>{ 
    return (
    <>
        <ModalHeader className="flex flex-col gap-1">할일 삭제</ModalHeader>
        <ModalBody>
            <p><span className="font-bold">id: </span>{focusedCalorie.id}</p> 
            <p><span className="font-bold">내용: </span>{focusedCalorie.breakfast}</p> 
            <div className="flex py-2 px-1 space-x -4"> {/*패딩*/}
                <span className="font-bold">일: </span>
                <p>{`${focusedCalorie.date}`}</p>
            </div>
        </ModalBody>    
        <ModalFooter>
                <Button color="danger" variant="flat" onPress={() => {
                    setIsLoading(true)
                    onDelete(focusedCalorie.id )
                }}>
                {(isLoading)? <CircularProgress 
                    size= "sm" 
                    color="warning" 
                    aria-label="Loading..."/>:"삭제"}
                </Button>
                <Button color="primary" onPress={onClose}>{/*누르면 꺼짐*/}
                닫기
                </Button>
            </ModalFooter>
    </>
    )
}

const getModal= (type: CustomModalType) => {
    switch (type){
        case 'detail':
            return DetailModal();
        case 'edit':
            return EditModal();
        case 'delete':
            return DeleteModal();
        default: break;
    }
}
return (
    <>
    {getModal(modalType)}
    </>
)

}

export default CustomModal; 
