import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const schema = z.object({
  name: z.string().trim().min(3, {
    message: "Le nom doit faire au moins 3 caractères.",
  }),
  icon: z.string().trim().min(1, { message: "L'icône est obligatoire." }),
  description: z.string().trim(),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData);
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    const locationType = await prisma.locationType.create({
      data: {
        name: parsed.data.name,
        icon: parsed.data.icon,
        description: parsed.data.description,
      },
    });

    const items = await prisma.item.findMany({
      select: {
        id: true,
      },
    });

    const locationMandatoryItemData = items.map((item) => {
      return {
        itemId: item.id,
        locationTypeId: locationType.id,
      };
    });

    await prisma.locationMandatoryItem.createMany({
      data: locationMandatoryItemData,
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "LocationType added successfully",
        locationType,
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
