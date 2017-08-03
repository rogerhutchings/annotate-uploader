# AnnoTate Subject Uploader

Takes files provided by the Tate in their usual catalogue structure and uploads them as subjects / sets to AnnoTate on Panoptes.

## Docker Usage

Clone this repo, then:

```
docker-compose run uploader <directory>
```

## Requirements

Requires Node 4 LTS or higher.

## Installation

This package is meant to be installed globally, so install by running:

```
npm install -g annotate-upload
```

## Usage

```
annotate-uploader <directory>
```

The following flags are available:

```
-h, --help        Show this help text
-v, --version     Show the current version
-u, --username    Set Panoptes username
-p, --password    Set Panoptes password
-e, --env         Set Panoptes environment (probably staging or production)
```

You can also store your Panoptes credentials as JSON in `~/.annotate_uploader`.

Example:

```
{
  "staging": {
    "username": "user1",
    "password": "foo"
  },
  "production": {
    "username": "user2",
    "password": "bar"
  }
}
```
