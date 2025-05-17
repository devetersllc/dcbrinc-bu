import { TabsContent } from "@/components/ui/tabs";
import { ProjectDetails } from "./project-details";
import { CategoriesAndKeywords } from "./categories-and-keywords";
import AudienceForm from "./audience-form";

export default function Details() {
  return (
    <>
      <ProjectDetails />
      <CategoriesAndKeywords />
      <AudienceForm />
    </>
  );
}
