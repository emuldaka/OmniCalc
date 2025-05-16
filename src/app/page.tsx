import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ArrowRightLeft, Sigma } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background to-secondary">
      <header className="mb-12 text-center">
        <Sigma className="mx-auto h-24 w-24 text-primary mb-4" />
        <h1 className="text-5xl font-bold text-primary">Welcome to OmniCalc</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Your all-in-one solution for calculations and conversions.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Link href="/calculator" passHref>
          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center text-primary mb-2">
                <Calculator className="h-8 w-8 mr-3" />
                <CardTitle className="text-3xl">Calculator</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Perform basic to advanced arithmetic operations with ease.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button variant="default" className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
                Go to Calculator
                <ArrowRightLeft className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/converter" passHref>
          <Card className="hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center text-primary mb-2">
                <ArrowRightLeft className="h-8 w-8 mr-3" />
                <CardTitle className="text-3xl">Unit Converter</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Convert between various units for length, weight, temperature, and more.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
               <Button variant="default" className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
                Go to Converter
                <ArrowRightLeft className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <footer className="mt-16 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} OmniCalc. Powered by AI.</p>
      </footer>
    </div>
  );
}
