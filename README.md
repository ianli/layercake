LayerCake, a quick-to-use calendar/date picker
==============================================

LayerCake is a calendar/date picker that allows separate selection of year, month, and date.

Most calendar pickers support selection of month and year together (_e.g._, "April 2011"). This means that if "April 2011" is currently selected and the user wants "December 2011", the user has to click 8 times. With LayerCake, the user only has to click twice: (1) select the month and (2) select the year. In cases where the current selection differs from the desired selection by either the month or the year, the user only has to click once.


Requirements
------------

Requires the following Javascript libraries:

- [jQuery](http://jquery.com/) for DOM manipulation
- [Underscore.js](http://documentcloud.github.com/underscore/) for utility functions


Versioning
----------

For transparency and insight into our release cycle, and for striving to maintain backwards compatibility, LayerCake will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the follow format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on SemVer, please visit http://semver.org/.


Change Log
----------

__0.2.0__ -- January 16, 2012

- Added showRangeSelector

__0.1.0__ -- October 26, 2011

- Initial release of LayerCake, formerly LayerCal.


License
-------

Copyright (c) 2011 Ian Li, http://ianli.com

Licensed under [the MIT license](http://www.opensource.org/licenses/mit-license.php).
