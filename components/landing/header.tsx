"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

// const navLinks = [
//   { href: "#how-it-works", label: "How It Works" },
//   { href: "#profiles", label: "Profiles" },
//   { href: "#success-stories", label: "Success Stories" },
//   { href: "#pricing", label: "Pricing" },
// ]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm border-b border-border"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Heart className="h-8 w-8 text-primary fill-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight">
              My<span className="text-primary">Saadi</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {/* <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div> */}

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button> */}
            <Button asChild className="rounded-full px-6">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm">
              <div className="flex flex-col gap-6 mt-8">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-8 w-8 text-primary fill-primary" />
                  <span className="text-2xl font-bold">
                    My<span className="text-primary">Saadi</span>
                  </span>
                </Link>
                {/* <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium py-2 border-b border-border"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav> */}
                <div className="flex flex-col gap-3 mt-4">
                  {/* <Button
                    variant="outline"
                    asChild
                    className="w-full bg-transparent"
                  >
                    <Link href="/login">Log in</Link>
                  </Button> */}
                  <Button asChild className="w-full rounded-full">
                    <Link href="/login">Get Started</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
