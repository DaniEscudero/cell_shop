export const verifySession = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/session`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Error HTTP: la respuesta llegó pero no fue exitosa
      const errorData = await response.json();
      let errors: string[] = [];
      if (errorData.errors) {
        errors = errorData.errors;
      }
      throw new Error(
        `Error del servidor: ${response.status} - ${
          errorData?.error || errors || 'Algo salió mal'
        }`
      );
    }

    // Todo ok, devolvemos la respuesta parseada
    const data = await response.json();
    return data;
  } catch (error) {
    // Error de red o algo explotó arriba
    //console.error('Error creando producto:', error);
    throw error;
  }
};
