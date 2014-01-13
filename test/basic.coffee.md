    should = require 'should'

    describe 'The module', ->
      freeswitch = require '../index'
      describe 'start function', ->
        it 'should exist', ->
          freeswitch.should.have.property 'start'
        it 'and be a function', ->
          freeswitch.start.should.be.a.Function
        it 'should return properly', ->
          freeswitch.start '../test/freeswitch.xml'
