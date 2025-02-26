import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  name: z.string().trim().min(3, {
    message: "Le nom doit faire au moins 3 caractères.",
  }),
  locationType: z.string().trim().min(1),
  description: z.string().trim(),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    const location = await prisma.location.create({
      data: {
        name: parsed.data.name,
        locationTypeId: Number(parsed.data.locationType),
        description: parsed.data.description,
      },
    });

    const items = await prisma.item.findMany({
      select: {
        id: true,
      },
    });

    const locationItemsData = items.map((item) => {
      return {
        itemId: item.id,
        locationId: location.id,
      };
    });

    await prisma.locationItem.createMany({
      data: locationItemsData,
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Location added successfully",
        location,
      }),
      {
        status: 201,
      },
    );
  } else {
    const error: ZodError = parsed.error;
    let errorMessage = "";

    error.errors.map((error) => {
      errorMessage += error.message + "\n";
    });

    return new NextResponse(
      JSON.stringify({
        success: false,
        error: { message: errorMessage },
      }),
      { status: 400 },
    );
  }
}
