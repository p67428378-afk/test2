import React from 'react';
import Button from '../UI/Button';

const MovieHeader = ({ movie }) => {
  return (
    <div className='relative h-[500px] rounded-3xl overflow-hidden group'>
      <div className='absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10'></div>
      <div className='absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent z-10'></div>
      <img 
        alt={`${movie.title} background`} 
        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000' 
        src={movie.poster_url || 'https://via.placeholder.com/1280x720'} 
      />
      <div className='absolute bottom-10 left-10 z-20 max-w-2xl'>
        <h3 className='font-display text-5xl mb-4 leading-tight'>{movie.title}</h3>
        <p className='font-body-lg text-body-lg text-on-surface-variant mb-6 line-clamp-2'>{movie.description}</p>
        <div className='flex items-center gap-4'>
          <Button className='bg-primary text-on-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20'>
            <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            Play Movie
          </Button>
          <Button className='bg-surface-variant/30 backdrop-blur-md border border-outline-variant/30 text-on-surface px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-surface-variant transition-all'>
            <span className='material-symbols-outlined'>add</span>
            Add to List
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieHeader;
