import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserContext from './UserContext'
import Map from './Map'

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
const context = {
  currentList: list,
  setCurrentList: x => x,
  showAlert: x => x
};

describe('Map Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <Map />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <Map />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
