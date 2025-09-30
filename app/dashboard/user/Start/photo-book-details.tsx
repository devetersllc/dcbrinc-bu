"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useDispatch } from "react-redux";
import {
  setBookCategory,
  setBookLanguage,
  setProjectTitle,
  StartPageState,
} from "@/lib/features/data/startPageSlice";

export function PhotoBookDetails() {
  const startPage = useSelector((state: RootState) => state.startPage);
  const dispatch = useDispatch();

  const [category, setCategory] = useState("Fiction");

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="bg-white p- rounded-lg mb-4">
        <h1 className="text-xl font-bold mb-6">Book Details</h1>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label
                htmlFor="project-title"
                className="text-xs font-semibold uppercase"
              >
                Project Title
              </Label>
              <span className="text-xs text-gray-500">
                {startPage.projectTitle.length} / 255
              </span>
            </div>
            <Input
              id="project-title"
              value={startPage.projectTitle}
              placeholder="Enter Project Title"
              onChange={(e) => dispatch(setProjectTitle(e.target.value))}
              className="border-gray-300"
              maxLength={255}
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Label
                htmlFor="book-language"
                className="text-xs font-semibold uppercase"
              >
                Book Language
              </Label>
              <div className="ml-2 text-purple-600">
                <InfoIcon size={16} />
              </div>
            </div>
            <Select
              value={startPage.bookLanguage}
              onValueChange={(e: StartPageState["bookLanguage"]) => {
                dispatch(setBookLanguage(e));
              }}
            >
              <SelectTrigger id="book-language" className="border-gray-300">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Akkadian">Akkadian</SelectItem>
                <SelectItem value="Amharic">Amharic</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="book-category"
              className="text-xs font-semibold uppercase mb-2 block"
            >
              Book Category
            </Label>
            <Select
              value={startPage.bookCategory}
              onValueChange={(e: StartPageState["bookCategory"]) => {
                dispatch(setBookCategory(e));
              }}
            >
              <SelectTrigger id="book-category" className="border-gray-300">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                <SelectItem value="Fiction">Fiction</SelectItem>
                <SelectItem value="Art & Photography">
                  Art & Photography
                </SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Cookbook">Cookbook</SelectItem>
                <SelectItem value="Biography">Biography</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
