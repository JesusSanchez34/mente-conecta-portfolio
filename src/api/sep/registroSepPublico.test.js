import {
  buildRegistroSepPayload,
  formatPhoneWithCountryCode,
  registrarPacienteSep,
} from './registroSepPublico';
import {
  getRegistroStepContent,
  PHONE_PREFIX_OPTIONS,
} from '../../pages/webBasica/registroSep/RegistroSep';

const validFormData = {
  nombre: 'ANA',
  apellidoPaterno: 'LÓPEZ',
  apellidoMaterno: 'PÉREZ',
  fechaNacimiento: '2000-01-01',
  contactoTelefono: '123456789',
  contactoLada: '+33',
  correo: 'ANA@EXAMPLE.COM',
  password: 'secreto',
  aceptaConsentimiento: true,
  paisId: '1',
  estadoId: '2',
  ciudadId: '3',
  sedeId: '4',
  paisNombre: 'Francia',
  estadoNombre: 'Isla de Francia',
  ciudadNombre: 'París',
  contactoNombre: 'LUIS LÓPEZ',
  contactoParentesco: 'PADRE',
};

describe('registro SEP público', () => {
  beforeEach(() => {
    process.env.REACT_APP_REGISTRO_SEP_BASE_URL = 'https://example.test';
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.REACT_APP_REGISTRO_SEP_BASE_URL;
  });

  test('forma teléfonos internacionales con longitudes distintas a diez', () => {
    expect(formatPhoneWithCountryCode('123456789', '+33')).toBe(
      '+33123456789',
    );
    expect(formatPhoneWithCountryCode('5512345678', '+52')).toBe(
      '+525512345678',
    );
    expect(formatPhoneWithCountryCode('5212345678', '+52')).toBe(
      '+525212345678',
    );
    expect(formatPhoneWithCountryCode('+14155552671', '+1')).toBe(
      '+14155552671',
    );
  });

  test('ofrece ladas y banderas de todos los países', () => {
    expect(PHONE_PREFIX_OPTIONS.length).toBeGreaterThan(180);
    expect(PHONE_PREFIX_OPTIONS[0]).toEqual(
      expect.objectContaining({ value: 'mx', dialCode: '+52', flag: '🇲🇽' }),
    );
    expect(PHONE_PREFIX_OPTIONS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'fr', dialCode: '+33' }),
        expect.objectContaining({ value: 'jp', dialCode: '+81' }),
      ]),
    );
  });

  test('mantiene los títulos y textos de apoyo de cada paso del registro', () => {
    expect(getRegistroStepContent(2, 'es')).toEqual({
      title: 'REGISTRO',
      description: 'Introduce tus datos',
    });
    expect(getRegistroStepContent(3, 'es')).toEqual({
      title: 'REGISTRO DE INSTITUCIÓN',
      description: 'Selecciona tu ubicación',
    });
    expect(getRegistroStepContent(4, 'es')).toEqual({
      title: 'REGISTRAR',
      description: 'Registra tu correo y contraseña',
    });
    expect(getRegistroStepContent(5, 'es')).toEqual({
      title: 'CONTACTO DE EMERGENCIA',
      description: 'Registra un contacto de emergencia',
    });
    expect(getRegistroStepContent(6, 'en').title).toBe(
      'TERMS AND CONDITIONS',
    );
  });

  test('normaliza el teléfono en el paciente y el contacto de emergencia', () => {
    const payload = buildRegistroSepPayload(validFormData);

    expect(payload.celular_paciente).toBe('+33123456789');
    expect(payload.contacto_emergencia[0].celular).toBe('+33123456789');
    expect(payload.email_paciente).toBe('ana@example.com');
  });

  test('convierte un duplicado del backend en un mensaje entendible', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        email_paciente: ['A user with this email already exists.'],
      }),
    });

    await expect(registrarPacienteSep(validFormData)).rejects.toThrow(
      'Ya existe una cuenta con ese correo electrónico',
    );
  });

  test('no muestra campos ni detalles internos del backend', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ internal_field: ['database constraint'] }),
    });

    await expect(registrarPacienteSep(validFormData)).rejects.toThrow(
      'Revisa la información capturada',
    );
  });

  test('muestra un mensaje claro cuando no hay conexión', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(registrarPacienteSep(validFormData)).rejects.toThrow(
      'No pudimos conectar con el servicio de registro',
    );
  });
});
