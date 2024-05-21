"use client"

import {useState} from "react";
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {Input, Button,ModalHeader, ModalBody, ModalFooter, Switch, CircularProgress} from "@nextui-org/react";
import {CustomModalType, Todo} from "@/types"



const CustomModal = ({focusedTodo, modalType, onClose, onEdit, onDelete}: {
    focusedTodo: Todo, 
    modalType: CustomModalType, 
    onClose: () => void,
    onEdit: (id: string, title: string, isDone: boolean) => void
    onDelete: (id: string) => void,
}) => { /*인풋: 인풋 자료형*/

    //수정된 선택
    const [isDone, setIsDone] = useState(focusedTodo.is_done);

    //수정된 할일 입력
    const [editedTodoInput, setEditedTodoInput] = useState<string>(focusedTodo.title);//editedTodoInput는 원래 할일

    //로딩 상태
    const [isLoading, setIsLoading] = useState(false)

    const DetailModal = () =>{ 
    return (
    <>
        <ModalHeader className="flex flex-col gap-1">할일 상세</ModalHeader>
        <ModalBody>
            <p><span className="font-bold">id: </span>{focusedTodo.id}</p> 
            <p><span className="font-bold">할일 내용: </span>{focusedTodo.title}</p> 
            <div className="flex py-2 px-1 space-x-4">
                <span className="font-bold">완료 여부: </span>
            {`${isDone ? '완료':'미완료'}`} 
            </div>
            <div className="flex py-2 px-1 space-x -4"> {/*패딩*/}
                <span className="font-bold">작성일: </span>
                <p>{`${focusedTodo.created_at}`}</p>
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
            <ModalHeader className="flex flex-col gap-1">할일 수정</ModalHeader>
            <ModalBody>
                {/* <p><span className="font-bold">id: </span>{focusedTodo.id}</p> */}
                {/* <p>입력된 할일:{editedTodoInput} 완료여부: {`${isDone}`}</p> */}
                <Input
                autoFocus
                label="할일 내용: "
                placeholder="할일을 입력해주세요"
                variant="bordered"
                isRequired
                defaultValue={focusedTodo.title}
                value={editedTodoInput} //지금 내가 입력하고 있는 value 
                onValueChange={setEditedTodoInput} //value 가 변경이 되면
                />
                <div className="flex py-2 px-1 space-x-4">
                    <span className="font-bold">완료 여부: </span>
                    <Switch defaultSelected={focusedTodo.is_done} 
                        onValueChange={setIsDone}
                        aria-label="Automatic updates"
                        color="warning">
                    </Switch>
                {`${isDone ? '완료':'미완료'}`} 
                </div>
                <div className="flex py-2 px-1 space-x -4"> {/*패딩*/}
                    <span className="font-bold">작성일: </span>
                    <p>{`${focusedTodo.created_at}`}</p>
                </div>
            </ModalBody>    
            <ModalFooter>
                <Button color="danger" variant="flat" onPress={() => {
                    setIsLoading(true); //누르면 로딩표시
                    onEdit(focusedTodo.id, editedTodoInput, isDone )
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
            <p><span className="font-bold">id: </span>{focusedTodo.id}</p> 
            <p><span className="font-bold">할일 내용: </span>{focusedTodo.title}</p> 
            <div className="flex py-2 px-1 space-x-4">
                <span className="font-bold">완료 여부: </span>
            {`${isDone ? '완료':'미완료'}`} 
            </div>
            <div className="flex py-2 px-1 space-x -4"> {/*패딩*/}
                <span className="font-bold">작성일: </span>
                <p>{`${focusedTodo.created_at}`}</p>
            </div>
        </ModalBody>    
        <ModalFooter>
                <Button color="danger" variant="flat" onPress={() => {
                    setIsLoading(true)
                    onDelete(focusedTodo.id )
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