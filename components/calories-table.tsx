"use client"

import {useState} from "react";
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, Spinner, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from "@nextui-org/react";
import {FocusedCalorieType, CustomModalType, Calorie} from "@/types"
import {useRouter} from "next/navigation"
import {VerticalDotsIcon} from "./icons"
import { PressEvent } from "@react-types/shared";
import CustomModal from "./calorie-custom-modal";

const CaloriesTable = ({calories}:{calories: Calorie[]}) => {

  //할일 추가 가능 여부
  const [calorieAddEnable, setCalorieAddEnable] = useState(false);

  //입력된 할일
  const [newcalorieInput, setNewCalorieInput] = useState('');

  //로딩상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //띄우는 모달 상태
  const [currentModalData, setCurrentModalData] =useState<FocusedCalorieType>({
    focusedCalorie: null,
    modalType: 'detail' as CustomModalType
  })

  const router=useRouter();

  //칼로리를 추가했을 때
  //작동
  const addACalorieHandler = async (calorie: string) => {
    if(!calorieAddEnable){return}
    {/*addtodogandler 성공했을 때 */}

    setCalorieAddEnable(false);
    setIsLoading(true);

    await new Promise (f => setTimeout(f,600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/calories`,{
      method:'post',
      body:JSON.stringify({
        calorie:calorie
      }), 
      cache:'no-store'
    });
    setNewCalorieInput(''); 
    router.refresh();
    setIsLoading(false);
    notifyaddSuccessEvent();
    console.log(`칼로리 추가완료 : ${newcalorieInput}`);
  };

//칼로리 수정
  const editACalorieHandler = async (
    id: string, 
    editedBreakfast: string,
    editedLunch: string,
    editedDinner: string,
    editedSnack: string,
  ) => {

    setIsLoading(true);

    await new Promise (f => setTimeout(f,600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/calories/${id}`,{
      method:'post',
      body:JSON.stringify({
        breakfast: editedBreakfast,
        lunch: editedLunch,
        dinner: editedDinner,
        snack: editedSnack
      }), 
      cache:'no-store'
    });
    router.refresh();
    setIsLoading(false);
    notifyeditSuccessEvent();
    console.log(`데이터 수정완료 : ${newcalorieInput}`);
  };

//해달 일 삭제
  const deleteACalorieHandler = async (
    id: string, 
  ) => {

    setIsLoading(true);

    await new Promise (f => setTimeout(f,600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/calories/${id}`,{
      method:'delete',
      cache:'no-store'
    });
    router.refresh();
    setIsLoading(false);
    notifydeleteSuccessEvent();
    console.log(`데이터 삭제완료 : ${newcalorieInput}`);
  };

  //const checkIsDoneUI = (succeed: boolean) => (succeed ? "line-through text-gray-900/50 dark:text-white/40" : "")

  const checkSuccessUI = (succeed: boolean) => (succeed ? "text-green-500": "text-red-500")

  const TodoRow = (aCalorie: Calorie) => {
    return <TableRow key={aCalorie.id}>
      <TableCell>{`${aCalorie.date}`}</TableCell>
      <TableCell>{aCalorie.breakfast}</TableCell>
      <TableCell>{aCalorie.lunch}</TableCell>
      <TableCell>{aCalorie.dinner}</TableCell>
      <TableCell>{aCalorie.snack}</TableCell>
      <TableCell>{aCalorie.total}</TableCell>
      <TableCell className= {checkSuccessUI(aCalorie.succeed)}>{aCalorie.succeed ? "목표 달성":"목표 미달"}</TableCell>
      <TableCell>
      <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu onAction={(key)=>{
                console.log(`aCalorie.id : ${aCalorie.id}/ key: ${key}`);
                setCurrentModalData({
                  focusedCalorie: aCalorie,
                  modalType: key as CustomModalType
                })
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
            (currentModalData.focusedCalorie && <CustomModal 
            focusedCalorie={currentModalData.focusedCalorie}
            modalType={currentModalData.modalType}
            onClose={onClose}//창 닫기
            onEdit={async (id, breakfast, lunch, dinner, snack) => {//수정 되었을 때
                    await editACalorieHandler(id, breakfast, lunch, dinner, snack);
                    onClose();
                  }}
            onDelete={
              async (id) => {
                await deleteACalorieHandler(id)
                onClose();
              }}
            />)
          )}
        </ModalContent>
      </Modal>
    )
  }
  const notifydeleteSuccessEvent = () => toast("삭제 성공");
  const notifyeditSuccessEvent = () => toast("수정 성공");
  const notifyaddSuccessEvent = () => toast("추가 성공");
  return (
    <>
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      {/* {ModalComponent()} */}
      <ToastContainer/>{/*알림 파트*/}
      <Input type="text" label="새로운 할일" 
      value={newcalorieInput}
      onValueChange={(changedInput) => {
        setNewCalorieInput (changedInput);
        setCalorieAddEnable(changedInput.length >0);
      }}/>
      {calorieAddEnable?
        <Button color="warning" className="h-14"
          onPress={async () => {
            await addACalorieHandler(newcalorieInput)
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
        <TableColumn>일시</TableColumn>
        <TableColumn>아침</TableColumn>
        <TableColumn>점심</TableColumn>
        <TableColumn>저녁</TableColumn>
        <TableColumn>간식</TableColumn>
        <TableColumn>총합</TableColumn>
        <TableColumn>목표 달성 여부</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"보여줄 데이터가 없습니다"}>
        {calories && calories.map((aCalorie: Calorie) =>( // Todo가 type
          TodoRow(aCalorie) //row action
        ))}

      </TableBody>
    </Table>
    </>
  );

}

export default CaloriesTable
