import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import ReactModal from 'react-modal';
import App from './App'

describe('App Tests', () => {
  // React-Modal expects a top-level element with ID of 'root' for accessibility
  // Adding a <div id="root"> around the <ModalOutlet> doesn't work.
  ReactModal.setAppElement = vi.fn();

  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
