interface BadgeProps {
  label: string;
}

const BadgeSkill: React.FC<BadgeProps> = ({ label }) => (
  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100">
    {label}
  </span>
);

export default BadgeSkill;