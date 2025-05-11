"use client"

import { useState } from "react"
import { BarChart3 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function RetailPriceForm() {
  const [priceBy, setPriceBy] = useState("revenue-goal")

  // Minimum prices for each currency
  const minimumPrices = {
    USD: "11.59",
    EUR: "10.00",
    AUD: "17.89",
    GBP: "9.39",
    CAD: "17.28",
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">Set a Retail Price</h2>
          <p className="text-sm text-gray-600 max-w-md">
            Set the price for each currency manually or select a revenue goal
            for each Photo Book sale.
          </p>
        </div>

        {/* Set Price By Section */}
        <div className="bg-blue-900 text-white p-4 rounded-t-md flex justify-between items-center">
          <div className="font-semibold">Set Price</div>
          <Select defaultValue="revenue-goal" onValueChange={setPriceBy}>
            <SelectTrigger className="w-64 bg-white text-black border-0">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <SelectValue placeholder="Select pricing method" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue-goal">Revenue Goal</SelectItem>
              <SelectItem value="manual">Manual Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Revenue Goal Section */}
        <div className="border rounded-t-none rounded-b-md p-4 grid grid-cols-3 gap-4 border-l-4 border-l-green-500">
          <div className="font-semibold">Revenue Goal</div>
          <div>
            <label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
              Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BarChart3 className="h-4 w-4 text-gray-400" />
              </div>
              <Input type="text" placeholder="--" className="pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
              Currency
            </label>
            <Select defaultValue="USD">
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <SelectValue placeholder="Select currency" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="AUD">AUD</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* List Price Section */}
        <div className="border rounded-md p-4 grid grid-cols-6 gap-4 border-l-4 border-l-green-500">
          <div className="font-semibold">List Price</div>

          {/* Currency Input Fields */}
          <div className="col-span-5 grid grid-cols-5 gap-4">
            {Object.entries(minimumPrices).map(([currency, minPrice]) => (
              <div key={currency} className="space-y-2">
                <div className="text-xs font-semibold text-center">
                  {currency}
                </div>
                <Input type="text" placeholder="--" className="text-center" />
                <div className="text-xs text-center">
                  {minPrice} {currency}
                </div>
              </div>
            ))}
          </div>

          {/* Footnote */}
          <div className="col-span-6 mt-2 text-xs text-gray-500">
            * Minimum Price is determined by the print cost and distribution
            fees.
            <br />
            To ensure you earn revenue for sales, the list price cannot be less
            than the minimum price.
          </div>
        </div>
      </div>
    </div>
  );
}
