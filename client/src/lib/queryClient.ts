import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.tex) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = any>(
  urlOrOptions: string | RequestInit,
  options?: RequestInit
): Promise<T> {
  let url: string;
  let requestOptions: RequestInit;

  if (typeof urlOrOptions === 'string') {
    url = urlOrOptions;
    requestOptions = options || { method: 'GET' };
  } else {
    throw new Error('When using apiRequest, first parameter must be a URL string');
  }

  // Ensure credentials are included
  requestOptions.credentials = 'include';

  const res = await fetch(url, requestOptions);
  await throwIfResNotOk(res);

  // For DELETE requests or other requests that don't return content
  if (res.status === 204 || requestOptions.method === 'DELETE') {
    return {} as T;
  }

  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
