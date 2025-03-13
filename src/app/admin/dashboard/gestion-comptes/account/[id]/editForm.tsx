"use client";

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
import { updateUser } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Le nom doit contenir au moins 3 caractères",
  }),
  email: z.string().email({
    message: "L'adresse email doit être valide",
  }),
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères",
  }),
  error: z.string().optional(),
  role: z.enum(["manager", "admin", "president"]),
});

export default function EditForm({ data }: { data: any }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const errorMessage = await updateUser(data?.id, values);

    if (errorMessage) {
      form.setError("error", { type: "manual", message: errorMessage });
      return;
    }

    toast("Mise à jour effectuée", {
      description: "Le chef de centre a été mis à jour.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Chef de centre</FormLabel>
              <FormControl>
                <Input
                  placeholder="Entrez ici le nom"
                  {...field}
                  className="h-12 text-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Entrez ici l'email"
                  {...field}
                  className="h-12 text-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Mot de passe</FormLabel>
              <FormControl>
                <Input
                  placeholder="Entrez ici le mot de passe"
                  {...field}
                  className="h-12 text-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => {
            const { value } = field;
            let role;

            if (value === "manager") {
              role = "Chef de centre";
            } else if (value === "admin") {
              role = "Administrateur";
            } else if (value === "president") {
              role = "Président de la CENI";
            }

            return (
              <FormItem>
                <FormLabel className="text-md">Rôle</FormLabel>
                <FormControl>
                  <div className="relative overflow-hidden rounded-md">
                    <Input
                      value={value}
                      readOnly
                      className="h-12 text-md bg-gray-100"
                    />
                    <span className="absolute inset-0 bg-gray-100 flex items-center px-4">
                      <span>{role}</span>
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="bg-cblue hover:bg-cblue/80 text-white transition-all duration-300 w-full rounded-lg h-12 uppercase relative overflow-hidden"
        >
          {form.formState.isSubmitting ? (
            <span className="absolute inset-0 flex items-center justify-center scale-150">
              <LoaderCircle className="animate-spin block" />
            </span>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </form>
    </Form>
  );
}
