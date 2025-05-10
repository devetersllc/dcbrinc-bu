"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Info, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import PaymentInformationForm from "./payment-information-form"

export default function PayeeManagement() {
  const [existingPayeesOpen, setExistingPayeesOpen] = useState(false)
  const [newPayeeOpen, setNewPayeeOpen] = useState(false)

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">Set Payees</h2>
          <p className="text-sm text-gray-600 max-w-md">
            Designate who gets paid when your Photo Book sells. Select from Payees saved in your account or create new
            ones.
          </p>
        </div>

        {/* Payees Section */}
        <div>
          <h3 className="font-semibold mb-2">Payees for Your Photo Book</h3>
          <p className="text-sm text-gray-600 mb-4">There are currently no Payees for your Photo Book.</p>
          <div className="border-t border-gray-200 my-4"></div>

          {/* Payee Selection Options */}
          <div className="space-y-3">
            {/* Select Existing Payees */}
            <div className="relative">
              <button
                onClick={() => {
                  setExistingPayeesOpen(!existingPayeesOpen)
                  if (!existingPayeesOpen) setNewPayeeOpen(false)
                }}
                className="w-full flex justify-between items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-md text-left"
              >
                <span>Select from Existing Payees</span>
                <div className={`bg-blue-500 p-1 rounded-md text-white`}>
                  {existingPayeesOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {existingPayeesOpen && (
                <div className="mt-2 p-4 border border-gray-200 rounded-md bg-white">
                  <p className="text-gray-500 italic">No existing payees found in your account.</p>
                </div>
              )}
            </div>

            {/* Create New Payee */}
            <div className="relative">
              <button
                onClick={() => {
                  setNewPayeeOpen(!newPayeeOpen)
                  if (!newPayeeOpen) setExistingPayeesOpen(false)
                }}
                className="w-full flex justify-between items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-md text-left"
              >
                <span>Create a New Payee</span>
                <div className={`bg-blue-900 p-1 rounded-md text-white`}>
                  {newPayeeOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {newPayeeOpen && (
                <div className="mt-2 p-4 border border-gray-200 rounded-md bg-white">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payee Name</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter payee name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Share (%)</label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter percentage"
                        min="1"
                        max="100"
                      />
                    </div>
                    <Button className="bg-blue-900 hover:bg-blue-800">Add Payee</Button>
                  </form>
                  <PaymentInformationForm />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Incomplete Steps Notification */}
        <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-md flex gap-3">
          <Info className="h-6 w-6 text-purple-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-purple-900">Some Steps Are Incomplete.</h4>
            <p className="text-sm text-purple-800">
              Before you can review your Photo Book, you must complete all steps in the publishing process. Click on the
              step(s) in the progress bar without this green checkmark{" "}
              <CheckCircle2 className="h-4 w-4 text-green-500 inline" /> to continue working on your Photo Book.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
