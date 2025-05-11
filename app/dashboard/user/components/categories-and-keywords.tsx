"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  setLuluCategory,
  setBisacMain,
  setBisacCategory2,
  setBisacCategory3,
  setKeywords,
} from "@/lib/features/data/detail";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function CategoriesAndKeywords() {
  const dispatch = useDispatch();
  const detail = useSelector((state: RootState) => state.detail);

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <h2 className="text-xl font-bold mb-6">Categories and Keywords</h2>

      <div className="space-y-6">
        <div>
          <Label
            htmlFor="lulu-category"
            className="text-xs font-semibold uppercase mb-2 block"
          >
            Lulu Bookstore Category
          </Label>
          <div className="relative">
            <Select
              value={detail.luluCategory}
              onValueChange={(value) => dispatch(setLuluCategory(value))}
            >
              <SelectTrigger
                id="lulu-category"
                className="w-full border-gray-300 bg-white"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiction">Fiction</SelectItem>
                <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                <SelectItem value="children">Children's Books</SelectItem>
                <SelectItem value="academic">Academic & Textbooks</SelectItem>
                <SelectItem value="art">Art & Photography</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <Link href="#" className="text-xs font-semibold text-blue-900">
              LEARN MORE ABOUT BISAC
            </Link>
          </div>
          <Label
            htmlFor="bisac-main"
            className="text-xs font-semibold uppercase mb-2 block"
          >
            BISAC Main Category
          </Label>
          <Input
            id="bisac-main"
            value={detail.bisacMain}
            onChange={(e) => dispatch(setBisacMain(e.target.value))}
            className="border-gray-300"
            placeholder="Start typing to find matching categories"
          />
          {!detail.bisacMain && (
            <div className="flex items-center gap-2 mt-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">
                At least one BISAC category is required
              </span>
            </div>
          )}
        </div>

        <div>
          <Label
            htmlFor="bisac-category-2"
            className="text-xs font-semibold uppercase mb-2 block"
          >
            BISAC Category 2 (Recommended)
          </Label>
          <Input
            id="bisac-category-2"
            value={detail.bisacCategory2}
            onChange={(e) => dispatch(setBisacCategory2(e.target.value))}
            className="border-gray-300"
            placeholder="Start typing to find matching categories"
          />
        </div>

        <div>
          <Label
            htmlFor="bisac-category-3"
            className="text-xs font-semibold uppercase mb-2 block"
          >
            BISAC Category 3 (Recommended)
          </Label>
          <Input
            id="bisac-category-3"
            value={detail.bisacCategory3}
            onChange={(e) => dispatch(setBisacCategory3(e.target.value))}
            className="border-gray-300"
            placeholder="Start typing to find matching categories"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label
              htmlFor="keywords"
              className="text-xs font-semibold uppercase"
            >
              Keywords
            </Label>
            <span className="text-xs text-gray-500">
              {detail.keywords.length} / 50
            </span>
          </div>
          <Input
            id="keywords"
            value={detail.keywords}
            onChange={(e) => dispatch(setKeywords(e.target.value))}
            className="border-gray-300"
            placeholder="Add keywords..."
            maxLength={50}
          />
          <div className="text-xs text-gray-500 mt-1">
            Separate keywords with a comma
          </div>
          {!detail.keywords && (
            <div className="flex items-center gap-2 mt-1 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">Please add at least one keyword</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
