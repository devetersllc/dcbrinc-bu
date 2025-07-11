"use client";

import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  setIsbnOption,
  setOwnIsbnValue,
} from "@/lib/features/data/copyWriteSlice";

export default function ISBNSelection() {
  const dispatch = useDispatch();
  const copyWrite = useSelector((state: RootState) => state.copyWrite);

  const [expandedSections, setExpandedSections] = useState({
    freeIsbn: false,
    ownIsbn: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-bold">ISBN</h1>
          <p className="text-sm text-gray-600 max-w-md">
            The International Standard Book Number (ISBN) is a unique identifier
            for your book. If you select Global Distribution, an ISBN is
            required.
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-md p-4 flex gap-3">
          <Info className="h-6 w-6 text-purple-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-purple-900">ISBN Not Required</h4>
            <p className="text-sm text-purple-800">
              If you are only selling your book on the DCBRINC Bookstore, an ISBN
              is not required. You can add an ISBN at any time if you decide
              later to sell your book through retailers.
            </p>
          </div>
        </div>

        <RadioGroup
          value={copyWrite.isbnOption}
          onValueChange={(val) =>
            dispatch(
              setIsbnOption(val as "free-isbn" | "own-isbn" | "proceed-without")
            )
          }
          className="space-y-2"
        >
          {/* Free ISBN */}
          <div className="border rounded-md overflow-hidden">
            <div className="p-4 flex justify-between items-start">
              <div className="flex items-start gap-2">
                <RadioGroupItem
                  value="free-isbn"
                  id="free-isbn"
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="free-isbn" className="font-medium">
                    Use a free ISBN
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Use a free DCBRINC ISBN, with DCBRINC assigned as the publishing
                    imprint. Once your Photo Book is published and the proof
                    copy approved, the ISBN will never expire and remain
                    attached to your published Photo Book indefinitely.
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSection("freeIsbn")}
                className="bg-blue-500 text-white p-1 rounded-md"
              >
                {expandedSections.freeIsbn ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>
            {expandedSections.freeIsbn && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600">
                  By selecting this option, DCBRINC will be listed as the publisher
                  of your book.
                </p>
                <Button className="mt-3 bg-blue-600 hover:bg-blue-700">
                  Assign Free ISBN
                </Button>
              </div>
            )}
          </div>

          {/* Own ISBN */}
          <div className="border rounded-md overflow-hidden">
            <div className="p-4 flex justify-between items-start">
              <div className="flex items-start gap-2">
                <RadioGroupItem
                  value="own-isbn"
                  id="own-isbn"
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="own-isbn" className="font-medium">
                    I have my own ISBN
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Add a previously unused ISBN to your Photo Book
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSection("ownIsbn")}
                className="bg-blue-900 text-white p-1 rounded-md"
              >
                {expandedSections.ownIsbn ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>
            {(expandedSections.ownIsbn ||
              (copyWrite.isbnOption === "own-isbn") && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enter your ISBN
                      </label>
                      <Input
                        value={copyWrite.ownIsbnValue}
                        onChange={(e) =>
                          dispatch(setOwnIsbnValue(e.target.value))
                        }
                        placeholder="e.g., 9783161484100"
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter a valid 13-digit ISBN. Do not include hyphens or
                        spaces.
                      </p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Verify ISBN
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          {/* Proceed without ISBN */}
          <div className="border rounded-md p-4 flex items-start gap-2">
            <RadioGroupItem
              value="proceed-without"
              id="proceed-without"
              className="mt-1"
            />
            <Label htmlFor="proceed-without" className="font-medium">
              Proceed without ISBN
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
