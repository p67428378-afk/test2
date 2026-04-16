import React from 'react';

const PolicyCancellation = () => {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<body class="bg-background text-on-background font-body antialiased pb-32">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md flex justify-between items-center px-6 py-4 w-full h-16">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Professional headshot of a middle-aged male executive in a blue suit with soft daylight and professional office background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4VnxI-rjPuzDdN3vVzuGjvgIsG0KuMNv42GzbXeJwsRYS_Cq5MhSRO6RHcYOkFKi_wQqgcvIlX6tjKCUB-etMrPzTm3KZMvWuOHhbFtm_JfFDyRCcsva6ZP2fpW6QmtZnm1K_dSoH-fjNs5AdLnWjJJ12X0Tw-1vhS8YsmKAsfPeK4xRIXyOSdPeIAHJ_r_q4G10dL0Q85Jn0hTbfFcLcBCimBLXEpIF242gN_e3EIKZDxIJOsxjNJMjE3R6Vc70ab0LD8j8wWFwt"/>
</div>
<span class="text-blue-800 font-headline font-bold text-lg tracking-tight">Policy Status</span>
</div>
<button class="text-slate-500 hover:opacity-80 transition-opacity active:scale-95 transition-transform">
<span class="material-symbols-outlined" data-icon="close">close</span>
</button>
</header>
<main class="pt-20 px-6 max-w-md mx-auto">
<!-- Hero Warning Section -->
<section class="mt-4 mb-8">
<div class="rounded-xl overflow-hidden relative p-6 bg-gradient-to-br from-primary to-primary-container text-on-primary">
<div class="relative z-10">
<span class="label-sm bg-tertiary-container/30 text-on-tertiary px-3 py-1 rounded-full uppercase tracking-widest font-bold text-[10px]">Critical Action</span>
<h1 class="font-headline text-2xl font-extrabold mt-3 leading-tight tracking-tight">Cancel Your Coverage</h1>
<p class="text-on-primary-container mt-2 text-sm opacity-90 leading-relaxed">We're sorry to see you go. Please review the implications of ending your health protection plan.</p>
</div>
<div class="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-20">
<span class="material-symbols-outlined text-[120px]" data-icon="shield_moon">shield_moon</span>
</div>
</div>
</section>
<!-- Current Policy Summary (Editorial Card) -->
<div class="bg-surface-container-low rounded-xl p-1 mb-8">
<div class="bg-surface-container-lowest rounded-lg p-5">
<div class="flex justify-between items-start mb-4">
<div>
<p class="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Active Policy</p>
<h2 class="font-headline font-bold text-primary text-lg">Azure Premier Guardian</h2>
</div>
<span class="bg-tertiary-container text-white text-[10px] px-2 py-1 rounded-full font-bold">ACTIVE</span>
</div>
<div class="grid grid-cols-2 gap-4">
<div>
<p class="text-[10px] text-outline uppercase tracking-wider">Member ID</p>
<p class="font-headline font-bold text-on-surface">AZ-8829-011</p>
</div>
<div>
<p class="text-[10px] text-outline uppercase tracking-wider">Renewal Date</p>
<p class="font-headline font-bold text-on-surface">Oct 12, 2024</p>
</div>
</div>
</div>
</div>
<!-- Review Cancellation Terms -->
<section class="space-y-6">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-primary" data-icon="gavel">gavel</span>
<h3 class="font-headline font-bold text-on-surface text-base">Review Cancellation Terms</h3>
</div>
<div class="space-y-4">
<!-- Point 1 -->
<div class="flex gap-4 p-4 rounded-xl bg-surface-container-low">
<div class="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
<span class="material-symbols-outlined text-sm" data-icon="event_busy">event_busy</span>
</div>
<div>
<h4 class="text-sm font-bold text-on-surface">Effective Termination Date</h4>
<p class="text-xs text-on-surface-variant mt-1 leading-relaxed">Cancellation will be effective at 11:59 PM on the last day of the current billing cycle. No partial refunds are issued for mid-month cancellations.</p>
</div>
</div>
<!-- Point 2 -->
<div class="flex gap-4 p-4 rounded-xl bg-surface-container-low">
<div class="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-error shadow-sm">
<span class="material-symbols-outlined text-sm" data-icon="warning">warning</span>
</div>
<div>
<h4 class="text-sm font-bold text-on-surface">Potential Penalties</h4>
<p class="text-xs text-on-surface-variant mt-1 leading-relaxed">A processing fee of $45.00 applies to early terminations. Any pending claims must be finalized before the account is fully closed.</p>
</div>
</div>
<!-- Point 3 -->
<div class="flex gap-4 p-4 rounded-xl bg-surface-container-low">
<div class="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-secondary shadow-sm">
<span class="material-symbols-outlined text-sm" data-icon="history">history</span>
</div>
<div>
<h4 class="text-sm font-bold text-on-surface">Loss of Continuity</h4>
<p class="text-xs text-on-surface-variant mt-1 leading-relaxed">Cancelling this policy may result in a "waiting period" for pre-existing conditions if you seek coverage elsewhere after a 63-day gap.</p>
</div>
</div>
</div>
</section>
<!-- Acknowledgment -->
<section class="mt-10 p-5 rounded-xl border border-outline-variant/20 bg-surface-container-lowest">
<div class="flex items-start gap-4">
<div class="pt-1">
<input class="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" id="gap-check" type="checkbox"/>
</div>
<label class="text-xs text-on-surface-variant leading-relaxed" for="gap-check">
                    I understand that cancelling this policy will result in a **coverage gap**. I acknowledge that I am responsible for any medical expenses incurred after the termination date.
                </label>
</div>
</section>
<!-- Final CTA -->
<div class="mt-10 pb-10">
<button class="w-full bg-error text-on-error py-4 rounded-xl font-headline font-bold text-base shadow-lg shadow-error/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
<span class="material-symbols-outlined" data-icon="cancel">cancel</span>
                Initiate Cancellation Request
            </button>
<button class="w-full mt-4 text-primary font-headline font-bold text-sm py-2 hover:underline transition-all">
                Keep My Current Plan
            </button>
</div>
</main>
<!-- BottomNavBar (Suppressed for focused task per rules, but included for structure reference) -->
<!-- Navigation hidden for transactional cancellation screen -->
</body>` }} />
  );
};

export default PolicyCancellation;
