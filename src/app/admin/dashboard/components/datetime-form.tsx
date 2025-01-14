"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DEFAULT_DURATION,
  Duration,
  TIME_OPTIONS,
} from "../constants/time-options";
import { useSessionTimer } from "../hooks/useSessionTimer";

// Schéma de validation du formulaire
const FormSchema = z.object({
  during: z.string(),
});

// Type dérivé du schéma pour le typage des valeurs du formulaire
type FormValues = z.infer<typeof FormSchema>;

export function DateTimeForm() {
  // Initialisation du client Supabase
  const supabase = createClient();
  // Hook personnalisé pour gérer l'état du timer
  const { timerRunning, setTimerRunning } = useSessionTimer();

  // Configuration du formulaire avec React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      during: DEFAULT_DURATION,
    },
  });

  /**
   * Gère la soumission du formulaire
   * Met à jour la durée de la session dans la base de données
   */
  const onSubmit = async (data: FormValues) => {
    try {
      // Calcule la date de fin basée sur la durée sélectionnée
      const endTime = calculateEndTime(data.during as Duration);
      // Met à jour la base de données avec la nouvelle durée
      const { error } = await supabase
        .from("duree")
        .update({ fin: endTime, end_session: false })
        .eq("id", 1);

      if (error) throw error;
      setTimerRunning(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-2 items-center"
      >
        {/* Champ de sélection de la durée */}
        <FormField
          control={form.control}
          name="during"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Durée de la session" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bouton de soumission */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || timerRunning}
          className="bg-cred hover:bg-cred/70 transition-all duration-300 font-semibold px-8 text-nowrap w-max py-2 rounded-lg"
        >
          {form.formState.isSubmitting && (
            <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
          )}
          Démarrer la session
        </Button>
      </form>
    </Form>
  );
}

/**
 * Calcule la date de fin de session basée sur la durée sélectionnée
 * @param duration - Durée sélectionnée (format: "Xmin" ou "Xh")
 * @returns Date ISO string de fin de session
 */
function calculateEndTime(duration: Duration): string {
  const now = new Date();
  const timeInMs = duration.includes("min")
    ? parseInt(duration) * 60 * 1000 // Conversion minutes en millisecondes
    : parseInt(duration) * 60 * 60 * 1000; // Conversion heures en millisecondes

  return new Date(now.getTime() + timeInMs).toISOString();
}
