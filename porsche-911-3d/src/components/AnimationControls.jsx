import React, { useState } from 'react';
import useAnimationStore from '../store/animationStore';

const ACCENT = '#FF0000';

const btnStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '6px',
  background: active ? '#FF000022' : '#ffffff0a',
  color: active ? '#FF6666' : '#aaa',
  cursor: 'pointer',
  fontSize: '13px',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'left',
  transition: 'all 0.2s',
  outline: active ? `1px solid ${ACCENT}44` : '1px solid transparent',
});

const sectionHeader = {
  color: '#888',
  fontSize: '11px',
  padding: '0 12px 4px',
  fontFamily: 'Arial',
  marginTop: '8px',
  borderTop: '1px solid #333',
  paddingTop: '8px',
};

const sliderContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 12px 8px',
};

const sliderStyle = {
  flex: 1,
  accentColor: ACCENT,
  height: '4px',
};

const labelStyle = {
  color: '#888',
  fontSize: '11px',
  fontFamily: 'monospace',
  minWidth: '32px',
  textAlign: 'right',
};

// Part specs for Porsche 911 GT3
const PART_SPECS = {
  body: { name: 'Body', specs: '992 GT3, 4573mm length, rear-engine RWD' },
  frontWheel: { name: 'Front Wheel', specs: '255/35-20, PCCB 408mm disc' },
  rearWheel: { name: 'Rear Wheel', specs: '315/30-21, PCCB 380mm disc' },
  engine: { name: 'Engine', specs: '4.0L flat-6, 502 HP @ 8400 RPM' },
  doors: { name: 'Doors', specs: '2 doors, front trunk (frunk)' },
  rearWing: { name: 'Rear Wing', specs: 'Carbon fiber, adjustable angle' },
  exhaust: { name: 'Exhaust', specs: 'Center-exit titanium, quad tips' },
  suspension: { name: 'Suspension', specs: 'Double wishbone front, multi-link rear' },
  transmission: { name: 'Transmission', specs: '7-speed PDK or 6-speed manual' },
  brakes: { name: 'Brakes', specs: 'PCCB carbon ceramic, yellow calipers' },
};

// Porsche-appropriate paint colors
const PAINT_COLORS = [
  { color: '#c0c0c0', name: 'GT Silver' },
  { color: '#CC0000', name: 'Guards Red' },
  { color: '#FFD200', name: 'Racing Yellow' },
  { color: '#0066AA', name: 'Shark Blue' },
  { color: '#111111', name: 'Black' },
  { color: '#EEEEEE', name: 'White' },
  { color: '#2C3E50', name: 'Gentian Blue' },
  { color: '#006400', name: 'Python Green' },
  { color: '#FF6600', name: 'Gulf Orange' },
  { color: '#4A0080', name: 'Ultraviolet' },
];

