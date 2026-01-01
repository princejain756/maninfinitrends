import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, X, Send, ShoppingBag, Truck, Ruler, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
          { from: 'bot', text: 'Choose how you’d like to reach support:' },
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

  // Lightweight contact helpers (centralize later if needed)
  const SUPPORT_EMAIL = 'info@maninfini.in';
  const SUPPORT_PHONE_E164 = '+919876543210'; // dialable format
  const WHATSAPP_PHONE = '919876543210'; // wa.me requires country code without '+'
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hi Maninfini Support, I need help with...')}`;
  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Support request')}&body=${encodeURIComponent('Hi Maninfini Support,\n\nI need help with ...\nOrder ID (if any): \n\nThanks,')}`;
  const telUrl = `tel:${SUPPORT_PHONE_E164}`;

  return (
    <>
      {/* Mobile overlay when open */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/30 z-[59]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={
          `fixed z-[60] flex flex-col ${
            isMobile && open
              ? 'inset-x-0 bottom-0 items-stretch'
              : 'bottom-4 right-4 items-end'
          }`
        }
      >
      {open && (
        <Card
          className={
            `${
              isMobile
                ? 'w-full h-[70vh] mb-0 rounded-t-2xl rounded-b-none'
                : 'w-80 sm:w-96 mb-3 rounded-2xl'
            } shadow-elegant border border-border/60 overflow-hidden bg-background`
          }
        >
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
            <div className="font-medium">Maninfini Assistant</div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/20">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div
            ref={bodyRef}
            className={`${isMobile ? 'h-[calc(70vh-108px)]' : 'max-h-96'} overflow-auto p-4 space-y-3`}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm max-w-[85%] ${
                  m.from === 'bot'
                    ? 'bg-muted text-foreground rounded-lg p-2'
                    : 'bg-primary/10 text-foreground rounded-lg p-2 ml-auto text-right'
                }`}
              >
                {m.text}
              </div>
            ))}

            {step === 'root' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {quickActions.map(({ key, label, icon: Icon }) => (
                  <Button key={key} variant="outline" size="sm" className="justify-start" onClick={() => handleQuick(key)}>
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            )}

            {step === 'bestsellers' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleNavigate('/shop')}>
                  All Bestsellers
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleNavigate('/collections/sarees')}>
                  Sarees
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleNavigate('/collections/kurtis')}>
                  Kurtis
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleNavigate('/collections/jewellery')}>
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
                  <Input placeholder="Email for size & fit tips" value={email} onChange={(e) => setEmail(e.target.value)} className="text-sm" />
                  <Button type="submit" size="icon" aria-label="Submit email">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}

            {step === 'support' && (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">Choose a contact option:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={mailtoUrl}>Email</a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={telUrl}>Call</a>
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  We typically respond within a few hours during 9 AM – 7 PM IST.
                </div>
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
      {/* Hide the trigger while the sheet is open on mobile to avoid overlap */}
      <div className={`${isMobile && open ? 'hidden' : 'block'} pb-[env(safe-area-inset-bottom)]` }>
        <Button className={`btn-primary rounded-full ${isMobile ? 'w-12 h-12' : 'w-14 h-14'} shadow-luxury`} onClick={() => setOpen((o) => !o)} aria-label="Open chat">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
    </>
  );
};

export default ChatWidget;
