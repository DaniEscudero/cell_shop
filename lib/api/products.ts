import { Product } from '../interface-products';

export const uploadImage = async (imageFile: FormData, token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // 👇 NO pongas Content-Type, fetch lo maneja por sí solo con FormData
        },
        body: imageFile,
      }
    );

    if (!response.ok) {
      // Error HTTP: la respuesta llegó pero no fue exitosa
      const errorData = await response.json();

      throw new Error(
        `Error del servidor: ${response.status} - ${
          errorData?.error || errorData?.errors || 'Algo salió mal'
        }`
      );
    }

    // Todo ok, devolvemos la respuesta parseada
    const data = await response.json();
    return data;
  } catch (error) {
    // Error de red o algo explotó arriba
    //console.error('Error subiendo imagen:', error);
    throw error;
  }
};

export const createProduct = async (product: Product, token: string) => {
  if (!product.numSales) {
    product.numSales = 0;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      }
    );

    if (!response.ok) {
      // Error HTTP: la respuesta llegó pero no fue exitosa
      const errorData = await response.json();
      console.log(errorData);
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

export const updateProduct = async (product: Product, token: string) => {
  if (!product.numSales) {
    product.numSales = 0;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${product._id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      }
    );

    console.log('Updating product...');

    if (!response.ok) {
      // Error HTTP: la respuesta llegó pero no fue exitosa
      const errorData = await response.json();
      console.log(errorData);
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
    console.error('Error actualizando producto:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string, token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Error HTTP: la respuesta llegó pero no fue exitosa
      const errorData = await response.json();
      console.log(errorData);
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

export const getProducts = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Error HTTP: la respuesta llegó pero no fue exitosa
      const errorData = await response.json();
      throw new Error(
        `Error del servidor: ${response.status} - ${
          errorData?.error || 'Algo salió mal'
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
