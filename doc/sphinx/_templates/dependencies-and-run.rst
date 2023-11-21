Dependencies
------------
Install `Node v16 <https://nodejs.org/en/>`_ for your platform

Then in a terminal, run:

.. code-block:: bash

    npm install

Run and build
-------------

To start the development server, run:

.. code-block:: bash

    npm run dev

To build the project, run:

.. code-block:: bash

    npm run build
    npx next export

And finally, the run the project as a web server, run

.. code-block:: bash

    python3 -m http.server --directory out/
