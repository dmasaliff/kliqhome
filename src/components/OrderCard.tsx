interface OrderDetailProps {
  service: string;
  keluhan: string;
  address: string;
  time_slot: string;
}

export function OrderCard({ service, address, time_slot, keluhan }: OrderDetailProps) {
  return (
    <div className="bg-white w-full max-w-xs rounded-[24px] p-6 shadow-sm border border-white">
      <div className="space-y-3">
        <p className="text-[12px] font-bold text-gray-900">
          Layanan : <span className="font-medium">{service}</span>
        </p>
        <p className="text-[12px] font-bold text-gray-900">
          Keluhan : <span className="font-medium">{keluhan}</span>
        </p>
        <p className="text-[12px] font-bold text-gray-900">
          Wilayah : <span className="font-medium">{address}</span>
        </p>
        <p className="text-[12px] font-bold text-gray-900">
          Jadwal : <span className="font-medium">{time_slot}</span>
        </p>
      </div>
    </div>
  );
}