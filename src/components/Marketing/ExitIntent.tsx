import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const STORAGE_KEY = 'mnf_exit_intent_shown_v1';

export const ExitIntent = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const shown = sessionStorage.getItem(STORAGE_KEY);
    if (shown) return;

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setOpen(true);
        sessionStorage.setItem(STORAGE_KEY, '1');
      }
    };

    // Mobile dwell fallback
    const dwellTimer = window.setTimeout(() => {
      if (!sessionStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
        sessionStorage.setItem(STORAGE_KEY, '1');
      }
    }, 30000);

    document.addEventListener('mouseleave', onMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      clearTimeout(dwellTimer);
    };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.match(/\S+@\S+\.\S+/)) return;
    try {
      localStorage.setItem('lead_email', email);
    } catch {}
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Before you go — enjoy 10% off</DialogTitle>
          <DialogDescription>
            Join our list for early access to new drops, eco finds, and exclusive offers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex gap-2 pt-2">
          <Input
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
          <Button type="submit" className="btn-primary">Unlock</Button>
        </form>
        <p className="text-xs text-muted-foreground">
          By continuing you agree to receive marketing emails. Unsubscribe anytime.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntent;

