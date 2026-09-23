import {useEffect} from 'react';

type StartupProgress = {
  start: (limit: number) => void;
  stop: () => void;
};

const getStartupProgress = () => (
  globalThis as typeof globalThis & {examStartupProgress?: StartupProgress}
).examStartupProgress;

export default function StartupLoading() {
  useEffect(() => {
    const examStartupProgress = getStartupProgress();
    examStartupProgress?.start(0.9);

    return () => examStartupProgress?.stop();
  }, []);

  return (
    <div className="startup-loading" role="status" aria-label="小試鴿手載入中" aria-live="polite" aria-busy="true">
      <img src="/Web_Logo.svg" width="64" height="64" alt="" />
      <span className="startup-spinner" aria-hidden="true" />
      <div className="startup-track" aria-hidden="true"><span className="startup-progress" /></div>
    </div>
  );
}
