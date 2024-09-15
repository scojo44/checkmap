import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserContext from './UserContext'
import UserRoutes from './UserRoutes'

const list = {
  id: 1,
  name: 'Test List 1a',
  description: 'This is a test list.',
  color: '#0000FF',
  regionType: 'State',
  ownerName: 'u1',
  states: [],
  counties: []
}
const user = {
  username: 'testuser',
  imageURL: 'u1.jpeg',
  role: 'User',
  lists: [list]
}
const context = {
  user,
  currentList: list,
  setCurrentList: x => x,
  showAlert: x => x
};

describe('UserRoutes Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <UserRoutes />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <UserRoutes />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
