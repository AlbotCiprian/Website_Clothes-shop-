'use client';

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import type { CartItem } from '@/lib/cart';
import { clearCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STORAGE_KEY = 'blueprint-checkout-contact';

const checkoutSchema = z.object({
  email: z.string().email({ message: 'Introduce un email valid.' }),
  phone: z.string().min(6, { message: 'Telefonul este obligatoriu.' }),
  customerName: z.string().min(2, { message: 'Numele complet este obligatoriu.' }),
  address: z.string().min(5, { message: 'Adresa este obligatorie.' }),
  deliveryType: z.enum(['Locker', 'Warehouse']),
  np_city: z.string().min(2, { message: 'Selectează orașul Nova Poshta.' }),
  np_city_ref: z.string().min(2, { message: 'Selectează orașul Nova Poshta.' }),
  np_warehouse: z.string().min(2, { message: 'Selectează lockerul sau depozitul.' }),
  np_warehouse_ref: z.string().min(2, { message: 'Selectează lockerul sau depozitul.' })
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  items: CartItem[];
}

export function CheckoutForm({ items }: CheckoutFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<CheckoutFormValues>({
    email: '',
    phone: '',
    customerName: '',
    address: '',
    deliveryType: 'Locker',
    np_city: '',
    np_city_ref: '',
    np_warehouse: '',
    np_warehouse_ref: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([]);
  const [warehouses, setWarehouses] = useState<Array<{ id: string; name: string; type?: string }>>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as CheckoutFormValues;
      setValues((prev) => ({ ...prev, ...stored }));
    } catch (error) {
      console.warn('Failed to read checkout draft', error);
    }
  }, []);

  useEffect(() => {
    async function loadCities() {
      try {
        setLoadingCities(true);
        const response = await fetch('/api/shipping/nova-poshta/cities');
        const data = (await response.json()) as { cities: Array<{ id: string; name: string }> };
        setCities(data.cities);
      } catch (error) {
        console.error('Failed to fetch NP cities', error);
      } finally {
        setLoadingCities(false);
      }
    }
    void loadCities();
  }, []);

  useEffect(() => {
    async function loadWarehouses(cityRef: string, type: 'Locker' | 'Warehouse') {
      if (!cityRef) {
        setWarehouses([]);
        return;
      }
      try {
        setLoadingWarehouses(true);
        const params = new URLSearchParams({ cityRef, type });
        const response = await fetch(`/api/shipping/nova-poshta/warehouses?${params.toString()}`);
        const data = (await response.json()) as { warehouses: Array<{ id: string; name: string; type?: string }> };
        setWarehouses(data.warehouses);
      } catch (error) {
        console.error('Failed to fetch NP warehouses', error);
      } finally {
        setLoadingWarehouses(false);
      }
    }
    void loadWarehouses(values.np_city_ref, values.deliveryType);
  }, [values.np_city_ref, values.deliveryType]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timeout = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    }, 250);
    return () => clearTimeout(timeout);
  }, [values]);

  const handleChange = (field: keyof CheckoutFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleDeliveryTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const deliveryType = event.target.value as CheckoutFormValues['deliveryType'];
    setValues((prev) => ({ ...prev, deliveryType, np_warehouse: '', np_warehouse_ref: '' }));
  };

  const handleCityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const city = cities.find((cityOption) => cityOption.id === selectedId);
    setValues((prev) => ({
      ...prev,
      np_city_ref: selectedId,
      np_city: city?.name ?? '',
      np_warehouse: '',
      np_warehouse_ref: ''
    }));
  };

  const handleWarehouseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const warehouse = warehouses.find((w) => w.id === selectedId);
    setValues((prev) => ({
      ...prev,
      np_warehouse_ref: selectedId,
      np_warehouse: warehouse?.name ?? ''
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    const parse = checkoutSchema.safeParse(values);
    if (!parse.success) {
      const fieldErrors = parse.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([key, val]) => [key, val?.[0] ?? ''])));
      return;
    }

    if (!items.length) {
      setSubmitError('Cartul este gol. Adaugă produse pentru a continua.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, items })
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const data = (await response.json()) as { redirectUrl: string };
      clearCart();
      window.localStorage.removeItem(STORAGE_KEY);
      router.push(data.redirectUrl);
    } catch (error) {
      console.error(error);
      setSubmitError('Nu am putut crea plata. Încearcă din nou în câteva secunde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold text-slate-900">1. Contact</h2>
          <p className="text-sm text-slate-500">Ținem legătura pentru confirmarea plății și expediere.</p>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(['email', 'phone', 'customerName'] as Array<keyof CheckoutFormValues>).map((fieldKey) => (
            <div key={fieldKey} className="sm:col-span-1">
              <Label htmlFor={fieldKey} className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {fieldKey === 'customerName' ? 'Nume complet' : fieldKey === 'phone' ? 'Telefon' : 'Email'}
              </Label>
              <Input
                id={fieldKey}
                type={fieldKey === 'email' ? 'email' : 'text'}
                value={values[fieldKey] ?? ''}
                onChange={handleChange(fieldKey)}
                autoComplete={fieldKey === 'email' ? 'email' : fieldKey === 'phone' ? 'tel' : 'name'}
                className={errors[fieldKey] ? 'border-rose-500 focus-visible:ring-rose-400' : ''}
              />
              {errors[fieldKey] ? <p className="mt-1 text-xs text-rose-500">{errors[fieldKey]}</p> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold text-slate-900">2. Livrare Nova Poshta</h2>
          <p className="text-sm text-slate-500">Alege tipul de livrare și punctul de ridicare.</p>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="deliveryType" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tip livrare
            </Label>
            <select
              id="deliveryType"
              value={values.deliveryType}
              onChange={handleDeliveryTypeChange}
              className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <option value="Locker">Pick-up Locker</option>
              <option value="Warehouse">Warehouse</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="np_city" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Oraș Nova Poshta
              </Label>
              <select
                id="np_city"
                value={values.np_city_ref}
                onChange={handleCityChange}
                className={`h-11 w-full rounded-full border px-4 text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                  errors.np_city ? 'border-rose-500 focus-visible:ring-rose-400' : 'border-slate-200'
                }`}
              >
                <option value="">{loadingCities ? 'Se încarcă orașele...' : 'Selectează orașul'}</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.np_city ? <p className="mt-1 text-xs text-rose-500">{errors.np_city}</p> : null}
            </div>
            <div>
              <Label htmlFor="np_warehouse" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {values.deliveryType === 'Locker' ? 'Locker Nova Poshta' : 'Depozit Nova Poshta'}
              </Label>
              <select
                id="np_warehouse"
                value={values.np_warehouse_ref}
                onChange={handleWarehouseChange}
                className={`h-11 w-full rounded-full border px-4 text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                  errors.np_warehouse ? 'border-rose-500 focus-visible:ring-rose-400' : 'border-slate-200'
                }`}
                disabled={!values.np_city_ref || loadingWarehouses}
              >
                <option value="">
                  {!values.np_city_ref
                    ? 'Selectează mai întâi orașul'
                    : loadingWarehouses
                      ? 'Se încarcă opțiunile...'
                      : 'Selectează opțiunea preferată'}
                </option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
              {errors.np_warehouse ? <p className="mt-1 text-xs text-rose-500">{errors.np_warehouse}</p> : null}
            </div>
          </div>
          <div>
            <Label htmlFor="address" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Adresă completă (pentru curier)
            </Label>
            <Input
              id="address"
              value={values.address}
              onChange={handleChange('address')}
              autoComplete="street-address"
              className={errors.address ? 'border-rose-500 focus-visible:ring-rose-400' : ''}
            />
            {errors.address ? <p className="mt-1 text-xs text-rose-500">{errors.address}</p> : null}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold text-slate-900">3. Plată securizată</h2>
        <p className="mt-2 text-sm text-slate-600">
          MAIB va deschide o fereastră separată pentru introducerea datelor cardului și confirmarea OTP. După confirmare, vei fi
          redirecționat înapoi pe Blueprint.
        </p>
      </div>
      {submitError && <p className="text-sm font-medium text-rose-500">{submitError}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Redirecționăm către MAIB…
          </span>
        ) : (
          'Plătește acum cu MAIB'
        )}
      </Button>
    </form>
  );
}
