import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserContext from '../UserContext'
import ProfileForm from './ProfileForm'

const mockUpdateUser = vi.fn();
const context = {
  user: {
    username: 'testuser',
    imageURL: 'u1.jpeg',
    role: 'User',
    lists: []
  }
};

describe('ProfileForm Tests', () => {
  beforeEach(() => {
    mockUpdateUser.mockClear();
  });

  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <ProfileForm />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <ProfileForm />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('Calls the passed function with the submitted values', async () => {
    const {getByText, getByLabelText} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <ProfileForm updateUser={mockUpdateUser}/>
        </UserContext.Provider>
      </MemoryRouter>
    );

    const imageURL = getByLabelText('Image URL (optional):');
    const password = getByLabelText('New Password (leave blank to not change):');
    const confirm = getByLabelText('Confirm Password:');
    const button = getByText('Save');

    fireEvent.change(imageURL, {target: {value: 'testuser.jpeg'}});
    fireEvent.change(password, {target: {value: 'secret123'}});
    fireEvent.change(confirm, {target: {value: 'secret123'}});
    fireEvent.click(button);

    await waitFor(() => expect(mockUpdateUser).toHaveBeenCalled());
    await waitFor(() => expect(mockUpdateUser).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'secret123',
      confirm: 'secret123',
      imageURL: 'testuser.jpeg'
    }));
  });

  it('Does not call the passed function when confirm does not match password', async () => {
    const {getByText, getByLabelText, container} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <ProfileForm updateUser={mockUpdateUser}/>
        </UserContext.Provider>
      </MemoryRouter>
    );

    const imageURL = getByLabelText('Image URL (optional):');
    const password = getByLabelText('New Password (leave blank to not change):');
    const confirm = getByLabelText('Confirm Password:');
    const button = getByText('Save');

    fireEvent.change(imageURL, {target: {value: 'testuser.jpeg'}});
    fireEvent.change(password, {target: {value: 'secret123'}});
    fireEvent.change(confirm, {target: {value: 'secret456'}});
    fireEvent.click(button);

    await waitFor(() => expect(mockUpdateUser).not.toHaveBeenCalled());
  });
});
