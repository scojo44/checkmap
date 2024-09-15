import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import ModalBox from './ModalBox'
import Modal from 'react-modal';


describe('ModalBox Tests', () => {
  // React-Modal expects a top-level element with ID of 'root' for accessibility
  // Adding a <div id="root"> around the <ModalBox> doesn't work.
  Modal.setAppElement = vi.fn();

  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <ModalBox element={<h1>Test</h1>}/>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
          <ModalBox element={<h1>Test</h1>}/>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
