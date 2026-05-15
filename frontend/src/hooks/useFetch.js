import React from 'react';
export const useFetch = (url, options = {}) => {
    const [state, setState] = React.useState({
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
        }
        catch (error) {
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
