module.exports = {
  isUUID: (uuid) => {
    const regex =
      /^[a-z0-9]{8}-[a-z0-9]{4}-4[a-z0-9]{3}-[89ab][a-z0-9]{3}-[a-z0-9]{12}$/;
    return regex.test(uuid);
  },
};
