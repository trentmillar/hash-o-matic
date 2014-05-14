var assert = require('assert'),
    hashomatic = require('../lib/hashomatic'),
    md5omatic = require('md5-o-matic');

describe('hash-o-matic', function ()
{

  describe('simple hashing with easy values', function ()
  {

    var hash = "12e3d8ce5cfd13b940aee85dca323867",
        object = {"a": "cde"};
    it('simple01 {normalize strings} {lower case strings}', function ()
    {
      hashomatic.hash(object, true, true).should.eql(hash);
    });

    it('simple01 {normalize strings}', function ()
    {
      hashomatic.hash(object, true, false).should.eql(hash);
    });

    it('simple01 {lower case strings}', function ()
    {
      hashomatic.hash(object, false, true).should.eql(hash);
    });

    it('simple01', function ()
    {
      hashomatic.hash(object, false, false).should.eql(hash);
    });
  });

  describe('unordered object with easy values', function ()
  {
    var expected = {"b": "cde", "a": "123"},
        reverseobject = {"a": "123", "b": "cde"};

    it('+{normalize strings} +{lower case strings}', function ()
    {
      assert.equal(hashomatic.hash(reverseobject, true, true), hashomatic.hash(expected, true, true));
    });

    it('+{normalize strings} -{lower case strings}', function ()
    {
      assert.equal(hashomatic.hash(reverseobject, true, false), hashomatic.hash(expected, true, false));
    });

    it('-{normalize strings} +{lower case strings}', function ()
    {
      assert.equal(hashomatic.hash(reverseobject, false, true), hashomatic.hash(expected, false, true));
    });

    it('-{normalize strings} -{lower case strings}', function ()
    {
      assert.equal(hashomatic.hash(reverseobject, false, false), hashomatic.hash(expected, false, false));
    });

    it('defaulted', function ()
    {
      assert.equal(hashomatic.hash(expected), hashomatic.hash(reverseobject));
    });
  });


  describe('string only', function ()
  {
    var object = "the quick brown fox...",
        hash = "86dab0c1274f87c47d6deba464e4af74";

    it('+{normalize strings} +{lower case strings}', function ()
    {
      hashomatic.hash(object, true, true).should.equal(hash);
    });

    it('+{normalize strings} -{lower case strings}', function ()
    {
      hashomatic.hash(object, true, false).should.equal(hash);
    });

    it('-{normalize strings} +{lower case strings}', function ()
    {
      hashomatic.hash(object, false, true).should.equal(hash);
    });

    it('-{normalize strings} -{lower case strings}', function ()
    {
      hashomatic.hash(object, false, false).should.equal(hash);
    });

    it('defaulted', function ()
    {
      hashomatic.hash(object).should.equal(hash);
    });
  });


  describe('string only (variable case)', function ()
  {
    var object = "The quick brown fox...",
        hash = "86dab0c1274f87c47d6deba464e4af74";

    it('+{normalize strings} +{lower case strings}', function ()
    {
      hashomatic.hash(object, true, true).should.equal(hash);
    });

    it('+{normalize strings} -{lower case strings}', function ()
    {
      hashomatic.hash(object, true, false).should.not.equal(hash);
    });

    it('-{normalize strings} +{lower case strings}', function ()
    {
      hashomatic.hash(object, false, true).should.equal(hash);
    });

    it('-{normalize strings} -{lower case strings}', function ()
    {
      hashomatic.hash(object, false, false).should.not.equal(hash);
    });

    it('defaulted', function ()
    {
      hashomatic.hash(object).should.not.equal(hash);
    });
  });


  describe('normalize empty and null strings', function ()
  {
    var object = {a: "", b: "not empty", c: null},
        object2 = {a: null, b: "not empty", c: ""};

    it('+{normalize strings} +{lower case strings}', function ()
    {
      hashomatic.hash(object, true, true).should.equal(hashomatic.hash(object2, true, true));
    });

    it('+{normalize strings} -{lower case strings}', function ()
    {
      hashomatic.hash(object, true, false).should.equal(hashomatic.hash(object2, true, false));
    });

    it('-{normalize strings} +{lower case strings}', function ()
    {
      hashomatic.hash(object, false, true).should.not.equal(hashomatic.hash(object2, false, true));
    });

    it('-{normalize strings} -{lower case strings}', function ()
    {
      hashomatic.hash(object, false, false).should.not.equal(hashomatic.hash(object2, false, false));
    });

    it('defaulted', function ()
    {
      hashomatic.hash(object).should.not.equal(hashomatic.hash(object2));
    });
  });


  describe('single and double quoted strings', function ()
  {
    var object = {'a': "", "b": "not empty", 'c': ""},
        object2 = {"a": '', 'b': 'not empty', "c": ''};

    it('+{normalize strings} +{lower case strings}', function ()
    {
      hashomatic.hash(object, true, true).should.equal(hashomatic.hash(object2, true, true));
    });

    it('+{normalize strings} -{lower case strings}', function ()
    {
      hashomatic.hash(object, true, false).should.equal(hashomatic.hash(object2, true, false));
    });

    it('-{normalize strings} +{lower case strings}', function ()
    {
      hashomatic.hash(object, false, true).should.equal(hashomatic.hash(object2, false, true));
    });

    it('-{normalize strings} -{lower case strings}', function ()
    {
      hashomatic.hash(object, false, false).should.equal(hashomatic.hash(object2, false, false));
    });

    it('defaulted', function ()
    {
      hashomatic.hash(object).should.equal(hashomatic.hash(object2));
    });
  });


  describe('nested objects', function ()
  {
    var object = {'a': "", "b": {"1": 1, "2": "2", "3": {}}, 'c': ""},
        samplehash = md5omatic("testing");

    it('+{normalize strings} +{lower case strings}', function ()
    {
      var x = hashomatic._stringify(object);
      hashomatic.hash(object, true, true).should.have.length(samplehash.length);
    });

    it('+{normalize strings} -{lower case strings}', function ()
    {
      hashomatic.hash(object, true, false).should.have.length(samplehash.length);
    });

    it('-{normalize strings} +{lower case strings}', function ()
    {
      hashomatic.hash(object, false, true).should.have.length(samplehash.length);
    });

    it('-{normalize strings} -{lower case strings}', function ()
    {
      hashomatic.hash(object, false, false).should.have.length(samplehash.length);
    });

    it('defaulted', function ()
    {
      hashomatic.hash(object).should.have.length(samplehash.length);
    });
  });
});
