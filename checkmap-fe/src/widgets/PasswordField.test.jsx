import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import PasswordField from './PasswordField'

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

describe('PasswordField Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <PasswordField name="password" label="Password" register={fakeRegister} errors={fakeErrors}/>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <PasswordField name="password" label="Password" register={fakeRegister} errors={fakeErrors}/>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
