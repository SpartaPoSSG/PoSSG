import { atom } from "recoil";
import { MyFolder, MyProjectFolder2 } from "./interfaces/Interfaces";

export const selectedFolderState = atom<MyFolder | null>({
  key: "selectedFolderState",
  default: null,
});

export const selectedSectorState = atom<MyProjectFolder2 | null>({
  key: "selectedSectorState",
  default: null,
});