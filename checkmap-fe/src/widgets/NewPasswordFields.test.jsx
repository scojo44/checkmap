import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import NewPasswordFields from './NewPasswordFields'

describe('NewPasswordFields Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <NewPasswordFields name="password" label="Password" register={x => x} errors={{test: {message: 'test message'}}}/>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <NewPasswordFields name="password" label="Password" register={x => x} errors={{test: {message: 'test message'}}}/>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
