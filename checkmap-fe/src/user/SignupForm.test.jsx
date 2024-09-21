import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import SignupForm from './SignupForm'

const mockSignup = vi.fn();

describe('SignupForm Tests', () => {
  beforeEach(() => {
    mockSignup.mockClear();
  });

  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('Calls the passed function with the submitted values', async () => {
    const {getByText, getByLabelText} = render(
      <MemoryRouter>
        <SignupForm signup={mockSignup}/>
      </MemoryRouter>
    );

    const username = getByLabelText('Username:');
    const password = getByLabelText('Password:');
    const confirm = getByLabelText('Confirm Password:');
    const imageURL = getByLabelText('Image URL (optional):');
    const button = getByText('Sign up');

    fireEvent.change(username, {target: {value: 'testuser'}});
    fireEvent.change(password, {target: {value: 'secret123'}});
    fireEvent.change(confirm, {target: {value: 'secret123'}});
    fireEvent.change(imageURL, {target: {value: 'testuser.jpeg'}});
    fireEvent.click(button);

    await waitFor(() => expect(mockSignup).toHaveBeenCalled());
    await waitFor(() => expect(mockSignup).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'secret123',
      confirm: 'secret123',
      imageURL: 'testuser.jpeg'
    }));
  });

  it('Does not call the passed function when confirm does not match password', async () => {
    const {getByText, getByLabelText} = render(
      <MemoryRouter>
        <SignupForm signup={mockSignup}/>
      </MemoryRouter>
    );

    const username = getByLabelText('Username:');
    const password = getByLabelText('Password:');
    const confirm = getByLabelText('Confirm Password:');
    const imageURL = getByLabelText('Image URL (optional):');
    const button = getByText('Sign up');

    fireEvent.change(username, {target: {value: 'testuser'}});
    fireEvent.change(password, {target: {value: 'secret123'}});
    fireEvent.change(confirm, {target: {value: 'secret456'}});
    fireEvent.change(imageURL, {target: {value: 'testuser.jpeg'}});
    fireEvent.click(button);

    await waitFor(() => expect(mockSignup).not.toHaveBeenCalled());
  });
});
