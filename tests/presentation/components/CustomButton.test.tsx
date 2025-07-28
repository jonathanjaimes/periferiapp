import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../../../src/presentation/components/CustomButton';

describe('CustomButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with title', () => {
    const { getByText } = render(
      <CustomButton title="Test Button" onPress={mockOnPress} />
    );
    
    const buttonText = getByText('Test Button');
    expect(buttonText).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const { getByText } = render(
      <CustomButton title="Test Button" onPress={mockOnPress} />
    );
    
    const button = getByText('Test Button');
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const { getByText, UNSAFE_getByType } = render(
      <CustomButton title="Disabled Button" onPress={mockOnPress} disabled={true} />
    );
    
    const touchableOpacity = UNSAFE_getByType(require('react-native').TouchableOpacity);
    const buttonText = getByText('Disabled Button');
    
    // Verificar que el TouchableOpacity tiene la prop disabled
    expect(touchableOpacity.props.disabled).toBe(true);
    
    // Verificar que el texto se renderiza correctamente
    expect(buttonText).toBeTruthy();
    
    // Intentar presionar el botón deshabilitado
    fireEvent.press(buttonText);
    
    // El onPress no debería ser llamado
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should apply custom styles', () => {
    const customButtonStyle = { backgroundColor: 'red', borderRadius: 10 };
    const customTextStyle = { fontSize: 20, color: 'yellow' };
    
    const { getByText, UNSAFE_getByType } = render(
      <CustomButton 
        title="Styled Button" 
        onPress={mockOnPress} 
        style={customButtonStyle}
        textStyle={customTextStyle}
      />
    );
    
    const touchableOpacity = UNSAFE_getByType(require('react-native').TouchableOpacity);
    const text = UNSAFE_getByType(require('react-native').Text);
    
    // Verificar que los estilos personalizados se aplican al TouchableOpacity
    expect(touchableOpacity.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customButtonStyle)
      ])
    );
    
    // Verificar que los estilos personalizados se aplican al Text
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(customTextStyle)
      ])
    );
  });

  it('should have correct TouchableOpacity properties', () => {
    const { UNSAFE_getByType } = render(
      <CustomButton title="Test Button" onPress={mockOnPress} />
    );
    
    const touchableOpacity = UNSAFE_getByType(require('react-native').TouchableOpacity);
    
    // Verificar propiedades del TouchableOpacity
    expect(touchableOpacity.props.activeOpacity).toBe(0.7);
    expect(touchableOpacity.props.disabled).toBe(undefined); // No está deshabilitado por defecto
    expect(touchableOpacity.props.onPress).toBe(mockOnPress);
  });

  it('should apply disabled styles when disabled', () => {
    const { UNSAFE_getByType } = render(
      <CustomButton title="Disabled Button" onPress={mockOnPress} disabled={true} />
    );
    
    const touchableOpacity = UNSAFE_getByType(require('react-native').TouchableOpacity);
    
    // Verificar que se aplican los estilos de deshabilitado
    expect(touchableOpacity.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#bbb' }) // Estilo disabled real
      ])
    );
  });

  it('should render with default styles when no custom styles provided', () => {
    const { UNSAFE_getByType } = render(
      <CustomButton title="Default Button" onPress={mockOnPress} />
    );
    
    const touchableOpacity = UNSAFE_getByType(require('react-native').TouchableOpacity);
    const text = UNSAFE_getByType(require('react-native').Text);
    
    // Verificar estilos por defecto del botón
    expect(touchableOpacity.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: '#007AFF',
          paddingVertical: 12,
          paddingHorizontal: 28,
          borderRadius: 20
        })
      ])
    );
    
    // Verificar estilos por defecto del texto
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: '#fff',
          fontSize: 16,
          fontWeight: 'light' // Corregido: el estilo real es 'light'
        })
      ])
    );
  });
});
