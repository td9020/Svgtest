import React from 'react';
import useAnimationStore from '../store/animationStore';

const btnStyle = (active) => ({
  padding: '6px 12px',
  margin: '3px',
  border: active ? '2px solid #FF0000' : '1px solid #555',
  borderRadius: '4px',
  background: active ? '#3a0000' : '#1a1a1a',
  color: active ? '#FF4444' : '#ccc',
  cursor: 'pointer',
  fontSize: '11px',
  fontFamily: 'monospace',
  fontWeight: active ? 'bold' : 'normal',
  transition: 'all 0.2s',
});

const sliderRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  margin: '4px 0',
};

const labelStyle = {
  color: '#999',
  fontSize: '10px',
  fontFamily: 'monospace',
  minWidth: '80px',
};

const presetBtn = (active) => ({
  ...btnStyle(active),
  background: active ? '#550000' : '#222',
  border: active ? '2px solid #FF0000' : '1px solid #444',
  fontWeight: 'bold',
  letterSpacing: '1px',
});

export default function AnimationControls() {
  const store = useAnimationStore();

  const toggles = [
    ['wheelSpin', 'Wheel Spin'],
    ['steeringSweep', 'Steering Sweep'],
    ['doorsOpen', 'Doors Open'],
    ['hoodOpen', 'Frunk Open'],
    ['headlightsOn', 'Headlights'],
    ['turnSignals', 'Turn Signals'],
    ['brakeLights', 'Brake Lights'],
    ['explodedView', 'Exploded View'],
    ['engineReveal', 'Engine Reveal'],
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'rgba(10, 10, 10, 0.92)',
        padding: '14px',
        borderRadius: '8px',
        border: '1px solid #333',
        maxHeight: '95vh',
        overflowY: 'auto',
        width: '240px',
        zIndex: 100,
      }}
    >
      <div
        style={{
          color: '#FF0000',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          fontSize: '11px',
          letterSpacing: '2px',
          marginBottom: '10px',
          textAlign: 'center',
          borderBottom: '1px solid #333',
          paddingBottom: '8px',
        }}
      >
        911 GT3 CONTROLS
      </div>

      {/* Presets */}
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        <div style={{ ...labelStyle, textAlign: 'center', marginBottom: '4px' }}>PRESETS</div>
        {['track', 'street', 'showroom'].map((p) => (
          <button
            key={p}
            style={presetBtn(false)}
            onClick={() => store.applyPreset(p)}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Toggle buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {toggles.map(([key, label]) => (
          <button
            key={key}
            style={btnStyle(store[key])}
            onClick={() => store.toggle(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div style={{ marginTop: '12px', borderTop: '1px solid #333', paddingTop: '8px' }}>
        <div style={sliderRow}>
          <span style={labelStyle}>Wheel Speed</span>
          <input
            type="range"
            min="0"
            max="25"
            step="0.5"
            value={store.wheelSpeed}
            onChange={(e) => store.setValue('wheelSpeed', +e.target.value)}
            style={{ flex: 1, accentColor: '#FF0000' }}
          />
          <span style={{ ...labelStyle, minWidth: '30px', textAlign: 'right' }}>
            {store.wheelSpeed.toFixed(1)}
          </span>
        </div>

        <div style={sliderRow}>
          <span style={labelStyle}>Engine RPM</span>
          <input
            type="range"
            min="800"
            max="9000"
            step="100"
            value={store.engineRPM}
            onChange={(e) => store.setValue('engineRPM', +e.target.value)}
            style={{ flex: 1, accentColor: '#FF0000' }}
          />
          <span style={{ ...labelStyle, minWidth: '40px', textAlign: 'right' }}>
            {store.engineRPM}
          </span>
        </div>

        <div style={sliderRow}>
          <span style={labelStyle}>Wing Angle</span>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            value={store.wingAngle}
            onChange={(e) => store.setValue('wingAngle', +e.target.value)}
            style={{ flex: 1, accentColor: '#FF0000' }}
          />
          <span style={{ ...labelStyle, minWidth: '30px', textAlign: 'right' }}>
            {(store.wingAngle * (180 / Math.PI)).toFixed(0)}°
          </span>
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          marginTop: '10px',
          borderTop: '1px solid #333',
          paddingTop: '8px',
          color: '#666',
          fontSize: '9px',
          fontFamily: 'monospace',
          textAlign: 'center',
        }}
      >
        4.0L Flat-6 | 502 HP | 9000 RPM
        <br />
        RWD | PDK | PCCB
      </div>
    </div>
  );
}
