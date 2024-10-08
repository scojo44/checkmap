import {render, fireEvent, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import UserContext from '../UserContext';
import CreateListForm from './CreateListForm'

const mockAddList = vi.fn();
const context = {
  SITE_NAME: 'CheckMap'
};

describe('CreateListForm Tests', () => {
  beforeEach(() => {
    mockAddList.mockClear();
  });

  it('Renders without crashing', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <CreateListForm/>
        </UserContext.Provider>
      </MemoryRouter>
    );
  });

  it('Matches snapshot', () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <CreateListForm/>
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('Calls the passed function with the submitted values', async () => {
    const {getByText, getByLabelText} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <CreateListForm addNewList={mockAddList}/>
        </UserContext.Provider>
      </MemoryRouter>
    );

    const listName = getByLabelText('Name:');
    const listDesc = getByLabelText('Description (optional):');
    const listType = getByLabelText('Region Type:');
    const listColor = getByLabelText('Fill Color:');
    const button = getByText('Submit');

    fireEvent.change(listName, {target: {value: 'New Test List'}});
    fireEvent.change(listDesc, {target: {value: 'Test description'}});
    fireEvent.change(listType, {target: {value: 'County'}});
    fireEvent.change(listColor, {target: {value: '#9370db'}});
    fireEvent.click(button);

    await waitFor(() => expect(mockAddList).toHaveBeenCalled());
    await waitFor(() => expect(mockAddList).toHaveBeenCalledWith({
      name: 'New Test List',
      description: 'Test description',
      regionType: 'County',
      color: '#9370db'
    }));
  });
});
