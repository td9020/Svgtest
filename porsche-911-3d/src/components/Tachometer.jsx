import React from 'react';
import useAnimationStore from '../store/animationStore';

// HUD-style Porsche center tachometer overlay
export default function Tachometer() {
  const { engineRPM, wheelSpin, wheelSpeed } = useAnimationStore();

  const displayRPM = Math.round(engineRPM);
  const displaySpeed = wheelSpin ? Math.round(wheelSpeed * 18) : 0;
  // Needle: 0 RPM at -135deg, 9000 RPM at +135deg (270 degree sweep)
  const needleAngle = -135 + (displayRPM / 9000) * 270;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        zIndex: 20,
        display: 'flex',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      {/* Tachometer - Porsche center tach style */}
      <div
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #0a0a0a 55%, #1a1a1a 100%)',
          border: '3px solid #444',
          position: 'relative',
          boxShadow: '0 0 20px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* RPM markings 0-9 (x1000) */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
          const a = ((-135 + (n / 9) * 270) * Math.PI) / 180;
          const r = 62;
          const x = 80 + Math.cos(a) * r;
          const y = 80 + Math.sin(a) * r;
          return (
            <span
              key={n}
              style={{
                position: 'absolute',
                left: x - 6,
                top: y - 6,
                fontSize: '10px',
                color: n >= 7 ? '#FF0000' : '#bbb',
                fontFamily: 'monospace',
                fontWeight: n >= 7 ? 'bold' : 'normal',
              }}
            >
              {n}
            </span>
          );
        })}

        {/* Tick marks */}
        {Array.from({ length: 46 }).map((_, i) => {
          const a = ((-135 + (i / 45) * 270) * Math.PI) / 180;
          const isMajor = i % 5 === 0;
          const r1 = isMajor ? 48 : 52;
          const r2 = 56;
          const isRedZone = i >= 35; // 7000+ RPM
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 80 + Math.cos(a) * r1,
                top: 80 + Math.sin(a) * r1,
                width: isMajor ? '2px' : '1px',
                height: `${r2 - r1}px`,
                background: isRedZone ? '#FF0000' : '#888',
                transform: `rotate(${a + Math.PI / 2}rad)`,
                transformOrigin: 'top center',
              }}
            />
          );
        })}

        {/* Red zone arc indicator */}
        <div
          style={{
            position: 'absolute',
            left: '12px',
            top: '12px',
            width: '136px',
            height: '136px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTop: '2px solid #FF000055',
            borderRight: '2px solid #FF000055',
            transform: 'rotate(45deg)',
          }}
        />

        {/* Needle */}
        <div
          style={{
            position: 'absolute',
            left: '79px',
            top: '80px',
            width: '2px',
            height: '50px',
            background: 'linear-gradient(to top, #FF0000, #FF3333)',
            transformOrigin: 'bottom center',
            transform: `rotate(${needleAngle + 180}deg)`,
            transition: 'transform 0.1s ease-out',
            boxShadow: '0 0 8px #FF0000',
          }}
        />

        {/* Center cap - Porsche style */}
        <div
          style={{
            position: 'absolute',
            left: '73px',
            top: '73px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#222',
            border: '2px solid #555',
          }}
        />

        {/* RPM value */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            left: 0,
            right: 0,
            textAlign: 'center',
            color: '#fff',
            fontSize: '15px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}
        >
          {displayRPM}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: 0,
            right: 0,
            textAlign: 'center',
            color: '#888',
            fontSize: '8px',
            fontFamily: 'monospace',
            letterSpacing: '1px',
          }}
        >
          RPM x 1000
        </div>

        {/* Porsche logo area */}
        <div
          style={{
            position: 'absolute',
            top: '38px',
            left: 0,
            right: 0,
            textAlign: 'center',
            color: '#FF0000',
            fontSize: '7px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            letterSpacing: '2px',
          }}
        >
          PORSCHE
        </div>
      </div>

      {/* Speed & Info Panel */}
      <div
        style={{
          width: '110px',
          height: '160px',
          borderRadius: '10px',
          background: '#0a0a0a',
          border: '2px solid #444',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            color: '#888',
            fontSize: '9px',
            fontFamily: 'monospace',
            letterSpacing: '1px',
            marginBottom: '2px',
          }}
        >
          km/h
        </div>
        <div
          style={{
            color: '#FF0000',
            fontSize: '32px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(255,0,0,0.3)',
          }}
        >
          {displaySpeed}
        </div>

        {/* Gear indicator */}
        <div
          style={{
            marginTop: '8px',
            padding: '2px 10px',
            borderRadius: '3px',
            background: '#1a1a1a',
            border: '1px solid #444',
            color: wheelSpin ? '#FF8800' : '#444',
            fontSize: '14px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}
        >
          {!wheelSpin
            ? 'N'
            : wheelSpeed > 10
              ? '6'
              : wheelSpeed > 8
                ? '5'
                : wheelSpeed > 6
                  ? '4'
                  : wheelSpeed > 4
                    ? '3'
                    : wheelSpeed > 2
                      ? '2'
                      : '1'}
        </div>

        {/* RPM bar */}
        <div
          style={{
            marginTop: '8px',
            width: '80px',
            height: '4px',
            borderRadius: '2px',
            background: '#222',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(displayRPM / 9000) * 100}%`,
              height: '100%',
              background:
                displayRPM > 7500
                  ? '#FF0000'
                  : displayRPM > 5000
                    ? '#FF8800'
                    : '#FF0000aa',
              transition: 'width 0.1s, background 0.3s',
            }}
          />
        </div>

        {/* Engine spec */}
        <div
          style={{
            marginTop: '8px',
            color: '#555',
            fontSize: '7px',
            fontFamily: 'monospace',
            textAlign: 'center',
            lineHeight: '11px',
          }}
        >
          4.0L Flat-6
          <br />
          502 HP
        </div>
      </div>
    </div>
  );
}
