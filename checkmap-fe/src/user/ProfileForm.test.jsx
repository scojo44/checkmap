import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserContext from '../UserContext'
import ProfileForm from './ProfileForm'

const context = {
  user: {
    username: 'testuser',
    imageURL: 'u1.jpeg',
    role: 'User',
    lists: []
  }
};

describe('ProfileForm Tests', () => {
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
});
