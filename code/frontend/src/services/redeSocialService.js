//buscar redes sociais


export const buscarTiposRedesSociais = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/tipoRedesSociais`);
  return response.json();
};

export const cadastrarRedeSocial = async (redeSocial) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/redesSociais`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(redeSocial),
  });
  return response.json();
};