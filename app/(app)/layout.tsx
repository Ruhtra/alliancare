"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, History, Bell, User, Menu, LogOut, Settings, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-accent/5 to-background">
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 hidden border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 md:block">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/app" className="flex items-center gap-3">
            <Image
              src="/vigidoc-logo.png"
              alt="VigiDoc Logo"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">VigiDoc</span>
              <span className="text-xs text-muted-foreground">sinais vitais</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="lg"
                    className={cn(
                      "gap-2 font-semibold",
                      isActive && "shadow-lg shadow-primary/20"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-xl">
                  <Heart className="h-6 w-6 text-primary" />
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-base"
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
                <div className="my-4 h-px bg-border" />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-base"
                >
                  <Settings className="h-5 w-5" />
                  Configurações
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-base text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => (window.location.href = "/")}
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-0">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/95 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center gap-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-accent hover:text-foreground">
                  <Menu className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Menu
                </span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2 pb-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-base"
                >
                  <Settings className="h-5 w-5" />
                  Configurações
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-base text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => (window.location.href = "/")}
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}
