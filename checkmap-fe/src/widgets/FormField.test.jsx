import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import FormField from './FormField'

describe('FormField Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <FormField name="test" label="Test Label" register={x => x} errors={{test: {message: 'test message'}}}/>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <FormField name="test" label="Test Label" register={x => x} errors={{test: {message: 'test message'}}}/>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
