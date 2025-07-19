"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  FileText,
  ImageIcon,
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
  Info,
  Search,
  Download,
  CreditCard,
  Eye,
  UserCog,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { useAuth } from "@/lib/hooks";
import type { Order } from "@/lib/features/models/Order";
import { Suspense } from "react";
import { BookOpen, DollarSign } from "lucide-react";
import { QuickBooksConnectButton } from "@/components/quickbooks-connect-button";
import { logoutUser } from "@/lib/features/auth/authSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { SubAdminForm } from "@/components/sub-admin-form";
import { SubAdminEditForm } from "@/components/sub-admin-edit-form";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type SubAdmin = {
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions: {
    cardOrders: boolean;
    bookOrders: boolean;
    users: boolean;
  };
  createdAt: string;
};

type PaginationData = {
  current: number;
  pageSize: number;
  total: number;
};

// Mock data - replace with real data from your API
const statsData = [
  {
    title: "Total Users",
    value: "1,234",
    description: "Active users on the platform",
    icon: Users,
  },
  {
    title: "Total Orders",
    value: "567",
    description: "Orders processed this month",
    icon: BookOpen,
  },
  {
    title: "Revenue",
    value: "$12,345",
    description: "Total revenue this month",
    icon: DollarSign,
  },
  {
    title: "Growth",
    value: "+12.5%",
    description: "Growth from last month",
    icon: TrendingUp,
  },
];

// Skeleton components for loading states
function OrderTableSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-3 border rounded-lg"
        >
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-3 w-[120px]" />
          </div>
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[80px]" />
          <div className="flex gap-1">
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-7 w-12" />
          </div>
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
    </div>
  );
}

function UserTableSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-3 border rounded-lg"
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-3 w-[180px]" />
          </div>
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      ))}
    </div>
  );
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[80px] mb-2" />
        <Skeleton className="h-3 w-[120px]" />
      </CardContent>
    </Card>
  );
}

