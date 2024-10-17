import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    // Find all users matching the provided name
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: name, // partial matching
          mode: 'insensitive' // case-insensitive search
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // If users are found, return the list
    if (users.length > 0) {
      return NextResponse.json(users, {
        status: 501,
      });
    }

    // If no users are found, return an appropriate message
    return NextResponse.json({
      msg: "No users found",
    }, {
      status: 404,
    });
  } catch (error) {
    // Handle any errors that occur
    return NextResponse.json({
      error: "An error occurred during the search",
    }, {
      status: 500,
    });
  }
}
