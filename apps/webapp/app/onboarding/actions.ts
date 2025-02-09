"use server";

import { auth } from "@/auth";
import { onboardingApi } from "@/lib/http-clients/backend/client";
import { userService } from "@/lib/services/user-service";
import { UserGender } from "@/lib/types/user.types";
import Logger from "@/logger/logger";
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
  preferences: z.array(
    z.object({
      title: z.string(),
      subtitle: z.string(),
      content: z.string(),
      description: z.string(),
      categories: z.array(z.string()),
      enrichment: z.object({}),
      author: z.string(),
    })
  ),
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

export async function updateUser(
  data: UserUpdateData
): Promise<UpdateUserResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return unauthorized();
  }

  Logger.getInstance().info("Starting updateUser with data", { data });

  const userEmail = session.user.email;

  Logger.getInstance().info("Processing update for userId", { userEmail });
  try {
    const validatedFields = userUpdateSchema.safeParse(data);
    Logger.getInstance().info("Validation result", { validatedFields });

    if (!validatedFields.success) {
      Logger.getInstance().error("Validation failed", {
        error: validatedFields.error,
      });
      return {
        success: false,
        error: "Invalid data provided",
      };
    }

    await userService.updateUser(userEmail, {
      $set: {
        ...validatedFields.data,
        isOnboardingDone: true,
      },
    });
    Logger.getInstance().info("User updated successfully");

    return {
      success: true,
    };
  } catch (error) {
    Logger.getInstance().error("Error updating user", { error });
    return {
      success: false,
      error: "Failed to update user",
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
    Logger.getInstance().error("Error ingesting reader", { error });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to ingest reader",
    };
  }
}

export async function getUserInformation() {
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

    return {
      success: true,
      data: {
        name: user.name,
        gender: user.gender,
        digestTime: user.digestTime,
        digestChannel: user.digestChannel,
        preferences: user.preferences,
        enrichment: user.enrichment,
        age: user.age,
      },
    };
  } catch (error) {
    Logger.getInstance().error("Error fetching user information", { error });
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch user information",
    };
  }
}
