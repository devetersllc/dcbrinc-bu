"use client";
import Image from "next/image";
import Link from "next/link";
import ProfileDropDown from "./ProfileDropDown";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogIn, User, Menu, X, ChevronDown } from "lucide-react";
import { setServiceType } from "@/lib/features/general/general";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (pathname.startsWith("/auth/")) {
    return null;
  }

  const menuItems = [
    {
      title: "DCBR Accounting",
      href: "https://dcbrinc.com/accounting-and-finance/",
      submenu: [
        {
          title: "Quick Books online",
          href: "https://dcbrinc.com/quickbooks-online-advanced/",
        },
        {
          title: "Book keeping Services",
          href: "https://dcbrinc.com/book-keeping-services/",
        },
        {
          title: "Payroll Services",
          href: "https://dcbrinc.com/payroll-processing/",
        },
        {
          title: "Financial Statement Preparation and Analysis",
          href: "https://dcbrinc.com/financial-planning/",
        },
        {
          title: "Budgeting, Forecasting & Modelling",
          href: "#",
        },
        {
          title: "Individual Tax Return",
          href: "https://dcbrinc.com/individual-tax-return/",
        },
        {
          title: "Business Tax Return",
          href: "https://dcbrinc.com/business-tax-return/",
        },
      ],
    },
    {
      title: "Business Strategies",
      href: "https://dcbrinc.com/business-strategies/",
      submenu: [
        {
          title: "Business Plan",
          href: "https://dcbrinc.com/business-plan/",
        },
        {
          title: "Project Proposal & Feasibility Analysis",
          href: "#",
        },
        {
          title: "Marketing Strategies",
          href: "https://dcbrinc.com/marketing-strategies/",
        },
        {
          title: "Business Formation & Registration",
          href: "https://dcbrinc.com/business-formation-registration/",
        },
        {
          title: "Entrepreneurship Consulting",
          href: "https://dcbrinc.com/entrepreneurship-consulting/",
        },
        {
          title: "Innovation strategy Consulting",
          href: "#",
        },
      ],
    },
    {
      title: "Research Services",
      href: "https://dcbrinc.com/research-services/",
      submenu: [
        {
          title: "Market Research",
          href: "https://dcbrinc.com/market-research/",
        },
        {
          title: "Business Case Studies",
          href: "https://dcbrinc.com/business-case-studies/",
        },
        {
          title: "Thesis & Dissertation Consulting",
          href: "https://dcbrinc.com/thesis-dissertation-consulting/",
        },
      ],
    },
    {
      title: "Tutor & Training",
      href: "https://dcbrinc.com/personal-tutor-training/",
      submenu: [
        {
          title: "Business Management",
          href: "https://dcbrinc.com/business-management/",
        },
        {
          title: "Accounting and Finance",
          href: "https://dcbrinc.com/accounting-and-finance-2/",
        },
        {
          title: "Economics Courses",
          href: "https://dcbrinc.com/economics-courses/",
        },
        {
          title: "Software Training",
          href: "https://dcbrinc.com/software-training/",
        },
        {
          title: "Business Analytics",
          href: "https://dcbrinc.com/business-analytics/",
        },
        {
          title: "Marketing Analytics",
          href: "https://dcbrinc.com/marketing-analytics/",
        },
        {
          title: "Financial Analytics",
          href: "https://dcbrinc.com/financial-analytics/",
        },
      ],
    },
    {
      title: "Min e-Library",
      href: "https://dcbrinc.com/e-commerce-shop-online/",
      submenu: [
        {
          title: "Books",
          href: "/books", // Updated to use your existing books route
          submenu: [
            {
              title: "Management",
              href: "#",
            },
            {
              title: "Accounting and Finance",
              href: "#",
            },
            {
              title: "Economics",
              href: "#",
            },
          ],
        },
        {
          title: "Research articles",
          href: "#",
          submenu: [
            {
              title: "Economics",
              href: "#",
            },
            {
              title: "Management",
              href: "#",
            },
            {
              title: "Accounting and Finance",
              href: "#",
            },
          ],
        },
      ],
    },
    {
      title: "Print or Publish",
      href: "#",
      submenu: [
        {
          title: "Books & E-Books",
          href: "https://dcbrinc.com/print-publish/",
        },
        {
          title: "Business cards",
          href: "/cards", // Updated to use your existing cards route
        },
        {
          title: "Promotional products",
          href: "#",
        },
        {
          title: "Post-cards, & print advertising",
          href: "#",
        },
        {
          title: "Signs, banners and posters",
          href: "#",
        },
        {
          title: "Contact Team DCBR Print",
          href: "#",
        },
      ],
    },
    {
      title: "Contact Us",
      href: "https://dcbrinc.com/contact-us/",
    },
    {
      title: "Careers",
      href: "https://dcbrinc.com/jobs/",
    },
  ];

  const renderMenuItem = (item: any, isMobile = false, level = 0) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    if (isMobile) {
      return (
        <div key={item.title}>
          {hasSubmenu ? (
            <AccordionItem value={item.title} className="border-none">
              <AccordionTrigger className="py-2 text-left font-medium text-gray-900 hover:no-underline text-base">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="pl-4 space-y-1">
                  {item.submenu.map((subItem: any) => {
                    const hasNestedSubmenu =
                      subItem.submenu && subItem.submenu.length > 0;

                    if (hasNestedSubmenu) {
                      return (
                        <AccordionItem
                          key={subItem.title}
                          value={subItem.title}
                          className="border-none"
                        >
                          <AccordionTrigger className="py-1 text-sm font-medium text-gray-700 hover:no-underline">
                            {subItem.title}
                          </AccordionTrigger>
                          <AccordionContent className="pb-1">
                            <div className="pl-4 space-y-1">
                              {subItem.submenu.map((nestedItem: any) => (
                                <Link
                                  key={nestedItem.title}
                                  href={nestedItem.href}
                                  className="block text-sm text-gray-600 hover:text-blue-600 py-1 px-2 rounded-md hover:bg-gray-50"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    if (nestedItem.href === "/books") {
                                      dispatch(setServiceType("books"));
                                    } else if (nestedItem.href === "/cards") {
                                      dispatch(setServiceType("cards"));
                                    }
                                  }}
                                >
                                  {nestedItem.title}
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    }

                    return (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="block text-sm text-gray-700 hover:text-blue-600 py-1 px-2 rounded-md hover:bg-gray-50"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (subItem.href === "/books") {
                            dispatch(setServiceType("books"));
                          } else if (subItem.href === "/cards") {
                            dispatch(setServiceType("cards"));
                          }
                        }}
                      >
                        {subItem.title}
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ) : (
            <Link
              href={item.href}
              className="block py-2 px-2 font-medium text-gray-900 hover:text-blue-600 text-base rounded-md hover:bg-gray-50"
              onClick={() => {
                setMobileMenuOpen(false);
                if (item.href === "/books") {
                  dispatch(setServiceType("books"));
                } else if (item.href === "/cards") {
                  dispatch(setServiceType("cards"));
                }
              }}
            >
              {item.title}
            </Link>
          )}
        </div>
      );
    }

    if (hasSubmenu) {
      return (
        <DropdownMenu key={item.title}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-sm font-normal h-auto ps-0 pe-1 hover:bg-accent flex justify-center items-center gap-1"
            >
              {item.title}
              <ChevronDown className="m-0 h-2 w-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 max-h-96 overflow-y-auto"
            align="start"
          >
            {item.submenu.map((subItem: any, index: number) => {
              const hasNestedSubmenu =
                subItem.submenu && subItem.submenu.length > 0;

              if (hasNestedSubmenu) {
                return (
                  <DropdownMenuSub key={subItem.title}>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      {subItem.title}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48">
                      {subItem.submenu.map((nestedItem: any) => (
                        <DropdownMenuItem key={nestedItem.title} asChild>
                          <Link
                            href={nestedItem.href}
                            className="cursor-pointer"
                            onClick={() => {
                              if (nestedItem.href === "/books") {
                                dispatch(setServiceType("books"));
                              } else if (nestedItem.href === "/cards") {
                                dispatch(setServiceType("cards"));
                              }
                            }}
                          >
                            {nestedItem.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                );
              }

              return (
                <DropdownMenuItem key={subItem.title} asChild>
                  <Link
                    href={subItem.href}
                    className="cursor-pointer"
                    onClick={() => {
                      if (subItem.href === "/books") {
                        dispatch(setServiceType("books"));
                      } else if (subItem.href === "/cards") {
                        dispatch(setServiceType("cards"));
                      }
                    }}
                  >
                    {subItem.title}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link
        key={item.title}
        href={item.href}
        className="text-sm font-normal hover:bg-accent px-1 py-1 rounded-md transition-colors"
        onClick={() => {
          if (item.href === "/books") {
            dispatch(setServiceType("books"));
          } else if (item.href === "/cards") {
            dispatch(setServiceType("cards"));
          }
        }}
      >
        {item.title}
      </Link>
    );
  };

  const ListItem = ({
    title,
    href,
    onClick,
  }: {
    title: string;
    href: string;
    onClick?: () => void;
  }) => {
    return (
      <li>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          onClick={onClick}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </Link>
      </li>
    );
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-white backdrop-blur supports-[backdrop-filter]:bg-white flex items-center justify-center">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-3 w-full">
        <div className="flex items-center gap-0 pe-2 justify-between w-fit xl:w-[calc(100%-160px)]">
          <Link
            href={"/"}
            className="h-8 md:h-10 flex items-center justify-center w-fit cursor-pointer"
          >
            <Image
              src="https://dcbrinc.com/wp-content/uploads/2025/03/IMG_6463-2-1024x779-1.png"
              alt="DCBR Logo"
              className="object-cover h-full w-full mr-2"
              width={20}
              height={10}
            />
          </Link>
          <div className="flex items-center justify-end gap-3">
            <div className="hidden xl:flex items-center gap-">
              {menuItems.map((item) => renderMenuItem(item))}
            </div>

            {/* <div className="hidden md:flex justify-start gap-2 md:gap-4 items-center">
              <Link
                href={"/books"}
                className="text-sm text-gray-600 cursor-pointer hover:underline"
                onClick={() => {
                  dispatch(setServiceType("books"));
                }}
              >
                Books
              </Link>
              <Link
                href={"/cards"}
                className="text-sm text-gray-600 cursor-pointer hover:underline"
                onClick={() => {
                  dispatch(setServiceType("cards"));
                }}
              >
                Cards
              </Link>
            </div> */}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 w-fit xl:w-[160px] justify-end">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="xl:hidden">
              <Button variant="ghost" size="icon">
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs overflow-y-auto">
              <SheetHeader className="pb-6">
                <SheetTitle className="text-left text-lg">Menu</SheetTitle>
              </SheetHeader>
              <div className="px-6">
                {/* <div className="mb-6 pb-6 border-b space-y-2">
                  <Link
                    href="/books"
                    className="block py-2 px-2 font-medium text-gray-900 hover:text-blue-600 text-base rounded-md hover:bg-gray-50"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      dispatch(setServiceType("books"));
                    }}
                  >
                    Books
                  </Link>
                  <Link
                    href="/cards"
                    className="block py-2 px-2 font-medium text-gray-900 hover:text-blue-600 text-base rounded-md hover:bg-gray-50"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      dispatch(setServiceType("cards"));
                    }}
                  >
                    Cards
                  </Link>
                </div> */}

                <Accordion type="multiple" className="w-full space-y-2">
                  {menuItems.map((item) => renderMenuItem(item, true))}
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex justify-end gap-4 items-center border-l pl-2 md:pl-4 w-full">
            {isAuthenticated && user ? (
              <>
                <div className="items-center space-x-4 hidden md:flex">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{user.name}</span>
                  </div>
                </div>
                <ProfileDropDown />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="items-center space-x-2 hidden md:flex">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Guest User
                  </span>
                </div>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
