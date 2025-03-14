"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide" }),
  password: z.string().min(1, { message: "Veuillez entrer un mot de passe" }),
  target: z.string().optional(),
});

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      target: "",
    },
  });

  // Define a submit handler
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password } = data;
    const errorMessage = await login({ email, password });

    if (errorMessage) {
      form.setError("target", { type: "manual", message: errorMessage });
      return;
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
          {/* Define the email input field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Votre adresse mail"
                    type="email"
                    {...field}
                    className="bg-slate-50 border text-lg px-4 py-2 rounded-lg hover:ring-4 focus:ring-4 focus:outline-none ring-cblue-light/20"
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          {/* Define the password input field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Votre mot de passe"
                    type="password"
                    {...field}
                    className="bg-slate-50 border text-lg px-4 py-2 rounded-lg hover:ring-4 focus:ring-4 focus:outline-none ring-cblue-light/20"
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          {/* 
            Define the target input field
            Note: The target input field is hidden
            It is used just to display the error message 
          */}
          <FormField
            control={form.control}
            name="target"
            render={() => (
              <FormItem>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            className="bg-cblue hover:bg-cblue/80 uppercase px-8 py-2 h-auto text-lg max-h-none"
          >
            {form.formState.isSubmitting && (
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            S&apos;authentifier
          </Button>
        </form>
      </Form>
    </div>
  );
}
