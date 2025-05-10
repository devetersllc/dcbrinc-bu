"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ChevronDown } from "lucide-react"
import Link from "next/link"

export function CategoriesAndKeywords() {
  const [luluCategory, setLuluCategory] = useState("fiction")
  const [bisacMain, setBisacMain] = useState("")
  const [bisacCategory2, setBisacCategory2] = useState("")
  const [bisacCategory3, setBisacCategory3] = useState("")
  const [keywords, setKeywords] = useState("")

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <h2 className="text-xl font-bold mb-6">Categories and Keywords</h2>

      <div className="space-y-6">
        <div>
          <Label htmlFor="lulu-category" className="text-xs font-semibold uppercase mb-2 block">
            Lulu Bookstore Category
          </Label>
          <div className="relative">
            <Select value={luluCategory} onValueChange={setLuluCategory}>
              <SelectTrigger
                id="lulu-category"
                className="w-full border-gray-300 bg-white"
                // icon={<ChevronDown className="h-4 w-4 opacity-50" />}
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
          <Label htmlFor="bisac-main" className="text-xs font-semibold uppercase mb-2 block">
            BISAC Main Category
          </Label>
          <Input
            id="bisac-main"
            value={bisacMain}
            onChange={(e) => setBisacMain(e.target.value)}
            className="border-gray-300"
            placeholder="Start typing to find matching categories"
          />
          {!bisacMain && (
            <div className="flex items-center gap-2 mt-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">At least one BISAC category is required</span>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="bisac-category-2" className="text-xs font-semibold uppercase mb-2 block">
            BISAC Category 2 (Recommended)
          </Label>
          <Input
            id="bisac-category-2"
            value={bisacCategory2}
            onChange={(e) => setBisacCategory2(e.target.value)}
            className="border-gray-300"
            placeholder="Start typing to find matching categories"
          />
        </div>

        <div>
          <Label htmlFor="bisac-category-3" className="text-xs font-semibold uppercase mb-2 block">
            BISAC Category 3 (Recommended)
          </Label>
          <Input
            id="bisac-category-3"
            value={bisacCategory3}
            onChange={(e) => setBisacCategory3(e.target.value)}
            className="border-gray-300"
            placeholder="Start typing to find matching categories"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="keywords" className="text-xs font-semibold uppercase">
              Keywords
            </Label>
            <span className="text-xs text-gray-500">{keywords.length} / 50</span>
          </div>
          <Input
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="border-gray-300"
            placeholder="Add keywords..."
            maxLength={50}
          />
          <div className="text-xs text-gray-500 mt-1">Separate keywords with a comma</div>
          {!keywords && (
            <div className="flex items-center gap-2 mt-1 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">Please add at least one keyword</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
