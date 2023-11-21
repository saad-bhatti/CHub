import React from "react";
import { Container, Row, Button } from "react-bootstrap";
import { Url, UrlObject } from "url";
import Link from "next/link";

export default function CoursePage(href: Url | UrlObject) {
  return (
    <Container>
      <Row className="mb-3" style={{ marginTop: "2.5rem" }}>
        <Link href={href}>
          <Button
            className="w-auto"
            variant="outline-primary"
          >
            Course Page
          </Button>
        </Link>
      </Row>
    </Container>
  );
}
