
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ArrowRightLeft, Sigma, BeakerIcon, LineChart, FlaskConical, Atom, Landmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const featureCards: FeatureCardProps[] = [
  {
    href: "/calculator",
    icon: Calculator,
    title: "Standard Calculators",
    description: "Perform arithmetic operations with multiple side-by-side calculators.",
  },
  {
    href: "/converter",
    icon: ArrowRightLeft,
    title: "Unit Converter",
    description: "Convert between various units for length, mass, temperature, time, and more.",
  },
  {
    href: "/advanced-calculator",
    icon: BeakerIcon,
    title: "Advanced Scientific Calculator",
    description: "Utilize scientific functions, store values, and manage history with multiple instances.",
  },
  {
    href: "/graphing",
    icon: LineChart,
    title: "Graphing Calculator",
    description: "Define and plot mathematical functions on multiple interactive graphs.",
  },
  {
    href: "/chemistry",
    icon: FlaskConical,
    title: "Chemistry Hub",
    description: "Explore elements, reactions, and utilize chemistry-specific calculators.",
  },
  {
    href: "/physics",
    icon: Atom,
    title: "Physics Hub",
    description: "Discover physical constants, common formulas, particles, and physics tools.",
  },
  {
    href: "/banking",
    icon: Landmark,
    title: "Banking Calculators",
    description: "Tools for managing credit cards, loans, bonds, and savings strategies.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-secondary">
      <header className="mb-12 text-center">
        <Sigma className="mx-auto h-24 w-24 text-primary mb-4" />
        <h1 className="text-5xl font-bold text-primary">Welcome to OmniCalc</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Your all-in-one solution for calculations, conversions, and specialized tools.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
        {featureCards.map((feature) => (
          <Link href={feature.href} passHref key={feature.title}>
            <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center text-primary mb-2">
                  <feature.icon className="h-8 w-8 mr-3" />
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-base min-h-[3em]"> {/* Ensure consistent description height */}
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button variant="default" className="w-full text-lg py-5 bg-primary hover:bg-primary/90">
                  Go to {feature.title.split(" ")[0]} {/* Shorten button text */}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <footer className="mt-16 text-center text-muted-foreground">
        {/* You can add a footer here if desired */}
      </footer>
    </div>
  );
}
