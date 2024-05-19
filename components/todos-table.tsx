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
    setIsLoading(true);

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
    notify();
    console.log(`할일 추가완료 : ${newtodoInput}`);
  };

  const TodoRow = (aTodo: Todo) => {
    return <TableRow key={aTodo.id}>
      <TableCell>{aTodo.id.slice(0,4)}</TableCell>
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
                <DropdownItem key = "update">Edit</DropdownItem>
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
    <div>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose: ((e: PressEvent) => void) | undefined) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{currentModalData.modalType}</ModalHeader>
              <ModalBody>
                <p> 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                  dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. 
                  Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. 
                  Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur 
                  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
    )
  }

  const notify = () => toast("할일 추가 성공");
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
        <TableColumn>아이디</TableColumn>
        <TableColumn>할일내용</TableColumn>
        <TableColumn>완료여부</TableColumn>
        <TableColumn>생성일</TableColumn>
        <TableColumn>액션</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"보여줄 데이터가 없습니다"}>
        {todos && todos.map((aTodo: Todo) =>( // Todo가 type
          TodoRow(aTodo)
        ))}

      </TableBody>
    </Table>
    </>
  );

}

export default TodosTable