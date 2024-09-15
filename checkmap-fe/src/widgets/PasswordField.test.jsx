import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import PasswordField from './PasswordField'

describe('PasswordField Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <PasswordField name="password" label="Password" register={x => x} errors={{test: {message: 'test message'}}}/>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <PasswordField name="password" label="Password" register={x => x} errors={{test: {message: 'test message'}}}/>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
