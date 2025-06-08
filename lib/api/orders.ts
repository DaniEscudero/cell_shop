import { Order } from '../interface-orders';

export const createOrder = async (order: Order, token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
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
    //console.error('Error creando ordero:', error);
    throw error;
  }
};

export const updateOrder = async (order: Order, token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${order._id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      }
    );

    console.log('Updating order...');

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
    console.error('Error actualizando ordero:', error);
    throw error;
  }
};

export const getOrders = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders`,
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
    //console.error('Error creando ordero:', error);
    throw error;
  }
};
