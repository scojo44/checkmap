import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import FormField from './FormField'

const fakeRegister = vi.fn((name, options) => {
  return {
    name,
    onChange: x => x,
    onBlur: x => x
  }
});

const fakeErrors = {
  test: {message: 'test message'}
}

describe('FormField Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <FormField name="test" label="Test Label" register={fakeRegister} errors={fakeErrors}/>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <FormField name="test" label="Test Label" register={fakeRegister} errors={fakeErrors}/>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
