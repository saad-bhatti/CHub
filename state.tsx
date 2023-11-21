const globalState = {
  user: {
    fname: "Mahr",
    lname: "Proj",
    email: "mahr@chub.com",
    permission: "All Students",
  },
};

// Get the current user
export const getUser = async () => globalState.user;
export const updateUser = async (item: {
  first: string;
  second: string;
  ema: string;
  permission: string;
}) => {
  globalState.user.fname = item.first;
  globalState.user.lname = item.second;
  globalState.user.email = item.ema;
  globalState.user.permission = item.permission;
};
