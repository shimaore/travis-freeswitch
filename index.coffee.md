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

    exports.start = (cfgname,dir,stdio) ->
      serial += 1

      dir ?= path.join process.cwd(), "tmp-#{process.pid}-#{serial}"
      stdio ?= 'ignore'

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
      ], stdio: stdio

      c.on 'error', (err) ->
        console.log "FreeSwitch startup failed: #{err}"

      c.on 'exit', (code,signal) ->
        console.log "FreeSwitch stopped: code=#{code} signal=#{signal}"
        c = null

Clean-up the directories when the main Node.js process exits.

      process.on 'exit', ->
        remove_dir dir
        if c?
          c.kill 'SIGKILL'
          c = null

      return c
