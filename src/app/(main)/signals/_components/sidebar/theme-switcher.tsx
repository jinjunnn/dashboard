"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 确保组件只在客户端渲染后显示真实主题
  useEffect(() => {
    setMounted(true);
  }, []);

  // 在服务端渲染或未挂载时显示占位符
  if (!mounted) {
    return (
      <Button size="icon" disabled>
        <Sun />
      </Button>
    );
  }

  return (
    <Button size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      {resolvedTheme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
