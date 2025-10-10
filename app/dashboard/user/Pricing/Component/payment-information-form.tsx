"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Download, Upload } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  setPaymentMethod,
  setPaypalEmail,
  setTaxIdNumber,
  setNonUsTaxIdNumber,
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
} from "@/lib/features/data/priceSlice";

export default function PaymentInformationForm() {
  const dispatch = useDispatch();
  const {
    paymentMethod,
    paypalEmail,
    taxIdNumber,
    nonUsTaxIdNumber,
    taxFormStatus,
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
  } = useSelector((state: RootState) => state.price);

  const [isPaypalExpanded, setIsPaypalExpanded] = useState(true);

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-4 font-semibold border-b">Payment Information</div>
      <div className="space-y-4 p-4">
        {/* Personal Information */}
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="font-semibold">Payee Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
                First Name
              </Label>
              <Input
                value={firstName}
                onChange={(e) => dispatch(setFirstName(e.target.value))}
              />
            </div>
            <div>
              <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
                Last Name
              </Label>
              <Input
                value={lastName}
                onChange={(e) => dispatch(setLastName(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOrganization"
              checked={isOrganization}
              onChange={(e) => dispatch(setIsOrganization(e.target.checked))}
              className="h-4 w-4"
            />
            <Label htmlFor="isOrganization">
              This payee is an organization
            </Label>
          </div>

          {isOrganization && (
            <div>
              <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
                Organization Name
              </Label>
              <Input
                value={organizationName}
                onChange={(e) => dispatch(setOrganizationName(e.target.value))}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
                Country
              </Label>
              <Input
                value={country}
                onChange={(e) => dispatch(setCountry(e.target.value))}
              />
            </div>
            <div>
              <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
                State/Province
              </Label>
              <Input
                value={state}
                onChange={(e) => dispatch(setState(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
              Address Line 1
            </Label>
            <Input
              value={addressLine1}
              onChange={(e) => dispatch(setAddressLine1(e.target.value))}
            />
          </div>

          <div>
            <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
              Address Line 2 (Optional)
            </Label>
            <Input
              value={addressLine2}
              onChange={(e) => dispatch(setAddressLine2(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
                City
              </Label>
              <Input
                value={city}
                onChange={(e) => dispatch(setCity(e.target.value))}
              />
            </div>
            <div>
              <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
                Postal Code
              </Label>
              <Input
                value={postalCode}
                onChange={(e) => dispatch(setPostalCode(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
                Phone
              </Label>
              <Input
                value={phone}
                onChange={(e) => dispatch(setPhone(e.target.value))}
              />
            </div>
            <div>
              <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => dispatch(setEmail(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => dispatch(setPaymentMethod(value))}
          className="space-y-4"
        >
          {/* PayPal Option */}
          <div className="border rounded-md overflow-hidden">
            <div className="flex items-start p-4 gap-2 border-l-4 border-l-green-500">
              <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <Label htmlFor="paypal" className="font-medium">
                    Paypal
                  </Label>
                  <button
                    onClick={() => setIsPaypalExpanded(!isPaypalExpanded)}
                    className="text-[#1B463C] hover:bg-blue-50 p-1 rounded"
                  >
                    {isPaypalExpanded ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Add the Payee's PayPal Account email address and preferred
                  currency. PayPal payments are made monthly by deposit with a
                  minimum payment of $2.00 USD or the equivalent.
                </p>
              </div>
            </div>

            {isPaypalExpanded && (
              <div className="p-4 border-t bg-blue-50">
                <div className="space-y-2">
                  <Label className="block text-xs uppercase font-semibold text-gray-700">
                    PayPal Email Address
                  </Label>
                  <Input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => dispatch(setPaypalEmail(e.target.value))}
                    className="bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Check Option */}
          <div className="border rounded-md p-4 flex items-start gap-2 bg-blue-50">
            <RadioGroupItem value="check" id="check" className="mt-1" />
            <div>
              <Label htmlFor="check" className="font-medium">
                Check
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Payee will receive payment by check in USD, mailed to the above
                address. Check payments are made quarterly by deposit with a
                minimum payment of $20.00 USD or the equivalent.
              </p>
            </div>
          </div>
        </RadioGroup>

        {/* Tax-Related Information */}
        <div className="border rounded-md p-4 space-y-4">
          <h3 className="font-semibold">Tax-Related Information (Optional)</h3>
          <p className="text-sm text-gray-600">
            DCBRINC is located in the United States and is subject to US tax
            laws. When we make a payment, we may be required to withhold certain
            amounts from your payment for certain eligible sales.
          </p>
          <p className="text-sm text-gray-600">
            If your book is published with a free DCBRINC ISBN, US income taxes
            will be withheld on revenue earned from US sales, unless a completed
            and valid tax form has been provided. Please consult a tax
            professional for any questions regarding your tax liability.
          </p>

          {/* Tax ID Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
                Tax ID Number
              </Label>
              <Input
                type="text"
                value={taxIdNumber}
                onChange={(e) => dispatch(setTaxIdNumber(e.target.value))}
              />
            </div>
            <div>
              <Label className="block text-xs uppercase font-semibold text-gray-700 mb-1">
                NON-US TAX ID NUMBER
              </Label>
              <Input
                type="text"
                value={nonUsTaxIdNumber}
                onChange={(e) => dispatch(setNonUsTaxIdNumber(e.target.value))}
              />
            </div>
          </div>

          {/* Tax Forms */}
          <div>
            <h4 className="font-semibold mb-2">Tax Forms</h4>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Tax Form Status:</span>
              <span className="text-sm font-medium">{taxFormStatus}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              A tax form is not required to publish.
              <br />
              Books for sale using a DCBRINC-owned ISBN are subject to US tax
              withholding. DCBRINC will use the default IRS withholding rates
              unless a valid tax form is provided for this Payee.
            </p>
            <a
              href="#"
              className="text-[#1B463C] text-sm hover:underline block mb-4"
            >
              Learn more about tax withholdings.
            </a>

            {/* Download Button */}
            <Button className="bg-[#1b463c] hover:bg-blue-600 mb-4 flex items-center gap-2">
              <Download size={16} />
              Download Tax Form Templates
            </Button>

            <p className="text-sm text-gray-600 mb-2">
              For US Residents, please provide a completed and signed W-9 form.
              <br />
              For International Residents, please provide a completed and signed
              W-8BEN form.
            </p>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-blue-300 rounded-md p-6 text-center bg-blue-50 mb-4">
              <div className="flex justify-center mb-2">
                <Upload className="text-[#1B463C]" size={24} />
              </div>
              <a
                href="#"
                className="text-[#1B463C] font-medium hover:underline block"
              >
                Upload Payee W-9 or W-8BEN tax form
              </a>
              <p className="text-sm text-gray-500 mt-1">
                or Drag & Drop it here
              </p>
            </div>

            {/* Mail To */}
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="font-medium mb-1">Mail to:</p>
              <p className="text-sm">
                Attn: Creator Revenues
                <br />
                DCBRINC Press, Inc.
                <br />
                Durham, NC 27709
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-blue-900 hover:bg-blue-800">
            Create and Add Payee
          </Button>
        </div>
      </div>
    </div>
  );
}
