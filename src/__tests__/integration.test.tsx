import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import CryptoTracker from '@/components/CryptoTracker';
import InteractiveParticles from '@/components/InteractiveParticles';

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

describe('CryptoTracker Tests', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockCryptoData,
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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
