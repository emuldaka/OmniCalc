
// src/components/chemistry/element-detail-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ElementData } from "./periodic-table-data";
import { elementCategoriesStyles } from "./element-categories";
import { Badge } from "@/components/ui/badge";

interface ElementDetailModalProps {
  element: ElementData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ElementDetailModal({ element, isOpen, onClose }: ElementDetailModalProps) {
  if (!element) return null;

  const categoryStyle = elementCategoriesStyles[element.category] || elementCategoriesStyles.unknown;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center">
            <span 
              className={`mr-4 text-5xl font-black ${categoryStyle.textColor}`}
              style={{ WebkitTextStroke: `1px ${categoryStyle.borderColor || 'currentColor'}` }}
            >
              {element.symbol}
            </span>
            <div>
              {element.name} (#{element.atomicNumber})
              <Badge variant="outline" className={`ml-2 ${categoryStyle.backgroundColor} ${categoryStyle.textColor} ${categoryStyle.borderColor}`}>
                {element.category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Detailed information for {element.name}.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow pr-6 -mr-6"> {/* Offset padding for scrollbar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm py-4">
            <DetailItem label="Atomic Mass" value={element.atomicMass.toLocaleString()} />
            <DetailItem label="Electron Configuration" value={element.electronConfiguration} />
            <DetailItem label="Electronegativity" value={element.electronegativity ?? 'N/A'} />
            <DetailItem label="Ionization Energies (kJ/mol)" value={element.ionizationEnergies.join(', ')} />
            <DetailItem label="Common Oxidation States" value={element.oxidationStates.join(', ')} />
            <DetailItem label="Melting Point" value={element.meltingPointK ? `${element.meltingPointK} K` : 'N/A'} />
            <DetailItem label="Boiling Point" value={element.boilingPointK ? `${element.boilingPointK} K` : 'N/A'} />
            <DetailItem label="Discovery" value={element.discovery} />
            <div className="md:col-span-2">
                <h4 className="font-semibold text-primary mb-1">Common Uses:</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{element.uses}</p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-auto pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DetailItemProps {
    label: string;
    value: string | number;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value}) => (
    <div>
        <h4 className="font-semibold text-primary">{label}:</h4>
        <p className="text-foreground">{value}</p>
    </div>
)
