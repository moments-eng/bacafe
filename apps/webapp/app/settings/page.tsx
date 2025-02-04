"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserGender } from "@/lib/types/user.types";
import { hebrewContent } from "@/locales/he";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getUserInformation, updateUser } from "../onboarding/actions";

const settingsFormSchema = z.object({
  name: z.string().min(2).max(50),
  age: z.number().min(13).max(120).optional(),
  gender: z.enum([
    UserGender.FEMALE,
    UserGender.MALE,
    UserGender.NOT_SPECIFIED,
  ]),
  digestTime: z.string(),
  digestChannel: z.enum(["email", "whatsapp"]),
  preferences: z
    .array(
      z.object({
        title: z.string(),
        subtitle: z.string(),
        content: z.string(),
        description: z.string(),
        categories: z.array(z.string()),
        author: z.string(),
        enrichment: z.object({}),
      })
    )
    .default([]),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const { settings } = hebrewContent;

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      name: "",
      gender: UserGender.NOT_SPECIFIED,
      digestChannel: "email",
      digestTime: "08:00",
      age: undefined,
      preferences: [],
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      const response = await getUserInformation();
      if (response.success && response.data) {
        const { name, gender, digestTime, digestChannel, age, preferences } =
          response.data;
        form.reset({
          name: name || "",
          gender: gender || UserGender.NOT_SPECIFIED,
          age: age || undefined,
          digestTime: digestTime || "08:00",
          digestChannel: digestChannel || "email",
          preferences: preferences || [],
        });
      }
    };

    loadUserData();
  }, [form]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      const response = await updateUser(data);
      if (response.success) {
        toast({
          title: settings.toast.success,
        });
      } else {
        toast({
          variant: "destructive",
          title: settings.toast.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: settings.toast.error,
      });
    }
  };

  const handleRemoveData = async () => {
    // TODO: Implement data removal functionality
    toast({
      title: settings.toast.dataRemoved,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{settings.title}</h1>
        <p className="text-muted-foreground">{settings.subtitle}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">
                {settings.sections.profile.title}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {settings.sections.profile.name.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={settings.sections.profile.name.placeholder}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {settings.sections.profile.gender.label}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(
                          settings.sections.profile.gender.options
                        ).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{settings.sections.profile.age.label}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={settings.sections.profile.age.placeholder}
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">
                {settings.sections.preferences.title}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="digestTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {settings.sections.preferences.digestTime.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder={
                          settings.sections.preferences.digestTime.placeholder
                        }
                        {...field}
                        value={field.value || "08:00"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="digestChannel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {settings.sections.preferences.digestChannel.label}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(
                          settings.sections.preferences.digestChannel.options
                        ).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="w-full sm:w-auto">
              {settings.toast.success}
            </Button>
          </div>
        </form>
      </Form>

      <Card className="border-destructive">
        <CardHeader>
          <h2 className="text-lg font-semibold text-destructive">
            {settings.sections.danger.title}
          </h2>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                {settings.sections.danger.removeData.button}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {settings.sections.danger.removeData.confirmTitle}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {settings.sections.danger.removeData.confirmDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {settings.sections.danger.removeData.cancelButton}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemoveData}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {settings.sections.danger.removeData.confirmButton}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
