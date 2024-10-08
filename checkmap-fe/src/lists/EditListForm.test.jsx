import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserContext from '../UserContext';
import EditListForm from './EditListForm'

const mockUpdateList = vi.fn();
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
  SITE_NAME: 'CheckMap'
};

describe('EditListForm Tests', () => {
  beforeEach(() => {
    mockUpdateList.mockClear();
  });

  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <EditListForm list={list} />
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <EditListForm list={list} />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('Calls the passed function with the submitted values', async () => {
    const {getByText, getByLabelText} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <EditListForm list={list} updateList={mockUpdateList} />
        </UserContext.Provider>
      </MemoryRouter>
    );

    const listName = getByLabelText('Name:');
    const listDesc = getByLabelText('Description (optional):');
    const listColor = getByLabelText('Fill Color:');
    const button = getByText('Save');

    fireEvent.change(listName, {target: {value: 'Updated Test List'}});
    fireEvent.change(listDesc, {target: {value: 'This test description was updated'}});
    fireEvent.change(listColor, {target: {value: '#6495ed'}});
    fireEvent.click(button);

    await waitFor(() => expect(mockUpdateList).toHaveBeenCalled());
    await waitFor(() => expect(mockUpdateList).toHaveBeenCalledWith({
      name: 'Updated Test List',
      description: 'This test description was updated',
      color: '#6495ed'
    }));
  });
});
