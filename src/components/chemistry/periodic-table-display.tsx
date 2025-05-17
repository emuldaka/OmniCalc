
// src/components/chemistry/periodic-table-display.tsx
"use client";

import { useState, useMemo } from 'react';
import type { ElementData} from './periodic-table-data';
import { elementsData } from './periodic-table-data';
import { elementCategoriesStyles, getElementCategoryList } from './element-categories';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ElementDetailModal } from './element-detail-modal';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AtomIcon } from 'lucide-react';

// Define the grid dimensions. For a simple display, 9 rows and 18 columns.
const NUM_ROWS = 9; // Max period (includes placeholders for Lanthanides/Actinides if fully drawn)
const NUM_COLUMNS = 18; // Max group

export function PeriodicTableDisplay() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  const categoryList = useMemo(() => getElementCategoryList(), []);

  const filteredElements = useMemo(() => {
    return elementsData.filter(el => {
      const matchesSearch = searchTerm.trim() === '' ||
        el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        el.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        el.atomicNumber.toString().includes(searchTerm);
      const matchesCategory = selectedCategory === '' || el.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Create a map for quick lookup of elements by their grid position
  const elementGridMap = useMemo(() => {
    const map = new Map<string, ElementData>();
    filteredElements.forEach(el => {
      map.set(`${el.row}-${el.column}`, el);
    });
    return map;
  }, [filteredElements]);

  const handleElementClick = (element: ElementData) => {
    setSelectedElement(element);
  };

  const handleCloseModal = () => {
    setSelectedElement(null);
  };
  
  const getElementForCell = (r: number, c: number): ElementData | undefined => {
    return elementGridMap.get(`${r}-${c}`);
  }

  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-3xl text-primary flex items-center">
          <AtomIcon className="mr-3 h-8 w-8" /> Interactive Periodic Table
        </CardTitle>
        <CardDescription>
          Explore elements, search, and filter. Click on an element for more details.
          Currently showing a subset of elements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search by name, symbol, or atomic number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categoryList.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div 
            className="grid gap-0.5 overflow-x-auto pb-4"
            style={{ 
                gridTemplateColumns: `repeat(${NUM_COLUMNS}, minmax(50px, 1fr))`,
                gridTemplateRows: `repeat(${NUM_ROWS}, minmax(50px, 1fr))` 
            }}
        >
          {Array.from({ length: NUM_ROWS }).map((_, rIndex) => 
            Array.from({ length: NUM_COLUMNS }).map((_, cIndex) => {
              const row = rIndex + 1;
              const col = cIndex + 1;
              const element = getElementForCell(row, col);

              if (element) {
                const categoryStyle = elementCategoriesStyles[element.category] || elementCategoriesStyles.unknown;
                return (
                  <button
                    key={element.atomicNumber}
                    onClick={() => handleElementClick(element)}
                    className={cn(
                      "p-1.5 border text-center flex flex-col items-center justify-center rounded-sm transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:z-10",
                      categoryStyle.backgroundColor,
                      categoryStyle.textColor,
                      categoryStyle.borderColor || 'border-gray-300',
                      "aspect-square min-w-[50px] min-h-[50px]" 
                    )}
                    style={{ gridRowStart: row, gridColumnStart: col }}
                    title={element.name}
                  >
                    <div className="text-xs font-medium">{element.atomicNumber}</div>
                    <div className="text-lg font-bold">{element.symbol}</div>
                    <div className="text-[10px] truncate w-full">{element.name}</div>
                  </button>
                );
              } else {
                // Placeholder for empty cells, adjust styling as needed
                // For a more accurate periodic table shape, complex conditions would be needed here
                // to skip rendering cells that are not part of the standard table layout.
                // This simple version fills all grid cells.
                return (
                  <div 
                    key={`${row}-${col}`} 
                    className="border border-transparent aspect-square" // Transparent or very light border for empty cells
                    style={{ gridRowStart: row, gridColumnStart: col }}
                  />
                );
              }
            })
          )}
        </div>

        <ElementDetailModal
          element={selectedElement}
          isOpen={!!selectedElement}
          onClose={handleCloseModal}
        />
      </CardContent>
    </Card>
  );
}
