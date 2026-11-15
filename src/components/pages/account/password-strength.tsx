import { getPasswordStrength } from "@/components/pages/account/auth-schemas";
import { cn } from "@/lib/utils";

const barColors = {
  1: "bg-destructive",
  2: "bg-foreground/40",
  3: "bg-foreground/70",
  4: "bg-success",
} as const;

/** Four-step strength meter with a short hint, announced politely as it changes. */
export function PasswordStrength({ password, id }: { password: string; id?: string }) {
  const { score, label, hint } = getPasswordStrength(password);

  return (
    <div id={id} className="flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-1.5" aria-hidden>
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={cn(
              "h-1 rounded-full bg-muted transition-colors duration-300",
              score >= step && score > 0 && barColors[score as 1 | 2 | 3 | 4],
            )}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {label && (
          <span className="font-medium text-foreground">
            {label}
            <span className="sr-only"> password.</span>
            <span aria-hidden> · </span>
          </span>
        )}
        {hint}
      </p>
    </div>
  );
}
