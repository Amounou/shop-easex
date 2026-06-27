import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export const SettingsSubPage = ({ title, description, children, actions }: Props) => (
  <div className="p-6 md:p-8 max-w-4xl mx-auto">
    <Link to="/dashboard/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
      <ArrowLeft className="h-4 w-4" /> Retour aux paramètres
    </Link>
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions}
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

export default SettingsSubPage;