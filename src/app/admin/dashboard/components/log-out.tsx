"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LogOut() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signOut();
    router.replace("/admin/signin");
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2 items-center">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-cred hover:bg-cred/70 transition-all duration-300 font-semibold px-8 text-nowrap w-max py-2 rounded-lg"
      >
        {isSubmitting && (
          <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
        )}
        Déconnexion
      </Button>
    </form>
  );
}
