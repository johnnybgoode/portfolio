import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TypeWriter } from '../../components/ui/TypeWriter';
import { render } from '../utils/render';

describe('TypeWriter', () => {
  const mockTextItems = ['Hello', 'World', 'Test'];

  const defaultProps = {
    textItems: mockTextItems,
    typingSpeed: 10,
    typingDelay: 10,
  };

  let rafCallbacks: Array<FrameRequestCallback> = [];
  let rafId = 0;
  let mockNow = 0;

  beforeEach(() => {
    rafCallbacks = [];
    rafId = 0;
    mockNow = 0;

    // Mock Date.now to control time precisely
    vi.spyOn(Date, 'now').mockImplementation(() => mockNow);

    vi.spyOn(global, 'requestAnimationFrame').mockImplementation(cb => {
      rafCallbacks.push(cb);
      return ++rafId;
    });

    vi.spyOn(global, 'cancelAnimationFrame').mockImplementation(() => {
      rafCallbacks.pop();
    });
  });

  const advanceAnimation = async (ms: number) => {
    const endTime = mockNow + ms;
    while (mockNow < endTime) {
      mockNow = Math.min(mockNow + 16, endTime);
      if (rafCallbacks.length > 0) {
        const cb = rafCallbacks.pop()!;
        rafCallbacks = [];
        await act(async () => {
          cb(mockNow);
        });
      }
    }
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should type the first characters without skipping', async () => {
    render(<TypeWriter {...defaultProps} />);

    await advanceAnimation(defaultProps.typingSpeed);

    await screen.findByText(/> H/);
  });

  it('should type all characters of first text without skipping', async () => {
    render(<TypeWriter {...defaultProps} />);

    await advanceAnimation(10);
    await screen.findByText(/> H/);

    await advanceAnimation(10);
    await screen.findByText(/> He/);

    await advanceAnimation(10);
    await screen.findByText(/> Hel/);

    await advanceAnimation(10);
    await screen.findByText(/> Hell/);

    await advanceAnimation(10);
    await screen.findByText(/> Hello/);
  });

  it('should cycle through all text items and maintain character integrity', async () => {
    render(<TypeWriter {...defaultProps} />);

    await advanceAnimation(100);
    await screen.findByText(/> Hello/);

    await advanceAnimation(70);
    let lastMessage = screen.queryByText(/Hello/);
    expect(lastMessage).not.toBeInTheDocument();

    await advanceAnimation(100);
    await screen.findByText(/> World/);

    await advanceAnimation(70);
    lastMessage = screen.queryByText(/World/);
    expect(lastMessage).not.toBeInTheDocument();

    await advanceAnimation(100);
    await screen.findByText(/> Test/);
  });

  it('should render cursor element', async () => {
    render(<TypeWriter {...defaultProps} />);
    screen.getByText('_');
  });
});
