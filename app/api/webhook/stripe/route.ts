import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.text();
  console.log(body);
  return new NextResponse(null, { status: 200 });
};
