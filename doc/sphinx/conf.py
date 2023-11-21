# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'CHub'
copyright = '2022, Ezzeldin Ismail, Stephen Guo, Saad Mohy-Uddin Bhatti, Ziyao Yin, Xinyi Ye, Jesse Zhang, Awais Aziz'
author = 'Ezzeldin Ismail, Stephen Guo, Saad Mohy-Uddin Bhatti, Ziyao Yin, Xinyi Ye, Jesse Zhang, Awais Aziz'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = []

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']



# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_static_path = ['_static']
