import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { Logger } from "@rx-lab/common";

// Types and interfaces
type RouteChangeCallback = () => void;
type Queue = (() => void)[];

interface RouterContextType {
  addToQueue: (callback: RouteChangeCallback) => void;
  isQueueEmpty: () => boolean;
  notifyRouteChange: () => void;
  registerLoading: (promise: Promise<void>) => void;
}

// Create the context
export const RouterContext = createContext<RouterContextType | undefined>(
  undefined,
);

// Debounce function
function debounce<F extends (...args: any[]) => void>(
  func: F,
  wait: number,
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

// RouterProvider component
export function RouterProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Queue>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingPromises, setPendingPromises] = useState<Promise<void>[]>([]);

  const addToQueue = useCallback((callback: RouteChangeCallback) => {
    Logger.log(`Adding callback to queue: ${callback}`);
    setQueue((prevQueue) => [...prevQueue, callback]);
  }, []);

  const isQueueEmpty = useCallback(() => queue.length === 0, [queue]);

  const notifyRouteChange = useCallback(() => {
    queue.forEach((callback) => callback());
    setQueue([]);
  }, [queue]);

  const registerLoading = useCallback((promise: Promise<void>) => {
    Logger.log(`Registering loading promise: ${promise}`);
    setPendingPromises((prev) => [...prev, promise]);
  }, []);

  // Create a ref to store the debounced function
  const debouncedEffect = useRef(
    debounce(() => {
      if (pendingPromises.length > 0) {
        setIsLoading(true);
        Promise.all(pendingPromises)
          .then(() => {
            setIsLoading(false);
            setPendingPromises([]);
          })
          .catch((error) => {
            console.error("Error during loading:", error);
            setIsLoading(false);
            setPendingPromises([]);
          });
      } else {
        setIsLoading(false);
      }
    }, 100), // 100ms debounce time, adjust as needed
  );

  useEffect(() => {
    debouncedEffect.current();
  }, [pendingPromises]);

  const contextValue: RouterContextType = {
    addToQueue,
    isQueueEmpty,
    notifyRouteChange,
    registerLoading,
  };

  Logger.log(`RouterProvider initialized: ${isLoading}`);
  return (
    <RouterContext.Provider value={contextValue}>
      {isLoading ? null : children}
    </RouterContext.Provider>
  );
}