"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { hebrewContent } from "@/locales/he";
import { UserGender } from "@/lib/types/user.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOnboardingStore, OnboardingStep } from "../store/onboarding-store";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const { onboarding } = hebrewContent;
const step = onboarding.steps.personalDetails;

const personalDetailsSchema = z.object({
  name: z.string().min(2, step.name.error),
  age: z.preprocess(
    (a) => (a === "" ? undefined : Number(a)),
    z.number().min(13, step.age.error).max(120, step.age.error)
  ),
  gender: z.enum([
    UserGender.MALE,
    UserGender.FEMALE,
    UserGender.NOT_SPECIFIED,
  ]),
});

type PersonalDetailsForm = z.infer<typeof personalDetailsSchema>;

export function PersonalDetailsStep() {
  const { updatePersonalDetails, setStep } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PersonalDetailsForm>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      name: "",
      age: undefined,
      gender: UserGender.NOT_SPECIFIED,
    },
  });

  const onSubmit = async (values: PersonalDetailsForm) => {
    setIsLoading(true);
    try {
      updatePersonalDetails(values);
      setStep(OnboardingStep.TimePreference);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-lg font-semibold">{step.title}</h2>
        <p className="text-sm text-muted-foreground">{step.subtitle}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm">{step.name.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={step.name.placeholder}
                    className="h-9"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  {step.name.description}
                </FormDescription>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-sm">{step.age.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={step.age.placeholder}
                    className="h-9"
                    value={field.value === undefined ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? "" : Number(value));
                    }}
                    min={13}
                    max={120}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  {step.age.description}
                </FormDescription>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm">{step.gender.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col gap-1"
                  >
                    {Object.entries(step.gender.options).map(([key, label]) => (
                      <FormItem
                        key={key}
                        className="flex items-center space-x-3 space-x-reverse"
                      >
                        <FormControl>
                          <RadioGroupItem value={key} className="h-4 w-4" />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormDescription className="text-xs">
                  {step.gender.description}
                </FormDescription>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-9 mt-2"
            disabled={isLoading}
          >
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
    </motion.div>
  );
}
