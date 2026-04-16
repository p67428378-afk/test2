import React from 'react';

const Beneficiaries = () => {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<body class="bg-background text-on-surface font-body min-h-screen pb-32">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex justify-between items-center px-6 py-4 w-full h-16">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high">
<img alt="User Profile Avatar" class="w-full h-full object-cover" data-alt="Professional headshot of a middle-aged man with a kind smile, clean corporate lighting, soft grey background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa22W-ctVNRbjtIIT92QDk3xr8W0Cdl9DqGfMlZO0ihbXs2O4ca5wWIazueC2GN6DnHQAqj2l6n_ZiO3JBiHRERQ67sR7ZxPNZcNNkhlFdndSGYY1h4eGsh5-vnX-CnTxn0S4Df94udyjLrolRQDzkQl3bPsOrCBR0c6yKoI-gZHHz1mP7JKUBVq8cXyJQM8dajCEuiqCatZdl48ONZ3mQV0W18kTznglh7Ge2C_TyISyNFosPI2EqHfUwgNLuEiAzHDQYuOc0Enku"/>
</div>
<h1 class="font-['Manrope'] font-bold text-lg tracking-tight text-blue-800 dark:text-blue-400">The Clarified Guardian</h1>
</div>
<button class="text-blue-800 dark:text-blue-400 hover:opacity-80 transition-opacity active:scale-95 transition-transform">
<span class="material-symbols-outlined">notifications</span>
</button>
<div class="absolute bottom-0 left-0 bg-slate-100 dark:bg-slate-800 h-px w-full"></div>
</header>
<main class="pt-24 px-6 max-w-md mx-auto">
<!-- Hero Section: Coverage Overview -->
<section class="mb-10">
<div class="bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl text-on-primary shadow-sm relative overflow-hidden">
<div class="relative z-10">
<p class="font-label text-xs uppercase tracking-widest opacity-80 mb-1">Total Allocated Share</p>
<h2 class="font-headline font-extrabold text-4xl mb-4 tracking-tight">100%</h2>
<div class="h-2 w-full bg-white/20 rounded-full overflow-hidden">
<div class="h-full bg-secondary-fixed w-full shadow-[0_0_8px_rgba(146,241,254,0.6)]"></div>
</div>
</div>
<!-- Decorative element -->
<div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
</div>
</section>
<!-- Section Title -->
<div class="flex justify-between items-end mb-6">
<div>
<h3 class="font-headline text-xl font-bold text-primary">Beneficiaries</h3>
<p class="text-outline text-sm">Managing 3 active members</p>
</div>
<button class="text-primary font-headline text-sm font-bold flex items-center gap-1 group hover:underline decoration-2">
                Manage Shares
                <span class="material-symbols-outlined text-sm">settings</span>
</button>
</div>
<!-- Beneficiaries List (Editorial Asymmetric Layout) -->
<div class="space-y-4">
<!-- Sarah Jenkins -->
<div class="bg-surface-container-lowest p-5 rounded-xl flex items-center gap-4 group transition-all duration-200 hover:bg-surface-bright">
<div class="relative">
<div class="w-16 h-16 rounded-full overflow-hidden ring-4 ring-surface-container-low">
<img alt="Sarah Jenkins" class="w-full h-full object-cover" data-alt="Portrait of Sarah Jenkins, a woman with warm features and professional attire, natural daylight, soft focus background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqZqsg8iqjmoEEF8IxAxohpp2ZDydcWufmmh2LlDtPV99mexDyyLiqfEu2Vr7xJSjDyYfZBnAYzWudu4NTVqRRR446hok8kDgM0puYKBN7KO_w5EfU9wT0u802X-Fah-b5oFERPmsz4PrwGg_3E4FY49Y4xkUtLI8zApHp_OCe1qHj_J5iv9l-VWdTgIaduQ7ARjydKrg5UhE6PwBU-U2zFa3WR987lmmo8vnuSTBAr61rkNmvnVHvh-_RFjLvRc9Wv9m2qy9pB8oq"/>
</div>
<div class="absolute -bottom-1 -right-1 bg-tertiary-container text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Active</div>
</div>
<div class="flex-1">
<h4 class="font-headline font-bold text-on-surface">Sarah Jenkins</h4>
<p class="text-outline text-sm">Spouse</p>
</div>
<div class="text-right">
<span class="block font-headline font-extrabold text-primary text-xl">50%</span>
<span class="text-[10px] text-outline font-bold uppercase tracking-widest">Share</span>
</div>
</div>
<!-- Leo Jenkins -->
<div class="bg-surface-container-low/40 p-5 rounded-xl flex items-center gap-4 group transition-all duration-200">
<div class="w-16 h-16 rounded-full overflow-hidden ring-4 ring-surface-container-lowest">
<img alt="Leo Jenkins" class="w-full h-full object-cover" data-alt="Close up of a young boy Leo smiling, playful energy, outdoor park lighting with golden sun flares" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbt7kqGcs5WFmi96fq01KUDqswYR1KfxJf9fMeB2wa6kws_6kpZkffPrG9mbP3qtzmqqt8HhOcmGs0rySuWDEYogeKS-71zsWl2pcJfgRNKkbBQPpV2Ry32EaefJX77wY_W6tsC-0LPba3FS1N5VEgyWgIBL4ctQ6d2gdmYdAuiZ84zu08WTI-T_cPLtHBubNX642WaNJdRk3IN8SZw72Cbkcya-OwMbC28eXbndXZJK9AbT-TLHKZ6gCBVrhfTOzntFbSY9tP4CBG"/>
</div>
<div class="flex-1">
<h4 class="font-headline font-bold text-on-surface">Leo Jenkins</h4>
<p class="text-outline text-sm">Child</p>
</div>
<div class="text-right">
<span class="block font-headline font-extrabold text-on-surface-variant text-xl opacity-60">25%</span>
<span class="text-[10px] text-outline font-bold uppercase tracking-widest">Share</span>
</div>
</div>
<!-- Maya Jenkins -->
<div class="bg-surface-container-lowest p-5 rounded-xl flex items-center gap-4 group transition-all duration-200 hover:bg-surface-bright">
<div class="w-16 h-16 rounded-full overflow-hidden ring-4 ring-surface-container-low">
<img alt="Maya Jenkins" class="w-full h-full object-cover" data-alt="Young girl Maya with curly hair and bright eyes, soft indoor lighting, serene and clear composition" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcuvF5p59m-A15sBQfRPzes4c9EKj2O8jqP6kuU-wBegmFadwG0EyOuhcXnb6yszXQv5jnA2Q4-1g1D64g8MKV-PjaCSYZDj8c1s0y_v8jzuyaaFIE6VjpQNyP5yZe2lL_V6E7UReRZLR-4hTQSApQI8gwnbafilG7SEmiaKQ8dzHX8lldVdzkig1tJIZhdFGR0hL6Fv_7sQxFyN7M-TptWViQX5Z-Z5J65NKx91guwCvUjGiXIjnCWiQTXDZedadPWNcd2MsJJxul"/>
</div>
<div class="flex-1">
<h4 class="font-headline font-bold text-on-surface">Maya Jenkins</h4>
<p class="text-outline text-sm">Child</p>
</div>
<div class="text-right">
<span class="block font-headline font-extrabold text-on-surface-variant text-xl opacity-60">25%</span>
<span class="text-[10px] text-outline font-bold uppercase tracking-widest">Share</span>
</div>
</div>
</div>
<!-- Add Beneficiary Action -->
<div class="mt-8">
<button class="w-full bg-primary text-on-primary py-4 rounded-xl font-headline font-bold flex justify-center items-center gap-2 shadow-lg shadow-primary/10 active:scale-[0.98] transition-all">
<span class="material-symbols-outlined">person_add</span>
                Add Beneficiary
            </button>
<p class="text-center text-outline text-[11px] mt-4 px-8 leading-relaxed">
                Adding a beneficiary requires a review process and may take up to 48 hours to reflect in your policy dashboard.
            </p>
</div>
<!-- Support Shortcut -->
<div class="mt-12 p-6 rounded-2xl bg-surface-container-high/50 flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="bg-white p-2 rounded-lg shadow-sm">
<span class="material-symbols-outlined text-secondary">help_outline</span>
</div>
<div>
<p class="font-headline font-bold text-sm">Need assistance?</p>
<p class="text-outline text-xs">Chat with our advisors</p>
</div>
</div>
<span class="material-symbols-outlined text-outline">chevron_right</span>
</div>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 right-0 flex justify-around items-center px-4 pt-2 pb-6 w-full bg-white dark:bg-slate-900 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.04)] z-50">
<a class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider mt-1">Dashboard</span>
</a>
<a class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200" href="#">
<span class="material-symbols-outlined">verified_user</span>
<span class="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider mt-1">Policies</span>
</a>
<a class="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-2xl px-5 py-2 active:scale-90 transition-all duration-200" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">group</span>
<span class="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider mt-1">Beneficiaries</span>
</a>
<a class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200" href="#">
<span class="material-symbols-outlined">help_outline</span>
<span class="font-['Inter'] text-[10px] font-semibold uppercase tracking-wider mt-1">Support</span>
</a>
</nav>
</body>` }} />
  );
};

export default Beneficiaries;
