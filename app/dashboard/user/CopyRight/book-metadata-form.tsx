"use client";

import {
  setTitle,
  setSubtitle,
  setEdition,
  setEditionStatement,
  addContributor,
  removeContributor,
  updateContributor,
} from "@/lib/features/data/copyWriteSlice";

import { GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function BookMetadataForm() {
  const dispatch = useDispatch();
  const copyWrite = useSelector((state: RootState) => state.copyWrite);

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="space-y-6">
        {/* Title and Edition Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-bold mb-6">Title and Edition</h1>

            <div className="max-w-md">
              <p className="text-sm text-gray-600">
                Enter additional title and edition information for your Photo
                Book.
              </p>
              <a href="#" className="text-[#1B463C] text-sm hover:underline">
                Learn more about Editions
              </a>
            </div>
          </div>

          {/* Title Field */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs uppercase font-semibold text-gray-700">
                Title
              </label>
              <span className="text-xs text-gray-500">
                {copyWrite.title.length} / 222
              </span>
            </div>
            <Input
              placeholder="Enter Your Book Title"
              value={copyWrite.title}
              onChange={(e) => dispatch(setTitle(e.target.value))}
              maxLength={222}
              className="w-full"
            />
          </div>

          {/* Subtitle Field */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs uppercase font-semibold text-gray-700">
                Subtitle (Optional)
              </label>
              <span className="text-xs text-gray-500">
                {copyWrite.subtitle.length} / 222
              </span>
            </div>
            <Input
              value={copyWrite.subtitle}
              onChange={(e) => dispatch(setSubtitle(e.target.value))}
              placeholder="Enter a Subtitle"
              maxLength={222}
              className="w-full"
            />
          </div>

          {/* Edition Field */}
          <div className="space-y-1">
            <label className="text-xs uppercase font-semibold text-gray-700">
              Edition (Optional)
            </label>
            <Select
              value={copyWrite.edition}
              onValueChange={(v) => dispatch(setEdition(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an Edition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">First Edition</SelectItem>
                <SelectItem value="second">Second Edition</SelectItem>
                <SelectItem value="third">Third Edition</SelectItem>
                <SelectItem value="revised">Revised Edition</SelectItem>
                <SelectItem value="expanded">Expanded Edition</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Edition Statement Field */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs uppercase font-semibold text-gray-700">
                Edition Statement (Optional)
              </label>
              <span className="text-xs text-gray-500">
                {copyWrite.editionStatement.length} / 222
              </span>
            </div>
            <Input
              value={copyWrite.editionStatement}
              onChange={(e) => dispatch(setEditionStatement(e.target.value))}
              placeholder="Enter an Edition Statement"
              maxLength={222}
              className="w-full"
            />
          </div>
        </div>

        {/* Contributors Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold">Contributors</h2>
            <div className="max-w-md">
              <p className="text-sm text-gray-600">
                Add the name and role for each contributor on this Book. This
                includes authors, editors, and illustrators you want to credit
                for working on this Book.
              </p>
              <p className="text-sm font-semibold mt-2">
                Please note: Contributors are displayed in order and most
                retailers will display up to 5 contributors.
              </p>
            </div>
          </div>

          {/* Contributors List */}
          <div className="space-y-2">
            {copyWrite.contributors.map((contributor, index) => (
              <div
                key={contributor.id}
                className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-2 items-center bg-gray-100 p-3 rounded-md"
              >
                <div className="flex items-center justify-center bg-gray-700 text-white rounded-full w-6 h-6 text-sm">
                  {index + 1}
                </div>

                <div>
                  <Select
                    value={contributor.role}
                    onValueChange={(value) =>
                      dispatch(
                        updateContributor({
                          id: contributor.id,
                          field: "role",
                          value,
                        })
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="By (author)">By (author)</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="Illustrator">Illustrator</SelectItem>
                      <SelectItem value="Photographer">Photographer</SelectItem>
                      <SelectItem value="Translator">Translator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  value={contributor.firstName}
                  onChange={(e) =>
                    dispatch(
                      updateContributor({
                        id: contributor.id,
                        field: "firstName",
                        value: e.target.value,
                      })
                    )
                  }
                  placeholder="First Name"
                />

                <Input
                  value={contributor.lastName}
                  onChange={(e) =>
                    dispatch(
                      updateContributor({
                        id: contributor.id,
                        field: "lastName",
                        value: e.target.value,
                      })
                    )
                  }
                  placeholder="Last Name"
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(removeContributor(contributor.id))}
                  className="bg-blue-100 hover:bg-blue-200 border-blue-200 text-blue-700"
                >
                  Remove
                </Button>

                {/* <div className="flex items-center justify-center bg-blue-900 text-white p-2 h-full rounded-r-md cursor-move">
                  <GripVertical size={20} />
                </div> */}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => dispatch(addContributor())}
              className="bg-[#1b463c] hover:bg-blue-600"
            >
              Add Another Contributor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
