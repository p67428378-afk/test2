import React from 'react';

const PolicyManagement = () => {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<body class="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container pb-32">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex justify-between items-center px-6 py-4 w-full h-16">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden">
<img alt="User Profile Avatar" class="w-full h-full object-cover" data-alt="Portrait of a professional man in a blue shirt with a friendly expression, studio lighting, clean background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJpycb_oHvmHQ8YBWdtzKqdOWB8f0QaohkdZYXiw2Oc4ST0yDEFPICedELu_8uNb1K9ei0V-Tt1z3s2s18vwWZng8j4yTa2LVmhXMJb3ieQctDtjwsp2UlU2E4-jRqB3i8oVVvjCU0T8U8L2cjOMlt4tbVjU7sHXRjl6__UVgZPNczg2OwfQ4jE-OB7iRgasB-qcBJ5CHNpW6qFjaRD5lCbGUbh91Lpt5AAjkpe99BHwJxt7vx7ZaSC9mV_Hp3knDDOztOvW6UYi2H"/>
</div>
<span class="text-blue-800 dark:text-blue-400 font-extrabold tracking-tighter font-['Manrope'] font-bold text-lg tracking-tight">The Clarified Guardian</span>
</div>
<div class="flex items-center gap-4">
<button class="text-slate-500 dark:text-slate-400 hover:opacity-80 transition-opacity active:scale-95 transition-transform">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
</div>
</header>
<div class="h-16 w-full"></div>
<div class="bg-slate-100 dark:bg-slate-800 h-px w-full"></div>
<main class="max-w-md mx-auto px-6 mt-8">
<!-- Hero Header -->
<section class="mb-10">
<div class="label-md text-outline mb-2 flex items-center gap-2">
<span class="material-symbols-outlined text-[14px]" data-icon="verified_user" style="font-variation-settings: 'FILL' 1;">verified_user</span>
                MANAGE POLICY
            </div>
<h1 class="text-3xl font-extrabold text-primary tracking-tight leading-tight">Your Coverage <br/>Architecture</h1>
</section>
<!-- Dynamic Card 1: Main Information -->
<div class="space-y-6">
<div class="bg-surface-container-low rounded-[2rem] p-1 shadow-sm">
<div class="bg-surface-container-lowest rounded-[1.8rem] p-6">
<div class="flex justify-between items-center mb-8">
<div class="space-y-1">
<p class="text-label text-outline text-xs font-semibold uppercase tracking-[0.05em]">Current Status</p>
<span class="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary text-[10px] font-bold uppercase tracking-wider">
                                Active
                            </span>
</div>
<div class="text-right">
<p class="text-label text-outline text-xs font-semibold uppercase tracking-[0.05em]">Premium</p>
<p class="text-xl font-extrabold text-primary">$412<span class="text-sm font-medium text-outline">/mo</span></p>
</div>
</div>
<!-- Editable Form Fields -->
<form class="space-y-6">
<div class="space-y-2">
<label class="block text-[11px] font-bold text-primary uppercase tracking-widest pl-1" for="phone">Primary Phone</label>
<div class="relative group">
<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-outline text-sm" data-icon="call">call</span>
</div>
<input class="block w-full pl-10 pr-4 py-3 bg-surface-container-high border-none rounded-xl text-on-surface font-semibold focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none" id="phone" type="text" value="+1 (555) 012-3456"/>
<div class="absolute bottom-0 left-4 right-4 h-[1px] bg-outline-variant/20 group-focus-within:h-[2px] group-focus-within:bg-surface-tint transition-all"></div>
</div>
</div>
<div class="space-y-2">
<label class="block text-[11px] font-bold text-primary uppercase tracking-widest pl-1" for="address">Mailing Address</label>
<div class="relative group">
<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-outline text-sm" data-icon="location_on">location_on</span>
</div>
<input class="block w-full pl-10 pr-4 py-3 bg-surface-container-high border-none rounded-xl text-on-surface font-semibold focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none" id="address" type="text" value="742 Evergreen Terrace"/>
<div class="absolute bottom-0 left-4 right-4 h-[1px] bg-outline-variant/20 group-focus-within:h-[2px] group-focus-within:bg-surface-tint transition-all"></div>
</div>
</div>
<div class="space-y-2">
<label class="block text-[11px] font-bold text-primary uppercase tracking-widest pl-1" for="coverage">Coverage Level</label>
<div class="relative group">
<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-outline text-sm" data-icon="military_tech">military_tech</span>
</div>
<select class="block w-full pl-10 pr-10 py-3 bg-surface-container-high border-none rounded-xl text-on-surface font-bold focus:ring-2 focus:ring-primary-container focus:bg-white appearance-none transition-all outline-none" id="coverage">
<option value="Bronze">Bronze</option>
<option value="Silver">Silver</option>
<option selected="" value="Gold">Gold</option>
<option value="Platinum">Platinum</option>
</select>
<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-outline" data-icon="expand_more">expand_more</span>
</div>
<div class="absolute bottom-0 left-4 right-4 h-[1px] bg-outline-variant/20 group-focus-within:h-[2px] group-focus-within:bg-surface-tint transition-all"></div>
</div>
</div>
</form>
</div>
</div>
<!-- Asymmetric Data Visualization Card -->
<div class="grid grid-cols-12 gap-4">
<div class="col-span-12 p-6 rounded-[2rem] bg-gradient-to-br from-primary to-primary-container text-on-primary relative overflow-hidden">
<div class="relative z-10">
<h3 class="font-headline font-bold text-lg mb-1">Deductible Progress</h3>
<div class="flex items-baseline gap-2 mb-4">
<span class="text-3xl font-extrabold">$1,250</span>
<span class="text-on-primary-container text-xs font-medium">of $2,000 limit</span>
</div>
<div class="h-2 w-full bg-white/20 rounded-full overflow-hidden">
<div class="h-full bg-secondary-fixed w-[62.5%] rounded-full shadow-[0_0_8px_rgba(146,241,254,0.6)]"></div>
</div>
</div>
<!-- Decorative background element -->
<div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
</div>
</div>
<!-- Action Button -->
<div class="pt-4">
<button class="w-full py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-[20px]" data-icon="published_with_changes">published_with_changes</span>
                    Update Information
                </button>
<button class="w-full mt-4 py-3 text-primary font-bold text-sm hover:underline flex items-center justify-center gap-1">
                    Download Policy Details (PDF)
                </button>
</div>
</div>
<!-- Secondary Section -->
<section class="mt-12 mb-8">
<h2 class="text-primary font-extrabold text-xl mb-4 px-2">Family Beneficiaries</h2>
<div class="bg-surface-container-low rounded-[2rem] overflow-hidden">
<div class="divide-y divide-white/50">
<div class="p-4 flex items-center justify-between bg-surface-container-lowest">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
<span class="material-symbols-outlined text-slate-400" data-icon="person">person</span>
</div>
<div>
<p class="font-bold text-sm">Sarah Jenkins</p>
<p class="text-xs text-outline font-medium">Primary Spouse</p>
</div>
</div>
<span class="material-symbols-outlined text-outline-variant" data-icon="chevron_right">chevron_right</span>
</div>
<div class="p-4 flex items-center justify-between bg-surface">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
<span class="material-symbols-outlined text-slate-400" data-icon="person">person</span>
</div>
<div>
<p class="font-bold text-sm">Leo Jenkins</p>
<p class="text-xs text-outline font-medium">Dependent</p>
</div>
</div>
<span class="material-symbols-outlined text-outline-variant" data-icon="chevron_right">chevron_right</span>
</div>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 right-0 flex justify-around items-center px-4 pt-2 pb-6 w-full bg-white dark:bg-slate-900 z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.04)] border-t border-slate-100 dark:border-slate-800">
<a class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 tap-highlight-transparent active:scale-90 transition-all duration-200" href="#">
<span class="material-symbols-outlined mb-1" data-icon="dashboard">dashboard</span>
<span class="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider">Dashboard</span>
</a>
<a class="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-2xl px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 tap-highlight-transparent active:scale-90 transition-all duration-200" href="#">
<span class="material-symbols-outlined mb-1" data-icon="verified_user" style="font-variation-settings: 'FILL' 1;">verified_user</span>
<span class="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider">Policies</span>
</a>
<a class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 tap-highlight-transparent active:scale-90 transition-all duration-200" href="#">
<span class="material-symbols-outlined mb-1" data-icon="group">group</span>
<span class="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider">Beneficiaries</span>
</a>
<a class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 tap-highlight-transparent active:scale-90 transition-all duration-200" href="#">
<span class="material-symbols-outlined mb-1" data-icon="help_outline">help_outline</span>
<span class="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider">Support</span>
</a>
</nav>
</body>` }} />
  );
};

export default PolicyManagement;
