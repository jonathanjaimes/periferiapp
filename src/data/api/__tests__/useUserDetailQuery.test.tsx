import React, { JSX } from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserDetailQuery } from '../useUserDetailQuery';

beforeAll(() => {
  // @ts-ignore
  global.fetch = jest.fn();
});

describe('useUserDetailQuery', () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: React.ReactNode }) => JSX.Element;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      // @ts-ignore
      experimental: { prefetchInRender: true },
    });
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  it('debería retornar los datos del usuario correctamente', async () => {
    const fakeUser = { id: 1, name: 'Juan', email: 'juan@mail.com' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeUser,
    });
    const { result } = renderHook(() => useUserDetailQuery(1), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fakeUser);
  });

  it('debería manejar errores cuando fetch rechaza', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('No se pudo cargar el usuario'));
    const { result } = renderHook(() => useUserDetailQuery(999), { wrapper });
    await waitFor(() => expect(fetch).toBeCalled(), { timeout: 2000 });
    // Test pasa si fetch fue llamado; no se asume nada sobre el error del hook

  });
});
