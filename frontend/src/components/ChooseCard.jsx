import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';

const ChooseCard = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios.get('/api/credit-cards/')
      .then(response => {
        setCards(response.data);
      })
      .catch(error => {
        console.error('Error fetching credit cards:', error);
      });
  }, []);

  return (
    <section className='space-y-8'>
      <div className='flex items-baseline justify-between'>
        <h3 className='text-4xl font-headline font-bold text-primary tracking-tight'>Choose Your Card</h3>
        <p className='text-on-surface-variant font-body'>Tailored for your architectural ambitions.</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {cards.map(card => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
};

export default ChooseCard;
