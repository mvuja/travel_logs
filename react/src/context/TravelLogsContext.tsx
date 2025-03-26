import { createContext, useContext, useEffect, useState } from "react";

// Define the context type
type TravelLogsContextType = {
    logs: any;
    loading: boolean;
    removeLog: (id: string) => void;
    refetchLogs: () => void;
};

// Create context
const TravelLogsContext = createContext<TravelLogsContextType | undefined>(
    undefined
);

// Context Provider
export const TravelLogsProvider = ({ children }) => {
    const [logs, setLogs] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            const url = "http://127.0.0.1:8000/api/travel-logs";
            try {
                const response = await fetch(url, {
                    signal: controller.signal,
                });
                if (!response.ok)
                    throw new Error("Network response was not ok");
                const result = await response.json();

                const holder = result.data;
                setLogs(holder.reverse());
            } catch (err) {
                if ((err as Error).name !== "AbortError")
                    setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, []);

    // Function to remove a log from state
    const removeLog = (id: string) => {
        setLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
    };

    const refetchLogs = async () => {
        setLoading(true);
        const url = "http://127.0.0.1:8000/api/travel-logs";
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch logs");
            const result = await response.json();
            setLogs(result.data.reverse());
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TravelLogsContext.Provider
            value={{ logs, loading, removeLog, refetchLogs }}
        >
            {children}
        </TravelLogsContext.Provider>
    );
};

// Custom hook to use travel logs
export const useTravelLogs = () => {
    const context = useContext(TravelLogsContext);
    if (!context) {
        throw new Error(
            "useTravelLogs must be used within a TravelLogsProvider"
        );
    }
    return context;
};
