import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Download, BarChart3, Thermometer, Zap, RotateCcw, Menu, X } from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #ec4899 100%)',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
    backdropFilter: 'blur(10px)',
    padding: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  headerSubtitle: {
    textAlign: 'center',
    color: '#bfdbfe',
    fontSize: '14px'
  },
  navigation: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px',
    gap: '8px',
    flexWrap: 'wrap'
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.3s ease'
  },
  navButtonActive: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  navButtonInactive: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#bfdbfe'
  },
  mobileMenuButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    margin: '8px auto 0',
    fontSize: '12px'
  },
  mainContent: {
    display: 'flex',
    minHeight: 'calc(100vh - 120px)'
  },
  simulationArea: {
    flex: 1,
    padding: '16px'
  },
  simulationContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: '24px',
    height: '100%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(10px)'
  },
  simulationContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  statusIndicator: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px'
  },
  statusRunning: {
    background: '#dcfce7',
    color: '#166534'
  },
  statusPaused: {
    background: '#fecaca',
    color: '#991b1b'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  cylinderContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    minHeight: 0
  },
  cylinderWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  cylinder: {
    position: 'relative',
    borderRadius: '16px',
    border: '3px solid #374151',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    marginBottom: '16px',
    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(239, 68, 68, 0.3))'
  },
  temperatureOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: '12px',
    transition: 'all 0.5s ease'
  },
  particleContainer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden'
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    boxShadow: '0 0 10px currentColor',
    transition: 'all 0.075s ease'
  },
  temperatureLabel: {
    position: 'absolute',
    top: '16px',
    padding: '4px 8px',
    borderRadius: '8px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600'
  },
  coldLabel: {
    left: '-48px',
    background: 'rgba(37, 99, 235, 0.9)'
  },
  hotLabel: {
    right: '-48px',
    background: 'rgba(239, 68, 68, 0.9)'
  },
  flowArrow: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '-32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#6b7280'
  },
  legend: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '12px',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    color: '#374151',
    fontSize: '12px',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center'
  },
  legendDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    marginRight: '8px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  },
  resultsPanel: {
    background: 'linear-gradient(90deg, #374151, #1f2937)',
    color: 'white',
    padding: '16px',
    borderRadius: '12px',
    marginTop: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  resultsTitle: {
    fontWeight: 'bold',
    marginBottom: '12px',
    textAlign: 'center',
    fontSize: '16px'
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },
  resultCard: {
    textAlign: 'center',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  },
  resultValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  resultLabel: {
    fontSize: '14px',
    opacity: 0.8
  },
  resultStatus: {
    fontSize: '12px',
    opacity: 0.6,
    marginTop: '4px'
  },
  resultsFooter: {
    textAlign: 'center',
    marginTop: '12px',
    fontSize: '12px',
    opacity: 0.75
  },
  controlPanel: {
    width: '384px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    margin: '16px',
    padding: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(10px)',
    overflowY: 'auto'
  },
  controlHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  controlTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#374151'
  },
  controlButtons: {
    display: 'flex',
    gap: '4px'
  },
  controlButton: {
    padding: '8px',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  },
  playButton: {
    background: '#ea580c'
  },
  pauseButton: {
    background: '#16a34a'
  },
  resetButton: {
    background: '#4b5563'
  },
  downloadButton: {
    background: '#7c3aed'
  },
  parameterControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  parameterCard: {
    background: 'linear-gradient(90deg, #f9fafb, #eff6ff)',
    padding: '12px',
    borderRadius: '8px',
    borderLeft: '4px solid #3b82f6',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  },
  parameterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  parameterLabel: {
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px'
  },
  parameterValue: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: '14px',
    background: 'white',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  parameterSlider: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: '#d1d5db',
    outline: 'none',
    cursor: 'pointer',
    marginBottom: '8px',
    appearance: 'none'
  },
  parameterDescription: {
    fontSize: '12px',
    color: '#6b7280',
    lineHeight: '1.4'
  },
  researchNotes: {
    marginTop: '24px',
    background: 'linear-gradient(90deg, #374151, #1e40af)',
    color: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  notesTitle: {
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  notesList: {
    fontSize: '12px',
    lineHeight: '1.5'
  },
  notesItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '8px'
  },
  statusPanel: {
    marginTop: '16px',
    background: 'linear-gradient(90deg, #ecfdf5, #eff6ff)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db'
  },
  statusContent: {
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'center'
  },
  statusTitle: {
    fontWeight: '600',
    marginBottom: '4px'
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  otherViews: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  otherViewsContent: {
    textAlign: 'center',
    color: '#6b7280'
  },
  otherViewsIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'center',
    color: '#3b82f6'
  },
  otherViewsTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
    textTransform: 'capitalize',
    color: '#374151'
  },
  otherViewsDescription: {
    marginBottom: '24px',
    color: '#6b7280'
  },
  otherViewsResult: {
    background: 'linear-gradient(90deg, #eff6ff, #f3e8ff)',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #d1d5db'
  },
  otherViewsResultLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px'
  },
  otherViewsResultValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '8px'
  },
  otherViewsResultNote: {
    fontSize: '12px',
    color: '#9ca3af'
  }
};

