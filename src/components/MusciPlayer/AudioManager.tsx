// File: AudioManager.ts
// Export the AudioManager class so it can be used in other files

export class AudioManager {
    private static currentAudio: HTMLAudioElement | null = null;

    static async play(src: string): Promise<void> {
        // Stop any currently playing audio
        this.stop();

        this.currentAudio = new Audio(src);
        try {
            await this.currentAudio.play();
        } catch (error) {
            console.error('Error playing audio:', error);
            throw error;
        }
    }

    static stop(): void {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
    }

    static pause(): void {
        if (this.currentAudio) {
            this.currentAudio.pause();
        }
    }

    static resume(): void {
        if (this.currentAudio && this.currentAudio.paused) {
            this.currentAudio.play().catch(error => {
                console.error('Error resuming audio:', error);
            });
        }
    }

    static isPlaying(): boolean {
        return this.currentAudio ? !this.currentAudio.paused : false;
    }

    static getCurrentTime(): number {
        return this.currentAudio ? this.currentAudio.currentTime : 0;
    }

    static getDuration(): number {
        return this.currentAudio ? this.currentAudio.duration : 0;
    }

    static setVolume(volume: number): void {
        if (this.currentAudio) {
            this.currentAudio.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
        }
    }
}

// Alternative: Export as default
// export default AudioManager;

// ====================================
// HOW TO USE IN OTHER COMPONENTS:
// ====================================

/*
// In any other component file:

import { AudioManager } from './AudioManager'; // Adjust path as needed
// OR if using default export: import AudioManager from './AudioManager';

import React, { useState } from 'react';

const MyComponent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    try {
      await AudioManager.play('sounds/music.mp3');
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  };

  const handleStop = () => {
    AudioManager.stop();
    setIsPlaying(false);
  };

  return (
    <div>
      <button onClick={handlePlay}>Play</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};

export default MyComponent;
*/
