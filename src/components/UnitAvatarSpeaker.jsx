import React from 'react';
import { Sparkles } from 'lucide-react';
import './UnitAvatarSpeaker.css';

export default function UnitAvatarSpeaker({ avatar = 'jasmine', name = 'Jasmine', text = '', image = null }) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const rawImg =
    image ||
    (avatar === 'kader'
      ? `${baseUrl}avatars/kader.jpg`
      : avatar === 'maya'
      ? `${baseUrl}images/avatars/avatar_maya.jpg`
      : `${baseUrl}avatars/jasmine.jpg`);

  const imgSrc =
    rawImg.startsWith('/') && !rawImg.startsWith(baseUrl)
      ? `${baseUrl}${rawImg.slice(1)}`
      : rawImg;

  return (
    <div className="unit-avatar-speaker-card">
      <div className="unit-avatar-wrapper">
        <img src={imgSrc} alt={name || 'Avatar'} className="unit-avatar-img" />
      </div>

      <div className="unit-avatar-info">
        <div className="unit-avatar-name-row">
          <Sparkles size={16} className="sparkle-icon" />
          <span>Conseil d'immersion de {name}</span>
        </div>
        <p className="text-sm italic text-slate-700">« {text} »</p>
      </div>
    </div>
  );
}
