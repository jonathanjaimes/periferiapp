import React from 'react';
import { render } from '@testing-library/react-native';
import ModalGeofenceForm from '../../../src/presentation/components/ModalGeofenceForm';
import { Location } from '../../../src/domain/models/Location';

// Mock del hook useGeofenceForm
const mockUseGeofenceForm = {
  latitude: '40.7128',
  setLatitude: jest.fn(),
  longitude: '-74.0060',
  setLongitude: jest.fn(),
  radius: '100',
  setRadius: jest.fn(),
  name: 'Test Geofence',
  setName: jest.fn(),
  id: 'test-id',
  useCurrentLocation: false,
  setUseCurrentLocation: jest.fn(),
  reset: jest.fn(),
};

jest.mock('../../../src/hooks/useGeofenceForm', () => ({
  useGeofenceForm: () => mockUseGeofenceForm,
}));

// Mock del CustomButton
jest.mock('../../../src/presentation/components/CustomButton', () => 'CustomButton');

describe('ModalGeofenceForm', () => {
  const mockProps = {
    onClose: jest.fn(),
    updateGeofence: jest.fn(),
    currentLocation: { latitude: 40.7128, longitude: -74.0060 } as Location,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form title', () => {
    const { getByText } = render(<ModalGeofenceForm {...mockProps} />);
    
    expect(getByText('Ingresa los datos de la geocerca:')).toBeTruthy();
  });

  it('should render all input fields with correct values', () => {
    const { getByDisplayValue, getByText } = render(<ModalGeofenceForm {...mockProps} />);
    
    expect(getByDisplayValue('40.7128')).toBeTruthy(); // Latitud
    expect(getByDisplayValue('-74.0060')).toBeTruthy(); // Longitud
    expect(getByDisplayValue('100')).toBeTruthy(); // Radio
    expect(getByDisplayValue('Test Geofence')).toBeTruthy(); // Nombre
    expect(getByText('Usar ubicación actual')).toBeTruthy(); // Switch label
  });

  it('should render input placeholders', () => {
    const { getByPlaceholderText } = render(<ModalGeofenceForm {...mockProps} />);
    
    expect(getByPlaceholderText('Latitud')).toBeTruthy();
    expect(getByPlaceholderText('Longitud')).toBeTruthy();
    expect(getByPlaceholderText('Radio')).toBeTruthy();
    expect(getByPlaceholderText('Nombre')).toBeTruthy();
  });

  it('should call setLatitude when latitude input changes', () => {
    const { getByPlaceholderText } = render(<ModalGeofenceForm {...mockProps} />);
    
    const latitudeInput = getByPlaceholderText('Latitud');
    latitudeInput.props.onChangeText('41.0000');
    
    expect(mockUseGeofenceForm.setLatitude).toHaveBeenCalledWith('41.0000');
  });

  it('should call setLongitude when longitude input changes', () => {
    const { getByPlaceholderText } = render(<ModalGeofenceForm {...mockProps} />);
    
    const longitudeInput = getByPlaceholderText('Longitud');
    longitudeInput.props.onChangeText('-75.0000');
    
    expect(mockUseGeofenceForm.setLongitude).toHaveBeenCalledWith('-75.0000');
  });

  it('should call setRadius when radius input changes', () => {
    const { getByPlaceholderText } = render(<ModalGeofenceForm {...mockProps} />);
    
    const radiusInput = getByPlaceholderText('Radio');
    radiusInput.props.onChangeText('200');
    
    expect(mockUseGeofenceForm.setRadius).toHaveBeenCalledWith('200');
  });

  it('should call setName when name input changes', () => {
    const { getByPlaceholderText } = render(<ModalGeofenceForm {...mockProps} />);
    
    const nameInput = getByPlaceholderText('Nombre');
    nameInput.props.onChangeText('New Name');
    
    expect(mockUseGeofenceForm.setName).toHaveBeenCalledWith('New Name');
  });

  it('should call setUseCurrentLocation when switch changes', () => {
    const { UNSAFE_getByType } = render(<ModalGeofenceForm {...mockProps} />);
    
    const switchComponent = UNSAFE_getByType(require('react-native').Switch);
    switchComponent.props.onValueChange(true);
    
    expect(mockUseGeofenceForm.setUseCurrentLocation).toHaveBeenCalledWith(true);
  });

  it('should have correct switch configuration', () => {
    const { UNSAFE_getByType } = render(<ModalGeofenceForm {...mockProps} />);
    
    const switchComponent = UNSAFE_getByType(require('react-native').Switch);
    
    expect(switchComponent.props.value).toBe(false);
    expect(switchComponent.props.trackColor).toEqual({ false: '#ccc', true: '#52c934' });
    expect(switchComponent.props.thumbColor).toBe('#fff');
  });

  it('should render Cancelar and Guardar buttons', () => {
    const { UNSAFE_getAllByType } = render(<ModalGeofenceForm {...mockProps} />);
    
    const buttons = UNSAFE_getAllByType('CustomButton' as any);
    
    expect(buttons).toHaveLength(2);
    expect(buttons[0].props.title).toBe('Cancelar');
    expect(buttons[1].props.title).toBe('Guardar');
  });

  it('should call reset and onClose when Cancelar is pressed', () => {
    const { UNSAFE_getAllByType } = render(<ModalGeofenceForm {...mockProps} />);
    
    const buttons = UNSAFE_getAllByType('CustomButton' as any);
    const cancelButton = buttons[0];
    
    cancelButton.props.onPress();
    
    expect(mockUseGeofenceForm.reset).toHaveBeenCalled();
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('should call updateGeofence and onClose when Guardar is pressed', () => {
    const { UNSAFE_getAllByType } = render(<ModalGeofenceForm {...mockProps} />);
    
    const buttons = UNSAFE_getAllByType('CustomButton' as any);
    const saveButton = buttons[1];
    
    saveButton.props.onPress();
    
    expect(mockProps.updateGeofence).toHaveBeenCalledWith({
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100,
      name: 'Test Geofence',
      id: 'test-id',
    });
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('should work with null currentLocation', () => {
    const { getByText } = render(
      <ModalGeofenceForm {...mockProps} currentLocation={null} />
    );
    
    expect(getByText('Ingresa los datos de la geocerca:')).toBeTruthy();
  });

  it('should have numeric keyboard type for coordinate inputs', () => {
    const { getByPlaceholderText } = render(<ModalGeofenceForm {...mockProps} />);
    
    const latitudeInput = getByPlaceholderText('Latitud');
    const longitudeInput = getByPlaceholderText('Longitud');
    const radiusInput = getByPlaceholderText('Radio');
    
    expect(latitudeInput.props.keyboardType).toBe('numeric');
    expect(longitudeInput.props.keyboardType).toBe('numeric');
    expect(radiusInput.props.keyboardType).toBe('numeric');
  });

  it('should have correct placeholder text color', () => {
    const { getByPlaceholderText } = render(<ModalGeofenceForm {...mockProps} />);
    
    const latitudeInput = getByPlaceholderText('Latitud');
    
    expect(latitudeInput.props.placeholderTextColor).toBe('#888');
  });

  it('should handle switch with useCurrentLocation true', () => {
    // Modificar el mock directamente
    mockUseGeofenceForm.useCurrentLocation = true;
    
    const { UNSAFE_getByType } = render(<ModalGeofenceForm {...mockProps} />);
    
    const switchComponent = UNSAFE_getByType(require('react-native').Switch);
    
    expect(switchComponent.props.value).toBe(true);
    
    // Restaurar el valor original
    mockUseGeofenceForm.useCurrentLocation = false;
  });

  it('should convert string values to numbers when saving', () => {
    // Modificar el mock directamente con valores string
    const originalValues = {
      latitude: mockUseGeofenceForm.latitude,
      longitude: mockUseGeofenceForm.longitude,
      radius: mockUseGeofenceForm.radius,
    };
    
    mockUseGeofenceForm.latitude = '41.5';
    mockUseGeofenceForm.longitude = '-73.8';
    mockUseGeofenceForm.radius = '150';
    
    const { UNSAFE_getAllByType } = render(<ModalGeofenceForm {...mockProps} />);
    
    const buttons = UNSAFE_getAllByType('CustomButton' as any);
    const saveButton = buttons[1];
    
    saveButton.props.onPress();
    
    expect(mockProps.updateGeofence).toHaveBeenCalledWith({
      latitude: 41.5,
      longitude: -73.8,
      radius: 150,
      name: 'Test Geofence',
      id: 'test-id',
    });
    
    // Restaurar valores originales
    mockUseGeofenceForm.latitude = originalValues.latitude;
    mockUseGeofenceForm.longitude = originalValues.longitude;
    mockUseGeofenceForm.radius = originalValues.radius;
  });
});
