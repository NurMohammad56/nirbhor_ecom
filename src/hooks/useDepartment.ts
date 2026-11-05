import { useLocation } from "@/lib/navigation";
import { useStore } from "@/providers/store-provider";
import {
  categoryForDepartment,
  departmentForLocation,
  experienceForDepartment,
} from "@/lib/departments";
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
