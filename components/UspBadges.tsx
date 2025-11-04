import { CheckCircle2, ShieldCheck, Truck } from 'lucide-react';

const defaultBadges = [
  {
    icon: Truck,
    title: 'Nova Poshta express',
    description: 'Same-day creation of TTN for lockers & warehouses'
  },
  {
    icon: ShieldCheck,
    title: '3DS secure checkout',
    description: 'MAIB eComm protected payment with OTP confirmation'
  },
  {
    icon: CheckCircle2,
    title: '14-day returns',
    description: 'Free size exchanges and effortless refunds'
  }
];

export function UspBadges() {
  return (
    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:grid-cols-3">
      {defaultBadges.map((badge) => (
        <div key={badge.title} className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand shadow-soft">
            <badge.icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{badge.title}</p>
            <p className="text-xs text-slate-500">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
