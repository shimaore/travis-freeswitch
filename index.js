// Generated by CoffeeScript 1.6.3
(function() {
  var child_process, fs, path, remove, remove_dir, serial;

  child_process = require('child_process');

  path = require('path');

  fs = require('fs');

  remove_dir = function(dir) {
    var files;
    files = fs.readdirSync(dir);
    files.map(function(name) {
      return remove(path.join(dir, name));
    });
    return fs.rmdirSync(dir);
  };

  remove = function(name) {
    var s;
    s = fs.statSync(name);
    if (s.isDirectory()) {
      return remove_dir(name);
    } else {
      return fs.unlinkSync(name);
    }
  };

  serial = 0;

  exports.start = function(cfgname, dir, stdio) {
    var c;
    serial += 1;
    if (dir == null) {
      dir = path.join(process.cwd(), "tmp-" + process.pid + "-" + serial);
    }
    if (stdio == null) {
      stdio = 'ignore';
    }
    fs.mkdirSync(dir);
    c = child_process.spawn('freeswitch', ['-nf', '-nosql', '-nonat', '-nonatmap', '-nocal', '-nort', '-base', dir, '-conf', dir, '-log', dir, '-run', dir, '-db', dir, '-scripts', dir, '-temp', dir, '-mod', '/usr/lib/freeswitch/mod', '-cfgname', cfgname], {
      stdio: stdio
    });
    c.on('error', function(err) {
      return console.log("FreeSwitch startup failed: " + err);
    });
    c.on('exit', function(code, signal) {
      console.log("FreeSwitch stopped: code=" + code + " signal=" + signal);
      return c = null;
    });
    process.on('exit', function() {
      remove_dir(dir);
      if (c != null) {
        c.kill('SIGKILL');
        return c = null;
      }
    });
    return c;
  };

}).call(this);
