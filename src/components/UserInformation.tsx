import { icons } from "lucide-react";

interface UserInformationProps {
  icon: keyof typeof icons;
  text: string;
}

export function UserInformation({ icon, text }: UserInformationProps) {
  const IconComponent = icons[icon];

  return (
    <div className="flex items-center gap-2">
      <IconComponent size={20} />
      <span>{text}</span>
    </div>
  );
}
