import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuoteCalculator from './QuoteCalculator';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('QuoteCalculator', () => {
  it('should render the quote calculator', () => {
    render(<QuoteCalculator />);
    expect(screen.getByRole('heading', { name: /Instant Migration.*Quote Calculator/i })).toBeInTheDocument();
    expect(screen.getByText(/Upload your workflow JSON files/i)).toBeInTheDocument();
  });

  it('should display uploaded files', async () => {
    const user = userEvent.setup();
    render(<QuoteCalculator />);
    
    const file = new File(['{"nodes": [{"id": "1"}, {"id": "2"}]}'], 'workflow.json', {
      type: 'application/json',
    });
    
    const input = screen.getByLabelText(/Choose Files/i);
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByText('workflow.json')).toBeInTheDocument();
    });
  });

  it('should calculate migration cost', async () => {
    const user = userEvent.setup();
    render(<QuoteCalculator />);
    
    const file = new File(['{"nodes": [{"id": "1"}, {"id": "2"}]}'], 'workflow.json', {
      type: 'application/json',
    });
    
    const input = screen.getByLabelText(/Choose Files/i);
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByText('Total Nodes Detected:')).toBeInTheDocument();
    });
    
    const calculateButton = screen.getByRole('button', { name: /Calculate Migration Cost/i });
    await user.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Your Migration Quote/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should enforce minimum price of $200', async () => {
    const user = userEvent.setup();
    render(<QuoteCalculator />);
    
    // Upload file with only 1 node
    const file = new File(['{"nodes": [{"id": "1"}]}'], 'small.json', {
      type: 'application/json',
    });
    
    const input = screen.getByLabelText(/Choose Files/i);
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(screen.getByText('Total Nodes Detected:')).toBeInTheDocument();
    });
    
    const calculateButton = screen.getByRole('button', { name: /Calculate Migration Cost/i });
    await user.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText('$200')).toBeInTheDocument(); // Minimum price
    }, { timeout: 3000 });
  });

  it('should reject invalid file types', async () => {
    const user = userEvent.setup();
    const { container } = render(<QuoteCalculator />);
    
    const file = new File(['not json'], 'test.txt', {
      type: 'text/plain',
    });
    
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);
    
    // File should not be added to the list
    expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
  });
});