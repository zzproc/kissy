describe('kissy.js', function () {

    var S = KISSY,
        host = S.Env.host;


    describe("S.mix", function () {

        it("works simply", function () {
            var o1 = { a: 1, b: 2 },
                o2 = { a: 1, b: 2 },
                o3 = { a: 1, b: 2 },
            //o4 = { a: 1, b: 2 },
                o = { a: 'a', c: true };

            S.mix(o1, o);
            expect(o1.a).toBe('a');

            // turn off override
            S.mix(o2, o, false);
            expect(o2.a).toBe(1);

            // whitelist
            S.mix(o3, o, true, ['c']);
            expect(o3.a).toBe(1);


            // deep object mix testcase
            var r = {
                x: 1,
                y: {
                    z: 1
                },
                q: [2, 5]
            };

            S.mix(r, {
                x: 2,
                y: {
                    s: 1
                },
                q: [6]
            });

            expect(r.x).toBe(2);
            expect(r.y.s).toBe(1);
            expect(r.y.z).toBeUndefined();
            expect(r.q + "").toBe([6] + "");
        });


        it('works for deep mix', function () {

            var r, r2;

            r = {
                x: 1,
                y: {
                    z: 1,
                    q: 4
                }
            };

            r2 = {
                x: 2,
                y: {
                    z: 3,
                    w: r2
                }
            };

            r2.y.w=r2;

            S.mix(r, r2, {
                deep: true,
                whitelist: ['x', 'y', 'z','w']
            });

            expect(r).toEqual({
                x: 2,
                y: {
                    z: 3,
                    q: 4,
                    w: r
                }
            });

            expect(r).toBe(r.y.w);

            r = {
                x: 1,
                y: {
                    z: 1
                },
                q: [2, 5]
            };

            S.mix(r, {
                x: 2,
                y: {
                    s: 1
                },
                q: [undefined, 6]
            }, undefined, undefined, true);

            expect(r.x).toBe(2);
            expect(r.y.s).toBe(1);
            expect(r.y.z).toBe(1);
            expect(r.q + "").toBe([2, 6] + "");

            r = {
                x: 1,
                y: {
                    z: 1
                },
                q: [2, 5]
            };

            S.mix(r, {
                x: 2,
                y: {
                    s: 1
                },
                q: [undefined, 6]
            }, {
                deep: true
            });

            expect(r.x).toBe(2);
            expect(r.y.s).toBe(1);
            expect(r.y.z).toBe(1);
            expect(r.q + "").toBe([2, 6] + "");

            r = {
                x: 1,
                y: {
                    z: 1
                },
                q: [2, 5]
            };

            S.mix(r, {
                x: 2,
                y: {
                    s: 1,
                    z: 2
                },
                q: [undefined, 6]
            }, {
                overwrite: false,
                deep: true
            });

            expect(r.x).toBe(1);
            expect(r.y.s).toBe(1);
            expect(r.y.z).toBe(1);
            expect(r.q + "").toBe([2, 5] + "");
        });


        it("can mix circular reference object", function () {
            var o = {};

            o.x = 1;

            o.y = {};

            o.y.z = 3;

            o.y.a = o;

            var n = {};

            S.mix(n, o, undefined, undefined, true);

            expect(n.x).toBe(1);

            expect(n.y.z).toBe(3);

            expect(n.y.a).toBe(n);

            expect(n.__MIX_CIRCULAR).toBeUndefined();
            expect(n.y.__MIX_CIRCULAR).toBeUndefined();
        });

        it('solve JsEnumBug', function () {
            var v = {
                toString: function () {
                    return 1;
                }
            };
            var z = {};
            S.mix(z, v);
            expect(z.toString()).toBe(1);
        });

    });


    it('S.merge', function () {
        var a = {
                'bool': false,
                'num': 0,
                'nul': null,
                'undef': undefined,
                'str': 'blabber'
            },
            b = {
                'bool': 'oops',
                'num': 'oops',
                'nul': 'oops',
                'undef': 'oops',
                'str': 'oops'
            };

        var c = S.merge(a, b);

        expect(c.bool).toBe('oops');
        expect(c.num).toBe('oops');
        expect(c.nul).toBe('oops');
        expect(c.undef).toBe('oops');
        expect(c.str).toBe('oops');
    });

    it('S.augment', function () {
        function Bird(name) {
            this.name = name;
        }

        Bird.prototype = {
            getName: function () {
                return this.name;
            },
            fly: function () {
            }
        };

        function Pig(name) {
            this.name = name;
        }

        S.augment(Pig, Bird, { prop: 'test prop' });
        S.augment(Pig, { weight: '100kg' });
        var pig = new Pig('Babe');

        expect(typeof pig.fly).toBe('function');
        expect(pig.prop).toBe('test prop');
        expect(pig.weight).toBe('100kg');
    });

    it('S.extend', function () {
        function Bird(name) {
            this.name = name;
        }

        Bird.prototype = {
            getName: function () {
                return this.name;
            }
        };

        function Chicken(name) {
            Chicken.superclass.constructor.call(this, name);
        }

        Chicken.prototype.featcher = 2;
        S.extend(Chicken, Bird);
        var chicken = new Chicken('Tom');

        expect(chicken.constructor).toBe(Chicken);
        expect(chicken.getName()).toBe('Tom');
        expect(chicken.featcher).toBe(2); // keep existed prototype members
    });

    it('S.namespace', function () {
        var ns;

        // normal
        ns = S.namespace('app1.Test');
        ns.name = 'foo1';
        expect(S['app1'].Test.name).toBe('foo1');

        // first part of argument is the global object
        ns = S.namespace('KISSY.app2.Test2');
        ns.name = 'foo2';
        expect(S['app2'].Test2.name).toBe('foo2');

        // empty arguments
        expect(S.namespace()).toBe(null);

        // global
        expect(S.namespace('Global', true)).toBe(Global);

        // clear
        delete S['app1'];
        delete S['app2'];
        try {
            delete host['TB'];
            delete host['Global'];
        } catch (e) {
            host['TB'] = undefined;
            host['Global'] = undefined;
        }
    });

    it('S.log', function () {
        //S.log('test log');
    });

    it('S.error', function () {
        try {
            S.error('wrong');
        } catch (e) {
            expect(e.message).toBe('wrong');
        }
    });

    it('S.guid', function () {
        expect(typeof S.guid()).toBe('string');
        expect(S.guid() - S.guid()).toBe(-1);
    });


});
