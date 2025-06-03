import { create } from "zustand";

export type EditModalValues = {
  idx: number;
  weightsInKg: number;
  repetitions: number;
};
export const useEditModalStore = create<{
  editModalValues: EditModalValues | undefined;
  setEditModalValues: (values: EditModalValues | undefined) => void;
}>()((set) => ({
  editModalValues: undefined,
  setEditModalValues: (values) =>
    set((state) => ({ ...state, editModalValues: values })),
}));
