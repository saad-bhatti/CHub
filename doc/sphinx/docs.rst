Documentation Page
=============

The documentation is built using `Sphinx <https://www.sphinx-doc.org/>`_ with the  `Read the Docs Sphinx Theme <https://sphinx-rtd-theme.readthedocs.io/>`_

Dependencies
------------
In a terminal, run:

.. code-block:: bash

    pip install --upgrade sphinx sphinx-rtd-theme

Optional Dependencies
---------------------
Skip this step if you don't need an IDE experience when working with Sphinx.

.. code-block:: bash

    pip install --upgrade esbonio doc8

:code:`esbonio` is the reStructuredText language server (which is what Sphinx is based off of), and doc8 is the reStructuredText linter.

In VSCode, install :code:`lextudio.restructuredtext`, and :code:`trond-snekvik.simple-rst`.
On the bottom left, it may say :code:`docutils`. Instead, we want click and select :code:`Sphinx`. Lastly, we can have a live preview of the documentation by clicking the preview button at the top right of VSCode.

Building and Running
--------------------
To build the static HTML files, run:

.. code-block:: bash

    make html

To see see the documentation as a web page, run:

.. code-block:: bash

    python3 -m http.server --directory _build/html/

Then go to `http://localhost:8000 <http://localhost:8000>`_
