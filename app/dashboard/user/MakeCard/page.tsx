"use client";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useFieldsEmptyCheck } from "@/lib/hooks";
import { useDispatch } from "react-redux";
import { setActiveTab } from "@/lib/features/general/general";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  setAddress,
  setCompanyMessage,
  setCompanyName,
  setEmail,
  setImageUrl,
  setJobTitle,
  setName,
  setPhone,
  setWebsite,
} from "@/lib/features/data/makeCard";
import CardPreview from "./CardPreview";

export default function MakeCard() {
  const dispatch = useDispatch();
  const general = useSelector((state: RootState) => state.general);
  const makeCard = useSelector((state: RootState) => state.makeCard);
  useFieldsEmptyCheck(makeCard);

  const handleSubmit = () => {
    dispatch(setActiveTab(general.activeTab + 1));
  };

  return (
    <>
      <div className="bg-white w-full flex flex-wrap gap-[20px] mx-auto p-6 rounded-lg border-2 my-2">
        <div className="w-full xl:w-[calc(60%-10px)] p-4 rounded-lg border-2 flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label
                htmlFor="company-logo"
                className="text-xs font-semibold uppercase"
              >
                Company Logo
              </Label>
            </div>
            <Input
              type="file"
              id="company-logo"
              placeholder="Enter Company Logo"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  dispatch(setImageUrl({ file, previewUrl }));
                }
              }}
              className="border-gray-300"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="company-name"
                  className="text-xs font-semibold uppercase"
                >
                  Company Name
                </Label>
                <span className="text-xs text-gray-500">
                  {makeCard.companyName.length} / 50
                </span>
              </div>
              <Input
                id="company-name"
                value={makeCard.companyName}
                placeholder="Enter Company Name"
                onChange={(e) => dispatch(setCompanyName(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="company-name"
                  className="text-xs font-semibold uppercase"
                >
                  Company Message
                </Label>
                <span className="text-xs text-gray-500">
                  {makeCard.companyMessage.length} / 50
                </span>
              </div>
              <Input
                id="company-message"
                value={makeCard.companyMessage}
                placeholder="Enter Company Message"
                onChange={(e) => dispatch(setCompanyMessage(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase"
                >
                  Your Name
                </Label>
                <span className="text-xs text-gray-500">
                  {makeCard.companyName.length} / 50
                </span>
              </div>
              <Input
                id="name"
                value={makeCard.name}
                placeholder="Enter Your Name"
                onChange={(e) => dispatch(setName(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase"
                >
                  Your Email
                </Label>
              </div>
              <Input
                id="email"
                value={makeCard.email}
                placeholder="Enter Your Email"
                onChange={(e) => dispatch(setEmail(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="company-name"
                  className="text-xs font-semibold uppercase"
                >
                  Job Title
                </Label>
                <span className="text-xs text-gray-500">
                  {makeCard.jobTitle.length} / 50
                </span>
              </div>
              <Input
                id="job-title"
                value={makeCard.jobTitle}
                placeholder="Enter Job Title"
                onChange={(e) => dispatch(setJobTitle(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="website"
                  className="text-xs font-semibold uppercase"
                >
                  Website Url
                </Label>
                <span className="text-xs text-gray-500">
                  {makeCard.website?.length} / 50
                </span>
              </div>
              <Input
                id="website"
                value={makeCard.website}
                placeholder="Enter Website Url"
                onChange={(e) => dispatch(setWebsite(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="phone"
                  className="text-xs font-semibold uppercase"
                >
                  Phone
                </Label>
              </div>
              <Input
                id="phone"
                value={makeCard.phone}
                placeholder="Enter Your Phone"
                type="number"
                onChange={(e) => dispatch(setPhone(e.target.valueAsNumber))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="address"
                  className="text-xs font-semibold uppercase"
                >
                  Address
                </Label>
                <span className="text-xs text-gray-500">
                  {makeCard.address.length} / 50
                </span>
              </div>
              <Input
                id="address"
                value={makeCard.address}
                placeholder="Enter Company Address"
                onChange={(e) => dispatch(setAddress(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
          </div>
        </div>
        <CardPreview />
      </div>

      <Button
        disabled={general.areFieldsEmptyCheck}
        variant={"main"}
        size={"main"}
        className="w-full text-2xl"
        onClick={handleSubmit}
      >
        Review Card
      </Button>
    </>
  );
}
