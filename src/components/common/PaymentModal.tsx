import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Building2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  purpose: 'placement_programme' | 'course_fee' | 'employer_subscription';
  description: string;
  onSuccess: (paymentDetails: { transactionId: string; method: string }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  amount,
  purpose,
  description,
  onSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('student@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [txnRef, setTxnRef] = useState('');

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedTxn = `SB-TXN-${Date.now().toString().slice(-6)}`;
      setTxnRef(generatedTxn);
      setIsProcessing(false);
      setIsCompleted(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onSuccess({
          transactionId: generatedTxn,
          method: selectedMethod
        });
        onClose();
        setIsCompleted(false);
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
              Sandbox Gateway
            </span>
            <span className="flex items-center text-xs text-emerald-400 gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Encrypted
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{description}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isCompleted ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3 animate-bounce" />
              <h4 className="text-xl font-bold text-slate-800">Payment Successful!</h4>
              <p className="text-sm text-slate-600 mt-1">
                Ref ID: <span className="font-mono font-semibold text-slate-900">{txnRef}</span>
              </p>
              <p className="text-xs text-slate-400 mt-3">Finalising your registration...</p>
            </div>
          ) : (
            <>
              {/* Order Amount Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between mb-5">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">Total Payable</span>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    ₹{amount.toLocaleString('en-IN')}
                  </div>
                </div>
                {purpose === 'placement_programme' && (
                  <div className="text-right">
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      ₹2,000 Refund Eligible
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Upon verified placement</p>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                    selectedMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mb-1" />
                  UPI / QR
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                    selectedMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1" />
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Building2 className="w-5 h-5 mb-1" />
                  NetBanking
                </button>
              </div>

              {/* Form Input based on selection */}
              {selectedMethod === 'upi' && (
                <div className="space-y-2 mb-5">
                  <label className="text-xs font-medium text-slate-700">UPI Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <div className="flex gap-2 pt-1">
                    <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-200" onClick={() => setUpiId('demo@okhdfcbank')}>demo@okhdfcbank</span>
                    <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-200" onClick={() => setUpiId('user@paytm')}>user@paytm</span>
                  </div>
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-3 mb-5">
                  <div>
                    <label className="text-xs font-medium text-slate-700">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-slate-700">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-700">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={3}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div className="space-y-2 mb-5">
                  <label className="text-xs font-medium text-slate-700">Select Bank</label>
                  <select className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Punjab National Bank</option>
                  </select>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePay}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Demo Transaction...</span>
                  </>
                ) : (
                  <span>Simulate Payment of ₹{amount.toLocaleString('en-IN')}</span>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400 mt-3">
                Demo sandbox simulation. No actual funds will be deducted.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
