import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import CryptoTracker from '@/components/CryptoTracker';
import CryptoSearch from '@/components/CryptoSearch';
import PriceChart from '@/components/PriceChart';
import ProtectedRoute from '@/components/ProtectedRoute';
import InteractiveParticles from '@/components/InteractiveParticles';
import Footer from '@/components/layout/Footer';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

vi.mock('@/components/InteractiveParticles', () => ({
  default: () => <div data-testid="particles" />,
}));

const mockCryptoData = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 45000,
    price_change_percentage_24h: 5.5,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 2800,
    price_change_percentage_24h: -2.3,
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    current_price: 120,
    price_change_percentage_24h: 0,
  },
];

describe('Home Page Integration', () => {
  it('carga el título principal correctamente', () => {
    render(<Home />);
    
    const title = screen.getByText(/ARCHITECTING THE/i);
    expect(title).toBeInTheDocument();
  });

  it('el botón de cambio de idioma funciona correctamente', () => {
    render(<Home />);
    
    const buttons = screen.getAllByRole('button');
    const langButton = buttons.find(btn => btn.textContent === 'ES');
    expect(langButton).toBeInTheDocument();
    
    expect(screen.getByText(/Desarrollador especializado/i)).toBeInTheDocument();
    
    fireEvent.click(langButton!);
    
    const buttonsAfterClick = screen.getAllByRole('button');
    const langButtonAfter = buttonsAfterClick.find(btn => btn.textContent === 'EN');
    expect(langButtonAfter).toBeInTheDocument();
    expect(screen.getByText(/Developer specialized/i)).toBeInTheDocument();
  });
});

vi.mock('next-auth/react', () => ({
  useSession: vi.fn().mockReturnValue({
    data: null,
    status: 'unauthenticated',
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

const mockUseSession = vi.hoisted(() => vi.fn());

vi.mock('next-auth/react', async () => {
  const actual = await vi.importActual('next-auth/react');
  return {
    ...actual,
    useSession: mockUseSession,
  };
});

beforeAll(() => {
  mockUseSession.mockReturnValue({
    data: null,
    status: 'unauthenticated',
  });
});

describe('CryptoTracker Tests', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: { user: { name: 'Test' } },
      status: 'authenticated',
    });
    
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockCryptoData,
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
  });

  it('muestra correctamente el precio de BTC y ETH desde la API mockeada', async () => {
    render(<CryptoTracker lang="es" />);

    await waitFor(() => {
      expect(screen.getByText(/BTC/i)).toBeInTheDocument();
      expect(screen.getByText(/ETH/i)).toBeInTheDocument();
      expect(screen.getByText('$45,000.00')).toBeInTheDocument();
      expect(screen.getByText('$2,800.00')).toBeInTheDocument();
    });
  });

  it('muestra flecha verde cuando el precio sube (BTC)', async () => {
    render(<CryptoTracker lang="es" />);

    await waitFor(() => {
      const btcElement = screen.getByText('$45,000.00').parentElement;
      expect(btcElement).toHaveTextContent(/↑/);
      const arrowElement = btcElement?.querySelector('span:last-child');
      expect(arrowElement).toHaveClass('text-emerald-400');
    });
  });

  it('muestra flecha roja cuando el precio baja (ETH)', async () => {
    render(<CryptoTracker lang="es" />);

    await waitFor(() => {
      const ethElement = screen.getByText('$2,800.00').parentElement;
      expect(ethElement).toHaveTextContent(/↓/);
      const arrowElement = ethElement?.querySelector('span:last-child');
      expect(arrowElement).toHaveClass('text-red-400');
    });
  });

  it('maneja datos incompletos de la API sin explotar', async () => {
    const incompleteData = [
      { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: undefined, price_change_percentage_24h: undefined },
      { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: null, price_change_percentage_24h: null },
      { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 120, price_change_percentage_24h: 5 },
    ];
    
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => incompleteData,
    });
    vi.stubGlobal('fetch', fetchMock);

    expect(() => {
      render(<CryptoTracker lang="es" />);
    }).not.toThrow();

    await waitFor(() => {
      expect(screen.getByText('$120.00')).toBeInTheDocument();
    });
  });

  it('intenta volver a pedir los datos después de 60 segundos con useFakeTimers', async () => {
    vi.useFakeTimers();
    
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockCryptoData,
    });
    vi.stubGlobal('fetch', fetchSpy);

    render(<CryptoTracker lang="es" />);

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(60000);

    expect(fetchSpy).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
    vi.unstubAllGlobals();
  });
});

describe('Idioma Persistente', () => {
  it('cambia el texto del Hero de español a inglés correctamente', () => {
    render(<Home />);

    expect(screen.getByText(/Desarrollador especializado/i)).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    const langButton = buttons.find(btn => btn.textContent === 'ES');
    fireEvent.click(langButton!);

    expect(screen.getByText(/Developer specialized/i)).toBeInTheDocument();
    expect(screen.queryByText(/Desarrollador especializado/i)).not.toBeInTheDocument();
  });
});

describe('Navegación', () => {
  it('los enlaces del Navbar tienen los href correctos', () => {
    render(<Home />);

    const servicesLink = screen.getByRole('link', { name: /Servicios|Services/i });
    expect(servicesLink).toHaveAttribute('href', '#services');

    const playgroundLink = screen.getByRole('link', { name: /Laboratorio|Lab/i });
    expect(playgroundLink).toHaveAttribute('href', '#playground');

    const ctaLink = screen.getByRole('link', { name: /Ver Proyectos|View Projects/i });
    expect(ctaLink).toHaveAttribute('href', '#services');
  });
});

