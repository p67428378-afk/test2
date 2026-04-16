
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [quantity, setQuantity] = useState(1);
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleAddToCart = () => {
    axios.post('/api/cart/add', {
      productId: '1',
      quantity: quantity,
    })
    .then(response => {
      setCartItemCount(response.data.cartItemCount);
    })
    .catch(error => {
      console.error('Error adding item to cart', error);
    });
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      <header className="fixed top-0 w-full z-50 bg-[#f8f9ff]/70 backdrop-blur-xl flex justify-between items-center px-6 py-4 w-full">
        <div className="flex items-center gap-4">
          <button className="text-on-surface hover:opacity-80 transition-opacity active:scale-95 transition-transform duration-200">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        <div className="text-xl font-bold tracking-[0.2em] text-[#0d1c2e] font-['Manrope']">ATELIER</div>
        <div className="relative">
          <button className="text-on-surface hover:opacity-80 transition-opacity active:scale-95 transition-transform duration-200">
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">{cartItemCount}</span>
        </div>
      </header>
      <main className="pb-32 pt-16">
        <section className="relative h-[530px] w-full overflow-hidden bg-surface-container-low">
          <img alt="Sculptural Minimalist Lamp" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBftpJ66bX69BGO1tRZmwnxSOC4ri0cGT9wXU5fIGexu3V-NLfKuSm7MQffN6EPSk5a-__9h2UrZrQCcDkrQVzBxvyQ4immvbn6ImSdFHWKhiNJI5fR8_1fZMzH3z-XTILn9o9VGE7bLvc5au6ZheAPFRZCybhtK8y-k-f-eZo1bnXDT1IrzWam42AwO2ANrcY9yYZyZU9pm33TXKTzLqGjNykrlY_milpY1SVQwmRbiU3L6-bwboEkKaPKieUsVjJ7P1AFl7NbnRk"/>
          <div className="absolute bottom-6 right-6 flex gap-2">
            <div className="h-1.5 w-8 rounded-full bg-on-surface/20"></div>
            <div className="h-1.5 w-4 rounded-full bg-on-surface/10"></div>
            <div className="h-1.5 w-4 rounded-full bg-on-surface/10"></div>
          </div>
        </section>
        <div className="px-6 pt-10">
          <div className="flex flex-col gap-2">
            <p className="font-label text-[10px] tracking-[0.2em] text-outline uppercase">Handcrafted Lighting</p>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface leading-tight">
              Sculptural Minimalist Lamp
            </h1>
            <p className="font-headline text-2xl font-medium text-tertiary mt-2">
              $185.00
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <p className="text-on-surface-variant leading-relaxed font-body">
              A testament to architectural purity. This piece bridges the gap between functional object and fine art. Hand-finished in our local atelier, the matte ceramic body features a unique texture that catches soft ambient light.
            </p>
            <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-6 rounded-xl">
              <div className="flex flex-col gap-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-outline">Material</span>
                <span className="font-body text-sm font-medium">Stone &amp; Ceramic</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-outline">Height</span>
                <span className="font-body text-sm font-medium">14.5 Inches</span>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="font-label text-sm font-semibold text-on-surface">Quantity</span>
              <div className="flex items-center gap-6 bg-surface-container px-4 py-2 rounded-full">
                <button className="text-on-surface hover:text-primary transition-colors" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <span className="font-headline font-bold text-lg min-w-[1rem] text-center">{quantity}</span>
                <button className="text-on-surface hover:text-primary transition-colors" onClick={() => setQuantity(q => q + 1)}>
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>
            <button className="w-full bg-gradient-to-br from-primary to-primary-container py-5 rounded-full text-on-primary font-label text-sm font-bold uppercase tracking-[0.1em] shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-3" onClick={handleAddToCart}>
              <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: '\'FILL\' 1'}}>shopping_cart</span>
              Add to Cart
            </button>
          </div>
          <div className="mt-16 pb-12">
            <h3 className="font-headline text-lg font-bold mb-6">Related Curations</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <div className="aspect-[4/5] bg-surface-container rounded-xl overflow-hidden">
                  <img alt="Vase" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhhxw_DrB_cZFODsh1RqBGbHoP63kIqGFeciU6oTuF1kyAUdNqjFEQOZoVMrq1QGCAme2ucsSnuBH0VYvBiFZ6sXQAkQ3NxY3aZFZE3-pkGdU1fWzUfB6bptbyvLCCcYYh5M8kmPudmLfbnQVzZGbZjB-psnjrrOSLLGM37tmaydBj_dJtnsLEnXOORlnaGm7O5mM8MiOoyt_QTxunx-8-49Fre9n88v3QVGaZKn1v2sZQQYzp1eoBpJCwG7I5-X2hX9bssqrryJs"/>
                </div>
                <div>
                  <p className="font-headline text-sm font-bold">Charcoal Vase</p>
                  <p className="font-body text-xs text-outline">$95.00</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-8">
                <div className="aspect-[4/5] bg-surface-container rounded-xl overflow-hidden">
                  <img alt="Side Table" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrmMpVYh7a9T7p8VKXTwTBMem8sVsPgkYWmD28zvMb95EnopIc9y2es91q5STFgJp9CsMzq1nttKGpU_ys2wG4kweCLMUGO_xcz-fEIgTAgZ8MLFrFUR5JYMjAuQODbaPYpwwg0JvHJhL-pMcAsSE7jpNzvr4SXj1xs-Yis_VSnxIVKkiwJQQvtWdjfMaojhLe7DZYNBiSdES7qP_60pg0mYWiEj9n1N_cpr88BBo587tQgfEe_NgohKX855jbaSfUJD5kE7QqJM4"/>
                </div>
                <div>
                  <p className="font-headline text-sm font-bold">Oak Side Table</p>
                  <p className="font-body text-xs text-outline">$310.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#f8f9ff]/70 backdrop-blur-xl flex justify-around items-center px-4 pb-6 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl md:hidden">
        <a className="flex flex-col items-center justify-center text-[#0d1c2e]/60 p-3 hover:text-[#3525cd] transition-all" href="#">
          <span className="material-symbols-outlined">home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#0d1c2e]/60 p-3 hover:text-[#3525cd] transition-all" href="#">
          <span className="material-symbols-outlined">search</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#0d1c2e]/60 p-3 hover:text-[#3525cd] transition-all" href="#">
          <span className="material-symbols-outlined">favorite</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#0d1c2e]/60 p-3 hover:text-[#3525cd] transition-all" href="#">
          <span className="material-symbols-outlined">person</span>
        </a>
      </nav>
    </div>
  );
}

export default App;
