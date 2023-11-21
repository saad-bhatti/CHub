import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { AuthedPage } from "components/types";
import Loading from "components/Loading";
import CoursePage from "components/CoursePage";
import { trpc } from "utils/trpc";
import { useState } from "react";
import { Post } from "utils/types/Post";
import Link from "next/link"
import GenericError from "components/GenericError";
export const getServerSideProps = GSSPCoursePath;

const Assignments: AuthedPage<
  InferGetServerSidePropsType<typeof GSSPCoursePath>
> = ({ course, session: { user } }) => {
  const query = trpc.useQuery(["course.posts", course]);
  const [filterOwnPosts, setFilterOwnPosts] = useState(false);
  const [filterFavoritePosts, setFilterFavoritePosts] = useState(false);
  let [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const editPost = trpc.useMutation(["post.edit"]);

  function pinPost(post: Post) {
    editPost.mutate(
      {
        id: post.id,
        newPost: {
          ...post,
          pinned: !post.pinned,
        },
      },
      {
        onSuccess: (result, variable, context) => {
          const postsCopy = [...displayedPosts];
          postsCopy[
            postsCopy.findIndex((postCopy) => postCopy.id === post.id)
          ].pinned = !post.pinned;
          setDisplayedPosts(postsCopy);
        },
      }
    );
  }

  function endorsePost(post: Post) {
    editPost.mutate(
      {
        id: post.id,
        newPost: {
          ...post,
          endorsement: !post.endorsement,
        },
      },
      {
        onSuccess: (result, variable, context) => {
          const postsCopy = [...displayedPosts];
          postsCopy[
            postsCopy.findIndex((postCopy) => postCopy.id === post.id)
          ].endorsement = !post.endorsement;
          setDisplayedPosts(postsCopy);
        },
      }
    );
  }

  function favoritePost(post: Post) {
    if (post.favorite.has(user.id)) {
      post.favorite.delete(user.id);
    } else {
      post.favorite.add(user.id);
    }

    editPost.mutate(
      {
        id: post.id,
        newPost: {
          ...post,
          favorite: post.favorite,
        },
      },
      {
        onSuccess: (result, variable, context) => {
          const postsCopy = [...displayedPosts];
          postsCopy[
            postsCopy.findIndex((postCopy) => postCopy.id === post.id)
          ].favorite = post.favorite;
          setDisplayedPosts(postsCopy);
        },
      }
    );
  }

  if (query.data === undefined) {
    return (
      <Container className="text-center pt-5">
        <Loading />
      </Container>
    );
  }

  if (query.data === null) return GenericError("Could not find posts.");

  // Sorts posts by pinned first
  query.data.sort((firstElement, secondElement) => {
    return firstElement.pinned === secondElement.pinned
      ? 0
      : firstElement.pinned
      ? -1
      : 1;
  });

  displayedPosts = query.data.filter((post) => {
    return (
      (!filterOwnPosts || post.owner === user.id) &&
      (!filterFavoritePosts || post.favorite.has(user.id))
    );
  }) as Post[];

  return (
    <Container className="pt-5">
      <>
        <Row className="mb-3 row-cols-2">
          <Col>{CoursePage({pathname: './', query: {course}})}</Col>
          <Col className="d-flex justify-content-end">
            <Form>
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Filter for your posts"
                onChange={() => {
                  setFilterOwnPosts(!filterOwnPosts);
                }}
              ></Form.Check>
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Filter for favorite posts"
                onChange={() => {
                  setFilterFavoritePosts(!filterFavoritePosts);
                }}
              ></Form.Check>
            </Form>
          </Col>
        </Row>
        <Link href={{
          pathname: 'posts/add',
          query:{
            course: course
          }
        }}>
          <Button
            variant="primary"
            className="my-3"
          >
            Add new post
          </Button>
        </Link>
        <Row className="row-cols-1 row-cols-md-2 g-4 mb-5">
          {displayedPosts.map((post) => {
            return (
              <Col key={post.id}>
                <Card className="p-3 m-3">
                  <Row className="d-flex">
                    <Col style={{ flexGrow: 3 }}>
                      <h5 className="card-title">
                        <span
                          onClick={() => {
                            favoritePost(post);
                          }}
                        >
                          {(post.favorite.has(user.id) && " ⭐ ") || " ✩ "}
                        </span>
                        {post.title}
                        {post.pinned && " 📌 "}
                        {post.endorsement && " 💡"}
                      </h5>
                    </Col>
                    <Col className="d-flex justify-content-end flex-shrink-0">
                      {user.type === "Teacher" && (
                        <>
                          <Button
                            className="me-2"
                            onClick={() => {
                              pinPost(post);
                            }}
                          >
                            Pin
                          </Button>
                          <Button
                            onClick={() => {
                              endorsePost(post);
                            }}
                          >
                            Endorse
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>

                  <h6 className="card-subtitle mb-3 text-muted">
                    <>
                      <div>type: {post.type}</div>
                      <div>user: {post.owner}</div>
                      <div>
                        <>date posted: {post.date.toUTCString()}</>
                      </div>
                    </>
                  </h6>
                  <p className="mb-3 cut-text">{post.content}</p>
                  <Link href={{
                    pathname: 'posts/[postId]',
                    query: {
                      course: course,
                      postId: post.id
                    }
                  }}>
                    <Button
                      variant="primary"
                      className="mx-3"
                    >
                      Go to discussion page
                    </Button>
                  </Link>
                </Card>
              </Col>
            );
          })}
        </Row>
      </>
    </Container>
  );
};

Assignments.auth = true;
export default Assignments;
