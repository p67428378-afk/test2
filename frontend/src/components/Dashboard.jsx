import React from 'react';

const Dashboard = () => {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<body class="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed pb-32">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
<div class="flex justify-between items-center px-6 py-4 w-full h-16">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant/20">
<img alt="User Profile" class="w-full h-full object-cover" data-alt="professional headshot of a smiling man with spectacles in a clean studio setting with soft blue lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmefsCArN4nQYBYwVRCiM_uRFg9R1LRr-6QaFJO8qndLxB4RtaVJd_kXZLopUqQA0M1oSHyrhCm87_INyzwHBB8dodRplY9o_BUaa0w68Wr3XKzhC43HSGuo8cJ72PFpUbsm4GdL9X5CSIObwRCkOehvkuks-zSgk7PP5eHdsMsrg-al2lvsS45aaMPyGicT2deR2WyXSpv76_Gxj8xaxuqRUKJB8TXAWHXzklDSrgsx5IHh81UnbUZb_V-LHe8KACesQwECVEO5Pm"/>
</div>
<h1 class="text-blue-800 dark:text-blue-400 font-['Manrope'] font-bold text-lg tracking-tight">The Clarified Guardian</h1>
</div>
<button class="text-slate-500 dark:text-slate-400 hover:opacity-80 transition-opacity active:scale-95 transition-transform">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
</div>
<div class="bg-slate-100 dark:bg-slate-800 h-px w-full"></div>
</header>
<main class="mt-20 px-6 max-w-lg mx-auto">
<!-- Hero: Gold Shield Premium -->
<section class="mb-8">
<div class="glass-texture rounded-[2rem] p-8 text-on-primary shadow-2xl relative overflow-hidden">
<!-- Abstract Grain Pattern -->
<div class="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
<div class="relative z-10">
<div class="flex justify-between items-start mb-6">
<div>
<span class="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">Active</span>
<h2 class="font-headline font-extrabold text-2xl tracking-tight leading-tight">Gold Shield Premium</h2>
</div>
<span class="material-symbols-outlined text-4xl opacity-50" data-icon="shield_with_heart" style="font-variation-settings: 'FILL' 1;">shield_with_heart</span>
</div>
<div class="space-y-1 mb-8">
<p class="text-on-primary-container/80 text-sm font-medium">Monthly Premium</p>
<div class="flex items-baseline gap-1">
<span class="font-headline font-extrabold text-4xl tracking-tighter">$450</span>
<span class="text-on-primary-container/60 font-semibold">/mo</span>
</div>
</div>
<div class="w-full bg-white/20 h-2 rounded-full mb-2 overflow-hidden">
<div class="bg-secondary-fixed h-full w-[85%] shadow-[0_0_12px_rgba(146,241,254,0.5)]"></div>
</div>
<div class="flex justify-between text-[11px] font-bold uppercase tracking-wider text-on-primary-container/70">
<span>Deductible Met</span>
<span>$2,550 / $3,000</span>
</div>
</div>
</div>
</section>
<!-- Quick Actions -->
<section class="grid grid-cols-2 gap-4 mb-10">
<button class="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-3xl group active:scale-95 transition-all duration-200">
<div class="w-12 h-12 bg-primary-container/10 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
<span class="material-symbols-outlined" data-icon="group">group</span>
</div>
<span class="font-headline font-bold text-sm text-primary tracking-tight">Manage Beneficiaries</span>
</button>
<button class="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-3xl group active:scale-95 transition-all duration-200">
<div class="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-on-primary transition-colors">
<span class="material-symbols-outlined" data-icon="visibility">visibility</span>
</div>
<span class="font-headline font-bold text-sm text-secondary tracking-tight">View Coverage</span>
</button>
</section>
<!-- Insights Bento Grid -->
<section class="space-y-4">
<h3 class="font-headline font-bold text-lg text-primary ml-2 mb-4">Health Governance</h3>
<div class="grid grid-cols-12 gap-4">
<!-- Recent Claims -->
<div class="col-span-12 bg-surface-container-low rounded-[2rem] p-1">
<div class="bg-surface-container-lowest rounded-[1.75rem] p-6">
<div class="flex justify-between items-center mb-6">
<h4 class="font-headline font-bold text-on-surface">Recent Claims</h4>
<span class="text-primary text-xs font-bold uppercase tracking-widest">See All</span>
</div>
<div class="space-y-6">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
<span class="material-symbols-outlined text-outline" data-icon="medical_services">medical_services</span>
</div>
<div class="flex-1">
<p class="font-bold text-sm">Metropolitan General</p>
<p class="text-xs text-outline">Oct 24, 2023</p>
</div>
<div class="text-right">
<p class="font-bold text-sm text-tertiary">+$1,240.00</p>
<p class="text-[10px] font-bold uppercase text-outline tracking-tight">Approved</p>
</div>
</div>
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
<span class="material-symbols-outlined text-outline" data-icon="medication">medication</span>
</div>
<div class="flex-1">
<p class="font-bold text-sm">CVS Pharmacy #482</p>
<p class="text-xs text-outline">Oct 21, 2023</p>
</div>
<div class="text-right">
<p class="font-bold text-sm">$45.00</p>
<p class="text-[10px] font-bold uppercase text-secondary tracking-tight">Pending</p>
</div>
</div>
</div>
</div>
</div>
<!-- Small Cards -->
<div class="col-span-6 bg-surface-container-low rounded-[2rem] p-6 flex flex-col justify-between aspect-square">
<span class="material-symbols-outlined text-secondary text-3xl" data-icon="verified_user">verified_user</span>
<div>
<p class="text-xs text-outline font-medium mb-1">ID Card</p>
<p class="font-headline font-bold text-on-surface leading-tight">Digital Access Ready</p>
</div>
</div>
<div class="col-span-6 bg-surface-container-low rounded-[2rem] p-6 flex flex-col justify-between aspect-square">
<span class="material-symbols-outlined text-primary text-3xl" data-icon="support_agent">support_agent</span>
<div>
<p class="text-xs text-outline font-medium mb-1">Assistance</p>
<p class="font-headline font-bold text-on-surface leading-tight">24/7 Concierge Active</p>
</div>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 w-full z-50 rounded-t-3xl border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
<div class="fixed bottom-0 left-0 right-0 flex justify-around items-center px-4 pt-2 pb-6 w-full">
<a class="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-2xl px-5 py-2 tap-highlight-transparent active:scale-90 transition-all duration-200" href="#">
<span class="material-symbols-outlined" data-icon="dashboard" style="font-variation-settings: 'FILL' 1;">dashboard</span>
<span class="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider mt-1">Dashboard</span>
</a>
<a class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 tap-highlight-transparent active:scale-90 transition-all duration-200" href="#">
<span class="material-symbols-outlined" data-icon="verified_user">verified_user</span>
<span class="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider mt-1">Policies</span>
</a>
<a class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 tap-highlight-transparent active:scale-90 transition-all duration-200" href="#">
<span class="material-symbols-outlined" data-icon="group">group</span>
<span class="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider mt-1">Beneficiaries</span>
</a>
<a class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 tap-highlight-transparent active:scale-90 transition-all duration-200" href="#">
<span class="material-symbols-outlined" data-icon="help_outline">help_outline</span>
<span class="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider mt-1">Support</span>
</a>
</div>
</nav>
</body>` }} />
  );
};

export default Dashboard;
