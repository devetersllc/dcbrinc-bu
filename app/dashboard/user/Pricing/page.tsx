import { TabsContent } from "@/components/ui/tabs";
import RetailPriceForm from "./retail-price-form";
import PayeeManagement from "./payee-management";

export default function Pricing() {
  return (
    <>
      <RetailPriceForm />
      <PayeeManagement />
    </>
  );
}
