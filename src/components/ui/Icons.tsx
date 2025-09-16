import { Eye, EyeOff, ChevronDown, ShoppingCart, Trash2 } from 'lucide-react';

export const EyeFilledIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Eye {...props} />
);

export const EyeSlashFilledIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <EyeOff {...props} />
);

export const ChevronDownIcon = ({ className }: { className?: string }) => (
  <ChevronDown className={className} />
);

export const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <ShoppingCart {...props} />
);

export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <Trash2 {...props} />
);