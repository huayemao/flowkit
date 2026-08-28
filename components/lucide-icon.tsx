import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

export const LucideIcon = ({ name, ...props }: IconProps) => {
  const Icon = (Icons as any)[name];
  if (!Icon) {
    return <Icons.HelpCircle {...props} />;
  }
  return <Icon {...props} />;
};
