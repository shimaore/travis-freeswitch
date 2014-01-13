Travis-FreeSwitch
=================

Enables you to start arbitrary FreeSwitch instances for test purposes.

Add as a development dependency
-------------------------------

    npm --save-dev install travis-freeswitch

Add it in your .travis.yml
--------------------------

    before_install:
      - sudo ./node_modules/travis-freeswitch/install.sh

In your test code
-----------------

    freeswitch = require('travis-freeswitch')

    service = freeswitch.start '../test/freeswitch.xml'

The service is a Node.js `ChildProcess`. It will be automatically cleaned up at the end of the Node.js process, but you might also manually rip it:

    service.kill()

To start multiple concurrent FreeSwitch process make sure the ports for the event socket, sofia SIP, etc. are all different.

What is provided
----------------

The core FreeSwitch application plus the following modules:

* commands
* event-socket
* dptools
* loopback
* dialplan-xml
* sofia

If you need additional modules please [open an issue](https://github.com/shimaore/travis-freeswitch/issues) or a pull-request.
