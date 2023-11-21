import { Container } from "react-bootstrap";
import { InferGetServerSidePropsType, NextPage } from "next";
import { AuthedPage } from "components/types";
import { trpc } from "utils/trpc";
import UserProfile from "components/Profile";
import GenericError from "components/GenericError";
import GSSPUrlParams from "components/props/GSSPUrlParam";
import { UserIdValidator } from "utils/types/User";

export const getServerSideProps = GSSPUrlParams({user: UserIdValidator});
const Profile: AuthedPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  user: id,
  session: { user: cuser },
}) => {
  const user = trpc.useQuery(["user.get", id]);
  if (user.error) console.dir(user.error)
  if (!user.data) return <div>Loading...</div>;
  if (cuser.type === "Student" && !user.data.visible)
    return GenericError("This user has chosen to be invisible.");

  return <Container>{UserProfile(user.data)}</Container>;
};
Profile.auth = true;

export default Profile;
