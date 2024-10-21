"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { updateEndTime } from "@/lib/supabase/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const FormSchema = z.object({
  during: z.string(),
});

export function DateTimeForm() {
  const supabase = createClient();
  const [sessionHasEnded, setSessionHasEnded] = useState(false);

  useEffect(() => {
    const checkSessionStatus = async () => {
      const { data, error } = await supabase
        .from("duree")
        .select("end_session, fin")
        .single();

      if (error) {
        console.error(
          "Erreur lors de la récupération du statut de la session:",
          error
        );
      } else {
        const endTime = new Date(data.fin);
        // @ts-ignore
        setSessionHasEnded(endTime - new Date() < 0);
      }
    };

    checkSessionStatus();

    const channel = supabase
      .channel("public:duree")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "duree",
        },
        (payload) => {
          const endTime = new Date(payload.new.end);
          setSessionHasEnded(endTime < new Date());
        }
      )
      .subscribe();

    // Vérifier toutes les minutes si la session a expiré
    const intervalId = setInterval(() => {
      checkSessionStatus();
    }, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, [supabase]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      during: "15min",
    },
  });

  const calculateEndTime = (duration: string) => {
    const now = new Date();
    let timeInMs;

    if (duration.includes("min")) {
      const minutes = parseInt(duration.replace("min", ""));
      timeInMs = minutes * 60 * 1000;
    } else if (duration.includes("h")) {
      const hours = parseInt(duration.replace("h", ""));
      timeInMs = hours * 60 * 60 * 1000;
    }

    // @ts-ignore
    const endTime = new Date(now.getTime() + timeInMs);
    return endTime.toISOString();
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const endTime = calculateEndTime(data.during);
    await updateEndTime(endTime);
    setSessionHasEnded(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-2 items-center"
      >
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
                  <SelectItem value="15min">15 minutes</SelectItem>
                  <SelectItem value="24h">24 heures</SelectItem>
                  <SelectItem value="10min">10 minutes</SelectItem>
                  <SelectItem value="5min">5 minutes</SelectItem>
                  <SelectItem value="1min">1 minutes</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
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
