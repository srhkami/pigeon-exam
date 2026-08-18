export function createRefreshCoordinator() {
  let active: Promise<string> | null = null;

  return {
    run(refresh: () => Promise<string>, onFailure: (error: unknown) => void): Promise<string> {
      if (active) return active;
      active = refresh().catch((error: unknown) => {
        onFailure(error);
        throw error;
      }).finally(() => {
        active = null;
      });
      return active;
    },
  };
}
