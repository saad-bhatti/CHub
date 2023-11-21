Backend
=======

The backend is built using `Next.js <https://nextjs.org/>`_ with TypeScript and `Zod <https://zod.dev/>`_. The database is MongoDB, and
the frontend communicates with the backend using `tRPC <https://trpc.io/>`_ as the middleware.

.. include:: _templates/dependencies-and-run.rst

Database
--------
The database we're using is `SurrealDB <https://surrealdb.com/>`_.

Interacting with the database is done using the :file:`../../database/surrealdb/interface/SurrealInterface.ts` file.

Docker setup
^^^^^^^^^^^^
If you have Docker setup, you can run these to get started

.. code-block:: bash

    docker run \
        --rm \
        --detach \
        --publish 8000:8000 \
        surrealdb/surrealdb:latest \
            start --user=root --pass=root

    # To initalize the database:
    npx ts-node database/surrealdb/init.ts

    # To get into the SurrealDB shell
    docker exec \
        --interactive \
        --tty \
        $(docker ps --quiet --filter ancestor=surrealdb/surrealdb:latest) \
            /surreal sql \
                --conn http://localhost:8000 \
                --user root \
                --pass root \
                --ns CHub \
                --db CHub

    # Alternatively, just run our pre-made script
    npm run db
    npm run dev

Local setup
^^^^^^^^^^^
Otherwise, you'll need to set the database up locally.
`Here's a quick link on how to get started <https://surrealdb.com/install>`_
Make sure the databse setup matches the Docker command above

Database tests
^^^^^^^^^^^^^^

To check if things have actually been added, get into the SurrealDB shell, and run

.. code-block:: sql

    SELECT * FROM Users;
Tests
-----
We are not using a formal testing framework currently. Once SurrealDB is running locally, tests can be run with the following command:

.. code-block:: bash

    npx ts-node database/testing/SurrealDBtest.ts

.. include:: _templates/api.rst
