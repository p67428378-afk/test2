import React from "react";

export default function OrderSummaryCard({
  boxSize,
  frequencyWeeks,
  onComplete,
  loading,
}) {
  const sizeDetails = {
    Small: {
      name: "The Taster",
      basePrice: 25.0,
      discountedPrice: 22.5,
      discount: 2.5,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAcZ3yUVf0U2M6-S6C9HcXJxdFLoFa6LM4HqSyodW8P2JHobH2548siAEJJDt_EAA-PpGbOVhO1p44Pvv_Sl8_qWMMzF5CFaOZkJRcnAobl4C6fM20pH4Yr_m2JxVEPdf-o5KtS_uxwZve1lWnKC7id4xmOSz-a9kYkKNlRGqiHPuNcp27dQ_AlORFN-zVpTB3Of4oFN34Bzo4zrku-Rgg6cA1HKcXSmRR1IfM6IYzZhVv4CIwvVbHzjzRFFXdPH6mv8-AIch4UIU0",
    },
    Medium: {
      name: "The Connoisseur",
      basePrice: 45.0,
      discountedPrice: 40.5,
      discount: 4.5,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAcZ3yUVf0U2M6-S6C9HcXJxdFLoFa6LM4HqSyodW8P2JHobH2548siAEJJDt_EAA-PpGbOVhO1p44Pvv_Sl8_qWMMzF5CFaOZkJRcnAobl4C6fM20pH4Yr_m2JxVEPdf-o5KtS_uxwZve1lWnKC7id4xmOSz-a9kYkKNlRGqiHPuNcp27dQ_AlORFN-zVpTB3Of4oFN34Bzo4zrku-Rgg6cA1HKcXSmRR1IfM6IYzZhVv4CIwvVbHzjzRFFXdPH6mv8-AIch4UIU0",
    },
    Large: {
      name: "The Chocolatier",
      basePrice: 80.0,
      discountedPrice: 72.0,
      discount: 8.0,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAcZ3yUVf0U2M6-S6C9HcXJxdFLoFa6LM4HqSyodW8P2JHobH2548siAEJJDt_EAA-PpGbOVhO1p44Pvv_Sl8_qWMMzF5CFaOZkJRcnAobl4C6fM20pH4Yr_m2JxVEPdf-o5KtS_uxwZve1lWnKC7id4xmOSz-a9kYkKNlRGqiHPuNcp27dQ_AlORFN-zVpTB3Of4oFN34Bzo4zrku-Rgg6cA1HKcXSmRR1IfM6IYzZhVv4CIwvVbHzjzRFFXdPH6mv8-AIch4UIU0",
    },
  };

  const current = sizeDetails[boxSize] || sizeDetails.Medium;

  return (
    <div className="sticky top-0 min-h-screen flex flex-col p-margin-mobile md:p-12 lg:p-16">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-8 border-b border-outline-variant/10 pb-6">
        Your Subscription Summary
      </h2>

      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_10px_40px_rgba(74,44,42,0.08)] mb-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed-dim/10 rounded-bl-full -z-0"></div>

        <div className="relative z-10 flex gap-6 mb-8 border-b border-outline-variant/10 pb-6">
          <div className="w-24 h-24 rounded-lg bg-surface-container-highest overflow-hidden shrink-0 border border-outline-variant/20">
            <img
              className="w-full h-full object-cover"
              alt={current.name}
              src={current.image}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
              {current.name}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                sync
              </span>
              Ships every {frequencyWeeks} weeks
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-body-md text-body-md text-on-surface-variant">
              Box Subtotal
            </span>
            <span className="font-body-md text-body-md text-on-surface">
              ${current.basePrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body-md text-body-md text-[#2e7d32] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">
                local_offer
              </span>
              Subscriber Discount (10%)
            </span>
            <span className="font-body-md text-body-md text-[#2e7d32]">
              -${current.discount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body-md text-body-md text-on-surface-variant">
              Shipping
            </span>
            <span className="font-body-md text-body-md text-on-surface uppercase tracking-wider text-sm">
              Free
            </span>
          </div>
        </div>

        <div className="border-t border-outline-variant/20 pt-6 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-widest">
              Total Due Today
            </span>
            <span className="font-body-md text-body-md text-on-surface-variant text-sm">
              Includes all applicable taxes
            </span>
          </div>
          <span className="font-headline-md text-headline-md text-primary">
            ${current.discountedPrice.toFixed(2)}
          </span>
        </div>

        <button
          onClick={onComplete}
          disabled={loading}
          className="w-full mt-10 bg-primary-container text-secondary-fixed-dim hover:bg-primary py-4 px-6 rounded-full font-label-md text-label-md transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]">
            shopping_bag
          </span>
          {loading
            ? "Processing..."
            : `Complete Subscription — $${current.discountedPrice.toFixed(2)}`}
        </button>

        <p className="font-label-sm text-label-sm text-on-surface-variant mt-6 text-center leading-relaxed opacity-80">
          By completing this subscription, you agree to our 48-Hour Rule.
          Changes to your box or cancellations must be made 48 hours prior to
          your scheduled shipping date.
        </p>
      </div>

      <div className="flex justify-center gap-8 mt-12 py-6 border-t border-outline-variant/10">
        <div className="flex flex-col items-center gap-2 text-center max-w-[100px]">
          <span className="material-symbols-outlined text-3xl text-surface-tint opacity-80">
            event_available
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            No Commitment
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center max-w-[100px]">
          <span className="material-symbols-outlined text-3xl text-surface-tint opacity-80">
            verified_user
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Secure Checkout
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center max-w-[100px]">
          <span className="material-symbols-outlined text-3xl text-surface-tint opacity-80">
            thumb_up
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            100% Satisfaction
          </span>
        </div>
      </div>
    </div>
  );
}
