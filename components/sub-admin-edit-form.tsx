"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SubAdmin {
  _id: string;
  name: string;
  email: string;
  permissions: {
    cardOrders: boolean;
    bookOrders: boolean;
    users: boolean;
  };
}

interface SubAdminEditFormProps {
  subAdmin: SubAdmin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SubAdminEditForm({
  subAdmin,
  open,
  onOpenChange,
  onSuccess,
}: SubAdminEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    permissions: {
      cardOrders: false,
      bookOrders: false,
      users: false,
    },
  });

  useEffect(() => {
    if (subAdmin) {
      setFormData({
        name: subAdmin.name,
        email: subAdmin.email,
        password: "",
        permissions: subAdmin.permissions,
      });
    }
  }, [subAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subAdmin) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/sub-admins/${subAdmin._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Sub-admin updated successfully");
        onOpenChange(false);
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update sub-admin");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Sub-Admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              Password (leave blank to keep current)
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cardOrders"
                  checked={formData.permissions.cardOrders}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      permissions: {
                        ...formData.permissions,
                        cardOrders: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="cardOrders">Card Orders</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bookOrders"
                  checked={formData.permissions.bookOrders}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      permissions: {
                        ...formData.permissions,
                        bookOrders: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="bookOrders">Book Orders</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="users"
                  checked={formData.permissions.users}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      permissions: {
                        ...formData.permissions,
                        users: checked as boolean,
                      },
                    })
                  }
                />
                <Label htmlFor="users">Users</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
