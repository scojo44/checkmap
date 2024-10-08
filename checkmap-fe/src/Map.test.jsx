import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import ReactModal from 'react-modal'
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
  // React-Modal expects a top-level element with ID of 'root' for accessibility
  // Adding a <div id="root"> around the <ModalOutlet> doesn't work.
  ReactModal.setAppElement = vi.fn();

  it('Renders without crashing', async () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <Map/>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(1).toBe(1));
  });

  it('Matches snapshot', async () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <Map/>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });
});
