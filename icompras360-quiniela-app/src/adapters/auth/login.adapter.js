export const loginAdapter = (response) => {
  const data = response.data;
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    tx_phone: data.tx_phone,
    token: data.token,
    created_at: data.created_at,
    is_cli: data.is_cli,
  };
};
