import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, X, Send, ShoppingBag, Truck, Ruler, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

type Step =
  | 'root'
  | 'bestsellers'
  | 'size'
  | 'shipping'
  | 'returns'
  | 'support';

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('root');
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([
    { from: 'bot', text: 'Namaste! I’m here to help. What would you like to do?' },
  ]);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, open, step]);

  // Allow other components to open chat and navigate to a step
  useEffect(() => {
    const handler = (e: Event) => {
      // @ts-expect-error CustomEvent detail
      const detail = (e as CustomEvent).detail as { step?: Step } | undefined;
      setOpen(true);
      if (detail?.step) setStep(detail.step);
    };
    window.addEventListener('mnf:chat-open', handler as EventListener);
    return () => window.removeEventListener('mnf:chat-open', handler as EventListener);
  }, []);

  const quickActions = useMemo(
    () => [
      { key: 'bestsellers', label: 'Shop Bestsellers', icon: ShoppingBag },
      { key: 'size', label: 'Find My Size', icon: Ruler },
      { key: 'shipping', label: 'Shipping Info', icon: Truck },
      { key: 'returns', label: 'Returns & Exchanges', icon: Info },
      { key: 'support', label: 'Talk to Support', icon: MessageCircle },
    ] as { key: Step; label: string; icon: any }[],
    []
  );

  const handleQuick = (s: Step) => {
    setStep(s);
    switch (s) {
      case 'bestsellers':
        setMessages((m) => [
          ...m,
          { from: 'bot', text: 'Our most-loved collections. Pick one:' },
        ]);
        break;
      case 'size':
        setMessages((m) => [
          ...m,
          { from: 'bot', text: 'What size do you usually wear in tops? (XS–XXL)' },
        ]);
        break;
      case 'shipping':
        setMessages((m) => [
          ...m,
          { from: 'bot', text: 'Free shipping on orders ₹999+. Dispatch within 24–48 hours.' },
        ]);
        break;
      case 'returns':
        setMessages((m) => [
          ...m,
          { from: 'bot', text: 'Easy 15-day returns. Unused items with tags are eligible.' },
        ]);
        break;
      case 'support':
        setMessages((m) => [
          ...m,
          { from: 'bot', text: 'Share your email or use Contact page. We’ll respond ASAP.' },
        ]);
        break;
    }
  };

  const handleNavigate = (href: string) => {
    window.location.href = href;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setMessages((m) => [...m, { from: 'user', text: email }]);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: 'bot', text: 'Thanks! We’ll share personalized picks to your inbox.' },
      ]);
    }, 400);
    try {
      localStorage.setItem('chat_email', email);
    } catch {}
    setEmail('');
  };

  return (
    <div className="fixed z-[60] bottom-4 right-4 flex flex-col items-end">
      {open && (
        <Card className="w-80 sm:w-96 mb-3 rounded-2xl shadow-elegant border border-border/60 overflow-hidden">
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
            <div className="font-medium">Maninfini Assistant</div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/20">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div ref={bodyRef} className="max-h-96 overflow-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm ${m.from === 'bot' ? 'text-foreground' : 'text-muted-foreground text-right'}`}>
                {m.text}
              </div>
            ))}

            {step === 'root' && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {quickActions.map(({ key, label, icon: Icon }) => (
                  <Button key={key} variant="outline" className="justify-start" onClick={() => handleQuick(key)}>
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            )}

            {step === 'bestsellers' && (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => handleNavigate('/shop')}>
                  All Bestsellers
                </Button>
                <Button variant="outline" onClick={() => handleNavigate('/collections/sarees')}>
                  Sarees
                </Button>
                <Button variant="outline" onClick={() => handleNavigate('/collections/kurtis')}>
                  Kurtis
                </Button>
                <Button variant="outline" onClick={() => handleNavigate('/collections/jewellery')}>
                  Jewellery
                </Button>
              </div>
            )}

            {step === 'size' && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Pick your usual size:</div>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={() => setMessages((m) => [...m, { from: 'bot', text: `Great! You’ll likely fit ${s}.` }])}>
                      {s}
                    </Button>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
                  <Input placeholder="Email for size & fit tips" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Button type="submit" size="icon" aria-label="Submit email">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}
          </div>
          {step !== 'root' && (
            <div className="p-3 border-t border-border/60 flex justify-between">
              <Button variant="ghost" onClick={() => setStep('root')}>Back</Button>
              <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
            </div>
          )}
        </Card>
      )}
      <Button className="btn-primary rounded-full w-14 h-14 shadow-luxury" onClick={() => setOpen((o) => !o)} aria-label="Open chat">
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ChatWidget;
