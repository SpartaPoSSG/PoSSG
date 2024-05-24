import { atom } from "recoil";
import { MyFolder } from "./interfaces/Interfaces";

export const selectedFolderState = atom<MyFolder | null>({
  key: "selectedFolderState",
  default: null,
});