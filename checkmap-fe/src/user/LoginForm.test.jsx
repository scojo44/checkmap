import {render,fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import LoginForm from './LoginForm'

const mockLogin = vi.fn();

describe('LoginForm Tests', () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('Calls the passed function with the submitted values', async () => {
    const {getByText, getByLabelText} = render(
      <MemoryRouter>
        <LoginForm login={mockLogin}/>
      </MemoryRouter>
    );

    const username = getByLabelText('Username:');
    const password = getByLabelText('Password:');
    const button = getByText('Log in');

    fireEvent.change(username, {target: {value: 'testuser'}});
    fireEvent.change(password, {target: {value: 'secret123'}});
    fireEvent.click(button);

    await waitFor(() => expect(mockLogin).toHaveBeenCalled());
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'secret123'
    }));
  });
});
