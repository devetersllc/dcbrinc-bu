"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ExternalLink, RefreshCw, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuickBooksConnectionStatus {
  isConnected: boolean
  connectedAt?: string
  expiresAt?: string
  companyName?: string
  error?: string
}

export function QuickBooksConnectButton() {
  const [connectionStatus, setConnectionStatus] = useState<QuickBooksConnectionStatus>({
    isConnected: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkConnectionStatus()
  }, [])

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch("/api/quickbooks/status")
      const data = await response.json()
      setConnectionStatus(data)
    } catch (error) {
      console.error("Failed to check QuickBooks connection:", error)
      setConnectionStatus({ isConnected: false, error: "Failed to check connection status" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      // Redirect to QuickBooks OAuth
      window.location.href = "/api/auth/quickbooks/connect"
    } catch (error) {
      console.error("Failed to initiate QuickBooks connection:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to initiate QuickBooks connection. Please try again.",
        variant: "destructive",
      })
      setIsConnecting(false)
    }
  }

  const handleRefreshToken = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/quickbooks/refresh", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Token Refreshed",
          description: "QuickBooks connection has been refreshed successfully.",
        })
        await checkConnectionStatus()
      } else {
        throw new Error("Failed to refresh token")
      }
    } catch (error) {
      console.error("Failed to refresh token:", error)
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh QuickBooks token. You may need to reconnect.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      const response = await fetch("/api/quickbooks/disconnect", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Disconnected",
          description: "QuickBooks has been disconnected successfully.",
        })
        setConnectionStatus({ isConnected: false })
      } else {
        throw new Error("Failed to disconnect")
      }
    } catch (error) {
      console.error("Failed to disconnect:", error)
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect QuickBooks. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded"></div>
            QuickBooks Integration
          </CardTitle>
          <CardDescription>Loading connection status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">QB</span>
          </div>
          QuickBooks Integration
        </CardTitle>
        <CardDescription>
          {connectionStatus.isConnected
            ? "Connected and ready to process payments"
            : "Connect your QuickBooks account to process payments"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectionStatus.isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            </div>

            {connectionStatus.companyName && (
              <div className="text-sm text-muted-foreground">
                <strong>Company:</strong> {connectionStatus.companyName}
              </div>
            )}

            {connectionStatus.connectedAt && (
              <div className="text-sm text-muted-foreground">
                <strong>Connected:</strong> {new Date(connectionStatus.connectedAt).toLocaleDateString()}
              </div>
            )}

            {connectionStatus.expiresAt && (
              <div className="text-sm text-muted-foreground">
                <strong>Expires:</strong> {new Date(connectionStatus.expiresAt).toLocaleDateString()}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshToken}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh Token"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="text-red-600 hover:text-red-700 bg-transparent"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {connectionStatus.error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {connectionStatus.error}
              </div>
            )}

            <Button onClick={handleConnect} disabled={isConnecting} className="w-full bg-blue-600 hover:bg-blue-700">
              {isConnecting ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Connect QuickBooks
                </div>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              You'll be redirected to QuickBooks to authorize this application
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
