import { act, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TypeWriter } from '../../components/TypeWriter';
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

  /**
   * Helper to advance time and trigger animation frames.
   * Simulates the passage of time while firing rAF callbacks.
   * We need to flush React updates between frames to ensure state is consistent.
   */
  const advanceAnimation = async (ms: number) => {
    const endTime = mockNow + ms;
    // Fire frames at ~16ms intervals (60fps)
    while (mockNow < endTime) {
      mockNow = Math.min(mockNow + 16, endTime);
      // console.log(`ADVANCING: ${mockNow}, cbs: ${rafCallbacks.length}` )
      // Execute only ONE callback per frame (LIFO)
      // This matches browser behavior where only one rAF fires per frame
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

    // Type "Hello" (5 chars)
    // Each character needs typingSpeed (10ms) to elapse.
    // At 16ms per frame, each frame types one character.
    // Need 5 frames minimum: 5 * 16 = 80ms
    await advanceAnimation(100);
    await screen.findByText(/> Hello/);

    // Delete "Hello" (5 chars at 2x speed = 5ms each) + delay (10ms)
    // Total: 25ms + 10ms = 35ms, use 70ms to be safe
    await advanceAnimation(70);
    let lastMessage = screen.queryByText(/Hello/);
    expect(lastMessage).not.toBeInTheDocument();

    // Type "World" (5 chars)
    await advanceAnimation(100);
    await screen.findByText(/> World/);

    await advanceAnimation(70);
    lastMessage = screen.queryByText(/World/);
    expect(lastMessage).not.toBeInTheDocument();

    // Type "Test"
    await advanceAnimation(100);
    await screen.findByText(/> Test/);
  });

  it('should render cursor element', async () => {
    render(<TypeWriter {...defaultProps} />);
    screen.getByText('_');
  });
});
