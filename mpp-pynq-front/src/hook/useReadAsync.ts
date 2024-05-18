import { useState, useEffect } from "react";


export function useReadAsync<T>(read: () => Promise<T>): [T, boolean, Error | null] {
    const [state, setState] = useState<T>(null as unknown as T);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        read()
            .then((data) => {
                setState(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    });

    return [state as T, loading, error]
}