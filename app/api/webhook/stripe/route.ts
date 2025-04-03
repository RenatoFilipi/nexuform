import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.text();
  return new NextResponse(null, { status: 200 });
};
