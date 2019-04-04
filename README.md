# Mazon OS - Static site generator
[![Build Status](https://travis-ci.com/joseafga/mazonos.com.svg?branch=master)](https://travis-ci.com/joseafga/mazonos.com)

The mazonos.com is a static site and here we have the code used to generate it.

*Read this in another language: [English](README.md), [Português (BR)](README.pt-BR.md).*

## Usage
The generator use Node.js to build the pages and npm as package manager.

### Instructions
Download the repository:

    $ git clone https://github.com/joseafga/mazonos.com.git

Access the folder and run the installation of the dependencies:

    $ cd mazonos.com
    $ npm install

Run the script to generate the static site:

    $ npm run build

Done! Just wait for the process to complete and a new folder named as `build` will appear, inside it are the files that were generated.

## Translate
Help us to translate the site!

To facilitate translation popular and easy-to-read formats were used, these being *markdown* and *yaml*. Inside `src/content/` are found the folders corresponding to each available language. Each language has a file named `data.yml` it contains the data shared between all pages of the site, another `.md` files match the pages themselves.  
To add a new language just copy the folder with the reference language (of your preference) and then edit the files of your content.

## Contribute
As the entire Mazon OS project every contribution is welcome. Static site generator related contributions such as bug fixes and new features should be made directly in Github. For other forms of contribution or doubts contact the official channels:

- **Email**: root@mazonos.com
- **IRC**: irc.freenode.net #mazonos