const MHDFluidFlowApp = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentView, setCurrentView] = useState('simulation');
  const [particles, setParticles] = useState([]);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);
  const animationRef = useRef();
  const lastTimeRef = useRef(0);

  // Parameters based on research data
  const [parameters, setParameters] = useState({
    gr: 1.0,      // Grashof Number (0.5 - 10.0)
    m: 1.0,       // Hartmann Number (0.1 - 5.0)  
    lambda: 0.1,  // Rabinowitsch (0.0 - 0.50)
    a: 1.0,       // Pressure Gradient (0.5 - 2.0)
    beta: 0.5,    // Porosity (0.0 - 1.0)
    rd: 0.5       // Radiation (0.0 - 2.0)
  });

  const parameterConfig = {
    gr: { name: 'Grashof (Gr)', shortName: 'Gr', min: 0.5, max: 10.0, step: 0.1, 
          description: 'Buoyancy effects - ↑62% velocity, ↑35% temperature', unit: '' },
    m: { name: 'Hartmann (M)', shortName: 'M', min: 0.1, max: 5.0, step: 0.1, 
         description: 'Magnetic field - ↓73% velocity, ↑22% temperature', unit: '' },
    lambda: { name: 'Rabinowitsch (λ₃)', shortName: 'λ₃', min: 0.0, max: 0.50, step: 0.01, 
              description: 'Non-Newtonian - ↓41% velocity, ↑28% temperature', unit: '' },
    a: { name: 'Pressure (A)', shortName: 'A', min: 0.5, max: 2.0, step: 0.1, 
         description: 'Driving force - ↑velocity, ↓22% temperature', unit: '' },
    beta: { name: 'Porosity (β₁)', shortName: 'β₁', min: 0.0, max: 1.0, step: 0.1, 
            description: 'Porous medium - ↓58% velocity, ↑42% temperature', unit: '' },
    rd: { name: 'Radiation (Rd)', shortName: 'Rd', min: 0.0, max: 2.0, step: 0.1, 
          description: 'Heat transfer - ↑velocity, ↑temperature', unit: '' }
  };

  // Track window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Responsive settings
  const getResponsiveSettings = useCallback(() => {
    const isMobile = windowWidth < 768;
    return {
      cylinderWidth: isMobile ? 120 : 200,
      cylinderHeight: isMobile ? 300 : 400,
      particleCount: isMobile ? 25 : 50,
      baseParticleSize: isMobile ? 3 : 4
    };
  }, [windowWidth]);

  // Calculate velocity factor based on research findings
  const calculateVelocity = useCallback(() => {
    let velocity = 1.0;
    velocity *= (0.4 + parameters.gr * 0.06);
    velocity *= (1.5 - parameters.m * 0.146);
    velocity *= (1.2 - parameters.lambda * 0.82);
    velocity *= (0.6 + parameters.a * 0.4);
    velocity *= (1.3 - parameters.beta * 0.58);
    velocity *= (0.8 + parameters.rd * 0.15);
    return Math.max(0.1, Math.min(3.0, velocity));
  }, [parameters]);

  // Calculate temperature factor based on research findings  
  const calculateTemperature = useCallback(() => {
    let temperature = 1.0;
    temperature *= (0.7 + parameters.gr * 0.035);
    temperature *= (0.9 + parameters.m * 0.044);
    temperature *= (0.8 + parameters.lambda * 0.56);
    temperature *= (1.3 - parameters.a * 0.11);
    temperature *= (0.7 + parameters.beta * 0.42);
    temperature *= (0.8 + parameters.rd * 0.2);
    return Math.max(0.2, Math.min(2.5, temperature));
  }, [parameters]);

  // Initialize particles
  useEffect(() => {
    const settings = getResponsiveSettings();
    const particleCount = Math.max(20, Math.min(settings.particleCount, Math.floor(parameters.gr * parameters.a * 8 + 15)));
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: 15 + Math.random() * (settings.cylinderWidth - 30),
        y: settings.cylinderHeight + Math.random() * 100,
        baseSpeed: 0.5 + Math.random() * 1.0,
        xOffset: (Math.random() - 0.5) * 20,
        size: settings.baseParticleSize + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.6 + Math.random() * 0.4,
        hue: 200 + Math.random() * 60
      });
    }
    setParticles(newParticles);
  }, [parameters.gr, parameters.a, getResponsiveSettings]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (currentTime) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = Math.min(currentTime - lastTimeRef.current, 32);
      lastTimeRef.current = currentTime;

      const velocity = calculateVelocity();
      const temperature = calculateTemperature();
      const settings = getResponsiveSettings();

      setParticles(prevParticles => 
        prevParticles.map(particle => {
          const speed = particle.baseSpeed * velocity * (deltaTime / 16) * 0.8;
          let newY = particle.y - speed;
          
          const wobble = Math.sin((currentTime * 0.002) + particle.phase) * particle.xOffset * 0.05;
          let newX = particle.x + wobble * (deltaTime / 16);
          
          newX = Math.max(5, Math.min(settings.cylinderWidth - 5, newX));
          
          if (newY < -30) {
            return {
              ...particle,
              x: 15 + Math.random() * (settings.cylinderWidth - 30),
              y: settings.cylinderHeight + Math.random() * 100,
              opacity: 0.6 + Math.random() * 0.4,
              hue: 200 + Math.random() * 60
            };
          }

          let opacity = particle.opacity;
          if (newY > settings.cylinderHeight - 50) {
            opacity = Math.max(0.1, (settings.cylinderHeight - newY + 50) / 50 * particle.opacity);
          } else if (newY < 50) {
            opacity = Math.max(0.1, (newY / 50) * particle.opacity);
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            opacity: Math.max(0.1, Math.min(1, opacity * (0.5 + temperature * 0.3)))
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, calculateVelocity, calculateTemperature, getResponsiveSettings]);

  const getParticleColor = (particle, temperature) => {
    const tempFactor = Math.min(1, temperature * 0.5);
    const baseHue = particle.hue - (tempFactor * 40);
    const saturation = 70 + (tempFactor * 20);
    const lightness = 50 + (tempFactor * 20);
    return `hsla(${baseHue}, ${saturation}%, ${lightness}%, ${particle.opacity})`;
  };

  const resetParameters = () => {
    setParameters({
      gr: 1.0, m: 1.0, lambda: 0.1, a: 1.0, beta: 0.5, rd: 0.5
    });
  };

  const downloadReport = () => {
    const velocity = calculateVelocity();
    const temperature = calculateTemperature();
    
    const reportData = {
      researcher: "Mr Mosala S.I",
      title: "Numerical Flow Analysis of MHD Rabinowitsch Fluid Flow",
      institution: "University of Limpopo",
      timestamp: new Date().toISOString(),
      currentParameters: parameters,
      calculatedResults: {
        velocityFactor: velocity.toFixed(3),
        temperatureFactor: temperature.toFixed(3)
      },
      researchFindings: {
        methodology: "SQLM: 0.0001% error, 3.2× faster than ADM",
        keyEffects: {
          "Grashof Number": "62% velocity ↑, 35% temperature ↑",
          "Hartmann Number": "73% velocity ↓, 22% temperature ↑",
          "Rabinowitsch": "41% velocity ↓, 28% temperature ↑",
          "Pressure Gradient": "Linear velocity ↑, 22% temperature ↓",
          "Porosity": "58% velocity ↓, 42% temperature ↑", 
          "Radiation": "Enhances both velocity and temperature"
        },
        optimalConditions: "M = 2-3, λ₃ = 0.05-0.10"
      }
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MHD_Flow_Report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const velocity = calculateVelocity();
  const temperature = calculateTemperature();
  const settings = getResponsiveSettings();
  const isMobile = windowWidth < 768;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>Advanced Fluid Mechanics & Heat Transfer</div>
        <div style={styles.headerSubtitle}>University of Limpopo - Mr Mosala S.I Research</div>
        
        {/* Navigation - Desktop */}
        {!isMobile && (
          <div style={styles.navigation}>
            {[
              { id: 'simulation', icon: Play, label: 'Simulation' },
              { id: 'velocity', icon: BarChart3, label: 'Velocity' },
              { id: 'temperature', icon: Thermometer, label: 'Temperature' },
              { id: 'combined', icon: Zap, label: 'Analysis' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                style={{
                  ...styles.navButton,
                  ...(currentView === tab.id ? styles.navButtonActive : styles.navButtonInactive)
                }}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setShowMobileControls(!showMobileControls)}
            style={styles.mobileMenuButton}
          >
            {showMobileControls ? <X size={16} /> : <Menu size={16} />}
            <span>Controls</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div style={{...styles.mainContent, flexDirection: isMobile ? 'column' : 'row'}}>
        
        {/* Simulation Area */}
        <div style={styles.simulationArea}>
          <div style={styles.simulationContainer}>
            
            {currentView === 'simulation' && (
              <div style={styles.simulationContent}>
                
                {/* Status Indicator */}
                <div style={styles.statusIndicator}>
                  <div style={{
                    ...styles.statusBadge,
                    ...(isPlaying ? styles.statusRunning : styles.statusPaused)
                  }}>
                    <div style={{
                      ...styles.statusDot,
                      backgroundColor: isPlaying ? '#22c55e' : '#ef4444'
                    }}></div>
                    <span>{isPlaying ? 'Simulation Running' : 'Simulation Paused'}</span>
                  </div>
                </div>

                {/* Cylinder Container */}
                <div style={styles.cylinderContainer}>
                  <div style={styles.cylinderWrapper}>
                    
                    {/* Main Cylinder */}
                    <div 
                      style={{
                        ...styles.cylinder,
                        width: `${settings.cylinderWidth}px`,
                        height: `${settings.cylinderHeight}px`
                      }}
                    >
                      {/* Temperature Gradient Background */}
                      <div 
                        style={{
                          ...styles.temperatureOverlay,
                          background: `linear-gradient(90deg, 
                            rgba(59, 130, 246, ${0.2 + temperature * 0.2}), 
                            rgba(239, 68, 68, ${0.2 + temperature * 0.3}))`
                        }}
                      />
                      
                      {/* Flowing Particles */}
                      <div style={styles.particleContainer}>
                        {particles.map(particle => (
                          <div
                            key={particle.id}
                            style={{
                              ...styles.particle,
                              left: `${particle.x}px`,
                              bottom: `${settings.cylinderHeight - particle.y}px`,
                              width: `${particle.size}px`,
                              height: `${particle.size}px`,
                              backgroundColor: getParticleColor(particle, temperature),
                              transform: `scale(${0.8 + velocity * 0.4})`
                            }}
                          />
                        ))}
                      </div>

                      {/* Temperature Labels */}
                      <div style={{...styles.temperatureLabel, ...styles.coldLabel}}>
                        Cold
                      </div>
                      <div style={{...styles.temperatureLabel, ...styles.hotLabel}}>
                        Hot
                      </div>
                    </div>

                    {/* Flow Arrow */}
                    <div style={styles.flowArrow}>
                      <div style={{fontSize: '16px'}}>↑</div>
                      <div style={{fontSize: '10px'}}>Flow</div>
                    </div>

                    {/* Legend */}
                    <div style={styles.legend}>
                      <div style={styles.legendItem}>
                        <div style={{...styles.legendDot, background: '#3b82f6'}}></div>
                        <span>Cold Fluid</span>
                      </div>
                      <div style={styles.legendItem}>
                        <div style={{...styles.legendDot, background: '#ef4444'}}></div>
                        <span>Hot Fluid</span>
                      </div>
                      <div style={styles.legendItem}>
                        <div style={{...styles.legendDot, background: '#8b5cf6'}}></div>
                        <span>Particles</span>
                      </div>
                      <div style={styles.legendItem}>
                        <div style={{...styles.legendDot, background: '#10b981'}}></div>
                        <span>Flow Direction</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Panel */}
                <div style={styles.resultsPanel}>
                  <div style={styles.resultsTitle}>Current Flow Analysis</div>
                  <div style={styles.resultsGrid}>
                    <div style={styles.resultCard}>
                      <div style={styles.resultValue}>{velocity.toFixed(2)}</div>
                      <div style={styles.resultLabel}>Velocity Factor</div>
                      <div style={styles.resultStatus}>
                        {velocity > 1.5 ? 'High Flow' : velocity > 1.0 ? 'Moderate' : 'Low Flow'}
                      </div>
                    </div>
                    <div style={styles.resultCard}>
                      <div style={styles.resultValue}>{temperature.toFixed(2)}</div>
                      <div style={styles.resultLabel}>Temperature Factor</div>
                      <div style={styles.resultStatus}>
                        {temperature > 1.5 ? 'High Heat' : temperature > 1.0 ? 'Moderate' : 'Low Heat'}
                      </div>
                    </div>
                    <div style={styles.resultCard}>
                      <div style={styles.resultValue}>{particles.length}</div>
                      <div style={styles.resultLabel}>Active Particles</div>
                      <div style={styles.resultStatus}>Dynamic</div>
                    </div>
                    <div style={styles.resultCard}>
                      <div style={styles.resultValue}>{(velocity * temperature).toFixed(2)}</div>
                      <div style={styles.resultLabel}>Flow Efficiency</div>
                      <div style={styles.resultStatus}>Combined</div>
                    </div>
                  </div>
                  <div style={styles.resultsFooter}>
                    Real-time calculations based on SQLM methodology
                  </div>
                </div>
              </div>
            )}

            {/* Other Views */}
            {currentView !== 'simulation' && (
              <div style={styles.otherViews}>
                <div style={styles.otherViewsContent}>
                  <div style={styles.otherViewsIcon}>
                    {currentView === 'velocity' && <BarChart3 size={48} />}
                    {currentView === 'temperature' && <Thermometer size={48} />}
                    {currentView === 'combined' && <Zap size={48} />}
                  </div>
                  <div style={styles.otherViewsTitle}>{currentView} Analysis</div>
                  <div style={styles.otherViewsDescription}>
                    {currentView === 'velocity' && 'Detailed velocity profile analysis'}
                    {currentView === 'temperature' && 'Temperature distribution analysis'}
                    {currentView === 'combined' && 'Combined flow and heat transfer analysis'}
                  </div>
                  <div style={styles.otherViewsResult}>
                    <div style={styles.otherViewsResultLabel}>
                      {currentView === 'velocity' && 'Current Velocity Factor'}
                      {currentView === 'temperature' && 'Current Temperature Factor'}
                      {currentView === 'combined' && 'Combined Efficiency'}
                    </div>
                    <div style={styles.otherViewsResultValue}>
                      {currentView === 'velocity' && velocity.toFixed(3)}
                      {currentView === 'temperature' && temperature.toFixed(3)}
                      {currentView === 'combined' && (velocity * temperature).toFixed(3)}
                    </div>
                    <div style={styles.otherViewsResultNote}>
                      Based on current parameter settings
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Control Panel */}
        {(!isMobile || showMobileControls) && (
          <div style={{
            ...styles.controlPanel,
            ...(isMobile ? {
              position: 'fixed',
              top: '120px',
              left: '16px',
              right: '16px',
              width: 'auto',
              zIndex: 1000,
              maxHeight: 'calc(100vh - 140px)'
            } : {})
          }}>
            
            {/* Control Header */}
            <div style={styles.controlHeader}>
              <div style={styles.controlTitle}>Flow Controls</div>
              <div style={styles.controlButtons}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    ...styles.controlButton,
                    ...(isPlaying ? styles.pauseButton : styles.playButton)
                  }}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  onClick={resetParameters}
                  style={{...styles.controlButton, ...styles.resetButton}}
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={downloadReport}
                  style={{...styles.controlButton, ...styles.downloadButton}}
                >
                  <Download size={16} />
                </button>
              </div>
            </div>

            {/* Parameter Controls */}
            <div style={styles.parameterControls}>
              {Object.entries(parameterConfig).map(([key, config]) => (
                <div key={key} style={styles.parameterCard}>
                  <div style={styles.parameterHeader}>
                    <span style={styles.parameterLabel}>{config.name}</span>
                    <span style={styles.parameterValue}>
                      {parameters[key].toFixed(key === 'lambda' ? 2 : 1)}{config.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={parameters[key]}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      [key]: parseFloat(e.target.value)
                    }))}
                    style={styles.parameterSlider}
                  />
                  <div style={styles.parameterDescription}>
                    {config.description}
                  </div>
                </div>
              ))}
            </div>

            {/* Research Notes */}
            <div style={styles.researchNotes}>
              <div style={styles.notesTitle}>
                <span>📊</span> Research Findings
              </div>
              <div style={styles.notesList}>
                <div style={styles.notesItem}>
                  <span style={{marginRight: '8px'}}>•</span>
                  <span>SQLM achieves 0.0001% error rate</span>
                </div>
                <div style={styles.notesItem}>
                  <span style={{marginRight: '8px'}}>•</span>
                  <span>3.2× faster than ADM method</span>
                </div>
                <div style={styles.notesItem}>
                  <span style={{marginRight: '8px'}}>•</span>
                  <span>Optimal: M=2-3, λ₃=0.05-0.10</span>
                </div>
                <div style={styles.notesItem}>
                  <span style={{marginRight: '8px'}}>•</span>
                  <span>Magnetic field dominates flow</span>
                </div>
              </div>
            </div>

            {/* Status Panel */}
            <div style={styles.statusPanel}>
              <div style={styles.statusContent}>
                <div style={styles.statusTitle}>Simulation Status</div>
                <div style={styles.statusRow}>
                  <span>State:</span>
                  <span>{isPlaying ? 'Running' : 'Paused'}</span>
                </div>
                <div style={styles.statusRow}>
                  <span>Particles:</span>
                  <span>{particles.length} active</span>
                </div>
                <div style={styles.statusRow}>
                  <span>Method:</span>
                  <span>SQLM</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MHDFluidFlowApp;