export default function AnimationControls() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('anim');

  const store = useAnimationStore();
  const {
    wheelSpin, steeringSweep, doorsOpen, hoodOpen,
    headlightsOn, turnSignals, brakeLights,
    explodedView, engineReveal,
    spokedWheels, nightMode, povCamera, showCables,
    paintColor, selectedPart,
    wheelSpeed, engineRPM, wingAngle,
    toggle, setValue, setPaintColor, applyPreset,
  } = store;

  const animControls = [
    { key: 'wheelSpin', label: 'Wheel Spin', active: wheelSpin },
    { key: 'steeringSweep', label: 'Steering Sweep', active: steeringSweep },
    { key: 'doorsOpen', label: 'Doors Open', active: doorsOpen },
    { key: 'hoodOpen', label: 'Frunk Open', active: hoodOpen },
    { key: 'headlightsOn', label: 'Headlights', active: headlightsOn },
    { key: 'turnSignals', label: 'Turn Signals', active: turnSignals },
    { key: 'brakeLights', label: 'Brake Lights', active: brakeLights },
    { key: 'explodedView', label: 'Exploded View', active: explodedView },
    { key: 'engineReveal', label: 'Engine Reveal', active: engineReveal },
  ];

  const visualControls = [
    { key: 'spokedWheels', label: spokedWheels ? 'Fuchs Wheels' : 'Forged Alloy', active: spokedWheels, toggleLabel: true },
    { key: 'showCables', label: 'Under-hood Wiring', active: showCables },
    { key: 'nightMode', label: nightMode ? 'Night Mode' : 'Day Mode', active: nightMode, toggleLabel: true },
    { key: 'povCamera', label: 'Driver POV', active: povCamera },
  ];

  const tabs = [
    { key: 'anim', label: 'ANIM' },
    { key: 'visual', label: 'VISUAL' },
  ];

  const partInfo = selectedPart && PART_SPECS[selectedPart];

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 100,
        width: collapsed ? 'auto' : '240px',
        background: 'rgba(10, 10, 10, 0.92)',
        backdropFilter: 'blur(12px)',
        borderRadius: '10px',
        border: '1px solid #333',
        overflow: 'hidden',
        maxHeight: '95vh',
        overflowY: 'auto',
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '10px 14px',
          border: 'none',
          borderBottom: collapsed ? 'none' : '1px solid #333',
          background: 'transparent',
          color: ACCENT,
          cursor: 'pointer',
          fontSize: '11px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          letterSpacing: '2px',
        }}
      >
        <span>911 GT3 CONTROLS</span>
        <span style={{ color: '#666', fontSize: '11px' }}>{collapsed ? '\u25B6' : '\u25BC'}</span>
      </button>

      {!collapsed && (
        <div style={{ padding: '6px 6px 10px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '6px', padding: '0 6px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                style={{
                  flex: 1,
                  padding: '5px',
                  border: 'none',
                  borderRadius: '4px',
                  background: activeSection === tab.key ? '#FF000044' : '#ffffff08',
                  color: activeSection === tab.key ? '#FF6666' : '#777',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontFamily: 'Arial',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ANIMATION TAB */}
          {activeSection === 'anim' && (
            <>
              {animControls.map(({ key, label, active }) => (
                <div key={key} style={{ marginBottom: '3px' }}>
                  <button onClick={() => toggle(key)} style={btnStyle(active)}>
                    <span>{label}</span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        background: active ? '#FF000033' : '#ffffff08',
                        color: active ? '#FF8888' : '#666',
                      }}
                    >
                      {active ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              ))}

              {/* Speed sliders */}
              <div style={sectionHeader}>SPEED CONTROLS</div>
              <div style={sliderContainer}>
                <span style={{ ...labelStyle, minWidth: '70px' }}>Wheel Speed</span>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={wheelSpeed}
                  onChange={(e) => setValue('wheelSpeed', +e.target.value)}
                  style={sliderStyle}
                />
                <span style={labelStyle}>{wheelSpeed.toFixed(1)}</span>
              </div>
              <div style={sliderContainer}>
                <span style={{ ...labelStyle, minWidth: '70px' }}>Engine RPM</span>
                <input
                  type="range"
                  min="800"
                  max="9000"
                  step="100"
                  value={engineRPM}
                  onChange={(e) => setValue('engineRPM', +e.target.value)}
                  style={sliderStyle}
                />
                <span style={labelStyle}>{engineRPM}</span>
              </div>
              <div style={sliderContainer}>
                <span style={{ ...labelStyle, minWidth: '70px' }}>Wing Angle</span>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={wingAngle}
                  onChange={(e) => setValue('wingAngle', +e.target.value)}
                  style={sliderStyle}
                />
                <span style={labelStyle}>{(wingAngle * (180 / Math.PI)).toFixed(0)}&deg;</span>
              </div>

              {/* Presets */}
              <div style={{ ...sectionHeader, display: 'flex', gap: '4px', paddingTop: '8px' }}>
                {[
                  { label: 'Track', preset: 'track' },
                  { label: 'Street', preset: 'street' },
                  { label: 'Showroom', preset: 'showroom' },
                ].map(({ label, preset }) => (
                  <button
                    key={preset}
                    onClick={() => applyPreset(preset)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      border: `1px solid ${ACCENT}55`,
                      borderRadius: '5px',
                      background: '#FF000011',
                      color: '#ccc',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      letterSpacing: '1px',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* VISUAL TAB */}
          {activeSection === 'visual' && (
            <>
              {visualControls.map(({ key, label, active, toggleLabel }) => (
                <div key={key} style={{ marginBottom: '3px' }}>
                  <button onClick={() => toggle(key)} style={btnStyle(active)}>
                    <span>{label}</span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        background: active ? '#FF000033' : '#ffffff08',
                        color: active ? '#FF8888' : '#666',
                      }}
                    >
                      {toggleLabel ? (active ? 'A' : 'B') : active ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              ))}

              {/* Paint color picker */}
              <div style={sectionHeader}>PAINT COLOR</div>
              <div style={{ padding: '4px 12px 8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {PAINT_COLORS.map(({ color, name }) => (
                  <button
                    key={color}
                    onClick={() => setPaintColor(color)}
                    title={name}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: paintColor === color ? '2px solid #fff' : '2px solid #444',
                      background: color,
                      cursor: 'pointer',
                      transition: 'transform 0.1s',
                      transform: paintColor === color ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                ))}
                <input
                  type="color"
                  value={paintColor}
                  onChange={(e) => setPaintColor(e.target.value)}
                  style={{
                    width: '24px',
                    height: '24px',
                    border: '2px solid #444',
                    borderRadius: '4px',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                  title="Custom color"
                />
              </div>
            </>
          )}

          {/* Selected part info */}
          {partInfo && (
            <div
              style={{
                margin: '6px 6px 0',
                padding: '8px 10px',
                background: '#FF000015',
                border: `1px solid ${ACCENT}44`,
                borderRadius: '6px',
              }}
            >
              <div
                style={{
                  color: '#FF6666',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fontFamily: 'Arial',
                }}
              >
                {partInfo.name}
              </div>
              <div
                style={{
                  color: '#888',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  marginTop: '3px',
                }}
              >
                {partInfo.specs}
              </div>
            </div>
          )}

          {/* Info footer */}
          <div
            style={{
              marginTop: '10px',
              borderTop: '1px solid #333',
              paddingTop: '8px',
              color: '#555',
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
      )}
    </div>
  );
}
