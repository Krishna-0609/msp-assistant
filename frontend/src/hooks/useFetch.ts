import React from 'react';

interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  skipInitialFetch?: boolean;
}

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const useFetch = <T = any>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchState<T> & { refetch: () => void } => {
  const [state, setState] = React.useState<UseFetchState<T>>({
    data: null,
    loading: !options.skipInitialFetch,
    error: null,
  });

  const fetchData = React.useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...(options.body && { body: JSON.stringify(options.body) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    }
  }, [url, options]);

  React.useEffect(() => {
    if (!options.skipInitialFetch) {
      fetchData();
    }
  }, [url, options.skipInitialFetch, fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
};
