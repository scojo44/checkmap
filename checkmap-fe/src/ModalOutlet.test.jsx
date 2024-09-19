import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import ModalOutlet from './ModalOutlet'
import Modal from 'react-modal';


describe('ModalOutlet Tests', () => {
  // React-Modal expects a top-level element with ID of 'root' for accessibility
  // Adding a <div id="root"> around the <ModalOutlet> doesn't work.
  Modal.setAppElement = vi.fn();

  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <ModalOutlet element={<h1>Test</h1>}/>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
          <ModalOutlet element={<h1>Test</h1>}/>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});