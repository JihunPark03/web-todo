"use client"

import {useState} from "react";
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Spinner, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from "@nextui-org/react";
import {FocusedTodoType, CustomModalType, Todo} from "@/types"
import {useRouter} from "next/navigation"
import {VerticalDotsIcon} from "./icons"
import { PressEvent } from "@react-types/shared";
import CustomModal from "./custom-modal";

const TodosTable = ({todos}:{todos: Todo[]}) => {

  //할일 추가 가능 여부
  const [todoAddEnable, setTodoAddEnable] = useState(false);

  //입력된 할일
  const [newtodoInput, setNewTodoInput] = useState('');

  //로딩상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //띄우는 모달 상태
  const [currentModalData, setCurrentModalData] =useState<FocusedTodoType>({
    focusedTodo: null,
    modalType: 'detail' as CustomModalType
  })

  const router=useRouter();

  const addATodoHandler = async (title: string) => {
    if(!todoAddEnable){return}
    {/*addtodogandler 성공했을 때 */}

    setTodoAddEnable(false);
    setIsLoading(true);

    await new Promise (f => setTimeout(f,600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos`,{
      method:'post',
      body:JSON.stringify({
        title:title
      }), 
      cache:'no-store'
    });
    setNewTodoInput(''); 
    router.refresh();
    setIsLoading(false);
    notifyaddSuccessEvent();
    console.log(`할일 추가완료 : ${newtodoInput}`);
  };


  const editATodoHandler = async (
    id: string, 
    editedTitle: string, 
    editedIsDone: boolean
  ) => {

    setIsLoading(true);

    await new Promise (f => setTimeout(f,600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`,{
      method:'post',
      body:JSON.stringify({
        title: editedTitle,
        is_done: editedIsDone
      }), 
      cache:'no-store'
    });
    router.refresh();
    setIsLoading(false);
    notifyeditSuccessEvent();
    console.log(`할일 수정완료 : ${newtodoInput}`);
  };


  const deleteATodoHandler = async (
    id: string, 
  ) => {

    setIsLoading(true);

    await new Promise (f => setTimeout(f,600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`,{
      method:'delete',
      cache:'no-store'
    });
    router.refresh();
    setIsLoading(false);
    notifydeleteSuccessEvent();
    console.log(`할일 삭제완료 : ${newtodoInput}`);
  };


  const TodoRow = (aTodo: Todo) => {
    return <TableRow key={aTodo.id}>
      <TableCell>{aTodo.title}</TableCell>
      <TableCell>{aTodo.is_done ? "완료":"미완료"}</TableCell>
      <TableCell>{`${aTodo.created_at}`}</TableCell>
      <TableCell>
      <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={(key)=>{
                console.log(`aTodo.id : ${aTodo.id}/ key: ${key}`);
                setCurrentModalData({focusedTodo:aTodo,modalType: key as CustomModalType})
                onOpen();
              }}>
                <DropdownItem key = "detail">View</DropdownItem>
                <DropdownItem key = "edit">Edit</DropdownItem>
                <DropdownItem key = "delete">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
      </TableCell>
    </TableRow>
  }

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const ModalComponent = () => {
    return (
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose: () => void) => (
            (currentModalData.focusedTodo && <CustomModal 
            focusedTodo={currentModalData.focusedTodo}
            modalType={currentModalData.modalType}
            onClose={onClose}
            onEdit={async (id, title, isDone) => {//수정 되었을 때
                    await editATodoHandler(id, title, isDone);
                    onClose();
                    console.log(id,title,isDone)
                  }}
            onDelete={
              async (id) => {
                await deleteATodoHandler(id)
                onClose();
              }}
            />)
          )}
        </ModalContent>
      </Modal>
    )
  }
  const notifydeleteSuccessEvent = () => toast("할일 삭제 성공");
  const notifyeditSuccessEvent = () => toast("할일 수정 성공");
  const notifyaddSuccessEvent = () => toast("할일 추가 성공");
  return (
    <>
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      {ModalComponent()}
      <ToastContainer/>{/*알림 파트*/}
      <Input type="text" label="새로운 할일" 
      value={newtodoInput}
      onValueChange={(changedInput) => {
        setNewTodoInput (changedInput);
        setTodoAddEnable(changedInput.length >0);
      }}/>
      {todoAddEnable?
        <Button color="warning" className="h-14"
          onPress={async () => {
            await addATodoHandler(newtodoInput)
          }}>
          추가
        </Button>:      
        <Button color="default" className="h-14">
          추가
        </Button>
      }

    </div>
    {isLoading && <Spinner color="warning"/>}
    <Table aria-label="Example static collection table">
      <TableHeader> 
        <TableColumn>할일내용</TableColumn>
        <TableColumn>완료여부</TableColumn>
        <TableColumn>생성일</TableColumn>
        <TableColumn>액션</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"보여줄 데이터가 없습니다"}>
        {todos && todos.map((aTodo: Todo) =>( // Todo가 type
          TodoRow(aTodo) //row action
        ))}

      </TableBody>
    </Table>
    </>
  );

}

export default TodosTable