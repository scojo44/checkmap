import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
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

describe('EditListForm Tests', () => {
  beforeEach(() => {
    mockUpdateList.mockClear();
  });

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

  it('Calls the passed function with the submitted values', async () => {
    const {getByText, getByLabelText} = render(
      <MemoryRouter>
        <EditListForm list={list} updateList={mockUpdateList} />
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
