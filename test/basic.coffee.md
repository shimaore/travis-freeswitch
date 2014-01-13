    should = require 'should'

    describe 'The module', ->
      freeswitch = require '../index'
      describe 'start function', ->
        it 'should exist', ->
          freeswitch.should.have.property 'start'
        it 'and be a function', ->
          freeswitch.start.should.be.a.Function
        it 'should return properly', ->
          service = freeswitch.start '../test/freeswitch.xml'
          service.should.have.property 'kill'
          service.kill.should.be.a.Function
          service.kill()

        # it 'should create a FreeSwitch process', (done) ->
        # it 'should kill the FreeSwitch process', (done) ->
        #  service.
