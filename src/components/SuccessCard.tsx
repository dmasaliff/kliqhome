import React from 'react';

interface SuccessCardProps {
  amount: number;
}

export const SuccessCard = ({ amount }: SuccessCardProps) => {
  return (
    <div className="bg-white rounded-[24px] p-8 shadow-lg text-center max-w-[320px] mx-auto">
      <h2 className="text-[32px] font-bold text-blue-600 mb-2">
        Rp {amount.toLocaleString('id-ID')}
      </h2>
      <p className="text-[12px] leading-relaxed font-medium">
        Pastikan anda menerima uang dari customer sebelum menekan riwayat pendapatan anda
      </p>
    </div>
  );
};