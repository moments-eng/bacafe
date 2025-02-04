"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { hebrewContent } from "@/locales/he";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useOnboardingStore, OnboardingStep } from "../store/onboarding-store";

const { onboarding } = hebrewContent;
const step = onboarding.steps.digestChannel;
const { channels } = step;

const formSchema = z.object({
  channel: z.enum(["email", "whatsapp"], {
    required_error: step.error,
  }),
  phoneNumber: z
    .string()
    .regex(/^05\d{8}$/, {
      message: channels.whatsapp.phoneNumber.error.invalid,
    })
    .optional()
    .refine((val) => {
      if (!val) {
        return false;
      }
      return true;
    }, channels.whatsapp.phoneNumber.error.required)
    .optional(),
});

type DigestChannelForm = z.infer<typeof formSchema>;

export function DigestChannelStep() {
  const { updateDigestChannel, setStep } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DigestChannelForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channel: "whatsapp",
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: DigestChannelForm) => {
    setIsLoading(true);
    try {
      updateDigestChannel(values.channel, values.phoneNumber);
      setStep(OnboardingStep.Login);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{step.title}</h2>
        <p className="text-sm text-muted-foreground">{step.subtitle}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 gap-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label>
                    <div
                      className={cn(
                        "relative p-4 border rounded-lg cursor-not-allowed opacity-50 transition-all",
                        "border-muted"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium">
                            {channels.email.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {channels.email.description}{" "}
                            {channels.email.comingSoon}
                          </p>
                        </div>
                        <RadioGroupItem
                          value="email"
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          disabled
                        />
                      </div>
                    </div>
                  </label>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label>
                    <div
                      className={cn(
                        "relative p-4 border rounded-lg cursor-pointer transition-all",
                        field.value === "whatsapp"
                          ? "border-primary ring-2 ring-primary/10 bg-primary/5"
                          : "border-muted hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <MessageCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium">
                            {channels.whatsapp.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {channels.whatsapp.description}
                          </p>
                        </div>
                        <RadioGroupItem
                          value="whatsapp"
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                        />
                      </div>
                    </div>
                  </label>
                </motion.div>
              </RadioGroup>
            )}
          />

          {form.watch("channel") === "whatsapp" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder={channels.whatsapp.phoneNumber.placeholder}
                        {...field}
                        className="text-right ltr"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {channels.whatsapp.phoneNumber.hint}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          <Button type="submit" className="w-full h-9" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {onboarding.loading.title}
              </>
            ) : (
              step.nextButton
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
