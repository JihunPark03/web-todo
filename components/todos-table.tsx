"use client"

import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button} from "@nextui-org/react";
import {Todo} from "@/types"

const TodosTable = ({todos}:{todos: Todo[]}) => {

  const TodoRow = (aTodo: Todo) => {
    return <TableRow key={aTodo.id}>
      <TableCell>{aTodo.id.slice(0,4)}</TableCell>
      <TableCell>{aTodo.title}</TableCell>
      <TableCell>{aTodo.is_done ? "완료":"미완료"}</TableCell>
      <TableCell>{`${aTodo.created_at}`}</TableCell>
    </TableRow>
  }

  return (
    <>
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input type="text" label="새로운 할일" />
      <Button color="warning" className="h-14">
        추가
      </Button>
    </div>

    <Table aria-label="Example static collection table">
      <TableHeader> 
        <TableColumn>아이디</TableColumn>
        <TableColumn>할일내용</TableColumn>
        <TableColumn>완료여부</TableColumn>
        <TableColumn>생성일</TableColumn>
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