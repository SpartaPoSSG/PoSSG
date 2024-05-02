import { atom } from "recoil";

// 폴더 수정 모드
export const editState = atom<boolean>({
    key: "editState",
    default: false,
  });