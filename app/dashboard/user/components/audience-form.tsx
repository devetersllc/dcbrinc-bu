"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  setAudience,
  setIsExplicitContent,
  setExplicitContentType,
} from "@/lib/features/data/detailSlice";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export default function AudienceForm() {
  const dispatch = useDispatch();
  const detail = useSelector((state: RootState) => state.detail);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Audience</h2>
          <p className="text-sm text-gray-600">
            Help readers find your Photo Book by assigning an Audience.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase font-semibold text-gray-700">
            Audience
          </label>
          <Select
            value={detail.audience}
            onValueChange={(value) => dispatch(setAudience(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general-trade">
                General/Trade - Adult fiction and nonfiction
              </SelectItem>
              <SelectItem value="children">Children</SelectItem>
              <SelectItem value="young-adult">Young Adult</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div
            className={`border-l-4 ${
              detail.isExplicitContent
                ? "border-l-green-500"
                : "border-l-transparent"
            }`}
          >
            <div className="p-4 flex justify-between items-start">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="explicit-content"
                  checked={detail.isExplicitContent}
                  onCheckedChange={(checked) =>
                    dispatch(setIsExplicitContent(checked as boolean))
                  }
                  className="mt-1"
                />
                <div>
                  <label
                    htmlFor="explicit-content"
                    className="font-medium cursor-pointer"
                  >
                    This Photo Book contains Explicit Content
                  </label>
                  <div>
                    <a
                      href="#"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Learn more about Explicit Content
                    </a>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-semibold text-gray-700">
                    Explicit Content Type
                  </label>
                  <Select
                    value={detail.explicitContentType}
                    onValueChange={(value) =>
                      dispatch(setExplicitContentType(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select explicit content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any-adult">
                        Any adult audience
                      </SelectItem>
                      <SelectItem value="mature">Mature themes</SelectItem>
                      <SelectItem value="violence">Violence</SelectItem>
                      <SelectItem value="sexual">Sexual content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
