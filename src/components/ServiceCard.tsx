import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ServiceProps {
  title: string;
  price: string;
  Icon: LucideIcon;
  description: string;
}

export function ServiceCard({ title, price, Icon, description }: ServiceProps) {
  return (
    <Card className="rounded-2xl border-none shadow-sm h-48 flex items-center justify-center bg-white">
      <CardContent className="flex flex-col items-center p-0 text-center">
        <div className="bg-[#EBF5FF] p-3 rounded-full mb-6">
          <Icon className="text-[#007AFF]" size={28} strokeWidth={2.5} />
        </div>
        
        <h3 className="font-extrabold text-[#1A1A1A] text-[13px] leading-tight px-4 mb-6 uppercase tracking-wide">
          {title}
        </h3>
        
        <p className="text-[11px] text-black font-medium">
          {price}
        </p>

        <p className="text-[11px] text-black font-medium">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}