"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface SubAdminFormProps {
  onSuccess: () => void;
}

export function SubAdminForm({ onSuccess }: SubAdminFormProps) {
  const [open, setOpen] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/sub-admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Sub-admin created successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          permissions: {
            cardOrders: false,
            bookOrders: false,
            users: false,
          },
        });
        setOpen(false);
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create sub-admin");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Sub-Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Sub-Admin</DialogTitle>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
