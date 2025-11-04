'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent, InputHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { clearCart, readCart } from '@/lib/cart';
import { cn } from '@/lib/utils';

const checkoutSchema = z.object({
  email: z.string().email({ message: 'Provide a valid email.' }),
  phone: z.string().min(6, { message: 'Phone number is required.' }),
  customerName: z.string().min(2, { message: 'Name is required.' }),
  address: z.string().optional(),
  np_city: z.string().optional(),
  np_warehouse: z.string().optional()
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const router = useRouter();
  const [values, setValues] = useState<CheckoutFormValues>({
    email: '',
    phone: '',
    customerName: '',
    address: '',
    np_city: '',
    np_warehouse: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (field: keyof CheckoutFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
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

    const cartItems = readCart();
    if (!cartItems.length) {
      setSubmitError('Cart is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, items: cartItems })
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const data = (await response.json()) as { redirectUrl: string };
      clearCart();
      router.push(data.redirectUrl);
    } catch (error) {
      console.error(error);
      setSubmitError('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4">
        <FormField
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
          autoComplete="email"
        />
        <FormField
          label="Phone"
          value={values.phone}
          onChange={handleChange('phone')}
          error={errors.phone}
          autoComplete="tel"
        />
        <FormField
          label="Full name"
          value={values.customerName}
          onChange={handleChange('customerName')}
          error={errors.customerName}
          autoComplete="name"
        />
        <FormField label="Street / apartment" value={values.address ?? ''} onChange={handleChange('address')} />
        <FormField label="Nova Poshta city" value={values.np_city ?? ''} onChange={handleChange('np_city')} />
        <FormField
          label="Nova Poshta warehouse"
          value={values.np_warehouse ?? ''}
          onChange={handleChange('np_warehouse')}
        />
      </div>
      {submitError && <p className="text-sm text-rose-600">{submitError}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Redirecting to MAIB…' : 'Pay with MAIB'}
      </button>
    </form>
  );
}

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function FormField({ label, error, className, ...props }: FormFieldProps) {
  return (
    <label className="space-y-1 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        className={cn(
          'h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200',
          error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-200' : '',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </label>
  );
}