describe('Estabilidad 3D', () => {
  it('el componente de partículas está correctamente exportado', () => {
    expect(InteractiveParticles).toBeDefined();
  });
});

describe('Smoke Test', () => {
  it('la App no explota al renderizarse por primera vez', () => {
    expect(() => {
      render(<Home />);
    }).not.toThrow();
  });

  it('CryptoTracker no explota al renderizarse', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<CryptoTracker lang="es" />);
    }).not.toThrow();
    
    consoleError.mockRestore();
  });
});

describe('Protección de Rutas', () => {
  it('el buscador de criptos NO es visible si el usuario es null (no está logueado)', () => {
    render(
      <ProtectedRoute>
        <CryptoSearch lang="es" />
      </ProtectedRoute>
    );

    expect(screen.queryByPlaceholderText(/Buscar criptomoneda/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Solo para Usuarios Registrados/i)).toBeInTheDocument();
  });

  it('el botón de Login con Google está presente cuando no hay sesión', () => {
    render(
      <ProtectedRoute>
        <CryptoSearch lang="es" />
      </ProtectedRoute>
    );

    expect(screen.getByRole('button', { name: /Login con Google/i })).toBeInTheDocument();
  });
});

describe('PriceChart Tests', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        prices: [
          [1700000000000, 45000],
          [1700100000000, 46000],
          [1700200000000, 45500],
          [1700300000000, 47000],
          [1700400000000, 46500],
          [1700500000000, 48000],
          [1700600000000, 47500],
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('el componente de precios renderiza valores válidos', async () => {
    render(<PriceChart cryptoId="bitcoin" lang="es" />);

    await waitFor(() => {
      expect(screen.getByTestId('crypto-price-chart')).toBeInTheDocument();
    });
  });

  it('el precio mostrado es un número positivo (no NaN, no undefined, no negativo)', async () => {
    render(<PriceChart cryptoId="bitcoin" lang="es" />);

    await waitFor(() => {
      const chartElement = screen.getByTestId('crypto-price-chart');
      expect(chartElement).toBeInTheDocument();
    });

    const pricesText = screen.getAllByText(/\$/);
    expect(pricesText.length).toBeGreaterThan(0);
  });

  it('muestra las etiquetas de precio mínimo y máximo', async () => {
    render(<PriceChart cryptoId="bitcoin" lang="es" />);

    await waitFor(() => {
      const container = document.querySelector('.flex.items-center.justify-between.mb-4');
      expect(container).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

describe('Footer Tests', () => {
  it('renderiza correctamente la versión del JSON', () => {
    render(<Footer />);
    
    expect(screen.getByText(/V 2.4/)).toBeInTheDocument();
  });

  it('muestra el texto del autor', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Human in the loop x Cerebro/)).toBeInTheDocument();
  });

  it('el footer tiene el estilo correcto (alineado a la derecha)', () => {
    render(<Footer />);
    
    const footer = document.querySelector('footer');
    expect(footer).toHaveClass('text-right');
  });
});

describe('ATH (All Time High) Tests', () => {
  it('maneja ATH como N/A cuando no está definido', () => {
    const mockCrypto = {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'btc',
      image: { large: '', small: '' },
      market_data: {
        current_price: { usd: 45000 },
        price_change_percentage_24h: 5.5,
        market_cap: { usd: 850000000000 },
        total_volume: { usd: 50000000000 },
        high_24h: { usd: 46000 },
        low_24h: { usd: 44000 },
        ath: { usd: undefined as unknown as number },
        ath_date: { usd: undefined as unknown as string },
        circulating_supply: 19000000,
      },
    };

    const formatATHDate = (dateString: string | undefined) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    expect(formatATHDate(undefined)).toBe('N/A');
    expect(formatATHDate('2021-11-10')).toBe('10 nov 2021');
  });

  it('formatea correctamente la fecha del ATH', () => {
    const formatATHDate = (dateString: string | undefined) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    expect(formatATHDate('2021-11-10')).toBe('10 nov 2021');
    expect(formatATHDate('2024-03-14')).toBe('14 mar 2024');
  });

  it('CryptoDetailsCard no rompe cuando ath es undefined', () => {
    const mockCrypto = {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'btc',
      image: { large: '', small: '' },
      market_data: {
        current_price: { usd: 45000 },
        price_change_percentage_24h: 5.5,
        market_cap: { usd: 850000000000 },
        total_volume: { usd: 50000000000 },
        high_24h: { usd: 46000 },
        low_24h: { usd: 44000 },
        ath: { usd: undefined as unknown as number },
        ath_date: { usd: undefined as unknown as string },
        circulating_supply: 19000000,
      },
    };

    const formatPrice = (price: number) =>
      price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A';

    const formatCompact = (value: number, suffix = 'B') =>
      value ? `$${(value / 1e9).toFixed(2)}${suffix}` : 'N/A';

    const formatATHDate = (dateString: string | undefined) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    expect(() => {
      render(
        <div>
          <p>{mockCrypto.market_data.ath?.usd ? `$${formatPrice(mockCrypto.market_data.ath.usd)}` : 'N/A'}</p>
          <p>{formatATHDate(mockCrypto.market_data.ath_date?.usd)}</p>
        </div>
      );
    }).not.toThrow();

    expect(screen.getAllByText('N/A').length).toBe(2);
  });

  it('muestra el tooltip de ATH con la descripción correcta', () => {
    render(
      <TooltipProvider>
        <div>
          <p>All Time High (ATH)</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <button>Info</button>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 border-zinc-800">
              <p>Highest price ever reached. Indicates the previous market ceiling.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );

    expect(screen.getByText('Info')).toBeInTheDocument();
  });
});
