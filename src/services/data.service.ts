import api from "../lib/axios";
import { DataPointOfSale } from "../pointofsale/interfaces/data-point-of-sale.interface";


export class DataPointOfSaleService {

  static readonly getData = async (): Promise<DataPointOfSale> => {
    try {
      const response = await api.get<DataPointOfSale>("/data/1", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error("UnAuthorized");
    }
  };

  static readonly getDataById = async (id: number): Promise<DataPointOfSale> => {
    try {
      const response = await api.get<DataPointOfSale>(`/data/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener la info");
    }
  };

  static readonly updateData = async (
    id: number,
    dataSend: {
      name?: string;
    }
  ): Promise<DataPointOfSale> => {
    try {
      const currentData = await DataPointOfSaleService.getData();

      // Crear un objeto con solo los campos que han cambiado
      const updatedFields: Partial<DataPointOfSale> = {};

      // Definir los campos a verificar
      const fieldsToCheck: {
        key: keyof DataPointOfSale;
        value: any;
        compare?: (a: any, b: any) => boolean;
      }[] = [{ key: "name", value: dataSend.name }];

      // Verificar y actualizar los campos
      fieldsToCheck.forEach(({ key, value, compare }) => {
        if (
          value !== undefined &&
          (compare
            ? compare(value, currentData[key])
            : value !== currentData[key])
        ) {
          updatedFields[key] = value;
        }
      });

      // Solo enviar la solicitud si hay campos actualizados
      if (Object.keys(updatedFields).length > 0) {
        const response = await api.put<DataPointOfSale>(
          `/data/${id}`,
          updatedFields,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        console.log(response.data);
        return response.data;
      } else {
        console.log("No hay campos para actualizar");
        return currentData;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al actualizar los datos del negocio");
    }
  };
}