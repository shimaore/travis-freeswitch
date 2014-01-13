    child_process = require 'child_process'
    path = require 'path'
    fs = require 'fs'

## Recursively remove a directory and its content.

    remove_dir = (dir) ->
      files = fs.readdirSync dir
      files.map (name) ->
        remove path.join dir, name
      fs.rmdirSync dir

## Remove a filesystem location; if it is a directory, recursively remove it.

    remove = (name) ->
      s = fs.statSync name
      if s.isDirectory()
        remove_dir name
      else
        fs.unlinkSync name

## Create one subdirectory per sub-process.

    serial = 0

    exports.start = (cfgname,dir) ->
      serial += 1

      if typeof dir is 'function'
        [dir,cb] = [null,dir]
      dir ?= path.join process.cwd(), "tmp-#{process.pid}-#{serial}"

      fs.mkdirSync dir

      c = child_process.spawn 'freeswitch', [
        '-nf'
        '-nosql'
        '-nonat'
        '-nonatmap'
        '-nocal'
        '-nort'
        '-base', dir
        '-conf', dir
        '-log', dir
        '-run', dir
        '-db', dir
        '-scripts', dir
        '-temp', dir
        '-mod', '/usr/lib/freeswitch/mod'
        '-cfgname', cfgname
      ], stdio: 'pipe'

      c.on 'error', (err) ->
        console.log "FreeSwitch startup failed: #{err}"

      log = (s,d) ->
        s.resume()
        d.output = new Buffer 0
        s.on 'data', (data) ->
          d.output = Buffer.concat [d.output, data]

      out = err = {}
      log c.stdout, out
      log c.stderr, err

      c.on 'exit', (code,signal) ->
        console.log "FreeSwitch stopped: code=#{code} signal=#{signal}"
        # if code isnt 0
        process.stdout.write out.output
        process.stderr.write err.output
        c = null

Clean-up the directories when the main Node.js process exits.

      process.on 'exit', ->
        remove_dir dir
        if c?
          c.kill 'SIGKILL'
          c = null

      return c
