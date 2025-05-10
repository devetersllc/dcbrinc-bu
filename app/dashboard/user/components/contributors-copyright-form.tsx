"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, GripVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Contributor {
  id: number
  role: string
  firstName: string
  lastName: string
}

export default function ContributorsCopyrightForm() {
  const [contributors, setContributors] = useState<Contributor[]>([
    { id: 1, role: "By (author)", firstName: "Cecilia", lastName: "RAZA" },
  ])

  const [copyrightOption, setCopyrightOption] = useState("all-rights")
  const [copyrightHolder, setCopyrightHolder] = useState("")
  const [copyrightYear, setCopyrightYear] = useState("")
  const [expandedSections, setExpandedSections] = useState({
    allRights: true,
    creativeCommons: false,
    publicDomain: false,
  })

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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="space-y-6">
        {/* Contributors Section */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
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
                  <label className="text-xs uppercase font-semibold text-gray-700 mb-1 block">Role</label>
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

                <div>
                  <label className="text-xs uppercase font-semibold text-gray-700 mb-1 block">First Name</label>
                  <Input
                    value={contributor.firstName}
                    onChange={(e) => updateContributor(contributor.id, "firstName", e.target.value)}
                    placeholder="First Name"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-semibold text-gray-700 mb-1 block">Last Name</label>
                  <Input
                    value={contributor.lastName}
                    onChange={(e) => updateContributor(contributor.id, "lastName", e.target.value)}
                    placeholder="Last Name"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeContributor(contributor.id)}
                  className="bg-blue-100 hover:bg-blue-200 border-blue-200 text-blue-700 mt-6"
                >
                  Remove
                </Button>

                <div className="flex items-center justify-center bg-blue-900 text-white p-2 h-[42px] mt-6 rounded-md cursor-move">
                  <GripVertical size={20} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={addContributor} className="bg-blue-500 hover:bg-blue-600">
              Add Another Contributor
            </Button>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Copyright</h2>
            <div className="max-w-md">
              <p className="text-sm text-gray-600">
                Select the copyright license that best suits your work. For more information about copyright, please see
                our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Copyright Office FAQ
                </a>
              </p>
            </div>
          </div>

          <RadioGroup value={copyrightOption} onValueChange={setCopyrightOption} className="space-y-2">
            {/* All Rights Reserved Option */}
            <div className="border rounded-md overflow-hidden">
              <div
                className={`border-l-4 ${copyrightOption === "all-rights" ? "border-l-green-500" : "border-l-transparent"}`}
              >
                <div className="p-4 flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <RadioGroupItem value="all-rights" id="all-rights" className="mt-1" />
                    <div>
                      <Label htmlFor="all-rights" className="font-medium">
                        All Rights Reserved - Standard Copyright License
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        All Rights Reserved licensing. Your work cannot be distributed, remixed, or otherwise used
                        without your express consent.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSection("allRights")}
                    className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                  >
                    {expandedSections.allRights ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {expandedSections.allRights && (
                  <div className="p-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase font-semibold text-gray-700 mb-1 block">
                          Copyright Holder Name (Optional)
                        </label>
                        <Input
                          value={copyrightHolder}
                          onChange={(e) => setCopyrightHolder(e.target.value)}
                          placeholder=""
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-semibold text-gray-700 mb-1 block">
                          Copyright Year (Optional)
                        </label>
                        <Input
                          value={copyrightYear}
                          onChange={(e) => setCopyrightYear(e.target.value)}
                          placeholder=""
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Creative Commons Option */}
            <div className="border rounded-md overflow-hidden">
              <div className="p-4 flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <RadioGroupItem value="creative-commons" id="creative-commons" className="mt-1" />
                  <div>
                    <Label htmlFor="creative-commons" className="font-medium">
                      Some Rights Reserved - Creative Commons (CC BY)
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Some rights are reserved, based on the specific Creative Commons Licensing you select.{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        What is Creative Commons?
                      </a>
                    </p>
                  </div>
                </div>
                <button onClick={() => toggleSection("creativeCommons")} className="bg-blue-900 text-white p-1 rounded">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Public Domain Option */}
            <div className="border rounded-md overflow-hidden">
              <div className="p-4 flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <RadioGroupItem value="public-domain" id="public-domain" className="mt-1" />
                  <div>
                    <Label htmlFor="public-domain" className="font-medium">
                      No Rights Reserved - Public Domain
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      No rights are reserved and the work is freely available for anyone to use, distribute, and alter
                      in any way. Public Domain works are not eligible for Global Distribution.
                    </p>
                  </div>
                </div>
                <button onClick={() => toggleSection("publicDomain")} className="bg-blue-900 text-white p-1 rounded">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
