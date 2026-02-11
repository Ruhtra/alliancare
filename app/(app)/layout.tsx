"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, History, Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetPopup,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app", icon: Home, label: "Início" },
  { href: "/app/historico", icon: History, label: "Histórico" },
  { href: "/app/lembretes", icon: Bell, label: "Lembretes" },
  { href: "/app/perfil", icon: User, label: "Perfil" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 hidden border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/app" className="flex items-center gap-2">
            <Image
              src="/vigidoc-logo.png"
              alt="VigiDoc Logo"
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <span className="text-xl font-semibold text-primary">VigiDoc</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "gap-2",
                      isActive && "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetPopup>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Acesso rápido a todas as funcionalidades
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </SheetPopup>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "flex h-14 w-full flex-col gap-1 rounded-lg",
                    isActive && "bg-secondary text-secondary-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-14 flex-1 flex-col gap-1 rounded-lg"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetPopup side="bottom">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Acesso rápido a todas as funcionalidades
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </SheetPopup>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}