// Popover components for detailed information
function BookDetailsPopover({ order }: { order: Order }) {
  return (
    <PopoverContent className="w-64" align="start">
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Book Details</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Size:</span>
            <span className="font-medium">{order.bookSize}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pages:</span>
            <span className="font-medium">{order?.pageCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Color:</span>
            <span className="font-medium">{order.interiorColor}</span>
          </div>
        </div>
      </div>
    </PopoverContent>
  );
}
function CardDetailsPopover({ order }: { order: Order }) {
  return (
    <PopoverContent className="w-64" align="start">
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Card Details</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Company:</span>
            <span className="font-medium">{order.cardData?.companyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Job Title:</span>
            <span className="font-medium">{order.cardData?.jobTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium">{order.cardData?.phone}</span>
          </div>
        </div>
      </div>
    </PopoverContent>
  );
}

function SpecificationsPopover({ order }: { order: Order }) {
  if (order.type === "card") {
    return (
      <PopoverContent className="w-64" align="start">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Card Specifications</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Background:</span>
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: order.cardData?.backgroundColor }}
                />
                <span className="font-medium">
                  {order.cardData?.backgroundColor}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Text Color:</span>
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: order.cardData?.textColor }}
                />
                <span className="font-medium">{order.cardData?.textColor}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Website:</span>
              <span className="font-medium">
                {order.cardData?.website || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    );
  }
  return (
    <PopoverContent className="w-64" align="start">
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Specifications</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Paper:</span>
            <span className="font-medium">{order?.paperType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Binding:</span>
            <span className="font-medium">{order.bindingType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Finish:</span>
            <span className="font-medium">{order.coverFinish}</span>
          </div>
        </div>
      </div>
    </PopoverContent>
  );
}
function CardPreviewDialog({ order }: { order: Order }) {
  if (order.type !== "card" || !order.cardImageUrl) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 p-1 text-xs">
          <Eye className="h-3 w-3 mr-1" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Business Card Preview</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4">
          <Image
            src={order.cardImageUrl || "/placeholder.svg"}
            alt="Business Card"
            width={336}
            height={192}
            className="border-2 border-gray-300 rounded"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AdminDashboardContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated, hasPermission } = useAuth("admin");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [subAdminsLoading, setSubAdminsLoading] = useState(true);
  const [canvasRef] = useState(useRef(null));
  const [orderTypeFilter, setOrderTypeFilter] = useState("all");

  // Pagination states
  const [ordersPagination, setOrdersPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [usersPagination, setUsersPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [subAdminsPagination, setSubAdminsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const isFullAdmin = user?.role === "admin";
  useEffect(() => {
    if (user && isAuthenticated) {
      const canViewUsers =
        user.role === "admin" ||
        (user.role === "sub-admin" && user.permissions?.users);
      const canViewOrders =
        user.role === "admin" ||
        (user.role === "sub-admin" &&
          (user.permissions?.cardOrders || user.permissions?.bookOrders));
      const canViewSubAdmins = user.role === "admin";
      if (canViewUsers) {
        fetchUsers();
      }
      if (canViewOrders) {
        fetchOrders();
      }
      if (canViewSubAdmins) {
        fetchSubAdmins();
      }
    }
  }, [isAuthenticated, user]);

  const fetchUsers = async (page = 1, pageSize = 10, search = "") => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        search: search,
      });

      const response = await fetch(`/api/users?${params}`);
      const data = await response.json();

      setUsers(data.users);
      setUsersPagination({
        current: page,
        pageSize: pageSize,
        total: data.total,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (
    page = 1,
    pageSize = 10,
    search = "",
    type = ""
  ) => {
    setOrdersLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        search: search,
      });

      if (type) {
        params.append("type", type);
      }

      const response = await fetch(`/api/orders?${params}`);
      const data = await response.json();

      let filteredOrders = data.orders;
      if (user?.role === "sub-admin") {
        filteredOrders = data.orders.filter((order: Order) => {
          if (order.type === "card" && user.permissions?.cardOrders)
            return true;
          if (order.type === "book" && user.permissions?.bookOrders)
            return true;
          return false;
        });
      }
      setOrders(filteredOrders);
      setOrdersPagination({
        current: page,
        pageSize: pageSize,
        total: data.total,
      });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };
  const fetchSubAdmins = async (page = 1, pageSize = 10, search = "") => {
    setSubAdminsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        search: search,
      });
      const response = await fetch(`/api/sub-admins?${params}`);
      const data = await response.json();
      setSubAdmins(data);
      setSubAdminsPagination({
        current: page,
        pageSize: pageSize,
        total: data.total,
      });
    } catch (error) {
      console.error("Failed to fetch sub-admins:", error);
    } finally {
      setSubAdminsLoading(false);
    }
  };

  const handleOrdersPageChange = (page: number, pageSize?: number) => {
    fetchOrders(
      page,
      pageSize || ordersPagination.pageSize,
      "",
      orderTypeFilter
    );
  };

  const handleUsersPageChange = (page: number, pageSize?: number) => {
    fetchUsers(page, pageSize || usersPagination.pageSize);
  };
  const handleSubAdminsPageChange = (page: number, pageSize?: number) => {
    fetchSubAdmins(page, pageSize || subAdminsPagination.pageSize);
  };

  const handleOrderSearch = (value: string) => {
    fetchOrders(1, ordersPagination.pageSize, value, orderTypeFilter);
  };

  const handleUserSearch = (value: string) => {
    fetchUsers(1, usersPagination.pageSize, value);
  };
  const handleSubAdminSearch = (value: string) => {
    fetchSubAdmins(1, subAdminsPagination.pageSize, value);
  };

  const handleOrderTypeFilter = (type: string) => {
    setOrderTypeFilter(type);
    fetchOrders(1, ordersPagination.pageSize, "", type);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders(
          ordersPagination.current,
          ordersPagination.pageSize,
          "",
          orderTypeFilter
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  const deleteSubAdmin = async (subAdminId: string) => {
    try {
      const response = await fetch(`/api/sub-admins/${subAdminId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSubAdmins(
          subAdminsPagination.current,
          subAdminsPagination.pageSize
        );
      } else {
        console.error("Failed to delete sub-admin");
      }
    } catch (error) {
      console.error("Error deleting sub-admin:", error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "processing":
        return "default";
      case "completed":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getOrderTypeIcon = (type: string) => {
    return type === "card" ? CreditCard : BookOpen;
  };

  const getOrderTypeBadgeVariant = (type: string) => {
    return type === "card" ? "outline" : "default";
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      dispatch(logoutUser());
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const downloadPDF = (cloudinaryUrl: any, fileName: string) => {
    if (cloudinaryUrl) {
      fetch(cloudinaryUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          const downloadFileName = fileName?.endsWith(".pdf")
            ? fileName
            : `${fileName || "document"}.pdf`;
          link.download = downloadFileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        })
        .catch((error) => {
          console.error("Error downloading PDF:", error);
          alert("Failed to download PDF. Please try again.");
        });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `Example.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadCardImage = (imageUrl: string, fileName: string) => {
    if (imageUrl) {
      fetch(imageUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          const downloadFileName = fileName?.endsWith(".png")
            ? fileName
            : `${fileName || "card"}.png`;
          link.download = downloadFileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        })
        .catch((error) => {
          console.error("Error downloading image:", error);
          alert("Failed to download image. Please try again.");
        });
    }
  };
  const getAvailableTabs = () => {
    const tabs = [];
    const canViewOrders =
      user?.role === "admin" ||
      (user?.role === "sub-admin" &&
        (user?.permissions?.cardOrders || user?.permissions?.bookOrders));
    const canViewUsers =
      user?.role === "admin" ||
      (user?.role === "sub-admin" && user?.permissions?.users);
    const canViewSubAdmins = user?.role === "admin";
    if (canViewOrders) {
      tabs.push("orders");
    }
    if (canViewUsers) {
      tabs.push("users");
    }
    if (canViewSubAdmins) {
      tabs.push("sub-admins");
    }
    return tabs;
  };
  const availableTabs = getAvailableTabs();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isFullAdmin ? "Admin Dashboard" : "Sub-Admin Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {isFullAdmin
              ? "Manage your application and monitor key metrics"
              : "Manage assigned sections and monitor key metrics"}
          </p>
        </div>
      </div>

      {/* Stats Grid - Only show for full admin */}
      {isFullAdmin && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData?.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* QuickBooks Integration Section - Only show for full admin */}
      {isFullAdmin && (
        <div className="grid gap-6 md:grid-cols-1 w-full">
          <div className="space-y-4 w-full">
            <h2 className="text-2xl font-semibold tracking-tight">
              Payment Integration
            </h2>
            <p className="text-muted-foreground w-2/3">
              Connect your QuickBooks account to enable payment processing for
              all users. This is a one-time setup that allows the application to
              process payments on behalf of your business.
            </p>
            <QuickBooksConnectButton />
          </div>
        </div>
      )}

      {/* Recent Activity - Only show for full admin */}
      {isFullAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest activities and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registration</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Payment processed successfully
                  </p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System backup completed</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {availableTabs.length > 0 && (
        <Tabs defaultValue={availableTabs[0]} className="space-y-6">
          <TabsList
            className={`grid w-full grid-cols-${availableTabs.length} lg:w-[100%] rounded-md`}
          >
            {availableTabs.includes("orders") && (
              <TabsTrigger
                value="orders"
                className="flex items-center gap-2 rounded-md"
              >
                <ShoppingCart className="h-4 w-4" />
                Orders
              </TabsTrigger>
            )}
            {availableTabs.includes("users") && (
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 rounded-md"
              >
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
            )}
            {availableTabs.includes("sub-admins") && (
              <TabsTrigger
                value="sub-admins"
                className="flex items-center gap-2 rounded-md"
              >
                <UserCog className="h-4 w-4" />
                Sub-Admins
              </TabsTrigger>
            )}
          </TabsList>

          {availableTabs.includes("orders") && (
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <div className="w-full flex justify-between items-end flex-wrap gap-y-5">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Order Management
                      </CardTitle>
                      <CardDescription>
                        View and manage {isFullAdmin ? "all" : "assigned"} book
                        and card orders
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Select
                        value={orderTypeFilter}
                        onValueChange={handleOrderTypeFilter}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          {(isFullAdmin ||
                            (user?.role === "sub-admin" &&
                              user?.permissions?.bookOrders)) && (
                            <SelectItem value="book">Books</SelectItem>
                          )}
                          {(isFullAdmin ||
                            (user?.role === "sub-admin" &&
                              user?.permissions?.cardOrders)) && (
                            <SelectItem value="card">Cards</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <div className="relative w-full lg:w-[400px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search orders by name, email, status..."
                          onChange={(e) => handleOrderSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <OrderTableSkeleton />
                  ) : orders?.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders found
                      </h3>
                      <p className="text-muted-foreground">
                        Orders will appear here once customers place them.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold">
                                Customer
                              </TableHead>
                              <TableHead className="font-semibold">
                                Type
                              </TableHead>
                              <TableHead className="font-semibold">
                                Details
                              </TableHead>
                              <TableHead className="font-semibold">
                                Specifications
                              </TableHead>
                              <TableHead className="font-semibold">
                                Files
                              </TableHead>
                              <TableHead className="font-semibold">
                                Price
                              </TableHead>
                              <TableHead className="font-semibold">
                                Status
                              </TableHead>
                              <TableHead className="font-semibold">
                                Date
                              </TableHead>
                              <TableHead className="font-semibold">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders?.map((order) => {
                              const TypeIcon = getOrderTypeIcon(order.type);
                              return (
                                <TableRow
                                  key={order._id}
                                  className="hover:bg-muted/25 h-12"
                                >
                                  <TableCell className="py-2">
                                    <div className="space-y-0.5">
                                      <div className="font-medium text-sm text-gray-900">
                                        {order.name}
                                      </div>
                                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                        {order.email}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-2">
                                    <Badge
                                      variant={getOrderTypeBadgeVariant(
                                        order.type
                                      )}
                                      className="text-xs"
                                    >
                                      <TypeIcon className="h-3 w-3 mr-1" />
                                      {order.type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="py-2">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 p-1 text-xs"
                                        >
                                          <Info className="h-3 w-3 mr-1" />
                                          Details
                                        </Button>
                                      </PopoverTrigger>
                                      {order.type === "book" ? (
                                        <BookDetailsPopover order={order} />
                                      ) : (
                                        <CardDetailsPopover order={order} />
                                      )}
                                    </Popover>
                                  </TableCell>
                                  <TableCell className="py-2">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 p-1 text-xs"
                                        >
                                          <Info className="h-3 w-3 mr-1" />
                                          Specs
                                        </Button>
                                      </PopoverTrigger>
                                      <SpecificationsPopover order={order} />
                                    </Popover>
                                  </TableCell>
                                  <TableCell className="py-2">
                                    <div className="flex gap-1">
                                      {order.type === "book" ? (
                                        <>
                                          {/* PDF Button */}
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 px-2 text-xs group relative disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                                            onClick={() =>
                                              downloadPDF(
                                                order.pdfCloudinaryUrl,
                                                order.userName
                                              )
                                            }
                                            disabled={!order.pdfCloudinaryUrl}
                                          >
                                            <span className="absolute inset-0 flex items-center justify-center transition-opacity group-hover:opacity-0">
                                              <FileText className="h-3 w-3" />
                                            </span>
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Download className="h-3 w-3" />
                                            </span>
                                          </Button>

                                          {/* Cover Image Button */}
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 px-2 text-xs group relative disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                                            onClick={() =>
                                              downloadPDF(
                                                order.coverCloudinaryUrl,
                                                order.userName
                                              )
                                            }
                                            disabled={!order.coverCloudinaryUrl}
                                          >
                                            <span className="absolute inset-0 flex items-center justify-center transition-opacity group-hover:opacity-0">
                                              <ImageIcon className="h-3 w-3" />
                                            </span>
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Download className="h-3 w-3" />
                                            </span>
                                          </Button>
                                        </>
                                      ) : (
                                        <>
                                          {/* Card Preview Button */}
                                          <CardPreviewDialog order={order} />

                                          {/* Card Download Button */}
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 px-2 text-xs group relative disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                                            onClick={() =>
                                              downloadCardImage(
                                                order.cardImageUrl!,
                                                order.name
                                              )
                                            }
                                            disabled={!order.cardImageUrl}
                                          >
                                            <span className="absolute inset-0 flex items-center justify-center transition-opacity group-hover:opacity-0">
                                              <CreditCard className="h-3 w-3" />
                                            </span>
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Download className="h-3 w-3" />
                                            </span>
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-2">
                                    <div className="font-semibold text-sm text-green-600">
                                      ${order.totalPrice?.toFixed(2)}
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-2">
                                    <Badge
                                      variant={getStatusBadgeVariant(
                                        order.status
                                      )}
                                      className="text-xs"
                                    >
                                      {order.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="py-2 text-xs text-muted-foreground">
                                    {new Date(
                                      order.orderDate
                                    ).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="py-2">
                                    <Select
                                      value={order.status}
                                      onValueChange={(value) =>
                                        updateOrderStatus(order._id!, value)
                                      }
                                    >
                                      <SelectTrigger className="w-24 h-7 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">
                                          Pending
                                        </SelectItem>
                                        <SelectItem value="processing">
                                          Processing
                                        </SelectItem>
                                        <SelectItem value="completed">
                                          Completed
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                          Cancelled
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Orders Pagination */}
                      <div className="flex items-center justify-between mt-6 flex-wrap">
                        <div className="text-sm text-muted-foreground">
                          Showing{" "}
                          {(ordersPagination.current - 1) *
                            ordersPagination.pageSize +
                            1}{" "}
                          to{" "}
                          {Math.min(
                            ordersPagination.current *
                              ordersPagination.pageSize,
                            ordersPagination.total
                          )}{" "}
                          of {ordersPagination.total} orders
                        </div>
                        <div className="flex items-center space-x-2 gap-4 overflow-auto">
                          <Select
                            value={ordersPagination.pageSize.toString()}
                            onValueChange={(value) => {
                              const newPageSize = Number.parseInt(value);
                              setOrdersPagination((prev) => ({
                                ...prev,
                                pageSize: newPageSize,
                                current: 1,
                              }));
                              fetchOrders(1, newPageSize, "", orderTypeFilter);
                            }}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {availableTabs.includes("users") && (
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="w-full flex justify-between items-end flex-wrap gap-y-5">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Management
                      </CardTitle>
                      <CardDescription>
                        Manage users and their account information
                      </CardDescription>
                    </div>
                    <div className="relative w-full lg:w-[400px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users by name, email, role..."
                        onChange={(e) => handleUserSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {loading ? (
                    <UserTableSkeleton />
                  ) : users?.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No users found
                      </h3>
                      <p className="text-muted-foreground">
                        User accounts will appear here once they register.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold">
                                User
                              </TableHead>
                              <TableHead className="font-semibold">
                                Email
                              </TableHead>
                              <TableHead className="font-semibold">
                                Role
                              </TableHead>
                              <TableHead className="font-semibold">
                                Created
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users?.map((user) => (
                              <TableRow
                                key={user._id}
                                className="hover:bg-muted/25 h-12"
                              >
                                <TableCell className="py-2">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                                      {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="font-medium text-sm text-gray-900">
                                      {user.name}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 text-sm text-muted-foreground">
                                  {user.email}
                                </TableCell>
                                <TableCell className="py-2">
                                  <Badge
                                    variant={
                                      user.role === "admin"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {user.role}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-2 text-xs text-muted-foreground">
                                  {new Date(
                                    user.createdAt
                                  ).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Users Pagination */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-muted-foreground">
                          Showing{" "}
                          {(usersPagination.current - 1) *
                            usersPagination.pageSize +
                            1}{" "}
                          to{" "}
                          {Math.min(
                            usersPagination.current * usersPagination.pageSize,
                            usersPagination.total
                          )}{" "}
                          of {usersPagination.total} users
                        </div>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={usersPagination.pageSize.toString()}
                            onValueChange={(value) => {
                              const newPageSize = Number.parseInt(value);
                              setUsersPagination((prev) => ({
                                ...prev,
                                pageSize: newPageSize,
                                current: 1,
                              }));
                              fetchUsers(1, newPageSize);
                            }}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {availableTabs.includes("sub-admins") && (
            <TabsContent value="sub-admins">
              <Card>
                <CardHeader>
                  <div className="w-full flex justify-between items-end flex-wrap gap-y-5">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        Sub-Admin Management
                      </CardTitle>
                      <CardDescription>
                        Manage sub-administrators and their permissions
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <SubAdminForm
                        onSuccess={() => fetchSubAdmins()}
                        trigger={
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Sub-Admin
                          </Button>
                        }
                      />
                      <div className="relative w-full lg:w-[400px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search sub-admins by name, email..."
                          onChange={(e) => handleSubAdminSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {subAdminsLoading ? (
                    <UserTableSkeleton />
                  ) : subAdmins?.length === 0 ? (
                    <div className="text-center py-12">
                      <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No sub-admins found
                      </h3>
                      <p className="text-muted-foreground">
                        Sub-admin accounts will appear here once you create
                        them.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold">
                                Sub-Admin
                              </TableHead>
                              <TableHead className="font-semibold">
                                Email
                              </TableHead>
                              <TableHead className="font-semibold">
                                Permissions
                              </TableHead>
                              <TableHead className="font-semibold">
                                Created
                              </TableHead>
                              <TableHead className="font-semibold">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {subAdmins?.map((subAdmin) => (
                              <TableRow
                                key={subAdmin._id}
                                className="hover:bg-muted/25 h-12"
                              >
                                <TableCell className="py-2">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-7 w-7 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-medium">
                                      {subAdmin.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="font-medium text-sm text-gray-900">
                                      {subAdmin.name}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 text-sm text-muted-foreground">
                                  {subAdmin.email}
                                </TableCell>
                                <TableCell className="py-2">
                                  <div className="flex gap-1 flex-wrap">
                                    {subAdmin.permissions?.cardOrders && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Cards
                                      </Badge>
                                    )}
                                    {subAdmin.permissions?.bookOrders && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Books
                                      </Badge>
                                    )}
                                    {subAdmin.permissions?.users && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Users
                                      </Badge>
                                    )}
                                    {!subAdmin.permissions?.cardOrders &&
                                      !subAdmin.permissions?.bookOrders &&
                                      !subAdmin.permissions?.users && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          No permissions
                                        </Badge>
                                      )}
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 text-xs text-muted-foreground">
                                  {new Date(
                                    subAdmin.createdAt
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="py-2">
                                  <div className="flex gap-2">
                                    <SubAdminEditForm
                                      subAdmin={subAdmin}
                                      onSuccess={() => fetchSubAdmins()}
                                      trigger={
                                        <Button variant="outline" size="sm">
                                          <Edit className="h-3 w-3 mr-1" />
                                          Edit
                                        </Button>
                                      }
                                    />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">
                                          <Trash2 className="h-3 w-3 mr-1" />
                                          Delete
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Delete Sub-Admin
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete{" "}
                                            {subAdmin.name}? This action cannot
                                            be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              deleteSubAdmin(subAdmin._id)
                                            }
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Sub-Admins Pagination */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-muted-foreground">
                          Showing{" "}
                          {(subAdminsPagination.current - 1) *
                            subAdminsPagination.pageSize +
                            1}{" "}
                          to{" "}
                          {Math.min(
                            subAdminsPagination.current *
                              subAdminsPagination.pageSize,
                            subAdminsPagination.total
                          )}{" "}
                          of {subAdminsPagination.total} sub-admins
                        </div>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={subAdminsPagination.pageSize.toString()}
                            onValueChange={(value) => {
                              const newPageSize = Number.parseInt(value);
                              setSubAdminsPagination((prev) => ({
                                ...prev,
                                pageSize: newPageSize,
                                current: 1,
                              }));
                              fetchSubAdmins(1, newPageSize);
                            }}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Loading admin dashboard...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
