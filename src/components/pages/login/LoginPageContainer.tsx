"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LoginPageUI as UI } from "@/components/ui/login/LoginPage.view";
import { LOGIN_PAGE_COPY } from "@/constants/loginpage";
import { supabase } from "@/lib/supabaseClient";

export function LoginPageContainer() {
  const router = useRouter();
  const year = new Date().getFullYear();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({
            email,
            password,
          })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                shop_name: shopName,
                role: "admin",
                display_name: "Owner",
              },
            },
          });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    // 이메일 인증 ON 상태: 가입 후에는 이동하지 않고 안내만
    if (mode === "signup") {
      setSuccessMessage(
        "이메일로 인증 링크를 보냈어요.\n메일을 확인하고 인증을 완료한 뒤 로그인해주세요."
      );
      return;
    }

    // 로그인 성공 시에만 main으로 이동
    router.replace("/main");
  };

  const toggleMode = () => {
    setError("");
    setSuccessMessage("");
    setPassword("");
    setConfirmPassword("");

    if (mode === "login") {
      // login -> signup
      setShopName("");
    }

    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <UI.Layout>
      <UI.Main>
        <Logo />

        <UI.AuthForm
          mode={mode}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          shopName={shopName}
          onChangeEmail={setEmail}
          onChangePassword={setPassword}
          onChangeConfirmPassword={setConfirmPassword}
          onChangeShopName={setShopName}
          onSubmit={handleSubmit}
          onToggleMode={toggleMode}
          loading={loading}
          error={error}
          successMessage={successMessage}
        />
      </UI.Main>

      <UI.Footer year={year} appName={LOGIN_PAGE_COPY.appName} />
    </UI.Layout>
  );
}
