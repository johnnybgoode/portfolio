import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Box } from '../../components/ui/Box';
import { render } from '../utils/render';

describe('Box', () => {
  it('renders as paragraph element', async () => {
    render(
      <Box as="p" display="block">
        Cool content
      </Box>,
    );
    const element = await screen.findByRole('paragraph');
    expect(element).toHaveAttribute(
      'class',
      expect.stringContaining('sprinkles_display_block'),
    );
    screen.logTestingPlaygroundURL();
  });
  it('renders as link element', async () => {
    render(
      <Box as="a" color="sun" href="https://my-cool-site.com">
        Cool website
      </Box>,
    );
    const element = await screen.findByRole('link');
    expect(element).toHaveAttribute(
      'class',
      expect.stringContaining('sprinkles_color_sun'),
    );
  });
});
