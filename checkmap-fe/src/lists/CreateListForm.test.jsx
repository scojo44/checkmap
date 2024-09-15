import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserContext from '../UserContext'
import CreateListForm from './CreateListForm'

const user = {
  username: 'testuser',
  imageURL: 'u1.jpeg',
  role: 'User',
  lists: []
}
const context = {
  user,
  setCurrentList: x => x,
  showAlert: x => x
};

describe('CreateListForm Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <CreateListForm />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <CreateListForm />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
