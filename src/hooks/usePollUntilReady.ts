import { useEffect } from 'react';

export const usePollUntilReady = (status: string | undefined, refetch: () => void) => {
  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(() => {
        refetch();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [status, refetch]);
};
