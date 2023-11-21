import { GetServerSideProps } from "next";
import { serialize } from "superjson";
import { CourseCodeValidator } from "utils/types/Course";
import { ZodType } from "zod";

type Params<P, Q> = { [key in keyof P]: P[key] } & {
  [key in keyof Q]: Q[key] | undefined;
};

export const GSSPUrl =  <P, Q>(
  routeParams: { [key in keyof P]: ZodType<P[key], any, any> },
  urlQueries: { [key in keyof Q]: ZodType<Q[key] | undefined, any, any> }
): GetServerSideProps<Params<P, Q>> => {
  const GSSP: GetServerSideProps<Params<P, Q>> = async ({ params, query }) => {
    const props = {} as Params<P, Q>;
    try {
      if (Object.keys(routeParams).length > 0) {
        if (!params) return { notFound: true };
        for (let item in routeParams) {
          props[item] = routeParams[item].parse(params[item]) as any;
        }
      }
      if (Object.keys(urlQueries).length > 0) {
        for (let item in urlQueries) {
          props[item] = urlQueries[item].optional().parse(query[item]) as any;
        }
      }
    } catch (e) {
      return { notFound: true };
    }

    return {
      props: serialize(props) as any as Params<P, Q>,
    };
  };
  return GSSP;
};

export const GSSPUrlParams = <P>(routeParams: { [key in keyof P]: ZodType<P[key], any, any> }) => GSSPUrl(routeParams, {});
export default GSSPUrlParams
