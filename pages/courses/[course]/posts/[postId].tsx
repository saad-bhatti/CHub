import { Button, Container, Row, Card, Col } from "react-bootstrap";
import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { AuthedPage } from "components/types";
import { trpc } from "utils/trpc";
import Loading from "components/Loading";
import { Post } from "utils/types/Post";
import { useState } from "react";
import { PostComment } from "utils/types/PostComment";
import Link from 'next/link';
import GenericError from "components/GenericError";

export const getServerSideProps = GSSPCoursePath;

const Assignments: AuthedPage<
  InferGetServerSidePropsType<typeof GSSPCoursePath>
> = ({ course, session: { user } }) => {
  const router = useRouter();
  const postId = router.query.postId as string;
  const postQuery = trpc.useQuery(["post.get", postId]);
  const commentQuery = trpc.useQuery(["post.comments", postId]);
  const editPost = trpc.useMutation(["post.edit"]);
  const editComment = trpc.useMutation(["postComment.edit"]);
  let [endorsement, setEndorsement] = useState(false);
  let [pinned, setPinned] = useState(false);
  let [favorite, setFavorite] = useState(new Set<string>());
  let [displayedComments, setDisplayedComments] = useState<PostComment[]>([]);

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
          postQuery.data!.pinned = !pinned;
          setPinned(!pinned);
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
          postQuery.data!.endorsement = !endorsement;
          setEndorsement(!endorsement);
        },
      }
    );
  }

  function pinComment(comment: PostComment) {
    editComment.mutate(
      {
        id: comment.id,
        newPostComment: {
          ...comment,
          pinned: !comment.pinned,
        },
      },
      {
        onSuccess: (result, variable, context) => {
          const commentsCopy = [...displayedComments];
          commentsCopy[
            commentsCopy.findIndex(
              (commentCopy) => commentCopy.id === comment.id
            )
          ].pinned = !comment.pinned;
          setDisplayedComments(commentsCopy);
        },
      }
    );
  }

  function endorseComment(comment: PostComment) {
    editComment.mutate(
      {
        id: comment.id,
        newPostComment: {
          ...comment,
          endorsement: !comment.endorsement,
        },
      },
      {
        onSuccess: (result, variable, context) => {
          const commentsCopy = [...displayedComments];
          commentsCopy[
            commentsCopy.findIndex(
              (commentCopy) => commentCopy.id === comment.id
            )
          ].endorsement = !comment.endorsement;
          setDisplayedComments(commentsCopy);
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
          favorite: new Set(post.favorite),
        },
      },
      {
        onSuccess: (result, variable, context) => {
          postQuery.data!.favorite = post.favorite;
          setFavorite(post.favorite);
        },
      }
    );
  }

  const backButton = (
    <Row className="mb-3">
      <Link href={{
        pathname: '../',
        query: {
          course: course,
        }
      }}>
        <Button
          className="w-auto"
        >
          Go back to {course} discussion list
        </Button>
      </Link>
    </Row>
  );
  
  if (postQuery.data === undefined || commentQuery.data === undefined) return (
    <Container className="text-center pt-5">
      {backButton}
      <Loading />
    </Container>
  )
  if (postQuery.data === null) return GenericError("Could not find post.");
  if (commentQuery.data === null) return GenericError("Could not find comment.");
  
  endorsement = postQuery.data.endorsement;
  pinned = postQuery.data.pinned;
  favorite = postQuery.data.favorite;

  // Sorts comments by pinned first
  commentQuery.data.sort((firstElement, secondElement) => {
    return firstElement.pinned === secondElement.pinned
      ? 0
      : firstElement.pinned
      ? -1
      : 1;
  });

  displayedComments = commentQuery.data as PostComment[];

  return (
    <Container className="py-5">
      {backButton}
      <Row className="row-cols-2">
        <Col>
          <h1>
            <span
              onClick={() => {
                favoritePost(postQuery.data as Post);
              }}
            >
              {(postQuery.data.favorite.has(user.id) && " ⭐ ") || " ✩ "}
            </span>

            {postQuery.data.title}
            {pinned && " 📌 "}
            {endorsement && " 💡"}
          </h1>
        </Col>
        <Col className="d-flex justify-content-end">
          {user.id == postQuery.data.owner && (
            <Link href={{
              pathname: './[postId]/edit',
              query: {
                course: course,
                postId: postId
              }
            }}>
              <Button
                className="me-2"
              >
                Edit post
              </Button>
            </Link>
          )}
          {user.type === "Teacher" && (
            <>
              <Button
                className="me-2"
                onClick={() => {
                  pinPost(postQuery.data as Post);
                }}
              >
                Pin
              </Button>
              <Button
                onClick={() => {
                  endorsePost(postQuery.data as Post);
                }}
              >
                Endorse
              </Button>
            </>
          )}
        </Col>
      </Row>
      <h4 className="mb-5 text-muted">
        <>
          <div>type: {postQuery.data.type}</div>
          <div>user: {postQuery.data.owner}</div>
          <div>
            <>date posted: {postQuery.data.date.toUTCString()}</>
          </div>
        </>
      </h4>
      <p className="discussion-content">{postQuery.data.content}</p>
      <br></br>
      <Row>
        <Row className="row-cols-2 mb-3">
          <Col>
            <h2>Comments:</h2>
          </Col>
          <Col className="d-flex justify-content-end">
            <Link href={{
              pathname: './[postId]/add',
              query: {
                course: course,
                postId: postId
              }
            }}>
              <Button>
                Add a comment
              </Button>
            </Link>
          </Col>
        </Row>
        {displayedComments.map((comment) => {
          return (
            <Card key={comment.id} className="pt-3 my-1">
              <Row className="row-cols-2 mb-3">
                <Col className="d-flex justify-content-begin">
                  <span className="me-3">
                    <h6 className="card-subtitle mb-3 text-muted">
                      <>
                        <div>user: {comment.ownerId}</div>
                        <div>
                          <>date posted: {comment.date.toUTCString()}</>
                        </div>
                      </>
                    </h6>
                  </span>
                  <span>
                    <h5 className="card-title">
                      {comment.pinned && " 📌 "}
                      {comment.endorsement && " 💡"}
                    </h5>
                  </span>
                </Col>
                <Col className="d-flex justify-content-end">
                  {user.id == comment.ownerId && (
                    <Button
                      className="me-2"
                      onClick={() => {
                        router.push(
                          `${router.asPath}/${comment.id}/edit-comment`
                        );
                      }}
                    >
                      Edit comment
                    </Button>
                  )}
                  {user.type === "Teacher" && (
                    <>
                      <Button
                        className="me-2"
                        onClick={() => pinComment(comment)}
                      >
                        Pin
                      </Button>
                      <Button onClick={() => endorseComment(comment)}>
                        Endorse
                      </Button>
                    </>
                  )}
                </Col>
              </Row>

              <p className="mb-3" style={{ whiteSpace: "pre-line" }}>
                {comment.content}
              </p>
            </Card>
          );
        })}
      </Row>
    </Container>
  );
};

Assignments.auth = true;
export default Assignments;
