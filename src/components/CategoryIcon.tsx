"use client";

import * as Icons from "lucide-react";

interface CategoryIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export default function CategoryIcon({ name, size = 16, color, className }: CategoryIconProps) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <Icons.Tag size={size} style={{ color }} className={className} />;
  }
  return <IconComponent size={size} style={{ color }} className={className} />;
}
