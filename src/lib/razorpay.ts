import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

async function loadScript(src: string) {
  return new Promise<boolean>((resolve) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export type RazorpayOptions = {
  amount: number; // in INR paisa (e.g., Rs 100 -> 10000)
  name: string;
  email: string;
  contact: string; // 10-digit Indian mobile
  notes?: Record<string, string>;
};

export async function startRazorpayPayment(opts: RazorpayOptions) {
  if (!RAZORPAY_KEY_ID) {
    toast.info('Razorpay key missing. Using demo completion.');
    return { status: 'demo', id: 'demo_payment' } as const;
  }

  const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  if (!ok || !window.Razorpay) {
    toast.error('Unable to load Razorpay. Please retry.');
    return { status: 'failed' } as const;
  }

  return new Promise((resolve) => {
    // Razorpay renders all standard methods by default (Cards, UPI, NetBanking, Wallets).
    // We keep config minimal for a clean, reliable flow.
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: opts.amount,
      currency: 'INR',
      name: 'Maninfini Trends',
      prefill: {
        name: opts.name,
        email: opts.email,
        contact: `+91${opts.contact}`,
      },
      notes: opts.notes,
      handler: function (response: any) {
        resolve({ status: 'success', response } as const);
      },
      modal: {
        ondismiss: function () {
          resolve({ status: 'cancelled' } as const);
        },
      },
      theme: { color: '#7c203a' },
    });
    rzp.open();
  });
}
