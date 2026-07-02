/**
 * Convierte:
 * "Panadería San Martín"
 *
 * En:
 * "panaderia-san-martin"
 */
export const generateFolderName = (empresa) => {

    return empresa
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

};