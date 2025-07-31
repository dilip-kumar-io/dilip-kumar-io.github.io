// Enhanced Web Audio API futuristic coder ambient sound generator
class AmbientAudioGenerator {
    constructor() {
        this.audioContext = null;
        this.gainNode = null;
        this.oscillators = [];
        this.isPlaying = false;
        this.intervals = [];
        this.buffers = {};
    }

    async initialize() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.setValueAtTime(0.6, this.audioContext.currentTime);
            
            // Create procedural audio buffers
            await this.createAudioBuffers();
            return true;
        } catch (error) {
            console.error('Audio context initialization failed:', error);
            return false;
        }
    }

    async createAudioBuffers() {
        // Create keyboard click buffer
        this.buffers.keyClick = this.createKeyboardClickBuffer();
        
        // Create notification beep buffer
        this.buffers.notification = this.createNotificationBuffer();
        
        // Create data processing buffer
        this.buffers.dataProcess = this.createDataProcessingBuffer();
        
        // Create startup sound buffer
        this.buffers.startup = this.createStartupSoundBuffer();
    }

    createKeyboardClickBuffer() {
        const length = this.audioContext.sampleRate * 0.1; // 100ms
        const buffer = this.audioContext.createBuffer(1, length, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const envelope = Math.exp(-i / (this.audioContext.sampleRate * 0.05));
            const frequency = 1200 + Math.random() * 800;
            const sample = Math.sin(2 * Math.PI * frequency * i / this.audioContext.sampleRate) * envelope;
            data[i] = sample * 0.3;
        }
        return buffer;
    }

    createNotificationBuffer() {
        const length = this.audioContext.sampleRate * 0.3; // 300ms
        const buffer = this.audioContext.createBuffer(1, length, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const time = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-time * 5);
            const freq1 = 880 * Math.sin(2 * Math.PI * 2 * time); // Frequency modulation
            const freq2 = 1320;
            const sample1 = Math.sin(2 * Math.PI * freq1 * time) * envelope;
            const sample2 = Math.sin(2 * Math.PI * freq2 * time) * envelope * 0.5;
            data[i] = (sample1 + sample2) * 0.4;
        }
        return buffer;
    }

    createDataProcessingBuffer() {
        const length = this.audioContext.sampleRate * 2; // 2 seconds
        const buffer = this.audioContext.createBuffer(1, length, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const time = i / this.audioContext.sampleRate;
            const lfo = Math.sin(2 * Math.PI * 0.5 * time); // 0.5 Hz LFO
            const frequency = 200 + lfo * 100;
            const noise = (Math.random() - 0.5) * 0.1;
            const sample = Math.sin(2 * Math.PI * frequency * time) * 0.2 + noise;
            data[i] = sample;
        }
        return buffer;
    }

    createStartupSoundBuffer() {
        const length = this.audioContext.sampleRate * 1.5; // 1.5 seconds
        const buffer = this.audioContext.createBuffer(1, length, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const time = i / this.audioContext.sampleRate;
            const envelope = 1 - Math.exp(-time * 3);
            const frequency = 440 + time * 880; // Rising frequency
            const sample = Math.sin(2 * Math.PI * frequency * time) * envelope * 0.3;
            data[i] = sample;
        }
        return buffer;
    }

    playBuffer(bufferName, volume = 1, playbackRate = 1) {
        if (!this.buffers[bufferName]) return;
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = this.buffers[bufferName];
        source.playbackRate.setValueAtTime(playbackRate, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        
        source.connect(gainNode);
        gainNode.connect(this.gainNode);
        
        source.start();
        return source;
    }

    createAmbientDrone(frequency, volume = 0.1) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filterNode = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(frequency * 3, this.audioContext.currentTime);
        filterNode.Q.setValueAtTime(1, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 2);
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.gainNode);
        
        return { oscillator, gainNode, filterNode };
    }

    createPulseSynth(frequency, duration = 0.2) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filterNode = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        filterNode.type = 'bandpass';
        filterNode.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime);
        filterNode.Q.setValueAtTime(10, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.gainNode);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
        
        return { oscillator, gainNode };
    }

    createGlitchEffect() {
        const bufferLength = 1024;
        const whiteNoise = this.audioContext.createScriptProcessor(bufferLength, 1, 1);
        const gainNode = this.audioContext.createGain();
        
        whiteNoise.onaudioprocess = (e) => {
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < bufferLength; i++) {
                if (Math.random() < 0.02) { // 2% chance of glitch
                    output[i] = (Math.random() - 0.5) * 0.1;
                } else {
                    output[i] = 0;
                }
            }
        };
        
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        
        whiteNoise.connect(gainNode);
        gainNode.connect(this.gainNode);
        
        return { whiteNoise, gainNode };
    }

    async play() {
        if (this.isPlaying) return;
        
        if (!this.audioContext) {
            const initialized = await this.initialize();
            if (!initialized) return;
        }

        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        // Play startup sound
        this.playBuffer('startup', 0.5);

        // Create ambient drones with better frequencies
        const drones = [
            { freq: 55, vol: 0.15 },   // Sub bass
            { freq: 110, vol: 0.12 },  // Bass
            { freq: 165, vol: 0.08 },  // Low mid
            { freq: 220, vol: 0.06 }   // Mid
        ];

        this.oscillators = [];
        
        drones.forEach(drone => {
            const { oscillator, gainNode, filterNode } = this.createAmbientDrone(drone.freq, drone.vol);
            oscillator.start();
            this.oscillators.push({ oscillator, gainNode, filterNode });
        });

        // Add glitch effects
        const glitch = this.createGlitchEffect();
        this.oscillators.push(glitch);

        // Add modulation
        this.addAdvancedModulation();
        
        // Start coding sounds
        this.startAdvancedCodingSounds();
        
        this.isPlaying = true;
    }

    addAdvancedModulation() {
        if (this.oscillators.length > 0) {
            // Create multiple LFOs for complex modulation
            const lfo1 = this.audioContext.createOscillator();
            const lfo1Gain = this.audioContext.createGain();
            
            const lfo2 = this.audioContext.createOscillator();
            const lfo2Gain = this.audioContext.createGain();
            
            lfo1.type = 'sine';
            lfo1.frequency.setValueAtTime(0.1, this.audioContext.currentTime);
            lfo1Gain.gain.setValueAtTime(5, this.audioContext.currentTime);
            
            lfo2.type = 'triangle';
            lfo2.frequency.setValueAtTime(0.05, this.audioContext.currentTime);
            lfo2Gain.gain.setValueAtTime(20, this.audioContext.currentTime);
            
            lfo1.connect(lfo1Gain);
            lfo2.connect(lfo2Gain);
            
            if (this.oscillators[0].filterNode) {
                lfo1Gain.connect(this.oscillators[0].filterNode.frequency);
                lfo2Gain.connect(this.oscillators[1].filterNode.frequency);
            }
            
            lfo1.start();
            lfo2.start();
            
            this.oscillators.push({ oscillator: lfo1, gainNode: lfo1Gain });
            this.oscillators.push({ oscillator: lfo2, gainNode: lfo2Gain });
        }
    }

    startAdvancedCodingSounds() {
        // Enhanced keyboard typing
        const typingInterval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(typingInterval);
                return;
            }
            
            const burstLength = Math.floor(Math.random() * 12) + 3;
            for (let i = 0; i < burstLength; i++) {
                setTimeout(() => {
                    if (this.isPlaying) {
                        const playbackRate = 0.8 + Math.random() * 0.4; // Vary pitch
                        this.playBuffer('keyClick', 0.6, playbackRate);
                    }
                }, i * (40 + Math.random() * 80)); // 40-120ms between keys
            }
        }, 1500 + Math.random() * 3000); // Every 1.5-4.5 seconds
        
        this.intervals.push(typingInterval);

        // Data processing sounds
        const dataInterval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(dataInterval);
                return;
            }
            
            this.playBuffer('dataProcess', 0.3, 0.8 + Math.random() * 0.4);
        }, 8000 + Math.random() * 12000); // Every 8-20 seconds
        
        this.intervals.push(dataInterval);

        // System notifications and beeps
        const notificationInterval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(notificationInterval);
                return;
            }
            
            const soundType = Math.random();
            if (soundType < 0.5) {
                this.playBuffer('notification', 0.4);
            } else if (soundType < 0.8) {
                // Create sequence of pulse synths
                const frequencies = [800, 1000, 1200];
                frequencies.forEach((freq, index) => {
                    setTimeout(() => {
                        if (this.isPlaying) {
                            this.createPulseSynth(freq, 0.15);
                        }
                    }, index * 100);
                });
            } else {
                // Create harmonic beeps
                [440, 880, 1320].forEach((freq, index) => {
                    setTimeout(() => {
                        if (this.isPlaying) {
                            this.createPulseSynth(freq, 0.2);
                        }
                    }, index * 150);
                });
            }
        }, 6000 + Math.random() * 10000); // Every 6-16 seconds
        
        this.intervals.push(notificationInterval);

        // Occasional tech atmosphere sounds
        const atmosphereInterval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(atmosphereInterval);
                return;
            }
            
            // Create sweeping filter effect
            const sweep = this.audioContext.createOscillator();
            const sweepGain = this.audioContext.createGain();
            const sweepFilter = this.audioContext.createBiquadFilter();
            
            sweep.type = 'sawtooth';
            sweep.frequency.setValueAtTime(100, this.audioContext.currentTime);
            
            sweepFilter.type = 'lowpass';
            sweepFilter.frequency.setValueAtTime(200, this.audioContext.currentTime);
            sweepFilter.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 2);
            sweepFilter.Q.setValueAtTime(15, this.audioContext.currentTime);
            
            sweepGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            sweepGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
            
            sweep.connect(sweepFilter);
            sweepFilter.connect(sweepGain);
            sweepGain.connect(this.gainNode);
            
            sweep.start();
            sweep.stop(this.audioContext.currentTime + 2);
            
        }, 20000 + Math.random() * 30000); // Every 20-50 seconds
        
        this.intervals.push(atmosphereInterval);
    }

    stop() {
        if (!this.isPlaying) return;
        
        // Clear all intervals
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
        
        this.oscillators.forEach(({ oscillator, gainNode, whiteNoise }) => {
            if (gainNode) {
                gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
            }
            if (oscillator) {
                oscillator.stop(this.audioContext.currentTime + 1);
            }
            if (whiteNoise) {
                whiteNoise.disconnect();
            }
        });
        
        this.oscillators = [];
        this.isPlaying = false;
    }

    setVolume(volume) {
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        }
    }
}

// Export for use in main script
window.AmbientAudioGenerator = AmbientAudioGenerator;
