import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import EditListForm from './EditListForm'

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

describe('EditListForm Tests', () => {
  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <EditListForm list={list} />
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <EditListForm list={list} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
