
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
    title: "Advanced Scientific",
    description: "Utilize scientific functions, store values, and manage history with instances.",
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
    href: "/banking",
    icon: Landmark,
    title: "Banking Calculators",
    description: "Tools for managing credit cards, loans, bonds, and savings strategies.",
  },
  {
    href: "/physics",
    icon: Atom,
    title: "Physics Hub",
    description: "Discover physical constants, common formulas, particles, and physics tools.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-gradient-to-br from-background to-secondary">
      <header className="mb-8 text-center"> {/* Reduced mb-12 to mb-8 */}
        <Sigma className="mx-auto h-20 w-20 text-primary mb-3" /> {/* Reduced size and mb */}
        <h1 className="text-4xl font-bold text-primary">Welcome to OmniCalc</h1> {/* Reduced text-5xl to text-4xl */}
        <p className="text-lg text-muted-foreground mt-1"> {/* Reduced text-xl to text-lg and mt-2 to mt-1 */}
          This App is still in BETA
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 max-w-6xl w-full"> {/* Reduced gap, adjusted max-w */}
        {featureCards.map((feature, index) => {
          const isLastCard = index === featureCards.length - 1;
          const isLastRowSingleItemOnMd = isLastCard && featureCards.length % 3 === 1;

          return (
            <Link 
              href={feature.href} 
              passHref 
              key={feature.title} 
              className={isLastRowSingleItemOnMd ? "md:col-start-2" : ""}
            >
              <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
                <CardHeader className="p-4"> {/* Reduced padding */}
                  <div className="flex items-center text-primary mb-1.5"> {/* Reduced mb-2 to mb-1.5 */}
                    <feature.icon className="h-6 w-6 mr-2" /> {/* Reduced size and mr */}
                    <CardTitle className="text-xl">{feature.title}</CardTitle> {/* Reduced text-2xl to text-xl */}
                  </div>
                  <CardDescription className="text-sm min-h-[3.5em]"> {/* Reduced text-base, adjusted min-h for ~2-3 lines */}
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 mt-auto"> {/* Reduced padding, removed pt-0 if it was conflicting */}
                  <Button variant="default" className="w-full text-sm py-2.5 bg-primary hover:bg-primary/90"> {/* Reduced text-lg, py-5 */}
                    Go to {feature.title.split(" ")[0]}
                    <ArrowRight className="ml-2 h-4 w-4" /> {/* Reduced size */}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <footer className="mt-8 text-center text-muted-foreground"> {/* Reduced mt-16 to mt-8 */}
        {/* You can add a footer here if desired */}
      </footer>
    </div>
  );
}
