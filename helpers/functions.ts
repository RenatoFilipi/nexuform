export const uuid = () => {
  const uuid = self.crypto.randomUUID();
  return uuid;
};
