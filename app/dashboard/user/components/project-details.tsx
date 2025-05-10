"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export function ProjectDetails() {
  const [description, setDescription] = useState("")
  const [contributorNotes, setContributorNotes] = useState("")
  const [tableOfContents, setTableOfContents] = useState("")

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Promotional Information and Photo Book Details</h1>
        <p className="text-gray-600">
          We need to add a few more details to complete your Project's metadata and finalize everything.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold">Project Details</h2>
          <div className="text-sm">
            Provide all important metadata to help readers find your book.{" "}
            <Link href="#" className="text-blue-900 font-medium">
              Learn more about Metadata
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="description" className="text-xs font-semibold uppercase">
                Description
              </label>
              <span className="text-xs text-gray-500">{description.length} / 2500</span>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-32 border-gray-300 resize-none"
              placeholder="The Photo Book description will appear on the Lulu Bookstore and any retail sites if your Photo Book uses Global Distribution. Please note: Your description must be a minimum of 50 characters."
            />
            {description.length === 0 && (
              <div className="flex items-center gap-2 mt-2 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs">Description is required to publish</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="contributor-notes" className="text-xs font-semibold uppercase">
                Contributor Notes (Optional)
              </label>
              <span className="text-xs text-gray-500">{contributorNotes.length} / 2500</span>
            </div>
            <Textarea
              id="contributor-notes"
              value={contributorNotes}
              onChange={(e) => setContributorNotes(e.target.value)}
              className="min-h-32 border-gray-300 resize-none"
              placeholder="Add information about your Photo Book contributors such as related works, websites, social media profiles, and other notable achievements to help readers find your Photo Book with online searches. The contributor information listed here will appear with some online retailers when you use Global Distribution to distribute your Photo Book and will help your book appear in search results."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="table-of-contents" className="text-xs font-semibold uppercase">
                Table of Contents (Optional)
              </label>
              <span className="text-xs text-gray-500">{tableOfContents.length} / 2500</span>
            </div>
            <Textarea
              id="table-of-contents"
              value={tableOfContents}
              onChange={(e) => setTableOfContents(e.target.value)}
              className="min-h-32 border-gray-300 resize-none"
              placeholder="Add a Table of Contents for your Photo Book using a comma separated list. The Table of Contents entered here assists users searching for specific terms online. Please note that the Table of Contents entered here does not appear in the Lulu Bookstore and will only assist users searching for your Photo Book if it uses Global Distribution."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
