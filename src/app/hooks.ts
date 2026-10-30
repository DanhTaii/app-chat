import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
// gui yeu cau cap nhat state
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
// doc state
export const useAppSelector = useSelector.withTypes<RootState>();
