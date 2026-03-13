import React, { useState } from 'react';
import useAnimationStore from '../store/animationStore';

const VW_BLUE = '#001E50';
const VW_LIGHT = '#00437a';

const PART_SPECS = {
  body: 'Sedan, 4450mm length, MQB-A0-IN',
  frontWheel: '195/55-R16, Ventilated disc',
  rearWheel: '195/55-R16, Drum/disc',
  engine: '1.0L TSI turbo, 115 HP @ 5000 RPM',
  doors: '4 doors + trunk',
  hood: 'Front engine bay',
  trunk: '521L boot space',
  headlights: 'LED projector headlamps',
  suspension: 'MacPherson front, Torsion beam rear',
  exhaust: 'Single tip, BS-VI compliant',
};

const buttonStyle = (active) => ({
  padding: '7px 12px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: '600',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  transition: 'all 0.2s',
  backgroundColor: active ? VW_BLUE : '#ffffff18',
  color: active ? '#ffffff' : '#bbbbbb',
  outline: active ? '2px solid #4488cc' : '1px solid #ffffff25',
  minWidth: '60px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const presetStyle = (active) => ({
  ...buttonStyle(active),
  backgroundColor: active ? '#d4a017' : '#ffffff12',
  outline: active ? '2px solid #d4a017' : '1px solid #ffffff25',
  color: active ? '#000000' : '#bbbbbb',
  fontSize: '10px',
});

const sectionTitle = {
  color: '#8899bb',
  fontSize: '9px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  marginBottom: '5px',
  marginTop: '10px',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};

const tabStyle = (active) => ({
  flex: 1,
  padding: '8px 0',
  border: 'none',
  cursor: 'pointer',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  background: active ? VW_BLUE : 'transparent',
  color: active ? '#ffffff' : '#6688bb',
  borderBottom: active ? '2px solid #4488cc' : '2px solid transparent',
  transition: 'all 0.2s',
  borderRadius: active ? '6px 6px 0 0' : '0',
});

