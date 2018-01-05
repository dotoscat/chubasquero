from setuptools import setup, find_packages

setup(
    name="Chubasquero",
    version="0.9.0",
    packages=find_packages(),
    install_requires=["pelican>=3.7.1"],
    entry_points = {
        "console_scripts": ["chubasquero = chubasquero.core:main"],
    },
    package_data = {
        "chubasquero": ["static/*", "templates/*"]
    },
)
