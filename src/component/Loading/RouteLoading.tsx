import Loading from './Loading.tsx';

export default function RouteLoading() {
  return (
    <div className="route-loading" role="status" aria-live="polite" aria-label="頁面載入中" aria-busy="true">
      <Loading style="spinner" size="md" />
    </div>
  );
}
