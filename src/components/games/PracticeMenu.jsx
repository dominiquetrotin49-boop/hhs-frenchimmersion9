import React from 'react';
import CrosswordSection from '../sections/CrosswordSection';
import HeroCrosswordSection from '../sections/HeroCrosswordSection';

export default function PracticeMenu({ unitId }) {
  if (unitId === 'unite-reprise' || unitId === 'reprise') {
    return <CrosswordSection />;
  }
  return <HeroCrosswordSection />;
}

