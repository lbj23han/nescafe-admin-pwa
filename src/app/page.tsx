// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { PinInput } from "@/components/PinInput";
import { LoginPageUI as UI } from "@/components/ui/loginPage";
import { LOGIN_PAGE_COPY } from "@/constants/loginpage";

export default function LoginPage() {
  const router = useRouter();
  const year = new Date().getFullYear();

  return (
    <UI.Layout>
      <UI.Main>
        <Logo />
        <PinInput onSubmit={() => router.push("/main")} />
      </UI.Main>

      <UI.Footer year={year} appName={LOGIN_PAGE_COPY.appName} />
    </UI.Layout>
  );
}
