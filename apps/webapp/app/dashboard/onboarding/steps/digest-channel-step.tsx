"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { hebrewContent } from "@/locales/he";
import { useOnboardingStore } from "@/stores/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateUser } from "../actions";

const { onboarding } = hebrewContent;
const { channels } = onboarding.steps[4];

const formSchema = z.object({
  channel: z.enum(["email", "whatsapp"], {
    required_error: onboarding.steps[4].error,
  }),
});

export function DigestChannelStep() {
  const { digestChannel, setDigestChannel, nextStep } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channel: digestChannel || "email",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = await updateUser({
        digestChannel: values.channel,
      });

      if (result.success) {
        setDigestChannel(values.channel);
        nextStep();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{onboarding.steps[4].header}</h2>
        <p className="text-sm text-muted-foreground">
          {onboarding.steps[4].subheader}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RadioGroup
          onValueChange={(value) =>
            form.setValue("channel", value as "email" | "whatsapp")
          }
          defaultValue={form.watch("channel")}
          className="grid grid-cols-1 gap-4"
        >
          {Object.entries(channels).map(([key, config], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <label>
                <div
                  className={cn(
                    "relative p-4 border rounded-lg cursor-pointer transition-all",
                    form.watch("channel") === key
                      ? "border-primary ring-2 ring-primary/10 bg-primary/5"
                      : "border-muted hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {key === "email" ? (
                        <Mail className="h-6 w-6 text-primary" />
                      ) : (
                        <MessageCircle className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{config.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {config.description}
                      </p>
                    </div>
                    <RadioGroupItem
                      value={key}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </div>
              </label>
            </motion.div>
          ))}
        </RadioGroup>

        <Button type="submit" className="w-full h-9" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {onboarding.buttons.loading}
            </>
          ) : (
            onboarding.buttons.continue
          )}
        </Button>
      </form>
    </div>
  );
}
