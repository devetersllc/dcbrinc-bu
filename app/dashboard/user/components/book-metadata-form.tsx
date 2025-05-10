"use client"

import { useState } from "react"
import { GripVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Contributor {
  id: number
  role: string
  firstName: string
  lastName: string
}

export default function BookMetadataForm() {
  const [title, setTitle] = useState("hbfvafbva fvsabfvak")
  const [subtitle, setSubtitle] = useState("")
  const [edition, setEdition] = useState("")
  const [editionStatement, setEditionStatement] = useState("")
  const [contributors, setContributors] = useState<Contributor[]>([
    { id: 1, role: "By (author)", firstName: "Cecilia", lastName: "RAZA" },
  ])

  const addContributor = () => {
    const newId = contributors.length > 0 ? Math.max(...contributors.map((c) => c.id)) + 1 : 1
    setContributors([...contributors, { id: newId, role: "By (author)", firstName: "", lastName: "" }])
  }

  const removeContributor = (id: number) => {
    setContributors(contributors.filter((c) => c.id !== id))
  }

  const updateContributor = (id: number, field: keyof Contributor, value: string) => {
    setContributors(contributors.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="space-y-6">
        {/* Title and Edition Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="bg-blue-600 text-white px-2 py-1 font-semibold">Title and Edition</div>
            <div className="max-w-md">
              <p className="text-sm text-gray-600">
                Enter additional title and edition information for your Photo Book.
              </p>
              <a href="#" className="text-blue-600 text-sm hover:underline">
                Learn more about Editions
              </a>
            </div>
          </div>

          {/* Title Field */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs uppercase font-semibold text-gray-700">Title</label>
              <span className="text-xs text-gray-500">18 / 222</span>
            </div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={222} className="w-full" />
          </div>

          {/* Subtitle Field */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-xs uppercase font-semibold text-gray-700">Subtitle (Optional)</label>
              <span className="text-xs text-gray-500">0 / 222</span>
            </div>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter a Subtitle"
              maxLength={222}
              className="w-full"
            />
          </div>

          {/* Edition Field */}
          <div className="space-y-1">
            <label className="text-xs uppercase font-semibold text-gray-700">Edition (Optional)</label>
            <Select value={edition} onValueChange={setEdition}>
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
              <label className="text-xs uppercase font-semibold text-gray-700">Edition Statement (Optional)</label>
              <span className="text-xs text-gray-500">0 / 222</span>
            </div>
            <Input
              value={editionStatement}
              onChange={(e) => setEditionStatement(e.target.value)}
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
                Add the name and role for each contributor on this Photo Book. This includes authors, editors, and
                illustrators you want to credit for working on this Photo Book.
              </p>
              <p className="text-sm font-semibold mt-2">
                Please note: Contributors are displayed in order and most retailers will display up to 5 contributors.
              </p>
            </div>
          </div>

          {/* Contributors List */}
          <div className="space-y-2">
            {contributors.map((contributor, index) => (
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
                    onValueChange={(value) => updateContributor(contributor.id, "role", value)}
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
                  onChange={(e) => updateContributor(contributor.id, "firstName", e.target.value)}
                  placeholder="First Name"
                />

                <Input
                  value={contributor.lastName}
                  onChange={(e) => updateContributor(contributor.id, "lastName", e.target.value)}
                  placeholder="Last Name"
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeContributor(contributor.id)}
                  className="bg-blue-100 hover:bg-blue-200 border-blue-200 text-blue-700"
                >
                  Remove
                </Button>

                <div className="flex items-center justify-center bg-blue-900 text-white p-2 h-full rounded-r-md cursor-move">
                  <GripVertical size={20} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={addContributor} className="bg-blue-500 hover:bg-blue-600">
              Add Another Contributor
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
