"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setType, StartPageState } from "@/lib/features/data/startPageSlice";

export function ProductSelection() {
  const startPage = useSelector((state: RootState) => state.startPage);
  const dispatch = useDispatch();

  const products = [
    {
      id: "print-book",
      title: "Print Book",
      description:
        "Traditional or paperback book using a wide range of paper stock and binding options. Perfect for novels, cookbooks, and more - perfect for a variety of projects.",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: "photo-book",
      title: "Photo Book",
      description:
        "Preserve memories or create a lookbook of your work with a traditional photo book. Choose from a variety of sizes, paper types, cover styles, and more. Let your photographs highlight the best of your story options.",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: "comic-book",
      title: "Comic Book",
      description:
        "Traditional comic book size with paperback binding. Bring your art to life with colorful pages, speech bubbles, and illustrations. Create inside of the cover.",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: "magazine",
      title: "Magazine",
      description:
        "Create beautiful magazines with rich color and glossy pages. Perfect for showcasing paper stock designed for magazines and printing on the double-sided paper.",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: "yearbook",
      title: "Yearbook",
      description:
        "For schools and businesses, a great way to capture a year's worth of memories. Enjoy the best printing and binding at a fraction of the cost.",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: "calendar",
      title: "Calendar",
      description:
        "Create a 12 or 18-month calendar with custom images for each month. A great way to build your collection of seasonal imagery calendar design.",
      image: "/placeholder.svg?height=150&width=200",
    },
    {
      id: "ebook",
      title: "Ebook",
      description:
        "Create an ebook from your PDF or EPUB file. Ready for reading on an ereader, tablet, or smartphone.",
      image: "/placeholder.svg?height=150&width=200",
    },
  ];

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <h1 className="text-xl font-bold mb-6">Select a Product Type</h1>
      <RadioGroup
        value={startPage.type}
        onValueChange={(e: StartPageState["type"]) => {
          dispatch(setType(e));
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {products.map((product) => (
          <div key={product.id} className="relative">
            <Label
              htmlFor={product.id}
              className={cn(
                "cursor-pointer block h-full",
                startPage.type === product.id
                  ? "ring-2 ring-blue-500 rounded-lg"
                  : ""
              )}
            >
              <Card className="h-full border overflow-hidden">
                <div className="h-40 overflow-hidden bg-gray-100">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RadioGroupItem
                      value={product.id}
                      id={product.id}
                      className="mt-0"
                    />
                    <CardTitle className="text-base font-medium">
                      {product.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-gray-600">
                    {product.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