export default function AnimationControls() {
  const store = useAnimationStore();
  const [activeTab, setActiveTab] = useState('ANIM');

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(145deg, #0a1628ee, #0d1f3aee)',
      borderRadius: '14px',
      padding: '16px',
      width: '250px',
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
      <div style={{ textAlign: 'center', marginBottom: '12px', borderBottom: '1px solid #ffffff20', paddingBottom: '8px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#6688bb', fontWeight: '700' }}>VOLKSWAGEN</div>
        <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '4px', color: '#ffffff' }}>VIRTUS</div>
        <div style={{ fontSize: '9px', color: '#556688', marginTop: '2px' }}>3D INTERACTIVE MODEL</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
        <button style={tabStyle(activeTab === 'ANIM')} onClick={() => setActiveTab('ANIM')}>ANIM</button>
        <button style={tabStyle(activeTab === 'VISUAL')} onClick={() => setActiveTab('VISUAL')}>VISUAL</button>
      </div>

      {/* ANIM Tab */}
      {activeTab === 'ANIM' && (
        <div>
          {/* Presets */}
          <div style={sectionTitle}>Presets</div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <button style={presetStyle(false)} onClick={() => store.applyPreset('driving')}>Driving</button>
            <button style={presetStyle(false)} onClick={() => store.applyPreset('parked')}>Parked</button>
            <button style={presetStyle(false)} onClick={() => store.applyPreset('show')}>Show</button>
          </div>

          {/* Wheels */}
          <div style={sectionTitle}>Wheels</div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <button style={buttonStyle(store.wheelSpin)} onClick={store.toggleWheelSpin}>Spin</button>
            <button style={buttonStyle(store.steeringSweep)} onClick={store.toggleSteeringSweep}>Steer</button>
          </div>

          {/* Speed slider */}
          <div style={{ marginTop: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#8899bb' }}>
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
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <button style={buttonStyle(store.doorsOpen)} onClick={store.toggleDoorsOpen}>Doors</button>
            <button style={buttonStyle(store.hoodOpen)} onClick={store.toggleHoodOpen}>Hood</button>
            <button style={buttonStyle(store.trunkOpen)} onClick={store.toggleTrunkOpen}>Trunk</button>
          </div>

          {/* Lights */}
          <div style={sectionTitle}>Lights</div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <button style={buttonStyle(store.headlightsOn)} onClick={store.toggleHeadlights}>Headlights</button>
            <button style={buttonStyle(store.brakeLights)} onClick={store.toggleBrakeLights}>Brakes</button>
            <button style={buttonStyle(store.turnSignals)} onClick={store.toggleTurnSignals}>Signals</button>
          </div>

          {/* View */}
          <div style={sectionTitle}>View</div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <button style={buttonStyle(store.explodedView)} onClick={store.toggleExplodedView}>Exploded</button>
          </div>
        </div>
      )}

      {/* VISUAL Tab */}
      {activeTab === 'VISUAL' && (
        <div>
          {/* Wheel Type */}
          <div style={sectionTitle}>Wheel Type</div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              style={buttonStyle(!store.spokedWheels)}
              onClick={() => { if (store.spokedWheels) store.toggleSpokedWheels(); }}
            >
              Alloy
            </button>
            <button
              style={buttonStyle(store.spokedWheels)}
              onClick={() => { if (!store.spokedWheels) store.toggleSpokedWheels(); }}
            >
              Steel+Hubcap
            </button>
          </div>

          {/* Scene Options */}
          <div style={sectionTitle}>Scene</div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <button style={buttonStyle(store.showCables)} onClick={store.toggleShowCables}>Cables</button>
            <button style={buttonStyle(store.nightMode)} onClick={store.toggleNightMode}>Night</button>
            <button style={buttonStyle(store.povCamera)} onClick={store.togglePovCamera}>POV</button>
          </div>

          {/* Paint Color */}
          <div style={sectionTitle}>Paint Color</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { label: 'VW Blue', color: '#001E50' },
              { label: 'White', color: '#F5F5F0' },
              { label: 'Silver', color: '#C0C0C0' },
              { label: 'Red', color: '#8B0000' },
              { label: 'Black', color: '#1a1a1a' },
              { label: 'Grey', color: '#555555' },
            ].map(({ label, color }) => (
              <button
                key={color}
                title={label}
                onClick={() => store.setPaintColor(color)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: store.paintColor === color ? '3px solid #4488cc' : '2px solid #ffffff30',
                  background: color,
                  cursor: 'pointer',
                  padding: 0,
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
              />
            ))}
            <div style={{ position: 'relative' }}>
              <input
                type="color"
                value={store.paintColor}
                onChange={(e) => store.setPaintColor(e.target.value)}
                style={{
                  width: '28px',
                  height: '28px',
                  border: '2px solid #ffffff30',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  padding: 0,
                  background: 'transparent',
                }}
                title="Custom color"
              />
            </div>
          </div>

          {/* Part Specs Info */}
          <div style={sectionTitle}>Part Info</div>
          {store.selectedPart ? (
            <div style={{
              background: '#ffffff08',
              borderRadius: '8px',
              padding: '10px',
              border: '1px solid #ffffff15',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: VW_LIGHT, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {store.selectedPart}
              </div>
              <div style={{ fontSize: '10px', color: '#8899bb', lineHeight: '1.5' }}>
                {PART_SPECS[store.selectedPart] || 'Click a part for details'}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '10px', color: '#556677', fontStyle: 'italic' }}>
              Click a part on the car to see specs
            </div>
          )}

          {/* All Specs */}
          <div style={sectionTitle}>Specifications</div>
          <div style={{ fontSize: '9px', color: '#667799', lineHeight: '1.6' }}>
            {Object.entries(PART_SPECS).map(([key, val]) => (
              <div key={key} style={{ cursor: 'pointer', padding: '1px 0' }} onClick={() => store.selectPart(key)}>
                <span style={{ color: '#8899bb', fontWeight: '600', textTransform: 'capitalize' }}>{key}:</span>{' '}
                {val}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
