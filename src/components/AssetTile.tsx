import type { LucideIcon } from "lucide-react";
import {
  Candy,
  CircleDotDashed,
  Clover,
  Droplets,
  Flame,
  Flower2,
  Leaf,
  Mountain,
  Package,
  Sparkles,
  Sprout,
  TreePine,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AssetType = "wax" | "planter" | "field";
type AssetSize = "sm" | "md" | "lg";

interface AssetTileProps {
  type: AssetType;
  name: string;
  size?: AssetSize;
  className?: string;
}

interface AssetProfile {
  icon: LucideIcon;
  tone: string;
}

const defaultProfiles: Record<AssetType, AssetProfile> = {
  wax: {
    icon: Sparkles,
    tone: "bg-primary-container text-on-primary-container ring-primary/20",
  },
  planter: {
    icon: Package,
    tone: "bg-secondary-container text-on-secondary-container ring-secondary/20",
  },
  field: {
    icon: Sprout,
    tone: "bg-tertiary-container text-on-tertiary-container ring-tertiary/20",
  },
};

const profiles: Record<string, AssetProfile> = {
  "Caustic Wax": {
    icon: Flame,
    tone: "bg-lime-300/18 text-lime-100 ring-lime-300/22",
  },
  "Swirled Wax": {
    icon: Sparkles,
    tone: "bg-cyan-300/16 text-cyan-100 ring-cyan-300/22",
  },
  "Plastic Planter": {
    icon: Package,
    tone: "bg-sky-300/16 text-sky-100 ring-sky-300/22",
  },
  "Red Clay Planter": {
    icon: Flame,
    tone: "bg-rose-300/16 text-rose-100 ring-rose-300/22",
  },
  "Blue Clay Planter": {
    icon: Droplets,
    tone: "bg-blue-300/18 text-blue-100 ring-blue-300/22",
  },
  "Candy Planter": {
    icon: Candy,
    tone: "bg-pink-300/18 text-pink-100 ring-pink-300/22",
  },
  "Tacky Planter": {
    icon: Sparkles,
    tone: "bg-violet-300/16 text-violet-100 ring-violet-300/22",
  },
  "Heat Treated Planter": {
    icon: Flame,
    tone: "bg-orange-300/18 text-orange-100 ring-orange-300/22",
  },
  "Hydroponic Planter": {
    icon: Waves,
    tone: "bg-cyan-300/18 text-cyan-100 ring-cyan-300/22",
  },
  "Petal Planter": {
    icon: Flower2,
    tone: "bg-pink-300/16 text-pink-100 ring-pink-300/22",
  },
  "Pesticide Planter": {
    icon: CircleDotDashed,
    tone: "bg-emerald-300/16 text-emerald-100 ring-emerald-300/22",
  },
  "Rose Field": {
    icon: Flower2,
    tone: "bg-rose-300/18 text-rose-100 ring-rose-300/22",
  },
  "Clover Field": {
    icon: Clover,
    tone: "bg-green-300/18 text-green-100 ring-green-300/22",
  },
  "Mountain Top Field": {
    icon: Mountain,
    tone: "bg-slate-200/14 text-slate-100 ring-slate-200/20",
  },
  "Bamboo Field": {
    icon: TreePine,
    tone: "bg-lime-300/16 text-lime-100 ring-lime-300/22",
  },
  "Coconut Field": {
    icon: Waves,
    tone: "bg-cyan-200/16 text-cyan-100 ring-cyan-200/22",
  },
  "Dandelion Field": {
    icon: Flower2,
    tone: "bg-yellow-200/18 text-yellow-100 ring-yellow-200/22",
  },
  "Sunflower Field": {
    icon: Sprout,
    tone: "bg-amber-200/18 text-amber-100 ring-amber-200/22",
  },
  "Spider Field": {
    icon: CircleDotDashed,
    tone: "bg-zinc-200/14 text-zinc-100 ring-zinc-200/20",
  },
  "Cactus Field": {
    icon: Leaf,
    tone: "bg-emerald-300/16 text-emerald-100 ring-emerald-300/22",
  },
  "Pumpkin Field": {
    icon: CircleDotDashed,
    tone: "bg-orange-300/16 text-orange-100 ring-orange-300/22",
  },
  "Strawberry Field": {
    icon: Flower2,
    tone: "bg-red-300/18 text-red-100 ring-red-300/22",
  },
  "Blue Flower Field": {
    icon: Flower2,
    tone: "bg-blue-300/18 text-blue-100 ring-blue-300/22",
  },
  "Mushroom Field": {
    icon: CircleDotDashed,
    tone: "bg-stone-200/14 text-stone-100 ring-stone-200/20",
  },
};

const tileSizes: Record<AssetSize, string> = {
  sm: "size-10 rounded-lg",
  md: "size-14 rounded-xl",
  lg: "size-16 rounded-2xl",
};

const iconSizes: Record<AssetSize, string> = {
  sm: "size-5",
  md: "size-7",
  lg: "size-8",
};

export function AssetTile({
  type,
  name,
  size = "md",
  className,
}: AssetTileProps) {
  const profile = profiles[name] ?? defaultProfiles[type];
  const Icon = profile.icon;

  return (
    <div
      role="img"
      aria-label={name}
      title={name}
      className={cn(
        "grid shrink-0 place-items-center ring-1",
        tileSizes[size],
        profile.tone,
        className
      )}
    >
      <Icon className={iconSizes[size]} strokeWidth={2.2} />
    </div>
  );
}
