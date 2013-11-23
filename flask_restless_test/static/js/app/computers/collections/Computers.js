define(function (require) {
    "use strict";
    var _ = require('underscore'),
        BaseCollection = require('app/base/collections/BaseCollection'),
        Computer = require('app/computers/models/Computer');
    return BaseCollection.extend({
        model: Computer,
        url: '/api/computer'
    });
});
