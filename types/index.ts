import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Todo = { //미리 정한 json 배열
  id:string;
  title: string;
  is_done: boolean;
  created_at: Date;
}

export type CustomModalType = 'detail' | 'edit' | 'delete'

export type FocusedTodoType = {
    focusedTodo: Todo | null,
    modalType: CustomModalType
}

export type Calorie = {
  id: string;
  date: Date;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  total: number;
  succeed: boolean;
}

export type FocusedCalorieType = {
  focusedCalorie: Calorie | null,
  modalType: CustomModalType
}
