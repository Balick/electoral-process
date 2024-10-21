"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { login, signup } from "@/lib/actions";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const pathname = usePathname();
  const target = pathname === "/center/signin" ? "center" : "admin";

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Votre adresse mail"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              defaultValue={email}
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className="bg-slate-50 border text-lg px-4 py-2 rounded-lg hover:ring-4 focus:ring-4 focus:outline-none ring-cblue-light/20"
            />
          </div>

          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Votre mot de passe"
              autoCapitalize="none"
              autoCorrect="off"
              defaultValue={password}
              disabled={isSubmitting}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              className="bg-slate-50 border text-lg px-4 py-2 rounded-lg hover:ring-4 focus:ring-4 focus:outline-none ring-cblue-light/20"
            />
          </div>

          <Input
            id="target"
            type="target"
            name="target"
            value={target}
            className="hidden"
          />

          <Button
            disabled={isSubmitting}
            formAction={login}
            className="bg-cblue hover:bg-cblue/80 uppercase px-8 py-2 h-auto text-lg max-h-none"
          >
            {isSubmitting && (
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            S&apos;authentifier
          </Button>
        </div>
      </form>
    </div>
  );
}
