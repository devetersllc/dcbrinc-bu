"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info, CheckCircle2 } from "lucide-react";
import PaymentInformationForm from "./Component/payment-information-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useDispatch } from "react-redux";
import {
  setFirstName,
  setLastName,
  setIsOrganization,
  setOrganizationName,
  setCountry,
  setState,
  setAddressLine1,
  setAddressLine2,
  setCity,
  setPostalCode,
  setPhone,
  setEmail,
  setCurrency,
} from "@/lib/features/data/priceSlice";

export default function PayeeManagement() {
  const [existingPayeesOpen, setExistingPayeesOpen] = useState(false);
  const [newPayeeOpen, setNewPayeeOpen] = useState(false);

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">Set Payees</h2>
          <p className="text-sm text-gray-600 max-w-md">
            Designate who gets paid when your Photo Book sells. Select from
            Payees saved in your account or create new ones.
          </p>
        </div>

        {/* Payees Section */}
        <div>
          <h3 className="font-semibold mb-2">Payees for Your Photo Book</h3>
          <p className="text-sm text-gray-600 mb-4">
            There are currently no Payees for your Photo Book.
          </p>
          <div className="border-t border-gray-200 my-4"></div>

          {/* Payee Selection Options */}
          <div className="space-y-3">
            {/* Select Existing Payees */}
            <div className="relative">
              <button
                onClick={() => {
                  setExistingPayeesOpen(!existingPayeesOpen);
                  if (!existingPayeesOpen) setNewPayeeOpen(false);
                }}
                className="w-full flex justify-between items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-md text-left"
              >
                <span>Select from Existing Payees</span>
                <div className={`bg-blue-500 p-1 rounded-md text-white`}>
                  {existingPayeesOpen ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </button>

              {existingPayeesOpen && (
                <div className="mt-2 p-4 border border-gray-200 rounded-md bg-white">
                  <p className="text-gray-500 italic">
                    No existing payees found in your account.
                  </p>
                </div>
              )}
            </div>

            {/* Create New Payee */}
            <div className="relative">
              <button
                onClick={() => {
                  setNewPayeeOpen(!newPayeeOpen);
                  if (!newPayeeOpen) setExistingPayeesOpen(false);
                }}
                className="w-full flex justify-between items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-md text-left"
              >
                <span>Create a New Payee</span>
                <div className={`bg-blue-900 p-1 rounded-md text-white`}>
                  {newPayeeOpen ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </button>

              {newPayeeOpen && (
                <div className="mt-2 p-4 border border-gray-200 rounded-md bg-white">
                  <PayeeForm />
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
            <h4 className="font-semibold text-purple-900">
              Some Steps Are Incomplete.
            </h4>
            <p className="text-sm text-purple-800">
              Before you can review your Photo Book, you must complete all steps
              in the publishing process. Click on the step(s) in the progress
              bar without this green checkmark{" "}
              <CheckCircle2 className="h-4 w-4 text-green-500 inline" /> to
              continue working on your Photo Book.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PayeeForm() {
  const dispatch = useDispatch();
  const {
    firstName,
    lastName,
    isOrganization,
    organizationName,
    country,
    state,
    addressLine1,
    addressLine2,
    city,
    postalCode,
    phone,
    email,
    currency,
  } = useSelector((state: RootState) => state.price);

  return (
    <form className="space-y-4">
      <div className="space-y-1">
        <Label
          htmlFor="firstName"
          className="block uppercase text-xs font-medium bg-[#e6eef8] p-2 text-[#333]"
        >
          First Name
        </Label>
        <Input
          id="firstName"
          placeholder="Enter first name"
          className="w-full border rounded h-10"
          value={firstName}
          onChange={(e) => dispatch(setFirstName(e.target.value))}
        />
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="lastName"
          className="block uppercase text-xs font-medium bg-[#e6eef8] p-2 text-[#333]"
        >
          Last Name
        </Label>
        <Input
          id="lastName"
          placeholder="Enter last name"
          className="w-full border rounded h-10"
          value={lastName}
          onChange={(e) => dispatch(setLastName(e.target.value))}
        />
      </div>

      <div className="flex items-center space-x-2 py-2">
        <Checkbox
          id="isOrganization"
          checked={isOrganization}
          onCheckedChange={(checked) =>
            dispatch(setIsOrganization(checked as boolean))
          }
        />
        <Label
          htmlFor="isOrganization"
          className="uppercase text-xs font-medium text-[#333]"
        >
          Is this payee an organization?
        </Label>
      </div>

      {isOrganization && (
        <div className="space-y-1">
          <Label
            htmlFor="organizationName"
            className="block uppercase text-xs font-medium bg-[#e6eef8] p-2 text-[#333]"
          >
            Organization Name
          </Label>
          <Input
            id="organizationName"
            placeholder="Enter organization name"
            className="w-full border rounded h-10"
            value={organizationName}
            onChange={(e) => dispatch(setOrganizationName(e.target.value))}
          />
        </div>
      )}

      <div className="space-y-1">
        <div className="flex items-center">
          <Label
            htmlFor="country"
            className="block uppercase text-xs font-medium bg-[#e6eef8] p-2 text-[#333] w-full"
          >
            Country
          </Label>
          <div className="bg-[#e6eef8] p-2">
            <span className="inline-block w-5 h-5 text-gray-400 rounded-full border border-gray-400 text-center text-xs">
              i
            </span>
          </div>
        </div>
        <Select
          value={country}
          onValueChange={(value) => dispatch(setCountry(value))}
        >
          <SelectTrigger className="w-full border rounded h-10">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="United States">United States</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            <SelectItem value="Australia">Australia</SelectItem>
            <SelectItem value="Germany">Germany</SelectItem>
            <SelectItem value="France">France</SelectItem>
            <SelectItem value="Japan">Japan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="state"
          className="block uppercase text-xs font-medium bg-[#e6eef8] p-2 text-[#333]"
        >
          State
        </Label>
        <Input
          id="state"
          placeholder="Enter state or province"
          className="w-full border rounded h-10"
          value={state}
          onChange={(e) => dispatch(setState(e.target.value))}
        />
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="addressLine1"
          className="block uppercase text-xs font-medium bg-[#e6eef8] p-2 text-[#333]"
        >
          Address Line 1
        </Label>
        <Input
          id="addressLine1"
          placeholder="Enter street address"
          className="w-full border rounded h-10"
          value={addressLine1}
          onChange={(e) => dispatch(setAddressLine1(e.target.value))}
        />
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="addressLine2"
          className="block uppercase text-xs font-medium bg-[#e6eef8] p-2 text-[#333]"
        >
          Address Line 2 (Optional)
        </Label>
        <Input
          id="addressLine2"
          placeholder="Apartment, suite, etc. (optional)"
          className="w-full border rounded h-10"
          value={addressLine2}
          onChange={(e) => dispatch(setAddressLine2(e.target.value))}
        />
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="city"
          className="block uppercase text-xs font-medium bg-[#e6eef8] p-2 text-[#333]"
        >
          City
        </Label>
        <Input
          id="city"
          placeholder="Enter city"
          className="w-full border rounded h-10"
          value={city}
          onChange={(e) => dispatch(setCity(e.target.value))}
        />
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="postalCode"
          className="block uppercase text-xs font-medium bg-[#e6eef8] p-2 text-[#333]"
        >
          Postal Code
        </Label>
        <Input
          id="postalCode"
          placeholder="Enter ZIP or postal code"
          className="w-full border rounded h-10"
          value={postalCode}
          onChange={(e) => dispatch(setPostalCode(e.target.value))}
        />
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="phone"
          className="block uppercase text-xs font-medium bg-[#e6eef8] p-2 text-[#333]"
        >
          Phone
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Phone className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            id="phone"
            placeholder="Enter phone number"
            className="w-full border rounded h-10 pl-10"
            value={phone}
            onChange={(e) => dispatch(setPhone(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="email"
          className="block uppercase text-xs font-medium bg-[#e6eef8] p-2 text-[#333]"
        >
          Email
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            className="w-full border rounded h-10 pl-10"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="currency"
          className="block uppercase text-xs font-medium bg-[#e6eef8] p-2 text-[#333]"
        >
          Currency
        </Label>
        <Select
          value={currency}
          onValueChange={(value) => dispatch(setCurrency(value))}
        >
          <SelectTrigger className="w-full border rounded h-10">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
            <SelectItem value="CAD">CAD</SelectItem>
            <SelectItem value="AUD">AUD</SelectItem>
            <SelectItem value="JPY">JPY</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
}
