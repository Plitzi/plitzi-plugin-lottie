// Packages
import React from 'react';
import { render } from '@testing-library/react';
import { PlitziServiceProvider } from '@plitzi/plitzi-sdk';

// Relatives
import Demo from './Demo';

describe('Demo', () => {
  it('should render successfully', () => {
    const ref = { current: null };

    const BaseElement = render(
      <PlitziServiceProvider value={{ settings: { previewMode: true } }}>
        <Demo ref={ref} />
      </PlitziServiceProvider>
    );

    expect(BaseElement).toBeTruthy();
  });
});
