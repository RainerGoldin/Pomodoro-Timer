import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Twitch as Switch } from 'lucide-react';
import { TimeInput } from './components/TimeInput';
import { CircularProgress } from './components/CircularProgress';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { TimerSettings, TimerMode, TimerStatus } from './types';

const defaultSettings: TimerSettings = {
  studyMinutes: 25,
  studySeconds: 0,
  restMinutes: 5,
  restSeconds: 0,
  autoSwitch: true,
};

function App() {
  const [settings, setSettings] = useLocalStorage<TimerSettings>('pomodoro-settings', defaultSettings);
  const [mode, setMode] = useState<TimerMode>('study');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.studyMinutes * 60 + settings.studySeconds);
  const [initialTime, setInitialTime] = useState(timeLeft);

  const playSound = useCallback(() => {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play().catch(console.error);
  }, []);

  useEffect(() => {
    let interval: number;

    if (status === 'running') {
      interval = window.setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 0) {
            playSound();
            const nextMode = mode === 'study' ? 'rest' : 'study';
            setMode(nextMode);
            
            if (settings.autoSwitch) {
              // Keep the timer running if auto-switch is enabled
              return nextMode === 'study'
                ? settings.studyMinutes * 60 + settings.studySeconds
                : settings.restMinutes * 60 + settings.restSeconds;
            } else {
              // Stop the timer if auto-switch is disabled
              setStatus('idle');
              return nextMode === 'study'
                ? settings.studyMinutes * 60 + settings.studySeconds
                : settings.restMinutes * 60 + settings.restSeconds;
            }
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status, mode, settings, playSound]);

  useEffect(() => {
    const newTime = mode === 'study'
      ? settings.studyMinutes * 60 + settings.studySeconds
      : settings.restMinutes * 60 + settings.restSeconds;
    setTimeLeft(newTime);
    setInitialTime(newTime);
  }, [mode, settings]);

  const toggleTimer = () => {
    setStatus((s) => (s === 'running' ? 'paused' : 'running'));
  };

  const resetTimer = () => {
    setStatus('idle');
    setMode('study');
    setTimeLeft(settings.studyMinutes * 60 + settings.studySeconds);
    setInitialTime(settings.studyMinutes * 60 + settings.studySeconds);
  };

  const skipPhase = () => {
    setStatus('idle');
    setMode((m) => (m === 'study' ? 'rest' : 'study'));
  };

  const toggleAutoSwitch = () => {
    setSettings({ ...settings, autoSwitch: !settings.autoSwitch });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      mode === 'study' ? 'bg-emerald-50' : 'bg-orange-50'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Pomodoro Timer</h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="relative flex justify-center mb-8">
            <CircularProgress
              progress={progress}
              className={`${mode === 'study' ? 'text-emerald-500' : 'text-orange-500'}`}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-4xl font-bold">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-gray-500 capitalize">{mode} Mode</div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={toggleTimer}
              className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              {status === 'running' ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={resetTimer}
              className="p-3 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              <RotateCcw size={24} />
            </button>
            <button
              onClick={skipPhase}
              className="p-3 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              <SkipForward size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex items-center gap-2">
                <Switch size={20} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Auto-switch timer</span>
              </div>
              <button
                onClick={toggleAutoSwitch}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoSwitch ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoSwitch ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <TimeInput
              label="Study Duration"
              minutes={settings.studyMinutes}
              seconds={settings.studySeconds}
              onMinutesChange={(value) => setSettings({ ...settings, studyMinutes: value })}
              onSecondsChange={(value) => setSettings({ ...settings, studySeconds: value })}
              disabled={status !== 'idle'}
            />
            <TimeInput
              label="Rest Duration"
              minutes={settings.restMinutes}
              seconds={settings.restSeconds}
              onMinutesChange={(value) => setSettings({ ...settings, restMinutes: value })}
              onSecondsChange={(value) => setSettings({ ...settings, restSeconds: value })}
              disabled={status !== 'idle'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;