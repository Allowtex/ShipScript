﻿'use strict';
// ReSharper disable UndeclaredGlobalVariableUsing
const core = require('core');
const console = require('console');
const stdout = require('stdout');
var color = stdout.color;
{
    let copy = {};
    Object.assign(copy, color);
    color = copy;
}

const stdoutExplore = require('explore').create(stdout, color);

function evaluate(command, then, err) {
    if (typeof command !== 'string') {
        return;
    }

    EngineInternal.evalCode = command;
    const success = core.eval();
    EngineInternal.evalCode = undefined;
    if (success) {
        then(EngineInternal.evalResult);
        EngineInternal.evalResult = undefined;
    } else {
        err(EngineInternal.evalError);
        EngineInternal.evalError = undefined;
    }
}

var stdin;
function stdinCommand(command) {
    if (command === '.exit') {
        if (typeof stdin.stop === 'function') {
            stdin.stop();
        }

        return;
    }

    evaluate(command, stdoutExplore, console.err);
}

function hook(stream) {
    stdin = stream;
    return stream.pipe(stdinCommand);
}

exports.hook = hook;
exports.evaluate = evaluate;
exports.stdoutExplore = stdoutExplore;
