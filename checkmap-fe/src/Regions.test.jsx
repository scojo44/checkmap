import {render, waitFor} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import CheckMapAPI from './api'
import UserContext from './UserContext'
import Regions from './Regions'
import { MapContainer } from 'react-leaflet'

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

describe('Regions Tests', () => {
  CheckMapAPI.getRegions = vi.fn(() => [
    {
      "id": 56,
      "name": "Test State",
      "boundary": {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [-111.044893000417, 43.3157190000423],
              [-111.046540000405, 43.9141070000882],
              [-111.047348999794, 43.9999210000068],
              [-111.044893000417, 43.3157190000423]
            ]
          ]
        },
        "properties": {
          "gid": 9,
          "oid": "-1857883199",
          "name": "Test State",
          "geoid": "56",
          "lsadc": "00",
          "mtfcc": "G4000",
          "state": "56",
          "region": 4,
          "stusab": "TS",
          "centlat": 42.9960991,
          "centlon": -107.5514552,
          "statens": "01779807",
          "arealand": "-1938121641",
          "basename": "Test State",
          "division": 8,
          "funcstat": "A",
          "intptlat": 42.9918024,
          "intptlon": -107.5419255,
          "objectid": 31,
          "areawater": "1861259579",
          "geo_point_2d": {
            "lat": 42.9995710878,
            "lon": -107.551330644
          }
        }
      }
    }
  ]);

  it('Renders without crashing', async () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <MapContainer>
            <Regions/>
          </MapContainer>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(1).toBe(1));
  });

  it('Matches snapshot', async () => {
    const {asFragment} = render(
      <MemoryRouter>
        <UserContext.Provider value={context}>
          <MapContainer>
            <Regions/>
          </MapContainer>
        </UserContext.Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });
});
