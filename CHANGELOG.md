# Change Log

Format: [Keep a Changelog](http://keepachangelog.com/)

Adheres: [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2018-02-20

lunar_limbo forks

### Added

- configurations
  - `trimEmptyLines` - remove output lines with only spaces
  - `prefix` - string to place before banner
  - `suffix` - string to place after banner
  - `perLinePrefix` - string to place at the beginning of each line
  - `configs` - a hash of named configs for easy use
- commands
  - `ApplyFromList` - pick font from full list before applying defaults
  - `ApplyFromFavorite` - pick font from favorites before applying defaults
  - `ApplyFromConfig` - pick stored config to apply with
  - `ApplyDirectFromConfig`  - used for creating shortcuts to configs (only use with geddski/macros)

### Changed

- All `Apply` commands automatically selects the entire line if selection length = 0

## [0.1.0] - 2017-10-22

- Initial release by IMFUZZ