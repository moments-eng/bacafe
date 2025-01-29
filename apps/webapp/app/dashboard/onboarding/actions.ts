"use server";

import { auth } from "@/auth";
import { onboardingApi } from "@/lib/http-clients/backend/client";
import { PreferredArticle } from "@/lib/models/user.model";
import { userService } from "@/lib/services/user-service";
import { UserGender } from "@/lib/types/user.types";
import { unauthorized } from "next/navigation";
import { z } from "zod";

const userUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  age: z.number().min(13).max(120).optional(),
  gender: z
    .enum([UserGender.FEMALE, UserGender.MALE, UserGender.NOT_SPECIFIED])
    .optional(),
  isOnboardingDone: z.boolean().optional(),
  digestTime: z.string().optional(),
  articleScores: z
    .array(
      z.object({
        articleId: z.number(),
        score: z.union([z.literal(-1), z.literal(1)]),
      })
    )
    .optional(),
  digestChannel: z.enum(["email", "whatsapp"]).optional(),
  phoneNumber: z
    .string()
    .regex(/^05\d{8}$/)
    .optional(),
});

type UserUpdateData = z.infer<typeof userUpdateSchema>;

interface UpdateUserResponse {
  success: boolean;
  summary?: string;
  error?: string;
}

export async function ingestReader(): Promise<UpdateUserResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return unauthorized();
  }

  try {
    const user = await userService.getUser(session.user.email);
    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const dataBackendUrl = process.env.DATA_BACKEND_URL;
    if (!dataBackendUrl) {
      throw new Error("DATA_BACKEND_URL is not configured");
    }

    const { name, gender, digestTime, preferences, age } = user;
    const reader = {
      name,
      gender,
      digestTime,
      preferences,
      age,
    };

    const response = await fetch(`${dataBackendUrl}/api/ingest-reader`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reader),
    });

    if (!response.ok) {
      throw new Error("Failed to ingest reader");
    }

    const { embeddings, ...rest } = await response.json();
    await userService.updateUser(session.user.email, {
      $set: { enrichment: rest, embeddings },
    });

    return {
      success: true,
      summary: rest.summary,
    };
  } catch (error) {
    console.error("Error ingesting reader:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to ingest reader",
    };
  }
}

export async function updateUser(
  data: UserUpdateData
): Promise<UpdateUserResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return unauthorized();
  }

  console.log("Starting updateUser with data:", data);

  const userEmail = session.user.email;

  console.log("Processing update for userId:", userEmail);

  try {
    const validatedFields = userUpdateSchema.safeParse(data);
    console.log("Validation result:", validatedFields);

    if (!validatedFields.success) {
      console.log("Validation failed:", validatedFields.error);
      return {
        success: false,
        error: "Invalid data provided",
      };
    }

    await userService.updateUser(userEmail, { $set: validatedFields.data });
    console.log("User updated successfully");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: "Failed to update user",
    };
  }
}

export async function updateArticleScore(
  preferredArticle: PreferredArticle
): Promise<UpdateUserResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return unauthorized();
  }
  const userEmail = session.user.email;

  try {
    await userService.updateUser(userEmail, {
      $push: { preferences: preferredArticle },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating article score:", error);
    return {
      success: false,
      error: "Failed to update article score",
    };
  }
}

export async function getProductionOnboarding() {
  try {
    const { data } = await onboardingApi.getProductionOnboarding();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch production onboarding");
  }
}
