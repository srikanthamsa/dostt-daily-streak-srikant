import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from './src/App.jsx';

describe('App', () => {
  it('should not crash when opening the box', async () => {
    const { container } = render(<App />);
    
    // Find the button
    const btn = screen.getByText('Open Box');
    expect(btn).toBeDefined();

    // Click it
    fireEvent.click(btn);

    // Wait for the state update (timeout is 1200ms)
    await waitFor(() => {
      expect(screen.getByText('Awesome!')).toBeDefined();
    }, { timeout: 2000 });

    // Ensure it didn't unmount or throw
    expect(screen.getByText('Awesome!')).toBeDefined();
  });
});
