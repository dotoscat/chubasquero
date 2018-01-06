from setuptools import setup, find_packages

setup(
    name="Chubasquero",
    version="1.0.0",
    packages=find_packages(),
    install_requires=["pelican>=3.7.1"],
    entry_points = {
        "console_scripts": ["chubasquero = chubasquero.core:main"],
    },
    package_data = {
        "chubasquero": ["static/*", "templates/*"]
    },
    author="Oscar (dotoscat) Triano",
    description="A CMS built on top of Pelican",
    url="https://github.com/dotoscat/chubasquero",
    license="AGPL-3.0",
    selectors=[
        "Development Status :: 5 - Production/Stable",
        "Framework :: Flask",
        "Framework :: Pelican",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: GNU Affero General Public License v3 or later (AGPLv3+)",
        "Programming Language :: JavaScript",
        "Programming Language :: Python :: 3 :: Only",
        "Topic :: Desktop Environment",
        "Topic :: Utilities"
    ],
)
