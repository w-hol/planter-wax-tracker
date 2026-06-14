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
    tone: "from-primary/24 to-secondary/12 text-primary ring-primary/25",
  },
  planter: {
    icon: Package,
    tone: "from-secondary/22 to-primary/10 text-secondary ring-secondary/25",
  },
  field: {
    icon: Sprout,
    tone: "from-accent/22 to-primary/10 text-accent ring-accent/25",
  },
};

const profiles: Record<string, AssetProfile> = {
  "Caustic Wax": {
    icon: Flame,
    tone: "from-lime-300/28 to-primary/12 text-lime-100 ring-lime-300/25",
  },
  "Swirled Wax": {
    icon: Sparkles,
    tone: "from-cyan-300/22 to-fuchsia-300/12 text-cyan-100 ring-cyan-300/25",
  },
  "Plastic Planter": {
    icon: Package,
    tone: "from-sky-300/22 to-secondary/12 text-sky-100 ring-sky-300/25",
  },
  "Red Clay Planter": {
    icon: Flame,
    tone: "from-rose-300/22 to-accent/10 text-rose-100 ring-rose-300/25",
  },
  "Blue Clay Planter": {
    icon: Droplets,
    tone: "from-blue-300/24 to-cyan-300/10 text-blue-100 ring-blue-300/25",
  },
  "Candy Planter": {
    icon: Candy,
    tone: "from-pink-300/24 to-accent/12 text-pink-100 ring-pink-300/25",
  },
  "Tacky Planter": {
    icon: Sparkles,
    tone: "from-violet-300/20 to-secondary/12 text-violet-100 ring-violet-300/25",
  },
  "Heat Treated Planter": {
    icon: Flame,
    tone: "from-orange-300/22 to-rose-300/10 text-orange-100 ring-orange-300/25",
  },
  "Hydroponic Planter": {
    icon: Waves,
    tone: "from-cyan-300/24 to-primary/10 text-cyan-100 ring-cyan-300/25",
  },
  "Petal Planter": {
    icon: Flower2,
    tone: "from-pink-300/22 to-primary/10 text-pink-100 ring-pink-300/25",
  },
  "Pesticide Planter": {
    icon: CircleDotDashed,
    tone: "from-emerald-300/20 to-accent/10 text-emerald-100 ring-emerald-300/25",
  },
  "Rose Field": {
    icon: Flower2,
    tone: "from-rose-300/24 to-pink-300/10 text-rose-100 ring-rose-300/25",
  },
  "Clover Field": {
    icon: Clover,
    tone: "from-green-300/24 to-primary/10 text-green-100 ring-green-300/25",
  },
  "Mountain Top Field": {
    icon: Mountain,
    tone: "from-slate-200/18 to-secondary/12 text-slate-100 ring-slate-200/20",
  },
  "Bamboo Field": {
    icon: TreePine,
    tone: "from-lime-300/20 to-primary/10 text-lime-100 ring-lime-300/25",
  },
  "Coconut Field": {
    icon: Waves,
    tone: "from-cyan-200/20 to-accent/10 text-cyan-100 ring-cyan-200/25",
  },
  "Dandelion Field": {
    icon: Flower2,
    tone: "from-yellow-200/24 to-primary/10 text-yellow-100 ring-yellow-200/25",
  },
  "Sunflower Field": {
    icon: Sprout,
    tone: "from-amber-200/24 to-primary/10 text-amber-100 ring-amber-200/25",
  },
  "Spider Field": {
    icon: CircleDotDashed,
    tone: "from-zinc-200/18 to-secondary/10 text-zinc-100 ring-zinc-200/20",
  },
  "Cactus Field": {
    icon: Leaf,
    tone: "from-emerald-300/22 to-accent/10 text-emerald-100 ring-emerald-300/25",
  },
  "Pumpkin Field": {
    icon: CircleDotDashed,
    tone: "from-orange-300/22 to-accent/10 text-orange-100 ring-orange-300/25",
  },
  "Strawberry Field": {
    icon: Flower2,
    tone: "from-red-300/24 to-pink-300/10 text-red-100 ring-red-300/25",
  },
  "Blue Flower Field": {
    icon: Flower2,
    tone: "from-blue-300/24 to-secondary/10 text-blue-100 ring-blue-300/25",
  },
  "Mushroom Field": {
    icon: CircleDotDashed,
    tone: "from-stone-200/18 to-primary/10 text-stone-100 ring-stone-200/20",
  },
};

const tileSizes: Record<AssetSize, string> = {
  sm: "size-10 rounded-[1.1rem]",
  md: "size-14 rounded-[1.35rem]",
  lg: "size-16 rounded-[1.55rem]",
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
        "grid shrink-0 place-items-center bg-linear-to-br ring-1",
        tileSizes[size],
        profile.tone,
        className
      )}
    >
      <Icon className={cn("drop-shadow-sm", iconSizes[size])} strokeWidth={2.2} />
    </div>
  );
}
