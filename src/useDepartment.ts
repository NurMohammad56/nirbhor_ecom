import { useLocation } from "react-router-dom";
import { useStore } from "./store";
import {
  categoryForDepartment,
  departmentForLocation,
  experienceForDepartment,
} from "./departments";
export function useDepartment() {
  const { pathname, search } = useLocation();
  const { products, categories } = useStore();
  const department = departmentForLocation(
    pathname,
    search,
    products,
    categories,
  );
  return {
    department,
    category: department
      ? categoryForDepartment(department, categories)
      : undefined,
    experience: department
      ? experienceForDepartment(department, categories)
      : undefined,
  };
}
