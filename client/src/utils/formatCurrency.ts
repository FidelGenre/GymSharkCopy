export const formatARS = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0, // Fuerza a quitar los centavos
    maximumFractionDigits: 0, // Fuerza a quitar los centavos
  }).format(amount).replace('$', '$ '); // Agrega el espacio después del signo $
};