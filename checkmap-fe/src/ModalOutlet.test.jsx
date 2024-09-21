import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import ReactModal from 'react-modal';
import ModalOutlet from './ModalOutlet'

describe('ModalOutlet Tests', () => {
  // React-Modal expects a top-level element with ID of 'root' for accessibility
  // Adding a <div id="root"> around the <ModalOutlet> doesn't work.
  ReactModal.setAppElement = vi.fn();

  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <ModalOutlet/>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <ModalOutlet/>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
