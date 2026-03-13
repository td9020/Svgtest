import React from 'react';
import useAnimationStore from '../store/animationStore';

const VW_BLUE = '#001E50';
const VW_LIGHT = '#00437a';

const buttonStyle = (active) => ({
  padding: '8px 14px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: '600',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  transition: 'all 0.2s',
  backgroundColor: active ? VW_BLUE : '#ffffff22',
  color: active ? '#ffffff' : '#cccccc',
  outline: active ? `2px solid #4488cc` : '1px solid #ffffff33',
  minWidth: '70px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const presetStyle = (active) => ({
  ...buttonStyle(active),
  backgroundColor: active ? '#d4a017' : '#ffffff15',
  outline: active ? '2px solid #d4a017' : '1px solid #ffffff33',
  color: active ? '#000000' : '#cccccc',
  fontSize: '11px',
});

const sectionTitle = {
  color: '#8899bb',
  fontSize: '10px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  marginBottom: '6px',
  marginTop: '12px',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};

export default function AnimationControls() {
  const store = useAnimationStore();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(145deg, #0a1628ee, #0d1f3aee)',
      borderRadius: '14px',
      padding: '18px',
      width: '240px',
      maxHeight: '90vh',
      overflowY: 'auto',
      color: '#ffffff',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      border: '1px solid #ffffff15',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '14px', borderBottom: '1px solid #ffffff20', paddingBottom: '10px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#6688bb', fontWeight: '700' }}>VOLKSWAGEN</div>
        <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '4px', color: '#ffffff' }}>VIRTUS</div>
        <div style={{ fontSize: '9px', color: '#556688', marginTop: '2px' }}>3D INTERACTIVE MODEL</div>
      </div>

      {/* Presets */}
      <div style={sectionTitle}>Presets</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button style={presetStyle(false)} onClick={() => store.applyPreset('driving')}>Driving</button>
        <button style={presetStyle(false)} onClick={() => store.applyPreset('parked')}>Parked</button>
        <button style={presetStyle(false)} onClick={() => store.applyPreset('show')}>Show</button>
      </div>

      {/* Wheels */}
      <div style={sectionTitle}>Wheels</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button style={buttonStyle(store.wheelSpin)} onClick={store.toggleWheelSpin}>Spin</button>
        <button style={buttonStyle(store.steeringSweep)} onClick={store.toggleSteeringSweep}>Steer</button>
      </div>

      {/* Speed slider */}
      <div style={{ marginTop: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#8899bb' }}>
          <span>Speed</span>
          <span>{store.wheelSpeed.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="20"
          step="0.5"
          value={store.wheelSpeed}
          onChange={(e) => store.setWheelSpeed(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: VW_BLUE }}
        />
      </div>

      {/* Body */}
      <div style={sectionTitle}>Body</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button style={buttonStyle(store.doorsOpen)} onClick={store.toggleDoorsOpen}>Doors</button>
        <button style={buttonStyle(store.hoodOpen)} onClick={store.toggleHoodOpen}>Hood</button>
        <button style={buttonStyle(store.trunkOpen)} onClick={store.toggleTrunkOpen}>Trunk</button>
      </div>

      {/* Lights */}
      <div style={sectionTitle}>Lights</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button style={buttonStyle(store.headlightsOn)} onClick={store.toggleHeadlights}>Headlights</button>
        <button style={buttonStyle(store.brakeLights)} onClick={store.toggleBrakeLights}>Brakes</button>
        <button style={buttonStyle(store.turnSignals)} onClick={store.toggleTurnSignals}>Signals</button>
      </div>

      {/* View */}
      <div style={sectionTitle}>View</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button style={buttonStyle(store.explodedView)} onClick={store.toggleExplodedView}>Exploded</button>
      </div>

      {/* Specs */}
      <div style={sectionTitle}>Specifications</div>
      <div style={{ fontSize: '10px', color: '#667799', lineHeight: '1.6' }}>
        <div>Length: 4,561mm</div>
        <div>Width: 1,752mm</div>
        <div>Height: 1,487mm</div>
        <div>Wheelbase: 2,651mm</div>
        <div>Engine: 1.0 TSI 3-cyl Turbo</div>
        <div>Tyres: 205/55 R16</div>
        <div>Boot: 521L</div>
      </div>
    </div>
  );
}
