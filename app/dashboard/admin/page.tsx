"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { logoutUser } from "@/lib/features/auth/authSlice"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/hooks"

type User = {
  _id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useAuth("admin")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchUsers()
    }
  }, [isAuthenticated, user])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Call the logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Update Redux state
      dispatch(logoutUser())

      // Redirect to login page
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Don't render anything until we've checked authentication
  if (!user) {
    return <div className="py-10">Loading...</div>
  }

  return (
    <div className="py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>Manage users and system settings</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium mb-4">User Management</h3>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
