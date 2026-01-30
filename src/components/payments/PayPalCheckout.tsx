import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Shield,
  Check,
  ArrowRight,
  RefreshCcw,
} from 'lucide-react';
import { toast } from 'sonner';

interface PayPalCheckoutProps {
  itemName: string;
  itemPrice: number;
  itemType: 'one-time' | 'subscription';
  onSuccess?: () => void;
  onCancel?: () => void;
}

// PayPal logo SVG component
function PayPalLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 101 32" fill="currentColor">
      <path d="M12.237 2.438H4.437a1.031 1.031 0 0 0-1.019.872L.008 27.022a.619.619 0 0 0 .612.718h3.733a1.031 1.031 0 0 0 1.018-.872l.922-5.847a1.031 1.031 0 0 1 1.018-.872h2.351c4.892 0 7.714-2.367 8.451-7.06.332-2.054.014-3.667-.944-4.795-1.054-1.241-2.921-1.856-5.932-1.856zm.857 6.954c-.406 2.67-2.443 2.67-4.414 2.67h-1.12l.787-4.98a.617.617 0 0 1 .61-.522h.513c1.342 0 2.609 0 3.262.765.39.457.508 1.135.362 2.067z"/>
      <path d="M35.276 9.319h-3.746a.617.617 0 0 0-.61.523l-.166 1.047-.263-.38c-.813-1.18-2.625-1.574-4.435-1.574-4.148 0-7.692 3.142-8.382 7.549-.359 2.198.15 4.3 1.396 5.766 1.145 1.347 2.78 1.909 4.726 1.909 3.342 0 5.195-2.148 5.195-2.148l-.168 1.042a.619.619 0 0 0 .611.718h3.374a1.031 1.031 0 0 0 1.018-.872l2.026-12.843a.618.618 0 0 0-.576-.737zm-5.232 7.307c-.362 2.143-2.066 3.581-4.237 3.581-1.089 0-1.96-.35-2.52-.1-.556-.744-.753-1.803-.556-2.97.339-2.126 2.073-3.612 4.21-3.612 1.063 0 1.924.353 2.493 1.022.573.675.79 1.635.61 2.879z"/>
      <path d="M55.607 9.319h-3.762a1.034 1.034 0 0 0-.854.454l-4.932 7.26-2.09-6.978a1.033 1.033 0 0 0-.99-.736h-3.697a.62.62 0 0 0-.586.823l3.937 11.554-3.703 5.228a.619.619 0 0 0 .506.98h3.758a1.032 1.032 0 0 0 .848-.443l11.893-17.17a.618.618 0 0 0-.328-.972z"/>
      <path d="M68.125 2.438h-7.8a1.031 1.031 0 0 0-1.019.872l-3.41 21.712a.619.619 0 0 0 .612.718h4.005a.72.72 0 0 0 .712-.61l.967-6.11a1.031 1.031 0 0 1 1.018-.87h2.351c4.892 0 7.714-2.368 8.451-7.061.332-2.054.014-3.667-.944-4.795-1.054-1.24-2.921-1.856-5.943-1.856zm.857 6.954c-.406 2.67-2.443 2.67-4.414 2.67h-1.12l.787-4.98a.617.617 0 0 1 .61-.522h.513c1.342 0 2.609 0 3.262.765.39.457.508 1.135.362 2.067z"/>
      <path d="M91.164 9.319h-3.746a.617.617 0 0 0-.61.523l-.166 1.047-.263-.38c-.813-1.18-2.625-1.574-4.435-1.574-4.148 0-7.692 3.142-8.382 7.549-.359 2.198.15 4.3 1.396 5.766 1.145 1.347 2.78 1.909 4.726 1.909 3.342 0 5.195-2.148 5.195-2.148l-.168 1.042a.619.619 0 0 0 .611.718h3.374a1.031 1.031 0 0 0 1.018-.872l2.026-12.843a.618.618 0 0 0-.576-.737zm-5.232 7.307c-.362 2.143-2.066 3.581-4.237 3.581-1.089 0-1.96-.35-2.52-1-.556-.744-.753-1.803-.556-2.97.339-2.126 2.073-3.612 4.21-3.612 1.063 0 1.924.353 2.493 1.022.573.675.79 1.635.61 2.879z"/>
      <path d="M95.003 2.836l-3.461 22.024a.619.619 0 0 0 .611.718h3.226a1.031 1.031 0 0 0 1.019-.872L99.808 3.14a.619.619 0 0 0-.612-.718h-3.582a.617.617 0 0 0-.611.414z"/>
    </svg>
  );
}

export function PayPalCheckout({
  itemName,
  itemPrice,
  itemType,
  onSuccess,
  onCancel,
}: PayPalCheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card'>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayPalCheckout = async () => {
    setIsProcessing(true);
    // This would integrate with PayPal SDK
    toast.info('Connecting to PayPal...');
    
    // Simulate PayPal flow
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    toast.success('Payment successful!');
    onSuccess?.();
  };

  const handleCardPayment = async () => {
    setIsProcessing(true);
    toast.info('Processing card payment via PayPal...');
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    toast.success('Payment successful!');
    onSuccess?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto"
    >
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="font-display flex items-center justify-between">
            <span>Checkout</span>
            <Badge variant="outline">{itemType === 'subscription' ? 'Monthly' : 'One-time'}</Badge>
          </CardTitle>
          <CardDescription>{itemName}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Price Display */}
          <div className="text-center py-4 bg-muted/30 rounded-lg">
            <div className="text-3xl font-display font-bold">
              ${itemPrice.toFixed(2)}
              {itemType === 'subscription' && (
                <span className="text-base font-normal text-muted-foreground">/month</span>
              )}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as 'paypal' | 'card')}
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="paypal"
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
                <PayPalLogo className="h-5 text-[#003087]" />
              </Label>
              
              <Label
                htmlFor="card"
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value="card" id="card" className="sr-only" />
                <CreditCard className="w-5 h-5" />
                <span className="text-sm font-medium">Card</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Card Form (shown when card is selected) */}
          {paymentMethod === 'card' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" className="mt-1" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Payments processed securely via PayPal
              </p>
            </motion.div>
          )}

          <Separator />

          {/* Refund Policy */}
          <div className="flex items-start gap-2 text-sm bg-success/10 text-success p-3 rounded-lg">
            <RefreshCcw className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>14-Day Money-Back Guarantee</strong>
              <p className="text-xs text-success/80 mt-0.5">
                Full refund within 14 days, no questions asked
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              className="w-full gap-2"
              size="lg"
              disabled={isProcessing}
              onClick={paymentMethod === 'paypal' ? handlePayPalCheckout : handleCardPayment}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {paymentMethod === 'paypal' ? (
                    <>
                      Pay with <PayPalLogo className="h-4 text-current" />
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pay ${itemPrice.toFixed(2)}
                    </>
                  )}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
            
            <Button variant="ghost" className="w-full" onClick={onCancel} disabled={isProcessing}>
              Cancel
            </Button>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Secured by PayPal • SSL Encrypted</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
