'use client'
import React from 'react';
import { BODY_PARTS } from '../../data/constants';

const BodyPartGrid = ({ selectedBodyPart, setSelectedBodyPart }) => (
  <div className="grid grid-cols-2 gap-3">
    {BODY_PARTS.map(bodyPart => (
      <button
        key={bodyPart.name}
        onClick={() => setSelectedBodyPart(bodyPart.name)}
        className={`p-4 rounded-lg text-white font-medium transition-transform ${
          bodyPart.color
        } ${selectedBodyPart === bodyPart.name ? 'scale-95' : 'hover:scale-105'}`}
      >
        <div className="text-2xl mb-2">{bodyPart.icon}</div>
        <div className="capitalize">{bodyPart.name}</div>
      </button>
    ))}
  </div>
);

export default BodyPartGrid;