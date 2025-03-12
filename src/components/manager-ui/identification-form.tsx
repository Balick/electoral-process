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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { getCenter } from "@/lib/supabase/center";
import { getVoterById } from "@/lib/supabase/utils";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  pin: z.string(),
});

export default function IdentificationForm({
  centerName,
}: {
  centerName: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { pin } = data;
    setIsLoading(true);
    setError("");

    await getVoterById(pin).then(async (elector) => {
      if (elector.length === 0) {
        setError("Le numéro de la carte n'existe pas.");
        setIsLoading(false);
        return;
      }

      if (elector[0].a_vote) {
        setError(`L'électeur ${elector[0].nom} a déjà voté`);
        setIsLoading(false);
        return;
      }

      const center = await getCenter(elector[0].id_centre);
      if (center && centerName !== center.nom) {
        console.log(centerName, center.nom);
        setError(
          `L'électeur ${elector[0].nom} n'est pas de ce centre.\nVeuillez vous rendre au centre ${center.nom}/${center.ville}/${center.province}`
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      router.replace(`/center/${centerName}/votes/${pin}`);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl font-semibold">
                Numéro d&apos;identification
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <span className="block text-xl md:text-4xl mr-2">NN</span>
                  <InputOTP maxLength={11} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                      <InputOTPSlot index={8} />
                      <InputOTPSlot index={9} />
                      <InputOTPSlot index={10} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </FormControl>
              <FormDescription className="text-base md:text-lg text-black">
                <span className="text-red-500 block font-semibold">
                  {error}
                </span>
                Veuillez saisir le numéro d&apos;identification de votre carte
                d&apos;électeur. <br /> Vous pouvez trouver votre carte au coin
                droit de votre carte d&apos;électeur comme sur la photo
                présente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading || form.watch("pin").length !== 11}
          className={cn(
            "w-full h-auto py-4 uppercase font-semibold bg-cblue-light hover:bg-cblue active:bg-cblue active:scale-105 text-lg transition-all duration-300",
            form.watch("pin").length !== 11 && "invisible"
          )}
        >
          {isLoading ? (
            <Loader2Icon className="h-8 w-8 animate-spin" />
          ) : (
            "Valider"
          )}
        </Button>
      </form>
    </Form>
  );
}
