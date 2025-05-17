
// src/components/chemistry/element-categories.ts

export interface ElementCategoryStyles {
  [key: string]: {
    backgroundColor: string; // Tailwind background color class e.g., 'bg-blue-200'
    textColor: string;       // Tailwind text color class e.g., 'text-blue-800'
    borderColor?: string;     // Tailwind border color class e.g., 'border-blue-400'
  };
}

export const elementCategoriesStyles: ElementCategoryStyles = {
  nonmetal: {
    backgroundColor: 'bg-green-200',
    textColor: 'text-green-800',
    borderColor: 'border-green-400',
  },
  nobleGas: {
    backgroundColor: 'bg-purple-200',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-400',
  },
  alkaliMetal: {
    backgroundColor: 'bg-red-200',
    textColor: 'text-red-800',
    borderColor: 'border-red-400',
  },
  alkalineEarthMetal: {
    backgroundColor: 'bg-orange-200',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-400',
  },
  metalloid: {
    backgroundColor: 'bg-yellow-200',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-400',
  },
  halogen: {
    backgroundColor: 'bg-teal-200',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-400',
  },
  transitionMetal: {
    backgroundColor: 'bg-sky-200',
    textColor: 'text-sky-800',
    borderColor: 'border-sky-400',
  },
  lanthanide: {
    backgroundColor: 'bg-indigo-200',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-400',
  },
  actinide: {
    backgroundColor: 'bg-pink-200',
    textColor: 'text-pink-800',
    borderColor: 'border-pink-400',
  },
  postTransitionMetal: {
    backgroundColor: 'bg-gray-300',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-500',
  },
  unknown: {
    backgroundColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-300',
  },
};

export const getElementCategoryList = (): { value: string; label: string }[] => {
  return Object.keys(elementCategoriesStyles).map(key => ({
    value: key,
    // Convert camelCase or hyphen-case to Title Case for display
    label: key
      .replace(/([A-Z])/g, ' $1')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())
      .trim(),
  }));
};
