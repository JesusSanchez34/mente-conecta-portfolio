import { aceptarTerminosWebBasica } from "./authServiceWebBasica";

const BASE_URL = "https://sep.test";
const originalBaseUrl = process.env.REACT_APP_BASE_URL_SEP_V1;
const originalFetch = global.fetch;

function response({ ok = true, status = 200, data = {} } = {}) {
  return {
    ok,
    status,
    text: jest.fn().mockResolvedValue(JSON.stringify(data)),
  };
}

beforeEach(() => {
  process.env.REACT_APP_BASE_URL_SEP_V1 = BASE_URL;
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  if (originalBaseUrl === undefined) {
    delete process.env.REACT_APP_BASE_URL_SEP_V1;
  } else {
    process.env.REACT_APP_BASE_URL_SEP_V1 = originalBaseUrl;
  }

  if (originalFetch === undefined) {
    delete global.fetch;
  } else {
    global.fetch = originalFetch;
  }
});

test.each([
  ["consentimiento", "paciente2/pacientes/consentimiento/"],
  ["asentimiento", "paciente2/pacientes/asentimiento/"],
])(
  "acepta %s en el primer intento cuando el endpoint responde HTTP 200",
  async (tipo, endpoint) => {
    global.fetch.mockResolvedValue(
      response({
        data: {
          success: false,
          message: "Aceptación procesada",
        },
      }),
    );

    await expect(
      aceptarTerminosWebBasica(
        { tipo_consentimiento: tipo },
        "token-prueba",
      ),
    ).resolves.toMatchObject({
      success: false,
      status: 200,
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token-prueba",
      },
    });
  },
);

test("mantiene el error cuando el servidor responde con un HTTP no exitoso", async () => {
  global.fetch.mockResolvedValue(
    response({
      ok: false,
      status: 500,
      data: { error: "Error del servidor" },
    }),
  );

  await expect(
    aceptarTerminosWebBasica(
      { tipo_consentimiento: "consentimiento" },
      "token-prueba",
    ),
  ).rejects.toThrow("Error del servidor");
});
