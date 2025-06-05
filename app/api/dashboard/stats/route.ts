import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();

    // Get current date and last month date
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    // Calculate end dates for each period
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get orders statistics
    const totalOrders = await db.collection("orders").countDocuments();

    const currentMonthOrders = await db.collection("orders").countDocuments({
      orderDate: { $gte: currentMonth, $lte: currentMonthEnd },
    });

    const lastMonthOrders = await db.collection("orders").countDocuments({
      orderDate: { $gte: lastMonth, $lte: lastMonthEnd },
    });

    const pendingOrders = await db.collection("orders").countDocuments({
      status: "pending",
    });

    // Calculate order growth percentage
    const orderGrowthPercentage =
      lastMonthOrders > 0
        ? Math.round(
            ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
          )
        : 0;

    // Get users statistics
    const totalUsers = await db.collection("users").countDocuments();

    const currentMonthUsers = await db.collection("users").countDocuments({
      createdAt: { $gte: currentMonth, $lte: currentMonthEnd },
    });

    const lastMonthUsers = await db.collection("users").countDocuments({
      createdAt: { $gte: lastMonth, $lte: lastMonthEnd },
    });

    // Calculate user growth percentage
    const userGrowthPercentage =
      lastMonthUsers > 0
        ? Math.round(
            ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
          )
        : 0;

    // Get revenue statistics
    const currentMonthRevenue = await db
      .collection("orders")
      .aggregate([
        {
          $match: { orderDate: { $gte: currentMonth, $lte: currentMonthEnd } },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ])
      .toArray();

    const lastMonthRevenue = await db
      .collection("orders")
      .aggregate([
        { $match: { orderDate: { $gte: lastMonth, $lte: lastMonthEnd } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ])
      .toArray();

    const totalRevenue = await db
      .collection("orders")
      .aggregate([{ $group: { _id: null, total: { $sum: "$totalPrice" } } }])
      .toArray();

    const currentMonthRevenueValue =
      currentMonthRevenue.length > 0 ? currentMonthRevenue[0].total : 0;
    const lastMonthRevenueValue =
      lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 0;
    const totalRevenueValue =
      totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    // Calculate revenue growth percentage
    const revenueGrowthPercentage =
      lastMonthRevenueValue > 0
        ? Math.round(
            ((currentMonthRevenueValue - lastMonthRevenueValue) /
              lastMonthRevenueValue) *
              100
          )
        : 0;

    return NextResponse.json({
      totalOrders,
      orderGrowthPercentage,
      totalUsers,
      userGrowthPercentage,
      totalRevenue: totalRevenueValue,
      revenueGrowthPercentage,
      pendingOrders,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
