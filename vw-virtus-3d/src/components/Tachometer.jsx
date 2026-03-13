import React from 'react';
import useAnimationStore from '../store/animationStore';

const VW_BLUE = '#001E50';
const VW_LIGHT = '#00437a';

export default function Tachometer() {
  const wheelSpin = useAnimationStore((s) => s.wheelSpin);
  const wheelSpeed = useAnimationStore((s) => s.wheelSpeed);
  const steerAngle = useAnimationStore((s) => s.steerAngle);

  // Derive display values from wheel state
  const speedKmh = wheelSpin ? Math.round(wheelSpeed * 14) : 0;
  const rpm = wheelSpin ? Math.round(800 + wheelSpeed * 280) : 800;
  const rpmPercent = Math.min(((rpm - 800) / 5200) * 100, 100);
  const gear = !wheelSpin ? 'N' : wheelSpeed < 3 ? '1' : wheelSpeed < 6 ? '2' : wheelSpeed < 10 ? '3' : wheelSpeed < 15 ? '4' : '5';
  const steerDeg = Math.round((steerAngle / 0.5) * 90);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: 'linear-gradient(145deg, #0a1628ee, #0d1f3aee)',
      borderRadius: '14px',
      padding: '16px 20px',
      minWidth: '200px',
      color: '#ffffff',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      border: '1px solid #ffffff15',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      {/* Header */}
      <div style={{
        fontSize: '8px',
        letterSpacing: '3px',
        color: '#6688bb',
        fontWeight: '700',
        marginBottom: '8px',
        textAlign: 'center',
      }}>
        DASHBOARD
      </div>

      {/* Speed display */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div style={{
          fontSize: '42px',
          fontWeight: '200',
          letterSpacing: '2px',
          color: '#ffffff',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {speedKmh}
        </div>
        <div style={{ fontSize: '10px', color: '#6688bb', letterSpacing: '2px', marginTop: '2px' }}>
          KM/H
        </div>
      </div>

      {/* RPM bar gauge */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '9px',
          color: '#6688bb',
          marginBottom: '3px',
        }}>
          <span>RPM</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{rpm}</span>
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          background: '#ffffff10',
          borderRadius: '3px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${rpmPercent}%`,
            height: '100%',
            background: rpmPercent > 85
              ? 'linear-gradient(90deg, ' + VW_BLUE + ', #cc3333)'
              : 'linear-gradient(90deg, ' + VW_BLUE + ', ' + VW_LIGHT + ')',
            borderRadius: '3px',
            transition: 'width 0.15s ease-out',
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '7px',
          color: '#445566',
          marginTop: '2px',
        }}>
          <span>0</span>
          <span>2</span>
          <span>4</span>
          <span style={{ color: rpmPercent > 85 ? '#cc3333' : '#445566' }}>6</span>
        </div>
      </div>

      {/* Gear and steering */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #ffffff15',
        paddingTop: '8px',
      }}>
        {/* Gear indicator */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '8px', color: '#6688bb', letterSpacing: '1px', marginBottom: '2px' }}>GEAR</div>
          <div style={{
            fontSize: '22px',
            fontWeight: '700',
            color: gear === 'N' ? '#6688bb' : VW_LIGHT,
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${gear === 'N' ? '#ffffff20' : VW_BLUE}`,
            borderRadius: '6px',
          }}>
            {gear}
          </div>
        </div>

        {/* Steering angle */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '8px', color: '#6688bb', letterSpacing: '1px', marginBottom: '2px' }}>STEER</div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: steerDeg === 0 ? '#6688bb' : '#ffffff',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {steerDeg > 0 ? '+' : ''}{steerDeg}&deg;
          </div>
        </div>

        {/* Status indicator */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '8px', color: '#6688bb', letterSpacing: '1px', marginBottom: '2px' }}>STATUS</div>
          <div style={{
            fontSize: '10px',
            fontWeight: '700',
            color: wheelSpin ? '#44bb66' : '#6688bb',
            letterSpacing: '1px',
          }}>
            {wheelSpin ? 'RUN' : 'IDLE'}
          </div>
        </div>
      </div>
    </div>
  );
}
