"use client";
import {useParams,useLocation,Navigate} from '@/lib/navigation';
import {useStore} from '@/providers/store-provider';
import {departmentForProduct,productHref} from '@/lib/departments';
import ProductPage from './Product';
export default function ScopedProduct({
  department,
  campaignMode = false,
}: {
  department: string;
  campaignMode?: boolean;
}) {
  const { id } = useParams();
  const { products, categories } = useStore();
  const location = useLocation();
  const p = products.find((p) => p.id === id);
  const actual = p ? departmentForProduct(p, categories) : undefined;
  if (p && actual && actual.slug !== department)
    return (
      <Navigate
        to={productHref(p, categories) + location.search + location.hash}
        replace
      />
    );
  return <ProductPage campaignMode={campaignMode} />;
}
