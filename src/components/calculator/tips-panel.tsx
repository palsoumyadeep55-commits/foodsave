import React from "react";
import { Lightbulb, CheckCircle2 } from "lucide-react";

interface TipsPanelProps {
  topCategory: string;
}

export function TipsPanel({ topCategory }: TipsPanelProps) {
  const getTips = (cat: string) => {
    switch (cat) {
      case "Rice & Grains":
        return [
          {
            title: "Day-old rice makes the best fried rice",
            desc: "Cool cooked rice quickly and refrigerate in an airtight box. Chilled dry grains don't clump or turn soggy in a hot wok.",
          },
          {
            title: "Transform dry rotis into Vaghareli Upma",
            desc: "Tear stale rotis or chapatis, temper with mustard seeds, curry leaves, and dahi (curd) for a classic 10-minute zero-waste breakfast.",
          },
          {
            title: "Store bulk grains with dry neem or bay leaves",
            desc: "Placing a few dry neem or bay leaves inside rice and atta containers deters weevils and pantry insects naturally.",
          },
        ];
      case "Produce":
        return [
          {
            title: "Wrap coriander & mint in dry cotton",
            desc: "Remove wet stems, wrap fresh herbs in a clean cotton kitchen towel, and store in a sealed box for 2+ weeks of freshness.",
          },
          {
            title: "Keep tropical fruits on the counter",
            desc: "Mangoes, papayas, and bananas lose aromatics when chilled before full ripeness. Move to fridge only once fully sweet.",
          },
          {
            title: "Regrow scallions & celery in water",
            desc: "Place the root base of green onions in a shallow dish of water on the windowsill for an endless supply of fresh greens.",
          },
        ];
      case "Dairy":
        return [
          {
            title: "Turn sour curd into Kadhi or Chaas",
            desc: "Slightly sour dahi is the prized base for traditional spiced kadhi, raita, or seasoned buttermilk with roasted cumin.",
          },
          {
            title: "Store paneer submerged in water",
            desc: "Keep fresh paneer in a sealed bowl fully submerged in clean water; change water every 2 days to keep it soft and fresh.",
          },
        ];
      case "Bakery":
        return [
          {
            title: "Freeze bread slices and toast straight",
            desc: "Frozen sliced bread pops straight into the toaster or tawa, tasting freshly baked with zero stale waste.",
          },
          {
            title: "Turn leftover pav & buns into croutons",
            desc: "Toss cubed bread with ghee or olive oil and chili flakes, then pan-toast for crunchy salad and soup toppers.",
          },
        ];
      default:
        return [
          {
            title: "Practice First-In, First-Out (FIFO)",
            desc: "Always move older groceries to the front shelf whenever unpacking fresh market bags.",
          },
          {
            title: "Designate an 'Eat Me First' bowl",
            desc: "Keep a visible basket in the fridge where family members look first for snacks and cooking ingredients.",
          },
        ];
    }
  };

  const tips = getTips(topCategory);

  return (
    <div className="rounded-[22px] border border-black/[0.08] bg-[#f5f5f7] p-6 space-y-4">
      <div className="flex items-center gap-2 text-[#1d1d1f]">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h3 className="text-sm font-semibold tracking-tight">
          Preservation Tips for {topCategory}
        </h3>
      </div>

      <div className="space-y-3">
        {tips.map((t, idx) => (
          <div key={idx} className="rounded-[16px] border border-black/[0.06] bg-white p-4 shadow-xs">
            <h4 className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              {t.title}
            </h4>
            <p className="mt-1 text-[11px] text-[#6e6e73] leading-relaxed pl-5">
              {t.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
