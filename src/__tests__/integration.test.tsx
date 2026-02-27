import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '@/app/page';

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
