var InstaParser = function () {
    "use strict";
    var t = function () {
        return (t = Object.assign || function (t) {
            for (var n, o = 1, r = arguments.length; o < r; o++) for (var e in n = arguments[o]) Object.prototype.hasOwnProperty.call(n, e) && (t[e] = n[e]);
            return t
        }).apply(this, arguments)
    };
    function n(t, n, o, r) {
        return new (o || (o = Promise))((function (e, i) {
            function l(t) {
                try {
                    u(r.next(t))
                } catch (t) {
                    i(t)
                }
            }

            function a(t) {
                try {
                    u(r.throw(t))
                } catch (t) {
                    i(t)
                }
            }

            function u(t) {
                var n;
                t.done ? e(t.value) : (n = t.value, n instanceof o ? n : new o((function (t) {
                    t(n)
                }))).then(l, a)
            }

            u((r = r.apply(t, n || [])).next())
        }))
    }
    function o(t, n) {
        var o, r, e, i, l = {
            label: 0, sent: function () {
                if (1 & e[0]) throw e[1];
                return e[1]
            }, trys: [], ops: []
        };
        return i = {
            next: a(0),
            throw: a(1),
            return: a(2)
        }, "function" == typeof Symbol && (i[Symbol.iterator] = function () {
            return this
        }), i;

        function a(i) {
            return function (a) {
                return function (i) {
                    if (o) throw new TypeError("Generator is already executing.");
                    for (; l;) try {
                        if (o = 1, r && (e = 2 & i[0] ? r.return : i[0] ? r.throw || ((e = r.return) && e.call(r), 0) : r.next) && !(e = e.call(r, i[1])).done) return e;
                        switch (r = 0, e && (i = [2 & i[0], e.value]), i[0]) {
                            case 0:
                            case 1:
                                e = i;
                                break;
                            case 4:
                                return l.label++, {value: i[1], done: !1};
                            case 5:
                                l.label++, r = i[1], i = [0];
                                continue;
                            case 7:
                                i = l.ops.pop(), l.trys.pop();
                                continue;
                            default:
                                if (!(e = l.trys, (e = e.length > 0 && e[e.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                                    l = 0;
                                    continue
                                }
                                if (3 === i[0] && (!e || i[1] > e[0] && i[1] < e[3])) {
                                    l.label = i[1];
                                    break
                                }
                                if (6 === i[0] && l.label < e[1]) {
                                    l.label = e[1], e = i;
                                    break
                                }
                                if (e && l.label < e[2]) {
                                    l.label = e[2], l.ops.push(i);
                                    break
                                }
                                e[2] && l.ops.pop(), l.trys.pop();
                                continue
                        }
                        i = n.call(t, l)
                    } catch (t) {
                        i = [6, t], r = 0
                    } finally {
                        o = e = 0
                    }
                    if (5 & i[0]) throw i[1];
                    return {value: i[0] ? i[1] : void 0, done: !0}
                }([i, a])
            }
        }
    }
    function parseUsernameURL(url) {
        let regexp = /(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/([A-Za-z0-9-_\.]+)/im;
        let match = url.match(regexp);
        return match[1];
    }
    return function () {
        function instagramRegExp() {
            this.INSTAGRAM_HOSTNAME = "https://www.instagram.com/", this.SHARED_DATA_TAG_EXP = /^[\w\W]*<script type="text\/javascript">window._sharedData = ({[\w\W]*});<\/script>[\w\W]*$/g
        }
        return instagramRegExp.prototype.buildUrl = function (t) {
            return "" + this.INSTAGRAM_HOSTNAME + t
        },
            instagramRegExp.prototype.parseJSON = function (t, n) {
            try {
                var o = t;
                return n && (o = t.replace(this.SHARED_DATA_TAG_EXP, "$1")), JSON.parse(o)
            } catch (t) {
                console.error("Nanogram: failure during parsing JSON.\nError message: " + t.message)
            }
        },
            instagramRegExp.prototype.HTTP = function (t, r) {
            return void 0 === r && (r = !0), n(this, void 0, void 0, (function () {
                var n;
                return o(this, (function (o) {
                    switch (o.label) {
                        case 0:
                            return [4, function (t, n) {
                                return new Promise((function (o, r) {
                                    var e = new XMLHttpRequest;
                                    e.open(t, n), e.onload = function () {
                                        return o(e)
                                    }, e.onerror = r, e.send()
                                }))
                            }("GET", t).then((function (t) {
                                if (t.status >= 200 && t.status < 400) return t.responseText;
                                console.error(["Nanogram: error during request", "Probably making too many requests to the Instagram application.", "Also check method parameters"].join("\n"))
                            }))];
                        case 1:
                            return (n = o.sent()) ? [2, this.parseJSON(n, r)] : [2]
                    }
                }))
            }))
        },
            instagramRegExp.logError = function (t) {
            var n = "Nanogram: please provide a valid " + t.join(" and ");
            console.error(n)
        },
            instagramRegExp.prototype.getMediaByLink = function (e,count) {
            e = parseUsernameURL(e)
            var i, l, a;
            return n(this, void 0, void 0, (function () {
                var n, u, s, c;
                return o(this, (function (o) {
                    switch (o.label) {
                        case 0:
                            return n = {
                                posts: null,
                                ok: !1
                            }, e ? (u = this.buildUrl(e), [4, this.HTTP(u)]) : (r.logError(["username"]), [2, n]);
                        case 1:
                            return s = o.sent(), c = (null === (a = null === (l = null === (i = null == s ? void 0 : s.entry_data) || void 0 === i ? void 0 : i.ProfilePage[0]) || void 0 === l ? void 0 : l.graphql) || void 0 === a ? void 0 : a.user) || null, [2, t(t({}, n), {
                                posts: c['edge_owner_to_timeline_media']['edges'].splice(0, count).map(el=>{
                                    return {
                                        url: `https://www.instagram.com/p/${el.node.shortcode}/`,
                                        thumbnailUrl: el.node.thumbnail_src,
                                        displayUrl: el.node.display_url,
                                        likes: el.node.edge_media_preview_like.count,
                                        comment: el.node.edge_media_to_comment.count,
                                        caption: el.node.edge_media_to_caption.edges[0].node.text,
                                        owner: el.node.owner,
                                        thumbnail_resources: el.node.thumbnail_resources
                                    }
                                }),

                                ok: Boolean(c)
                            })]
                    }
                }))
            }))
        },
            instagramRegExp
    }()
}();
